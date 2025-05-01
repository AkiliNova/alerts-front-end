import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectDetectionController } from './object-detection.controller';
import { ObjectDetectionService } from './object-detection.service';
import { ObjectDetection, ObjectDetectionSchema } from './object-detection.schema';
import { AlertsModule } from '../alerts/alerts.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ObjectDetection.name, schema: ObjectDetectionSchema },
    ]),
    forwardRef(() => AlertsModule),
    RabbitMQModule,
  ],
  controllers: [ObjectDetectionController],
  providers: [ObjectDetectionService],
  exports: [ObjectDetectionService, MongooseModule], // Export MongooseModule to share the model
})
export class ObjectDetectionModule {}
