import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-legalnotice',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './post-legalnotice.component.html',
  styleUrl: './post-legalnotice.component.scss'
})
export class PostLegalnoticeComponent {

}
