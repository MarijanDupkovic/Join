import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if(!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    }else{
      return true;
    }
  }
}
