import { Controller, Post, Get, Body } from '@nestjs/common';
import { ObjectDetectionService } from './object-detection.service';

@Controller('object-detection')
export class ObjectDetectionController {
  constructor(private readonly objectDetectionService: ObjectDetectionService) {}

  @Post()
  async logDetection(@Body() detectionData: any) {
    return this.objectDetectionService.logDetection(detectionData);
  }

//   @Get()
//   async getDetections() {
//     return this.objectDetectionService.getAllDetections();
//   }
}
