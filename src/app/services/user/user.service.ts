import { Injectable } from '@angular/core';
import { Patient } from 'src/app/types/patient';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  constructor() { 
    this.user = JSON.parse(localStorage.getItem('user') || '{}')
  }

  set(user: Patient) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  get(): Patient {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}')
    return user as Patient
  }
}
