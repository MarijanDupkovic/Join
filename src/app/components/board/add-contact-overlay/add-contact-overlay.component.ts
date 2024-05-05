import { ContactsComponent } from './../contacts/contacts.component';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { ErrorService } from '../../../services/error.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-add-contact-overlay',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContactsComponent],
  templateUrl: './add-contact-overlay.component.html',
  styleUrl: './add-contact-overlay.component.scss'
})
export class AddContactOverlayComponent {
  createUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),]),
    email: new FormControl('', [Validators.required, Validators.email,]),
    phone: new FormControl('', [Validators.maxLength(12), Validators.pattern('[0-9]*')]),
  });

  @Output() closeOverlay = new EventEmitter<void>();
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;

  successMessageSubscription: Subscription = new Subscription;
  successMessage: string = '';

  errorMessage: string = '';
  errorCode: number | undefined;
  loading: boolean = false;
  close_btn_hover: boolean = false;
  isMessageFromThisComponent: boolean = false;
  constructor(private contacts: ContactsService, private errorService: ErrorService) { }

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
    this.isMessageFromThisComponent = true;
    try {
      await this.contacts.createUser(this.createUserForm.value);
      if (this.isMessageFromThisComponent) this.handleSucces();
    } catch (error) {
      if (this.isMessageFromThisComponent) this.handleErrors(error);
    } finally {
      setTimeout(() => this.setLoading(false), 1000);
    }
  }

  handleErrors(error: any) {
    this.errorService.handleError(error);
    setTimeout(() => {
      this.isMessageFromThisComponent = false;
    }, 3000);
  }

  handleSucces() {
    this.errorService.handleSuccessMessages('User created successfully');
    setTimeout(() => {
      this.contacts.getContacts();
      this.createUserForm.reset();
      this.close();
      this.isMessageFromThisComponent = false;
    }, 3000);
  }

  close(): void {
    this.closeOverlay.emit();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

}
