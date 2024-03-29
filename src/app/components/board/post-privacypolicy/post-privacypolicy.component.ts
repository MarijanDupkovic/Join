import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-privacypolicy',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './post-privacypolicy.component.html',
  styleUrl: './post-privacypolicy.component.scss'
})
export class PostPrivacypolicyComponent {

}
