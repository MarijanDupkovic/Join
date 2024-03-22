import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public userDetailsChanged = new EventEmitter<void>();
  private contacts = new BehaviorSubject<any>([]);
  contacts$ = this.contacts.asObservable();

  private userDetailsEmail = new BehaviorSubject<string>('');
  userDetailsEmail$ = this.userDetailsEmail.asObservable();


  constructor(private http: HttpClient) {
    this.getContacts();
   }

  async getContacts() {
    return lastValueFrom(this.http.post('./phpscripts/getUsers.php',{})).then((response:any) => {
      this.contacts.next(response['data']);
    });
  }
  updateUserDetails() {
    this.userDetailsChanged.emit();
  }

  async getUserDetails(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/getUserDetails.php',body));
  }
  async getUserDetailsByColorkey(body: Object) {
    return this.http.post('./phpscripts/getUserDetailsByColorkey.php',body);
  }

  changeEmail(email: string) {
    this.userDetailsEmail.next(email);

  }

  async deleteContact(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/deleteContact.php',body));
  }

  async createUser(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/createUser.php', body));

  }

  async editContact(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/editContact.php', body)).then((response:any) => {
      this.updateUserDetails();
    });
  }
}
