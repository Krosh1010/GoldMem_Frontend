import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGuestProfileComponent } from './post-guest-profile.component';

describe('PostGuestProfileComponent', () => {
  let component: PostGuestProfileComponent;
  let fixture: ComponentFixture<PostGuestProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostGuestProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostGuestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
