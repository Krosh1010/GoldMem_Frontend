import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowManagerComponent } from './follow-manager.component';

describe('FollowManagerComponent', () => {
  let component: FollowManagerComponent;
  let fixture: ComponentFixture<FollowManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
