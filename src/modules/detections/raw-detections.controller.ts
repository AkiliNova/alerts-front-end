import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { RawDetectionService } from './raw-detection.service';
import { RawDetection } from '../rabbitmq/raw-detection.schema';
import { CreateRawDetectionDto } from './dto/create-raw-detection.dto';
import { UpdateRawDetectionDto } from './dto/update-raw-detection.dto';
import { AnomalyDetectionService } from './anomaly-detection.service'; // Add a service for anomaly detection

@Controller('raw-detections')
export class RawDetectionController {
  constructor(
    private readonly rawDetectionService: RawDetectionService,
    private readonly anomalyDetectionService: AnomalyDetectionService, // Inject the AI service
  ) {}

  // Create a new raw detection with AI-based analysis
  @Post()
  async create(@Body() createRawDetectionDto: CreateRawDetectionDto): Promise<RawDetection> {
    const { detections, frame_id, timestamp, source } = createRawDetectionDto;
    
    // AI-based filtering and analysis (for example, anomaly detection)
    const analyzedDetections = await this.anomalyDetectionService.processDetections(detections);

    // If no anomalies detected, continue saving the data
    if (analyzedDetections.length === 0) {
      return this.rawDetectionService.create(createRawDetectionDto);
    } else {
      // Handle anomaly (e.g., trigger alerts, store separately, etc.)
      this.triggerAnomalyAlert(frame_id, analyzedDetections);
      return this.rawDetectionService.create({
        ...createRawDetectionDto,
        detections: analyzedDetections,
      });
    }
  }

  // AI-powered anomaly detection function
  private triggerAnomalyAlert(frame_id: string, detections: any[]) {
    this.anomalyDetectionService.alert(frame_id, detections);
  }

  // Get all raw detections with additional AI statistics (e.g., detection count, anomalies detected)
  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: RawDetection[]; total: number; page: number; pages: number; aiStats: any }> {
    const result = await this.rawDetectionService.findAll({
      limit: limit ? parseInt(limit.toString()) : undefined,
      page: page ? parseInt(page.toString()) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    // Fetch AI-related statistics (e.g., anomalies detected)
    const aiStats = await this.anomalyDetectionService.getStatistics();

    const pages = Math.ceil(result.total / (limit || 50));

    return {
      ...result,
      page: page || 1,
      pages,
      aiStats, // Include AI stats in the response
    };
  }

  // Get a specific raw detection by ID with AI classification details
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RawDetection> {
    const rawDetection = await this.rawDetectionService.findOne(id);
    
    // AI classification and enhancements
    rawDetection.detections = await this.anomalyDetectionService.enrichDetections(rawDetection.detections);
    return rawDetection;
  }

  // Update a raw detection with AI-based enhancements
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRawDetectionDto: UpdateRawDetectionDto,
  ): Promise<RawDetection> {
    return this.rawDetectionService.update(id, updateRawDetectionDto);
  }

  // Delete a raw detection
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.rawDetectionService.remove(id);
  }
}
