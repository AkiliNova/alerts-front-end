import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ObjectDetectionModule } from './modules/object-detection/object-detection.module';
import { FaceDetectionModule } from './modules/face-detection/face-detection.module';
import { HumanActionsModule } from './modules/human-actions/human-actions.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/school-surveillance'),
    AlertsModule,
    ObjectDetectionModule,
    FaceDetectionModule,
    HumanActionsModule,
    AuthModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}