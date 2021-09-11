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
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book;
  error: Error;
  subscription: Subscription;
  showEditBook: boolean;
  isProcessingRequest: boolean;

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

  toggleEditBook() {
    this.showEditBook = !this.showEditBook;
  }

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

  openDeletionDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Deletion confirmation',
        content: `${this.book.title} will be fully erased from the database. Please confirm deletion of the book.`,
      },
    });

    dialogRef.afterClosed().subscribe((canDelete) => {
      if (canDelete) this.deleteBook();
    });
  }
}
