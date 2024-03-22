import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { EditUserDetailsComponent } from '../edit-user-details/edit-user-details.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule,EditUserDetailsComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  @Output() closeOverlay = new EventEmitter<void>();
  public isMenuVisible = false;
  isEditContactVisible = false;
  email: string = '';
  contact: any = [];
  @ViewChild('editOptions')
  editOptions!: ElementRef;
  constructor(private contacts: ContactsService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.contacts.userDetailsEmail$.subscribe((email: string) => {
      this.email = email;
      this.getUserDetails();
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

  deleteContact(): void {
    let body = {
      "email": this.email
    };

    this.contacts.deleteContact(body).then((response: any) => {
      this.contacts.getContacts();
      this.close();
    });
  }

}
