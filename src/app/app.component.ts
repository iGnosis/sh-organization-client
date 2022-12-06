import { Component } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sh-provider-client';
  constructor(private themeService: ThemeService) {
    this.themeService.setupApp();
  }
}
