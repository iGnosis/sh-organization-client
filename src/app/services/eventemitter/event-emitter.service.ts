import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {
  ReceivedPatientID = new EventEmitter()

    constructor() { }

    SentPatientID(patientId:any){
      setTimeout(() => {
        this.ReceivedPatientID.emit(patientId);
      // console.log(patientId,"emitter called");
      }, 100);
    }

}
