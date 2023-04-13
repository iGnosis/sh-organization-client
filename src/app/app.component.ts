import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { SocketService } from './services/socket/socket.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sh-organization-client';
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private socketService: SocketService,
  ) {
    this.themeService.setTheme();
    this.authService.initRbac();
    this.overrideConsole();
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:keydown', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  onUserActivity(event: MouseEvent | KeyboardEvent | TouchEvent) {
    this.authService.resetLogoutTimer();
  }

  overrideConsole() {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    console.log = (...args) => {
      this.socketService.sendLogsToServer((JSON.stringify(args).toLowerCase().includes('error') ? '[ERROR] ' : '[LOG] ') + JSON.stringify(args));
      originalConsoleLog.apply(console, args);
    }
    console.error = (...args) => {
      const message: string =
        JSON.stringify(args[0], Object.getOwnPropertyNames(args[0])).length > 2
          ? JSON.stringify(args[0], Object.getOwnPropertyNames(args[0]))
          : JSON.stringify(args).length > 2
          ? JSON.stringify(args)
          : args.toString().length > 2
          ? args.toString()
          : JSON.stringify(args[0]).length > 2
          ? JSON.stringify(args[0])
          : 'Unknown Error Occured';
      this.socketService.sendLogsToServer('[ERROR] ' + message);
      originalConsoleError.apply(console, args);
    };
    console.warn = (...args) => {
      this.socketService.sendLogsToServer('[WARN] ' + JSON.stringify(args));
      originalConsoleWarn.apply(console, args);
    }
  }
}
