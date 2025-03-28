import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { User } from '../auth/entities/user.entity';

export type ConnectedClients = Record<
  string,
  {
    socket: Socket;
    user: User;
  }
>;

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      client.disconnect();
      throw new Error('User not found');
      //!
      // exit app
    }
    if (user && !user.isActive) {
      client.disconnect();
      throw new Error('User is inactive');
      //!
      // exit app
      // throw new WsException('User is inactive');
    }

    this.checkClientIsConnected(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBySocketId(socketId: string): string {
    const client = this.connectedClients[socketId];
    return client?.user?.fullName ?? 'Unknown User';
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

  private checkClientIsConnected(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      if (this.connectedClients[clientId].user.id === user.id) {
        console.log({
          userId: user.id,
          connectedId: this.connectedClients[clientId].user.id,
        });
        this.connectedClients[clientId].socket.disconnect();
        break;
      }
    }
  }
}
