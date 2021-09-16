import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookStatus, BOOK_STATUSES } from 'src/app/models/book-status';

@Component({
  selector: 'app-book-filter-form',
  templateUrl: './book-filter-form.component.html',
  styleUrls: ['./book-filter-form.component.scss'],
})
export class BookFilterFormComponent implements OnInit {
  status: BookStatus = 'AVAILABLE';
  BOOK_STATUSES = BOOK_STATUSES;

  @Output() onSubmit: EventEmitter<BookStatus> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleSubmit() {
    this.onSubmit.emit(this.status);
  }
}
