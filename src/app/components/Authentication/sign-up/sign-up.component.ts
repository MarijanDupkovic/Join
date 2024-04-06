import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { timeout } from 'rxjs';

interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8),],),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8),]),
    privacy_policy: new FormControl('', [Validators.requiredTrue]),
  },);
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;

  successMessageSubscription: Subscription = new Subscription;
  successMessage: string = '';

  errorMessage: string = '';
  errorCode: number | undefined;
  loading: boolean = false;
  showPassword = false;
  showPassword2 = false;
  isPWMatch: boolean = this.signUpForm.value.password === this.signUpForm.value.confirmPassword;
  success: boolean = false;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.successMessageSubscription = this.errorService.successMessage$.subscribe((successMessage: any) => {
      this.successMessage = successMessage;
    });
    this.errorCodeSubscription = this.errorService.errorCode$.subscribe((errorCode: any) => {
      this.errorCode = errorCode;
    });
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
    });
  }

  async onSubmit() {
    this.setLoading(true);



    this.signUp(this.signUpForm.value);
  }

  private async signUp(body: any) {
    try {
      await this.auth.signUp(body);
      this.errorService.handleSuccessMessages('User created successfully - Redirecting to login page...');

      setTimeout(() => {
        this.close();
      }, 3000);

    } catch (error: any) {
      this.errorService.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  close(): void {
    this.router.navigate(['/login'])
  }


  toggleShowPassword(pwField: number) {
    if (pwField === 1) {
      this.showPassword = !this.showPassword;
    } else {
      this.showPassword2 = !this.showPassword2;
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

}
