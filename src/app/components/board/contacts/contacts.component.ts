import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { AddContactOverlayComponent } from '../add-contact-overlay/add-contact-overlay.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  color_key: string;
}

interface ContactGroup {
  key: string;
  value: Contact[];
}
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule,AddContactOverlayComponent,UserDetailsComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  loaded_contacts: ContactGroup[] = [];
  public isAddContactOverlayVisible = false;
  static isAddContactOverlayVisible: boolean;
  isUserDetailsVisible: boolean = false;
  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.contactsService.contacts$.subscribe((response: Contact[]) => {
      const groupedContacts: { [key: string]: Contact[] } = {};

      response.forEach(contact => {
        const firstLetter = contact.lastName.charAt(0).toUpperCase();

        if (!groupedContacts[firstLetter]) {
          groupedContacts[firstLetter] = [];
        }

        groupedContacts[firstLetter].push(contact);
      });

      this.loaded_contacts = Object.entries(groupedContacts).map(([key, value]) => ({ key, value }));
    });
  }


  toggleAddContact(): void {
    this.isAddContactOverlayVisible = !this.isAddContactOverlayVisible;
  }

  openUserDetails(email:string): void {
    this.contactsService.changeEmail(email);
    this.isUserDetailsVisible = !this.isUserDetailsVisible;

  }
}
