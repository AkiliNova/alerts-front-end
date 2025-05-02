import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as amqp from 'amqplib';
import { RawDetection } from './raw-detection.schema';
import { setTimeout } from 'timers';

interface Detection {
  bbox: number[];
  class_id: number;
  class_name: string;
  confidence: number;
}

interface DetectionMessage {
  frame_id: string;
  detections: Detection[];
  timestamp: string;
  source: string;
}

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly detectionQueue = 'object_detections';
  private readonly logQueue = 'detection_log';
  private channel: amqp.Channel;
  private detectionBatch: DetectionMessage[] = [];
  private detectionBatchInterval: number = 1000; // 1 second batch
  private isBatchProcessing = false;

  constructor(
    @InjectModel(RawDetection.name) private rawDetectionModel: Model<RawDetection>
  ) {}

  async onModuleInit() {
    try {
      const connection = await amqp.connect('amqp://camera_alert_system:camera_alert_system@34.126.102.230:5672');
      this.channel = await connection.createChannel();

      await this.channel.assertQueue(this.detectionQueue, {
        durable: true,
        arguments: {
          'x-message-ttl': 900000,
          'x-max-length': 10000,
          'x-single-active-consumer': true
        }
      });

      await this.channel.assertQueue(this.logQueue, { durable: true });

      this.channel.prefetch(1);
      this.logger.log('RabbitMQ connected, consuming messages...');

      this.channel.consume(this.detectionQueue, async (msg) => {
        if (!msg) return;

        try {
          const message: DetectionMessage = JSON.parse(msg.content.toString());

          // Accumulate detection messages in the batch
          this.detectionBatch.push(message);

          // Schedule batch processing (only once)
          if (!this.isBatchProcessing) {
            this.isBatchProcessing = true;
            setTimeout(async () => {
              await this.processDetectionBatch();
              this.isBatchProcessing = false;
            }, this.detectionBatchInterval);
          }

        } catch (err) {
          this.logger.error('Error processing message:', err);
        } finally {
          this.channel.ack(msg);
        }
      }, { noAck: false });

    } catch (err) {
      this.logger.error('Failed to initialize RabbitMQ service:', err);
    }
  }

  private async processDetectionBatch() {
    const detectionsToProcess = this.detectionBatch;
    this.detectionBatch = []; // Clear the batch after processing

    if (detectionsToProcess.length === 0) {
      this.logger.log('No detections in batch to process');
      return;
    }

    try {
      for (const detectionMessage of detectionsToProcess) {
        const { frame_id, detections, timestamp, source } = detectionMessage;

        if (!detections || detections.length === 0) {
          this.logger.log(`No detections for frame_id: ${frame_id}`);
          continue;
        }

        const messageTimestamp = new Date(timestamp);
        const recentWindow = new Date(messageTimestamp.getTime() - 10000); // 5-second deduplication window

        const firstDetection = detections[0];

        const isDuplicate = await this.rawDetectionModel.exists({
          source,
          'detections.class_id': firstDetection.class_id,
          timestamp: { $gte: recentWindow, $lte: messageTimestamp }
        });

        if (isDuplicate) {
          this.logger.warn(`Skipped duplicate detection from ${source} of class ${firstDetection.class_id}`);
          continue;
        }

        const rawDetection = new this.rawDetectionModel({
          frame_id,
          detections,
          timestamp: messageTimestamp,
          source
        });

        await rawDetection.save();
        this.logger.log(`Saved detection for frame_id: ${frame_id}`);
      }
    } catch (err) {
      this.logger.error('Error saving detection batch:', err);
    }
  }
}
