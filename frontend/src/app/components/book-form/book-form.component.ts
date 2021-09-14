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
    // ISO date format transformation reference: https://stackoverflow.com/a/25159489
    added: [new Date().toISOString().split('T')[0], Validators.required],
    checkOutCount: [0, [Validators.min(0), Validators.required]],
    status: ['AVAILABLE', Validators.required],
    dueDate: [],
    comment: [],
  });

  // Used for setting up initial form state
  @Input() book: Book | undefined;
  // Manages 'disabled; state of submit button
  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Book> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Set initial form values using received as prop book object
    if (this.book) this.bookForm.setValue(this.book);

    // Track status field changes and if changed to any value except BORROWED, then reset dueDate field
    this.bookForm.get('status').valueChanges.subscribe((status) => {
      if (status !== 'BORROWED') {
        this.bookForm.get('dueDate').setValue('');
      }
    });
  }

  // Handle submit button click and if all form inputs hold valid values,
  // then emit onSubmit event and reset form.
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
