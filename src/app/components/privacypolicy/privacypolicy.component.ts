import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.scss'
})
export class PrivacypolicyComponent {
  constructor(private route:Router) {}

  close(): void {
    this.route.navigate(['/login'])
  }
}
