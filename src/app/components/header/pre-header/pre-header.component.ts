import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { AnimationServiceService } from '../../../services/animation-service.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-pre-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-header.component.html',
  styleUrl: './pre-header.component.scss'
})
export class PreHeaderComponent {
  isSignIn: boolean = false;
  animationend: boolean = false;
  isImg: boolean = false;
  constructor(private animationService: AnimationServiceService, private router: Router) {
    router.events.subscribe(event => {
      console.log(event);
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/login') {
          this.isSignIn = event.urlAfterRedirects === '/login';
        }else{
          this.isImg = true;

        }
      }
    });
  }

  onAnimationFinished() {
    this.animationService.animationFinished();
    this.animationend = true;
    this.isImg = true;


  }

  resetAnimation() {
    this.animationend = false;
    this.animationService.resetAnimation();
  }


}
