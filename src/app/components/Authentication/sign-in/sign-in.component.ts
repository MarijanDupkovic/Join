import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AnimationServiceService } from '../../../services/animation-service.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    remember: new FormControl(''),
  });

  savedEmail: string | null;
  savedPassword: string | null;
  savedRemember: string | null;

  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  public isAnimation = false;


  showPassword = true;

  constructor(private auth: AuthService, private router: Router,private animationService: AnimationServiceService) {
    this.savedEmail = localStorage.getItem('email');
    this.savedPassword = localStorage.getItem('password');
    this.savedRemember = localStorage.getItem('remember');

    if (this.savedEmail && this.savedPassword && this.savedRemember) {
      this.signInForm.setValue({
        email: this.savedEmail,
        password: this.savedPassword,
        remember: this.savedRemember
      });
    }
  }

  ngOnInit(): void {

    if (this.auth.loggedIn$) {
      this.setLoading(false);
      this.router.navigateByUrl('/board/summary');
    }
    this.animationService.animationFinished$.subscribe((animation:any) => {
      this.isAnimation = animation;
    });
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }




  onSubmit() {
    this.setLoading(true);
    if (this.signInForm.value.remember) {
      localStorage.setItem('email', this.signInForm.value.email!);
      localStorage.setItem('password', this.signInForm.value.password!);
      localStorage.setItem('remember', this.signInForm.value.remember!);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('remember');
    }
    let body: Object = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password,
    };
    this.auth.signIn(body).then(
      (response:any) => {
        setTimeout(() => {
          this.setLoading(false);
          this.router.navigateByUrl('/board/summary');
        }, 1000);
      },
      (error) => {
        if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 500) {
          this.handleErrorMessages(error);
        }
      }
    );
  }

 public showSignIn(){
    this.isAnimation = true;
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
      this.signInForm.reset();
    }, 5000);
  }

}
