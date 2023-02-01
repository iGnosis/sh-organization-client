import { Color } from '@angular-material-components/color-picker';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexToColor',
})
export class HexToColorPipe implements PipeTransform {
  transform(hex: string): Color {
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
}
