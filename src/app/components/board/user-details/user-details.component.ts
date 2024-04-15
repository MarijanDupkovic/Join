import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { EditUserDetailsComponent } from '../edit-user-details/edit-user-details.component';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, EditUserDetailsComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  @Output() closeOverlay = new EventEmitter<void>();
  public isMenuVisible = false;
  isEditContactVisible = false;
  email: string = '';
  contact: any = [];
  editHover = false;
  deleteHover = false;
  @ViewChild('editOptions')
  editOptions!: ElementRef;
  loading: boolean = false;
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;

  successMessageSubscription: Subscription = new Subscription;
  successMessage: string = '';

  errorMessage: string = '';
  errorCode: number | undefined;
  isMessageFromThisComponent: boolean = false;
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
      if (email) {
        this.email = email;
        this.getUserDetails();
      }
    });
    this.contacts.userDetailsChanged.subscribe(() => {
      this.getUserDetails();
    });

  }

  openEditContact(): void {
    this.isEditContactVisible = true;
    this.isMenuVisible = false;
  }

  getUserDetails(): void {
    let body = {
      "email": this.email
    };

    this.contacts.getUserDetails(body).then((response: any) => {
      this.contact = response['data'];
    });
  }

  close(): void {
    this.closeOverlay.emit();
  }

  toggleMenu(event: any): void {
    this.isMenuVisible = !this.isMenuVisible;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {

    if (this.isMenuVisible && !this.editOptions.nativeElement.contains(event.target)) {
      this.isMenuVisible = false;
    }
  }

  async deleteContact() {
    let body = {
      "email": this.email
    };
    this.loading = true;
    this.isMessageFromThisComponent = true;
    try {
      if (this.isMessageFromThisComponent) {
        await this.contacts.deleteContact(body);
        this.errorService.handleSuccessMessages('Contact successfully deleted');
        setTimeout(() => {
          this.afterContactDeleted();
          this.isMessageFromThisComponent = false;
        }, 3000);

      }
    } catch (error) {
      if (this.isMessageFromThisComponent) {
        this.errorService.handleError(error);
        setTimeout(() => {
          this.isMessageFromThisComponent = false;
        }, 3000);
      }
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }

  afterContactDeleted() {
    this.contacts.getContacts();
    this.clearUserDetails();
    this.close();
  }

  clearUserDetails() {
    this.isEditContactVisible = false;
    this.email = '';
    this.contact = [];
    this.editHover = false;
    this.deleteHover = false;
    this.contacts.changeEmail('');
  }
}
