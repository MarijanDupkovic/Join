import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { PostHeaderComponent } from '../../header/post-header/post-header.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RouterOutlet, FooterComponent,PostHeaderComponent,CommonModule,SidebarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  showFooter = window.innerWidth < 1000;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showFooter = event.target.innerWidth < 1000;
  }

}
