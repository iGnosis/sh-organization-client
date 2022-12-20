import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sh-provider-client';
  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {
    this.themeService.setTheme();
    this.authService.initRbac();
  }
}
