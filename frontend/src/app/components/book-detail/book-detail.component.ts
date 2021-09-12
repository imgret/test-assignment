import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
// TODO Add checkout creation form into checkouts view or into book details view (prefer book details)
// TODO remove BORROWED state from book creation form (because book won't have associated checkout)
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book;
  error: Error;
  subscription: Subscription;
  isProcessingRequest: boolean;
  showEditBook: boolean;
  showCheckOutBook: boolean;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params
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
      .subscribe((book) => (this.book = book));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      });
  }

  // Toggling depiction of book editing form is heavily inspired by video: https://youtu.be/3dHNOWTI7H8?t=5817
  // It looks like a good way to hide big book editing form and show it only when user needs this form.
  toggleEditBook() {
    this.showEditBook = !this.showEditBook;
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
      data: {
        title: 'Deletion confirmation',
        content: `Book with id ${this.book.id} will be fully erased from the database. Please confirm deletion of the book.`,
      },
    });

    dialogRef.afterClosed().subscribe((canDelete) => {
      if (canDelete) this.deleteBook();
    });
  }

  // Toggle depiction of book checkout form.
  toggleCheckOutBook() {
    this.showCheckOutBook = !this.showCheckOutBook;
  }
}
