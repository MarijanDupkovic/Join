import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KbBoardComponent } from './kb-board.component';

describe('KbBoardComponent', () => {
  let component: KbBoardComponent;
  let fixture: ComponentFixture<KbBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KbBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KbBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
