import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface AlertOptions {
  message: string, 
  options: {
    level?: string,
    duration?: number
  }
};

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  showAlert$: Subject<AlertOptions | null> = new Subject<AlertOptions | null>();

  constructor() { }

  open(options: AlertOptions){
    this.showAlert$.next(options);
  }

  dismiss(){
    this.showAlert$.next(null);
  }
}
