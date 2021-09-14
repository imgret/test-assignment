import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDetailTableComponent } from './checkout-detail-table.component';

describe('CheckoutDetailTableComponent', () => {
  let component: CheckoutDetailTableComponent;
  let fixture: ComponentFixture<CheckoutDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutDetailTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
