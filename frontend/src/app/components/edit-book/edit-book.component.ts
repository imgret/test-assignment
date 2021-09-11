import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { BOOK_STATUSES } from 'src/app/models/book-status';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
  readonly BOOK_STATUSES = BOOK_STATUSES;
  bookForm = this.formBuilder.group({
    id: [''],
    title: [''],
    author: [''],
    genre: [''],
    year: [''],
    added: [''],
    checkOutCount: [''],
    status: [''],
    dueDate: [''],
    comment: [''],
  });

  @Input() book: Book;
  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Book> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bookForm.setValue(this.book);
  }

  handleSubmit() {
    this.onSubmit.emit(this.bookForm.value);
  }
}
