import { Injectable } from '@nestjs/common';
import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { Socket } from 'socket.io';

type ConnectedClients = Record<string, Socket>;
@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }
  create(createMessagesWDto: CreateMessagesWDto) {
    return 'This action adds a new messagesW';
  }

  findAll() {
    return `This action returns all messagesWs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messagesW`;
  }

  update(id: number, updateMessagesWDto: UpdateMessagesWDto) {
    return `This action updates a #${id} messagesW`;
  }

  remove(id: number) {
    return `This action removes a #${id} messagesW`;
  }
}
