import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { BOOK_STATUSES } from 'src/app/models/book-status';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
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

  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Book> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.onSubmit.emit(this.bookForm.value);
  }
}
