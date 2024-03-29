import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AnimationServiceService } from '../../../services/animation-service.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(''),
  });

  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  public  isAnimation = false;
  static  isAnimation:boolean;
  constructor(private auth: AuthService, private router: Router,private animationService: AnimationServiceService) { }

  ngOnInit(): void {

    if (this.auth.loggedIn$) {
      this.setLoading(false);
      this.router.navigateByUrl('/board/summary');
    }
    this.animationService.animationFinished$.subscribe(() => {
      this.isAnimation = true;
    });
  }


  onSubmit() {
    this.setLoading(true);

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
    console.log('showSignIn');
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
