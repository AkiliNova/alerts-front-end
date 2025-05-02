import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDetection, RawDetectionSchema } from './raw-detection.schema';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_CLIENT",
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://camera_alert_system:camera_alert_system@34.126.102.230:5672'],
          queue: 'object_detections',
          queueOptions: {
            durable: true,
            arguments: {
              'x-message-ttl': 900000, // 15 minutes in milliseconds
              'x-max-length': 10000,
              'x-single-active-consumer': true
            }
          },
          noAck: true,
          prefetchCount: 1
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: RawDetection.name, schema: RawDetectionSchema }
    ])
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {} 