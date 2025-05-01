import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectDetection, ObjectDetectionDocument } from './object-detection.schema';
import { AlertsGateway } from '../alerts/alerts.gateway';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ObjectDetectionService {
  constructor(
    @InjectModel(ObjectDetection.name) private objectDetectionModel: Model<ObjectDetection>,
    @Inject(forwardRef(() => AlertsGateway)) private alertsGateway: AlertsGateway,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async logDetection(event: Partial<ObjectDetection>): Promise<ObjectDetection> {
    const savedEvent = await new this.objectDetectionModel(event).save();

    this.alertsGateway.sendAlert({
      message: `⚠️ ${event.objectType} detected!`,
      location: event.location,
      timestamp: event.timestamp,
    });
    this.rabbitMQService.publishDetectionLog(event);

    return savedEvent;
  }

  async getAllDetections(): Promise<ObjectDetection[]> {
    return this.objectDetectionModel.find().exec();
  }
}
