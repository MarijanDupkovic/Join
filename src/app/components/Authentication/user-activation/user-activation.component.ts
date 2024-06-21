import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss'
})
export class UserActivationComponent implements OnInit {
  message = '';
  isError = false;

  constructor(private auth: AuthService, private routes: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activateUser();
  }

  async activateUser() {
    let email = '';
    let body = {};
    this.routes.params.subscribe(params => {
      email = params['email'];
      body = this.getBody(email);
    });

    try {
      let response: any = await this.auth.activateUser(body);
      this.message = response['message'];
      this.isError = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 7000);
    } catch (error: any) {
      if (error['status'] === 400) {
        this.message = error.error.message;
        this.isError = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 7000);
      }
    }
  }

  getBody(mail: string) {
    let body = {
      email: mail
    }
    return body;
  }


  getMessageColor() {
    return this.isError ? 'red' : 'green';
  }

}
