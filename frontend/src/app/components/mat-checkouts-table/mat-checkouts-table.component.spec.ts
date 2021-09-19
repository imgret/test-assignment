import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCheckoutsTableComponent } from './mat-checkouts-table.component';

describe('MatCheckoutsTableComponent', () => {
  let component: MatCheckoutsTableComponent;
  let fixture: ComponentFixture<MatCheckoutsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatCheckoutsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatCheckoutsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
