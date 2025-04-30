import { Controller, Get, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAlerts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('severity') severity?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
    @Query('date') date?: string,
  ) {
    return this.alertsService.findAlerts({
      page,
      limit,
      severity,
      location,
      search,
      date,
    });
  }
} 