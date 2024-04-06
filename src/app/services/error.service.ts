import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
interface ErrorResponse {
  status: number;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private _errorCode = new BehaviorSubject<number | undefined>(undefined);
  private _errorMessage = new BehaviorSubject<string | undefined>(undefined);
  private _successMessage = new BehaviorSubject<string | undefined>(undefined);

  errorCode$ = this._errorCode.asObservable();
  errorMessage$ = this._errorMessage.asObservable();
  successMessage$ = this._successMessage.asObservable();

  constructor() { }

  setErrorCode(errorCode: number | undefined) {
    this._errorCode.next(errorCode);
  }

  setErrorMessage(errorMessage: string | undefined) {
    this._errorMessage.next(errorMessage);
  }

  setSuccessMessage(successMessage: string | undefined) {
    this._successMessage.next(successMessage);
  }

  handleErrorMessages(error: ErrorResponse): void {
    this.setErrorMessages(error);
    this.resetErrorMessages();
  }

  handleSuccessMessages(successMessage: string): void {
    this.setSuccessMessages(successMessage);
    this.resetSuccessMessages();
  }

  setErrorMessages(error: any): void {
    setTimeout(() => {
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error);
    }, 1000);
  }

  setSuccessMessages(successMessage: string): void {
    setTimeout(() => {
      this.setSuccessMessage(successMessage);
    }, 1000);
  }

  async resetErrorMessages() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.setErrorCode(undefined);
    this.setErrorMessage(undefined);
  }

  async resetSuccessMessages() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.setSuccessMessage(undefined);
  }

  handleError(error:any): void {
    if ([400,401, 403, 404, 500].includes(error.error.status)) {
      this.setErrorCode(error.error.status);
      this.setErrorMessage(error.error.error);
      this.resetErrorMessages();
    }
  }
}
