import { Module, forwardRef } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsGateway } from './alerts.gateway';
import { ObjectDetectionModule } from '../object-detection/object-detection.module';

@Module({
  imports: [
    forwardRef(() => ObjectDetectionModule),
  ],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsGateway],
  exports: [AlertsGateway],
})
export class AlertsModule {}
