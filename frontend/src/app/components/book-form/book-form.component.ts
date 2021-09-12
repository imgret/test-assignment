import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { BOOK_STATUSES } from 'src/app/models/book-status';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent implements OnInit {
  readonly BOOK_STATUSES = BOOK_STATUSES;
  bookForm = this.formBuilder.group({
    id: [''],
    title: [''],
    author: [''],
    genre: [''],
    year: [''],
    added: [''],
    checkOutCount: [''],
    status: ['AVAILABLE'],
    dueDate: [''],
    comment: [''],
  });

  @Input() book: Book | undefined;
  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Book> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.book) this.bookForm.setValue(this.book);
  }

  handleSubmit() {
    this.onSubmit.emit(this.bookForm.value);
  }
}
