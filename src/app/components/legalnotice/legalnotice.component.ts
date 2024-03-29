import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-legalnotice',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './legalnotice.component.html',
  styleUrl: './legalnotice.component.scss'
})
export class LegalnoticeComponent {
  constructor(private route:Router) {}

  close(): void {
    this.route.navigate(['/login'])
  }
}
