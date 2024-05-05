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
    this.routes.params.subscribe(params => {
      email = params['email'];
      let body = {
        email: email,
      };
      this.auth.activateUser(body).subscribe(
        (response: any) => {
          if (response['status'] === 200) {
            this.message = response['message'];
            this.isError = false;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 7000);
          }
        }, (error) => {
          if (error['status'] === 400) {
            this.message = error.error.message;
            this.isError = true;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 7000);
          }

        });
    });
  }
  getMessageColor() {
    return this.isError ? 'red' : 'green';
  }

}
