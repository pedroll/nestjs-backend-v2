import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { JwtPayload } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';

export type ConnectedClients = Record<
  string,
  {
    socket: Socket;
    user: User;
  }
>;

@WebSocketGateway({
  cors: true,
}) // Socket
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() webSocketServer: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  @SubscribeMessage('createMessagesW')
  create(@MessageBody() createMessagesWDto: CreateMessagesWDto) {
    return this.messagesWsService.create(createMessagesWDto);
  }

  @SubscribeMessage('findAllMessagesWs')
  findAll() {
    return this.messagesWsService.findAll();
  }

  @SubscribeMessage('findOneMessagesW')
  findOne(@MessageBody() id: number) {
    return this.messagesWsService.findOne(id);
  }

  @SubscribeMessage('updateMessagesW')
  update(@MessageBody() updateMessagesWDto: UpdateMessagesWDto) {
    return this.messagesWsService.update(
      updateMessagesWDto.id,
      updateMessagesWDto,
    );
  }

  @SubscribeMessage('removeMessagesW')
  remove(@MessageBody() id: number) {
    return this.messagesWsService.remove(id);
  }

  async handleConnection(client: Socket): Promise<any> {
    // console.log({ headers: client.handshake.headers });
    const token = client.handshake.headers.authorization!;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      console.log({ payload });
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.error(error);
      client.disconnect(true);
      return;
      //!
      // exit app
      // throw new WsException(error);
    }

    // emitimos el evento cada vez que se conecta un cliente
    this.webSocketServer.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket): any {
    // console.log('client disconnected', client.id);
    this.messagesWsService.removeClient(client);

    // emitimos el evento cada vez que se desconecta un cliente
    this.webSocketServer.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: CreateMessagesWDto) {
    console.log('message-from-client', payload);

    //! solo emite a si mismo
    // client.emit('message-from-server', payload);

    //! emite a todos menos asi mismo
    // client.broadcast.emit('message-from-server', payload);

    //! emite a todos los clientes
    this.webSocketServer.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      ...payload,
    });

    // registramos cliente en una sala y emitimos solo a esa sala
    // client.join('room1');
    // client.join(client.id);
    // client.join(client.email);
    // client.to('room1').emit('message-from-server', payload);
  }
}
