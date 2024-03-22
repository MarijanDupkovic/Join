import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskdetailsComponent } from './edit-taskdetails.component';

describe('EditTaskdetailsComponent', () => {
  let component: EditTaskdetailsComponent;
  let fixture: ComponentFixture<EditTaskdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTaskdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
