
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AnimationServiceService } from '../../../services/animation-service.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { ErrorService } from '../../../services/error.service';

interface SignInBody {
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    remember: new FormControl(''),
  });

  savedEmail!: string | null;
  savedPassword!: string | null;
  savedRemember!: string | null;

  loading: boolean = false;
  public isAnimation = false;

  animationSubscription: Subscription = new Subscription;
  showPassword = true;
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;
  errorMessage: string = '';
  errorCode: number | undefined;

  constructor(private auth: AuthService, private router: Router, private animationService: AnimationServiceService, private errorService: ErrorService) {

  }

  ngOnInit(): void {
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
    });

    this.errorCodeSubscription = this.errorService.errorCode$.subscribe((errorCode: any) => {
      this.errorCode = errorCode;
    });
    this.animationSubscription = this.animationService.animationFinished$.subscribe((animation: boolean) => {
      this.isAnimation = animation;
    });
    this.getDataFromLocalStorage();
    this.setInputValues();
    this.handleAuthStatus();

  }

  handleAuthStatus() {
    if (this.auth.loggedIn$) {
      this.setLoading(false);
      this.router.navigateByUrl('/board/summary');
    }
  }

  setInputValues() {
    if (this.savedEmail && this.savedPassword && this.savedRemember) {
      this.signInForm.setValue({
        email: this.savedEmail,
        password: this.savedPassword,
        remember: this.savedRemember
      });
    }
  }

  getDataFromLocalStorage() {
    this.savedEmail = localStorage.getItem('email');
    this.savedPassword = localStorage.getItem('password');
    this.savedRemember = localStorage.getItem('remember');
  }

  ngOnDestroy(): void {
    this.animationSubscription.unsubscribe();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async guestLogin() {
    this.setLoading(true);
    this.setFormValues(environment.email, environment.password);
    await this.signIn(this.setSignInBody())
  }

  setSignInBody(): SignInBody {
    let body: SignInBody = {
      email: environment.email,
      password: environment.password,
    };
    return body;
  }

  private async signIn(body: SignInBody) {
    try {
      await this.auth.signIn(body);
      this.router.navigateByUrl('/board/summary');
    } catch (error: any) {
      this.errorService.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async onSubmit(): Promise<void> {
    this.setLoading(true);
    this.saveFormValues();
    this.signIn({ email: String(this.signInForm.value.email), password: String(this.signInForm.value.password) });
  }

  public showSignIn() {
    this.isAnimation = true;
  }

  private setFormValues(email: string, password: string): void {
    this.signInForm.controls.email.setValue(email);
    this.signInForm.controls.password.setValue(password);
  }

  private saveFormValues(): void {
    if (this.signInForm.value.remember) {
      localStorage.setItem('email', this.signInForm.value.email!);
      localStorage.setItem('password', this.signInForm.value.password!);
      localStorage.setItem('remember', this.signInForm.value.remember!);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('remember');
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
