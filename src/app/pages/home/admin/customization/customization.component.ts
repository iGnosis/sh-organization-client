import { Color } from '@angular-material-components/color-picker';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  BrandColorType,
  OrganizationType,
  TypeFace,
} from 'src/app/pointmotion';

interface CustomizationOptions {
  orgName: string;
  orgType: OrganizationType;
  brandColors: { [key in BrandColorType]: string };
  orgLogoUrl: string;
  orgTypeFace: TypeFace;
}

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss'],
})
export class CustomizationComponent implements OnInit {
  @Input() customizable: boolean;
  @Output() changesMade: EventEmitter<boolean> = new EventEmitter<boolean>();

  private defaultOptions: Partial<CustomizationOptions> = {
    brandColors: {
      primary: '#000066',
      secondary: '#2F51AE',
      tertiary: '#FFA2AD',
      success: '#00BD3E',
      warning: '#FFB000',
      danger: '#EB0000',
    },
    orgLogoUrl: 'assets/images/logo.png',
    orgTypeFace: 'Inter',
  };

  private oldData: Partial<CustomizationOptions>;
  customizationOptions: Partial<CustomizationOptions>;

  // TODO: change these to be dynamic
  availableTypefaces: TypeFace[] = ['Abel', 'Inter', 'Roboto', 'Open Sans'];

  constructor() {}

  ngOnInit(): void {
    this.initValues();
  }

  initValues(): void {
    // TODO: get data from backend and update customizationOptions or use defaultOptions.
    this.customizationOptions = this.defaultOptions;
    this.oldData = {
      ...this.customizationOptions,
      brandColors: {
        ...this.customizationOptions.brandColors!,
      },
    };
  }

  setOrganizationType(orgType: OrganizationType): void {
    this.customizationOptions.orgType = orgType;
  }

  uploadLogo(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
      // TODO: upload and update logoUrl
    }
  }

  checkIfChangesAreMade(): void {
    const changesMade: boolean =
      JSON.stringify(this.customizationOptions) !==
      JSON.stringify(this.oldData);
    this.changesMade.emit(!changesMade);
  }

  setColor(type: BrandColorType, color: Color): void {
    const hexCode: string = ('#' + color.hex).toUpperCase();
    this.customizationOptions.brandColors![type] = hexCode;
    this.checkIfChangesAreMade();
  }

  setOrgType(orgType: OrganizationType): void {
    this.customizationOptions.orgType = orgType;
    this.checkIfChangesAreMade();
  }

  setOrgName(evt: Event): void {
    const element = evt.currentTarget as HTMLInputElement;
    this.customizationOptions.orgName = element.value;
    if (element.value.trim() === '') {
      delete this.customizationOptions.orgName;
      this.checkIfChangesAreMade();
      return;
    }
    this.checkIfChangesAreMade();
  }

  setTypeFace(typeFace: TypeFace): void {
    this.customizationOptions.orgTypeFace = typeFace;
    this.checkIfChangesAreMade();
  }

  saveChanges(): void {
    // TODO: send data to hasura and reinit values
    console.log('send:changes::', this.customizationOptions);
  }
}
