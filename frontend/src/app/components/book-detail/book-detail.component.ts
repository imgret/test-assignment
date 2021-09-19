import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { OperatorFunction, Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Checkout } from 'src/app/models/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book;
  error: Error;
  routeSubscription: Subscription;
  isProcessingRequest: boolean;
  showEditBook: boolean;
  showCheckOutBook: boolean;
  checkout: Checkout;
  isFavoriteBook: boolean;
  favoriteBookSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Firstly, get book id from route, then get book by id from book service
    // and when book is received add it to local state, and subscribe to 'get favorite book' observable
    // to set isFavoriteBook state
    this.routeSubscription = this.route.params
      .pipe(map((params) => params.id))
      .pipe(
        switchMap((id) =>
          this.bookService.getBook(id).pipe(
            catchError((error) => {
              this.error = error;
              return throwError(error);
            })
          )
        )
      )
      .subscribe((book) => {
        this.book = book;
        this.favoriteBookSubscription = this.bookService
          .getFavoriteBook(book.id)
          .subscribe((favoriteBook) => {
            this.isFavoriteBook = Boolean(favoriteBook);
          });
      });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.favoriteBookSubscription?.unsubscribe();
  }

  // Used on submit event from book editing form.
  // Calls saveBook of book service and updates internal 'book' state,
  // which is used for depiction of book details table.
  editBook(book: Book) {
    this.error = null;
    this.isProcessingRequest = true;
    // It took some time to figure out why post request wasn't sent
    // Solution: need to subscribe to the observable otherwise request won't be sent
    this.bookService
      .saveBook(book)
      .pipe(
        catchError((error) => {
          this.error = error;
          this.isProcessingRequest = false;
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.book = book;
        this.isProcessingRequest = false;
        this.showEditBook = false;
      });
  }

  // Toggling depiction of book editing form is heavily inspired by video: https://youtu.be/3dHNOWTI7H8?t=5817
  // It looks like a good way to hide big book editing form and show it only when user needs this form.
  toggleEditBook() {
    this.showEditBook = !this.showEditBook;
    // Close checkout creation form on opening of book editing form
    this.showCheckOutBook = false;
  }

  // Used for requesting book deletion in book service.
  // This method is called after user confirmation from confirmation dialog.
  deleteBook() {
    this.error = null;
    this.isProcessingRequest = true;
    this.bookService
      .deleteBook(this.book.id)
      .pipe(
        catchError((error) => {
          this.error = error;
          this.isProcessingRequest = false;
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.isProcessingRequest = false;
        this.router.navigate(['/books']);
      });
  }

  // Opens dialog to request deletion action confirmation from user.
  // It is called by 'delete' button click.
  openDeletionDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: 640,
      data: {
        title: 'Deletion confirmation',
        content: `Book with id ${this.book.id} will be fully erased from the database. Exception is when the book has associated checkouts with it. Please confirm deletion of the book.`,
      },
    });

    dialogRef.afterClosed().subscribe((canDelete) => {
      if (canDelete) this.deleteBook();
    });
  }

  // Toggle depiction of book checkout form.
  toggleCheckOutBook() {
    if (this.showCheckOutBook) {
      this.showCheckOutBook = false;
      this.checkout = null;
    } else {
      this.showCheckOutBook = true;
      this.checkout = {
        id: '',
        borrowerFirstName: '',
        borrowerLastName: '',
        borrowedBook: this.book,
        checkedOutDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        returnedDate: '',
      };
      // Close book editing form on opening of checkout creation form
      this.showEditBook = false;
    }
  }

  // Rxjs pipeable operator, which sets status of current book to 'BORROWED', checkOutCount + 1, dueDate to given date.
  // Returns observable which emits updated book object.
  borrowBook(dueDate: string): OperatorFunction<unknown, Book> {
    const updatedBook: Book = {
      ...this.book,
      status: 'BORROWED',
      checkOutCount: this.book.checkOutCount + 1,
      dueDate,
    };
    return (input$) =>
      input$.pipe(
        switchMap(() => this.bookService.saveBook(updatedBook)),
        map(() => updatedBook)
      );
  }

  // Used on submit event from book checkout form.
  // Calls saveCheckout of checkout service to create new checkout entry in a database and
  // sets book state to BORROWED in the database and updates book state in view.
  checkOutBook(checkout: Checkout) {
    this.error = null;
    this.isProcessingRequest = true;
    this.checkoutService
      .saveCheckout(checkout)
      .pipe(
        this.borrowBook(checkout.dueDate),
        catchError((error) => {
          this.error = error;
          this.isProcessingRequest = false;
          return throwError(error);
        })
      )
      .subscribe((book) => {
        this.book = book;
        this.isProcessingRequest = false;
        // Close checkout form, because it is unavailable to books with 'BORROWED' status.
        this.showCheckOutBook = false;
      });
  }

  // Opens dialog to request book checkout action confirmation from user.
  // It is called by submission of book checkout form.
  openCheckoutDialog(checkout: Checkout) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: 640,
      data: {
        title: 'Checkout confirmation',
        content: `Book with id ${this.book.id} will be marked as borrowed and
        corresponding checkout entry will be saved in database.
        Please confirm book checkout.`,
      },
    });

    dialogRef.afterClosed().subscribe((canDelete) => {
      if (canDelete) this.checkOutBook(checkout);
    });
  }

  toggleFavoriteBook() {
    if (this.isFavoriteBook) {
      this.bookService.removeFavoriteBook(this.book.id);
    } else {
      this.bookService.addFavoriteBook(this.book);
    }
  }
}
