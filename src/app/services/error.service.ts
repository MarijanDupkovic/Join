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

  errorCode$ = this._errorCode.asObservable();
  errorMessage$ = this._errorMessage.asObservable();

  constructor() { }

  setErrorCode(errorCode: number | undefined) {
    this._errorCode.next(errorCode);
  }

  setErrorMessage(errorMessage: string | undefined) {
    this._errorMessage.next(errorMessage);
  }

  handleErrorMessages(error: ErrorResponse): void {
    this.setErrorMessages(error);
    this.resetErrorMessages();
  }

  setErrorMessages(error: any): void {
    setTimeout(() => {
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error);
    }, 1000);
  }

  async resetErrorMessages() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.setErrorCode(undefined);
    this.setErrorMessage(undefined);
  }

  handleError(error: any): void {
    if ([401, 403, 404, 500].includes(error.status)) {
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error.error);
      this.resetErrorMessages();
    }
  }
}
