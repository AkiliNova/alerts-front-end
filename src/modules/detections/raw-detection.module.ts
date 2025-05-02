import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDetection, RawDetectionSchema } from '../rabbitmq/raw-detection.schema';
import { RawDetectionController } from './raw-detections.controller';
import { RawDetectionService } from './raw-detection.service';
import { AnomalyDetectionService } from './anomaly-detection.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RawDetection.name, schema: RawDetectionSchema }]),
  ],
  controllers: [RawDetectionController],
  providers: [RawDetectionService, AnomalyDetectionService],
})
export class RawDetectionModule {}
