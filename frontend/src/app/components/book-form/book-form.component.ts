import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    id: [],
    title: ['', Validators.required],
    author: ['', Validators.required],
    genre: ['', Validators.required],
    year: [0, [Validators.required, Validators.pattern(/^\d{1,4}$/)]],
    added: [new Date().toISOString().split('T')[0], Validators.required],
    checkOutCount: [0, [Validators.min(0), Validators.required]],
    status: ['AVAILABLE', Validators.required],
    dueDate: [],
    comment: [],
  });

  @Input() book: Book | undefined;
  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Book> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.book) this.bookForm.setValue(this.book);
  }

  handleSubmit() {
    if (!this.bookForm.invalid) {
      this.onSubmit.emit(this.bookForm.value);
      if (!this.book)
        this.bookForm.reset({
          year: 0,
          added: new Date().toISOString().split('T')[0],
          checkOutCount: 0,
          status: 'AVAILABLE',
        });
    }
  }
}
