import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this for security (use your frontend URL in production)
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Set<string>();

  handleConnection(client: any) {
    this.clients.add(client.id);
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.clients.delete(client.id);
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  sendAlert(alert: { message: string; location?: string; timestamp?: Date }) {
    console.log('🚨 Sending alert:', alert);
    this.server.emit('alert', alert); // Broadcast to all connected clients
  }
}
