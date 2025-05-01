import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Successfully connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async publishDetectionLog(data: any) {
    try {
      await lastValueFrom(this.client.emit('detection_log', data));
      console.log('Detection log published successfully:', data);
    } catch (error) {
      console.error('Failed to publish detection log:', error);
      throw error;
    }
  }

  subscribeToDetectionLogs(callback: (data: any) => void) {
    try {
      return this.client.emit<any>('detection_log', {}).subscribe(callback);
    } catch (error) {
      console.error('Failed to subscribe to detection logs:', error);
      throw error;
    }
  }
} 