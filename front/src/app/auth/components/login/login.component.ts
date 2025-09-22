import { StorageService } from './../../../services/storage.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../../services/board.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ActionCompleted } from '../../../shared/interfaces/action-completed.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, ActionCompleted{
  
  @Output() actionCompleted = new EventEmitter<void>();
  
  loginForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private authService: AuthService,
              private storageService: StorageService,
              private boardService: BoardService,
              private alertService: AlertService){}

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  submit(event: Event){
    event.preventDefault();
    this.authService.login(this.email?.value, this.password?.value)
      .subscribe({
        next: (user) => {
          this.storageService.saveUser(user);
          this.alertService.open({
            message: 'Logged in!', 
            options: {level: 'success', duration: 5}
          });
          this.loginForm.reset();
          this.actionCompleted.emit();
        },
        error: (err) => {
          this.alertService.open({
            message: String(err.message), 
            options: {level: 'danger'}
          });
        }
      })
  }

}
