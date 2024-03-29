import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AnimationServiceService {

  constructor() { }

  private animationFinishedSource = new BehaviorSubject<boolean>(false);
  animationFinished$ = this.animationFinishedSource.asObservable();

  animationFinished() {
    this.animationFinishedSource.next(true);
  }

  resetAnimation() {
    this.animationFinishedSource.next(false);
  }
}
