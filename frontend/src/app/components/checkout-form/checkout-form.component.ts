import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Checkout } from 'src/app/models/checkout';
import { BookService } from 'src/app/services/book.service';

/**
 * Form for creation or editing of checkout.
 * Functionality is very similar to book form, excluding borrowed book editing.
 * Form gives possibility to edit only borrowed book's id and based on this id form
 * retrieves book from book service and composes whole checkout object before emission.
 * If occurs error during fetching of book, borrowedBookId field would be marked with error message.
 */
@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm = this.formBuilder.group({
    id: [],
    borrowerFirstName: ['', Validators.required],
    borrowerLastName: ['', Validators.required],
    borrowedBookId: ['', Validators.required],
    checkedOutDate: [null, Validators.required],
    dueDate: [null, Validators.required],
    returnedDate: [],
  });

  // Used for setting up initial form state
  @Input() checkout: Checkout | undefined;
  // Manages 'disabled' state of submit button
  @Input() disableSubmit: boolean;
  @Output() onSubmit: EventEmitter<Checkout> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    if (this.checkout) {
      const { borrowedBook, ...partialCheckout } = this.checkout;
      this.checkoutForm.setValue({
        ...partialCheckout,
        borrowedBookId: this.checkout.borrowedBook.id,
      });
    }
  }

  // Handle submit button click and if all form inputs hold valid values,
  // then emit onSubmit event and reset form.
  handleSubmit() {
    if (!this.checkoutForm.invalid) {
      // In case when component receives checkout object, which is used as initial value,
      // Compare borrowedBookId from form and borrowedBook.id from checkout.
      if (
        this.checkout &&
        this.checkoutForm.value.borrowedBookId === this.checkout.borrowedBook.id
      ) {
        // If book ids are same, then compose updated checkout object and emit it.
        const { borrowedBookId, ...partialCheckout } = this.checkoutForm.value;
        const checkout = {
          ...partialCheckout,
          borrowedBook: this.checkout.borrowedBook,
        };
        this.onSubmit.emit(checkout);
      } else {
        // Otherwise request book by id from backend and compose updated checkout for emission.
        // If occurs error, then set error in form for borrowedBookId field and
        this.bookService
          .getBook(this.checkoutForm.value.borrowedBookId)
          .pipe(
            catchError((error) => {
              this.checkoutForm.get('borrowedBookId').setErrors({
                invalidId: { message: "Id doesn't exist or is invalid" },
              });
              return throwError(error);
            })
          )
          .subscribe((book) => {
            const { borrowedBookId, ...partialCheckout } =
              this.checkoutForm.value;
            const checkout = { ...partialCheckout, borrowedBook: book };
            this.onSubmit.emit(checkout);
          });
      }
      if (!this.checkout) this.checkoutForm.reset();
    }
  }
}
