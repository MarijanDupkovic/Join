import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../services/error.service';

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
    phone: new FormControl('', [Validators.maxLength(12), Validators.pattern('[0-9]*')]),
  });
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<void>();

  email: string = '';
  contact: any = [];
  loading: boolean = false;
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;

  successMessageSubscription: Subscription = new Subscription;
  successMessage: string = '';

  errorMessage: string = '';
  errorCode: number | undefined;
  constructor(private contacts: ContactsService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorCodeSubscription = this.errorService.errorCode$.subscribe((errorCode: any) => {
      this.errorCode = errorCode;
    });
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
    });
    this.successMessageSubscription = this.errorService.successMessage$.subscribe((successMessage: any) => {
      this.successMessage = successMessage;
    });
    this.contacts.userDetailsEmail$.subscribe((email: string) => {
      this.email = email;
      if (this.email !== '') {
        this.getUserDetails().then(() => {
          this.setUserDetails();
        });
      } else {
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
  async onSubmit() {
    let body = {
      firstName: this.createUserForm.value.firstName,
      lastName: this.createUserForm.value.lastName,
      email: this.createUserForm.value.email,
      phone: this.createUserForm.value.phone,
    };
    this.setLoading(true);
    try {
      await this.contacts.editContact(body);
      this.errorService.handleSuccessMessages('Task edited successfully');
      setTimeout(async () => {
        this.contacts.getContacts();
        this.close();

      }, 3000);
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      setTimeout(() => {
        this.setLoading(false);
      }, 1000);
    }
  }

  close(): void {
    this.closeOverlay.emit();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }


  deleteContact(event: any): void {
    event.stopPropagation();
    let body = {
      "email": this.email
    };

    this.contacts.deleteContact(body).then((response: any) => {
      this.contacts.changeEmail('');
      this.userDeleted.emit();
      this.contacts.getContacts();
      this.close();
    });
  }
}
