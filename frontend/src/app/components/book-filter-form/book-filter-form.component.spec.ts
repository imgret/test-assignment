import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFilterFormComponent } from './book-filter-form.component';

describe('BookFilterFormComponent', () => {
  let component: BookFilterFormComponent;
  let fixture: ComponentFixture<BookFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
