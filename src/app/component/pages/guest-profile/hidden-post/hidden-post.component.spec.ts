import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenPostComponent } from './hidden-post.component';

describe('HiddenPostComponent', () => {
  let component: HiddenPostComponent;
  let fixture: ComponentFixture<HiddenPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
