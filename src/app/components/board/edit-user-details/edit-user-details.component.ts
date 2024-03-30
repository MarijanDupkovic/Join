import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user-details.component.html',
  styleUrl: './edit-user-details.component.scss'
})
export class EditUserDetailsComponent {
  createUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('',[Validators.maxLength(12), Validators.pattern('[0-9]*')]),
  });
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<void>();
  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  email: string = '';
  contact: any = [];

  constructor(private contacts: ContactsService) { }

  ngOnInit(): void {
    this.contacts.userDetailsEmail$.subscribe((email: string) => {
      this.email = email;
      if(this.email !== '') {
        this.getUserDetails().then(() => {
          this.setUserDetails();
        });
      }else {
        this.contact = [];
      }

    });
  }

  setUserDetails(): void {
    this.createUserForm.setValue({
      firstName: this.contact.firstName,
      lastName: this.contact.lastName,
      email: this.contact.email,
      phone: this.contact.phone
    });
  }

  async getUserDetails() {
    let body = {
      "email": this.email
    };

    await this.contacts.getUserDetails(body).then((response: any) => {
      this.contact = response['data'];
    });
  }
  onSubmit(): void {
    let body = {
      firstName: this.createUserForm.value.firstName,
      lastName: this.createUserForm.value.lastName,
      email: this.createUserForm.value.email,
      phone: this.createUserForm.value.phone,
    };
    this.contacts.editContact(body).then(
      (response) => {
        setTimeout(() => {
          this.contacts.getContacts();
          this.setLoading(false);
          this.close();
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

  deleteContact(event:any): void {
    event.stopPropagation();
    let body = {
      "email": this.email
    };

    this.contacts.deleteContact(body).then((response: any) => {
      this.contacts.changeEmail('');
      console.log('User Deleted');
      this.userDeleted.emit();
      this.contacts.getContacts();
      this.close();
    });
  }
}
