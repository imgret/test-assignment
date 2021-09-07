import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutsTableComponent } from './checkouts-table.component';

describe('CheckoutsTableComponent', () => {
  let component: CheckoutsTableComponent;
  let fixture: ComponentFixture<CheckoutsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
