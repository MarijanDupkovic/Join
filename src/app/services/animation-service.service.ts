import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AnimationServiceService {

  constructor() { }

  private animationFinishedSource = new Subject<void>();
  animationFinished$ = this.animationFinishedSource.asObservable();

  animationFinished() {
    this.animationFinishedSource.next();
  }
}
