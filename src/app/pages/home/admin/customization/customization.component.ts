import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';

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
  selectedOrgType: OrganizationType | undefined = undefined;
  selectedColors: { [key in BrandColorType]: string } | undefined = undefined;

  color!: ThemePalette;
  colorCtr!: FormControl;
  constructor() {}

  ngOnInit(): void {}

  setOrganizationType(orgType: OrganizationType) {
    this.selectedOrgType = orgType;
  }

  uploadLogo(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
    }
  }
}
