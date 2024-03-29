import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPrivacypolicyComponent } from './post-privacypolicy.component';

describe('PostPrivacypolicyComponent', () => {
  let component: PostPrivacypolicyComponent;
  let fixture: ComponentFixture<PostPrivacypolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPrivacypolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostPrivacypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
