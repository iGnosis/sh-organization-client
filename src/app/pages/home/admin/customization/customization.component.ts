import {
  Color,
  NgxMatColorPickerInputEvent,
} from '@angular-material-components/color-picker';
import { Component, OnInit } from '@angular/core';

type OrganizationType = 'hospital' | 'clinic' | 'seniorHomeFacility';
type BrandColorType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss'],
})
export class CustomizationComponent implements OnInit {
  orgName: 'string' | undefined = undefined;
  orgType: OrganizationType | undefined = undefined;

  // TODO: change these to be dynamic
  availableTypefaces = ['Abel', 'Inter', 'Roboto', 'Open Sans'];

  // default brand color and typeface

  orgTypeface = 'Inter';
  colors: { [key in BrandColorType]: Color } = {
    primary: this.hexToRgb('#000066'),
    secondary: this.hexToRgb('#2F51AE'),
    tertiary: this.hexToRgb('#FFA2AD'),
    success: this.hexToRgb('#00BD3E'),
    warning: this.hexToRgb('#FFB000'),
    danger: this.hexToRgb('#EB0000'),
  };

  constructor() {
    this.initValues();
  }

  ngOnInit(): void {}

  initValues() {
    // TODO: get data from backend
  }

  // credit: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return new Color(
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      );
    } else {
      throw new Error('Invalid hex color');
    }
  }

  setOrganizationType(orgType: OrganizationType) {
    this.orgType = orgType;
  }

  uploadLogo(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
    }
  }

  setColor(type: BrandColorType, event: NgxMatColorPickerInputEvent) {
    console.log(event);
  }
}
