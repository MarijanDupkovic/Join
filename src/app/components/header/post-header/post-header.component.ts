import { AuthService } from './../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../board/sidebar/sidebar.component';

@Component({
  selector: 'app-post-header',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './post-header.component.html',
  styleUrl: './post-header.component.scss'
})
export class PostHeaderComponent {
  short_name: string = 'GG';
  openMenu: boolean = false;
  user_mail: string = '';
  showFooter = window.innerWidth < 1000;

  constructor(private auth:AuthService,private route:Router) { }


  ngOnInit() {
    this.auth.user_mail$.subscribe(usermail => {
      this.user_mail = usermail;
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
