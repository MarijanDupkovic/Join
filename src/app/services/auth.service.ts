import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  private user_mail = new BehaviorSubject<string>('');
  user_mail$ = this.user_mail.asObservable();
  constructor(private http: HttpClient) {
    this.loggedIn.next(this.isAuthenticated());
    if (sessionStorage.getItem('user')) {
      this.user_mail.next(JSON.parse(sessionStorage.getItem('user') || '{}'));
    }
  }

  async signIn(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/signIn.php', body)).then((response: any) => {
      this.user_mail.next(response['user']);
      sessionStorage.setItem('user', JSON.stringify(response['user']));
      sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
      this.setLoggedIn(true);
    });

  }

  async signUp(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/signUp.php', body));
  }

  async signOut(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/logout.php', body)).then((response) => {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('user');
      this.setLoggedIn(false);
      location.reload();
    });
  }


  activateUser(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/activateUser.php', body));
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  public isAuthenticated(): boolean {
    if (sessionStorage.getItem('isLoggedIn')) {
      let storage = JSON.parse(sessionStorage.getItem('isLoggedIn') || '{}');

      if (storage == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
