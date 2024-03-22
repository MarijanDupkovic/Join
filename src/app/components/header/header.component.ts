import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreHeaderComponent } from './pre-header/pre-header.component';
import { PostHeaderComponent } from './post-header/post-header.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet,PreHeaderComponent,PostHeaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private subscription: Subscription | undefined;
  signedIn: boolean = false;

  constructor(private auth:AuthService) { }

  ngOnInit() {
    this.subscription = this.auth.loggedIn$.subscribe(loggedIn => {
      this.signedIn = loggedIn;
    });
  }
}
