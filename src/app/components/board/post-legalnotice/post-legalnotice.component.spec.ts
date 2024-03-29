import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLegalnoticeComponent } from './post-legalnotice.component';

describe('PostLegalnoticeComponent', () => {
  let component: PostLegalnoticeComponent;
  let fixture: ComponentFixture<PostLegalnoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLegalnoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostLegalnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
