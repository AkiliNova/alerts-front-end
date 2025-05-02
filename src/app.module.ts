import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './modules/alerts/alerts.module';
import { FaceDetectionModule } from './modules/face-detection/face-detection.module';
import { HumanActionsModule } from './modules/human-actions/human-actions.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { RawDetectionModule } from './modules/detections/raw-detection.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/school-surveillance'),
    AlertsModule,
    FaceDetectionModule,
    HumanActionsModule,
    AuthModule,
    RawDetectionModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}