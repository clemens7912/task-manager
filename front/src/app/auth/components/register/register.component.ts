import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ActionCompleted } from '../../../shared/interfaces/action-completed.interface';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, ActionCompleted {
  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\-\._$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

  @Output() actionCompleted = new EventEmitter<void>();

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private alertService: AlertService){}

  ngOnInit(): void {
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
        passwordRepeat: ['', Validators.required]
      }, {validators: this.passwordMatchValidator});
  }

  private passwordMatchValidator(form: FormGroup){
    if(form.get('password')?.value !== form.get('passwordRepeat')?.value){
      form.get('passwordRepeat')?.setErrors({passwordMismatch: true});
      return;
    }

    form.get('passwordRepeat')?.setErrors(null);
  }

  get name(){ return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get passwordRepeat() { return this.registerForm.get('passwordRepeat'); }

  submit(event: Event){
    event.preventDefault();
    this.authService.register(this.name?.value, this.email?.value, this.password?.value)
      .subscribe({
        next: () => {
          this.alertService.open({
            message: 'User registered successfully', 
            options: {level: 'success', duration: 5}
          });
          this.registerForm.reset();
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
