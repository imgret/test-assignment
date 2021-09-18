import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatBooksTableComponent } from './mat-books-table.component';

describe('MatBooksTableComponent', () => {
  let component: MatBooksTableComponent;
  let fixture: ComponentFixture<MatBooksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatBooksTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatBooksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
