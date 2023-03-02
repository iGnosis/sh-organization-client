import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Theme } from 'src/app/pointmotion';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  logoSubject = new Subject<string>();
  constructor(private graphqlService: GraphqlService) {}

  /**
   * Getting the organization configuration.
   *
   * @returns {Promise<Theme>}
   */
  private async getOrganizationConfig(): Promise<Theme> {
    try {
      const response = await this.graphqlService.gqlRequest(GqlConstants.GET_ORGANIZATION_CONFIG);
      return response.organization ? { 
        ...response.organization[0].configuration,
        logoUrl: response.organization[0].logoUrl,
      } : {};
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  /**
   * Setting the colors of the entire application.
   *
   * @param {{ [key: string]: any }} colors
   * @returns {void}
   */
  private setColors(colors: { [key: string]: any }) {
    if (!colors) return;

    Object.keys(colors).forEach((color) => {
      document.documentElement.style.setProperty(`--${color}`, colors[color]);
    });
  }

  /**
   * Setting the theme of the application.
   * 
   * @returns {Promise<void>}
   */
  async setTheme(): Promise<void> {
    const theme = await this.getOrganizationConfig(); 
    if (theme) {
      if (theme.colors) {
        this.setColors(theme.colors);
      }
      if (theme.font) {
        this.loadFont(theme.font);
      }
      if (theme.logoUrl) {
        this.setLogoUrl(theme.logoUrl);
      }
    }
  }

  /**
   * Setting the typography of the entire application.
   *
   * @param {{ family: string url: string }} font
   * @returns {void}
   */
  private loadFont(font: {
    family: string;
    url: string;
  }) {
    if (!font) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.url;
    document.getElementsByTagName('head')[0].appendChild(link);

    document.documentElement.style.setProperty(`--font-family`, `'${font.family}', Inter, 'Times New Roman', Times, serif`);
  }

  private setLogoUrl(url: string) {
    this.logoSubject.next(url);
  }
}
