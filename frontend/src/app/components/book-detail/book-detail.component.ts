import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

// TODO add book deletion confirmation dialog
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

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
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

  // TODO disable submit button of editing form while until response arrival
  editBook(book: Book) {
    this.error = null;
    // It took some time to figure out why post request wasn't sent
    // Solution: need to subscribe to observable otherwise request wouldn't be sent
    this.bookService
      .saveBook(book)
      .pipe(
        catchError((error) => {
          this.error = error;
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.book = book;
      });
  }

  toggleEditBook() {
    this.showEditBook = !this.showEditBook;
  }

  deleteBook() {
    this.error = null;
    this.bookService
      .deleteBook(this.book.id)
      .pipe(
        catchError((error) => {
          this.error = error;
          return throwError(error);
        })
      )
      .subscribe(() => this.router.navigate(['/books']));
  }
}
