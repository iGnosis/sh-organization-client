import { Injectable } from '@angular/core';
import { User } from 'src/app/pointmotion';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user?: Partial<User>;
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  set(user: Partial<User>) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  get(): User {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}');
    return user as User;
  }
}
