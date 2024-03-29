import { ContactsComponent } from './../contacts/contacts.component';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-add-contact-overlay',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,ContactsComponent],
  templateUrl: './add-contact-overlay.component.html',
  styleUrl: './add-contact-overlay.component.scss'
})
export class AddContactOverlayComponent {
  createUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    email: new FormControl('', [Validators.required, Validators.email,]),
    phone: new FormControl('',),
  });
  @Output() closeOverlay = new EventEmitter<void>();
  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  close_btn_hover: boolean = false;
  constructor(private contacts:ContactsService) {}
  onSubmit(): void {
    let body = {
      firstName: this.createUserForm.value.firstName,
      lastName: this.createUserForm.value.lastName,
      email: this.createUserForm.value.email,
      phone: this.createUserForm.value.phone,
    };
    this.contacts.createUser(body).then(
      (response) => {
        setTimeout(() => {
          this.contacts.getContacts();
          this.close();
          this.setLoading(false);
        }, 1000);
      },
      (error) => {
        if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 500) {
          this.handleErrorMessages(error);
        }
      }
    );
  }

  close(): void {
    this.closeOverlay.emit();
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
      this.createUserForm.reset();
    }, 5000);
  }
}
