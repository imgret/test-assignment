import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailTableComponent } from './book-detail-table.component';

describe('BookDetailTableComponent', () => {
  let component: BookDetailTableComponent;
  let fixture: ComponentFixture<BookDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
