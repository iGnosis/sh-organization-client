import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Theme } from './pointmotion';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sh-provider-client';
  constructor(private themeService: ThemeService) {
    this.themeService.getOrganizationConfig().then((theme: Theme) => {
      if (theme) {
        if (theme.colors) {
          this.themeService.setColors(theme.colors);
        }
        if (theme.font) {
          this.themeService.loadFont(theme.font);
        }
      }
    });
  }
}
