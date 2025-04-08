import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesetingComponent } from './profileseting.component';

describe('ProfilesetingComponent', () => {
  let component: ProfilesetingComponent;
  let fixture: ComponentFixture<ProfilesetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
