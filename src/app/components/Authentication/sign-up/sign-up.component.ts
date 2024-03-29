import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(20),],  ),
    confirmPassword: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(20),]),
    privacy_policy: new FormControl('',[Validators.requiredTrue]),
  },);
  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  showPassword = false;
  showPassword2 = false;
  isPWMatch: boolean = this.signUpForm.value.password === this.signUpForm.value.confirmPassword;

  constructor(private http:HttpClient,private auth:AuthService,private router:Router) {}

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
  close(): void {
    this.router.navigate(['/login'])
  }


    toggleShowPassword(pwField:number) {
      if(pwField === 1){
        this.showPassword = !this.showPassword;
      } else {
        this.showPassword2 = !this.showPassword2;
      }
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
