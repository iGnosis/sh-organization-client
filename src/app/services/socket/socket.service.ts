import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket?: Socket;

  constructor(private jwtService: JwtService, private userService: UserService) {
  }

  connect() {
    this.socket = io(environment.websocketEndpoint, {
      query: {
        userId: this.userService.get().id,
        authToken: this.jwtService.getToken(),
      },
    });
  }

  sendLogsToServer(logs: string) {
    this.socket?.emit('cloudwatch-log', { logs, portal: 'organization-client' });
  }
}
