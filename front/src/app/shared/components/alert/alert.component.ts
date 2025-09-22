import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';

interface Options{
  level?: string
};

@Component({
  selector: 'app-alert',
  imports: [MatIconModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit{
  private _message: string = '';
  private _level: string = 'danger';

  constructor(private alertService: AlertService){}

  get message() { return this._message };
  get level() { return this._level };

  ngOnInit(): void {
    this.alertService.showAlert$.subscribe((options) => {
      if(!options){
        this._message = '';
        return;
      }
      this._message = options.message;
      this._level = options.options.level ? options.options.level : this._level;
      if(options.options.duration){
        setTimeout(() => {
          this._message = '';
        }, options.options.duration*1000);
      }
    })
  }

  dismiss() {
    this._message = '';
  }
}
