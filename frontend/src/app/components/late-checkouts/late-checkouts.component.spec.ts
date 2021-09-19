import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateCheckoutsComponent } from './late-checkouts.component';

describe('LateCheckoutsComponent', () => {
  let component: LateCheckoutsComponent;
  let fixture: ComponentFixture<LateCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateCheckoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
