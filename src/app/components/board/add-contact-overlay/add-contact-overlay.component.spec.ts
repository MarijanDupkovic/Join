import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactOverlayComponent } from './add-contact-overlay.component';

describe('AddContactOverlayComponent', () => {
  let component: AddContactOverlayComponent;
  let fixture: ComponentFixture<AddContactOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContactOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
