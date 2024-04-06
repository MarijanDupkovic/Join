import { AuthService } from './../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../board/sidebar/sidebar.component';
import { ContactsService } from '../../../services/contacts.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-post-header',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.scss'
})
export class PostHeaderComponent implements OnDestroy {
  short_name: string = 'GG';
  openMenu: boolean = false;
  user_mail: string = '';
  showFooter = window.innerWidth < 1000;
  color_key: string = '';
  private unsubscribe$ = new Subject<void>();

  constructor(private auth: AuthService, private route: Router, private contacts: ContactsService) { }

  ngOnInit() {
    this.auth.user_mail$.pipe(takeUntil(this.unsubscribe$)).subscribe(usermail => {
      this.user_mail = usermail;
    }, error => {
      console.error(error);
    });
    this.contacts.contacts$.pipe(takeUntil(this.unsubscribe$)).subscribe(contacts => {
      if (contacts.length > 0) {
        contacts.forEach((contact: any) => {
          if (contact.email === this.user_mail) {
            this.short_name = contact.firstName.charAt(0) + contact.lastName.charAt(0);
            this.color_key = contact.color_key;
          }
        });
      }
    }, error => {
      console.error(error);
    });
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
  }

  logout() {
    let body = {
      email: this.user_mail
    };
    this.auth.signOut(body).then(() => {
      this.route.navigate(['/']);
    }).catch(error => {
      console.error(error);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showFooter = event.target.innerWidth < 1000;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
