import { AuthService } from './../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../board/sidebar/sidebar.component';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-post-header',
  standalone: true,
  imports: [CommonModule,SidebarComponent,RouterLink],
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.scss'
})
export class PostHeaderComponent {
  short_name: string = 'GG';
  openMenu: boolean = false;
  user_mail: string = '';
  showFooter = window.innerWidth < 1000;
  color_key: string = '';

  constructor(private auth:AuthService,private route:Router,private contacts:ContactsService) { }


  ngOnInit() {
    this.auth.user_mail$.subscribe(usermail => {
      this.user_mail = usermail;
    });
    this.contacts.contacts$.subscribe(contacts => {
      if (contacts.length > 0) {
        contacts.forEach((contact:any) => {
          if (contact.email === this.user_mail) {
            this.short_name = contact.firstName.charAt(0) + contact.lastName.charAt(0);
            this.color_key = contact.color_key;
          }
        });
      }
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
    });
  }


  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showFooter = event.target.innerWidth < 1000;
  }
}
