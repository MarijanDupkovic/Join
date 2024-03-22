import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  constructor(private http:HttpClient,private auth:AuthService) {}

  onSubmit(): void {
    let body = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      confirmPassword: this.signUpForm.value.confirmPassword,
    };
    this.setLoading(true);

    this.auth.signUp(body).subscribe(
      (response) => {
        setTimeout(() => {
          this.setLoading(false);
        }, 1000);
      },
      (error) => {
        if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 500) {
          this.handleErrorMessages(error);

        }
      }
    );;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setErrorCode(errorCode: number | undefined) {
    this.errorCode = errorCode;
  }

  setErrorMessage(errorMessage: string | undefined) {
    this.errorMessage = errorMessage;
  }

  handleErrorMessages(error: any): void {
    this.setErrorMessages(error);
    this.resetErrorMessages();
  }

  setErrorMessages(error: any): void {
    setTimeout(() => {
      this.setLoading(false);
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error.error);
    }, 1000);
  }

  resetErrorMessages(): void {
    setTimeout(() => {
      this.setErrorCode(undefined);
      this.setErrorMessage(undefined);
      this.signUpForm.reset();
    }, 5000);
  }
}
