import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPwResetMailComponent } from './request-pw-reset-mail.component';

describe('RequestPwResetMailComponent', () => {
  let component: RequestPwResetMailComponent;
  let fixture: ComponentFixture<RequestPwResetMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPwResetMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestPwResetMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
