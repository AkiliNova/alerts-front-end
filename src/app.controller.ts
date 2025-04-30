import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @InjectConnection() private connection: Connection) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async checkHealth() {
    const state = this.connection.readyState;
    return {
      mongodb: {
        status: state === 1 ? 'connected' : 'disconnected',
        state: state
      }
    };
  }
}
