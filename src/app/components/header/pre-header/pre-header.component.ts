import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AnimationServiceService } from '../../../services/animation-service.service';

@Component({
  selector: 'app-pre-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-header.component.html',
  styleUrl: './pre-header.component.scss'
})
export class PreHeaderComponent {

  animationend: boolean = false;
  constructor(private animationService:AnimationServiceService) { }

  onAnimationFinished() {
    this.animationService.animationFinished();
    this.animationend = true;
  }

}
