import { Color } from '@angular-material-components/color-picker';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BrandColorType, TypeFace } from 'src/app/pointmotion';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UserService } from 'src/app/services/user/user.service';

interface CustomizationOptions {
  colors: { [key in BrandColorType]: string };
}

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss'],
})
export class CustomizationComponent implements OnInit {
  @Input() customizable: boolean;
  @Output() changesMade: EventEmitter<boolean> = new EventEmitter<boolean>();

  imageList: FileList | null;
  orgLogoUrl = 'assets/images/logo.png';

  private defaultOptions: CustomizationOptions = {
    colors: {
      primary: '#000066',
      secondary: '#2F51AE',
      info: '#FFA2AD',
      success: '#00BD3E',
      warning: '#FFB000',
      danger: '#EB0000',
    },
  };

  private oldData: CustomizationOptions;
  customizationOptions: CustomizationOptions;

  constructor(
    private graphqlService: GraphqlService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initValues();
  }

  async initValues() {
    this.customizationOptions = this.defaultOptions;
    try {
      const resp = await this.graphqlService.gqlRequest(
        GqlConstants.GET_ORG_CONFIG
      );
      const theme = resp.organization[0].configuration.theme;
      this.orgLogoUrl = resp.organization[0].logoUrl;
      console.log('orgLogoUrl::', this.orgLogoUrl);
      console.log('orgLogoUrl::', this.orgLogoUrl);
      if (theme) {
        this.customizationOptions = {
          ...theme,
        };
      } else {
        this.customizationOptions = {
          ...this.defaultOptions,
        };
      }
      console.log('orgConfig', this.customizationOptions);
    } catch (err) {
      console.log('Error::', err);
      this.customizationOptions = {
        ...this.defaultOptions,
      };
    }
    this.oldData = {
      colors: {
        ...this.customizationOptions.colors!,
      },
    };
  }

  uploadLogo(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
      this.imageList = fileList;
    }
    this.checkIfChangesAreMade();
  }

  checkIfChangesAreMade(): void {
    console.log(this.customizationOptions);
    const changesMade: boolean =
      JSON.stringify(this.customizationOptions) !==
        JSON.stringify(this.oldData) || !!this.imageList;
    this.changesMade.emit(!changesMade);
  }

  setColor(type: BrandColorType, color: Color): void {
    const hexCode: string = ('#' + color.hex).toUpperCase();
    this.customizationOptions.colors![type] = hexCode;
    this.checkIfChangesAreMade();
  }

  async saveLogo(): Promise<void> {
    if (!this.imageList) return;

    // only sends one image for now
    for (let i = 0; i < this.imageList.length; i++) {
      const image = this.imageList[i];

      const result = await this.graphqlService.client.request(
        GqlConstants.UPLOAD_ORGANIZATION_LOGO_URL
      );
      if (!result.uploadOrganizationLogo) return;
      const urls = result.uploadOrganizationLogo.data;
      console.log(image.type);

      const putResult = await fetch(urls.uploadUrl, {
        method: 'PUT',
        body: image,
        headers: new Headers({
          'Content-Type': image.type,
        }),
      });
      console.log(putResult);
    }
  }

  async saveChanges(): Promise<void> {
    await this.saveLogo();
    // TODO: send data to hasura and reinit values
    console.log('send:changes::', this.customizationOptions);

    const orgId: string = this.userService.get().orgId;
    try {
      const resp = await this.graphqlService.client.request(
        GqlConstants.UPDATE_ORG_CONFIG,
        {
          id: orgId,
          configuration: {
            theme: {
              colors: {
                ...this.customizationOptions.colors,
              },
            },
          },
        }
      );
      console.log('update:config::', resp);
    } catch (err) {
      console.log('Error::', err);
    }
  }
}
