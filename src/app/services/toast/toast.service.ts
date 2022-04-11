import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showSuccess(text: string) {
    this.show(text, {
      classname: 'bg-success text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Success'
    });
  }

  showDanger(text: string) {
    this.show(text, {
      classname: 'bg-danger text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Error'
    });
  }
}
