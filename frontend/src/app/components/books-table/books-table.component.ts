import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of, OperatorFunction, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookService } from '../../services/book.service';
import { BooksDataSource } from './books-data-source';

/**
 * Books table component
 *
 * Inspired by BooksListComponent and material table from https://material.angular.io/components/table/overview
 */
@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss'],
})
export class BooksTableComponent implements AfterViewInit, OnDestroy {
  dataSource: BooksDataSource = new BooksDataSource([]);
  displayedColumns: string[] = ['title', 'author', 'year', 'genre', 'status'];
  booksCount: number = 0;
  isLoadingBooks: boolean = true;
  showAddBook: boolean;
  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bookService: BookService, private router: Router) {}

  // Reference: https://material.angular.io/components/table/examples#table-http
  // I haven't used rxjs before, however data stream approach is interesting and somewhat hard at the same time
  // ###### How to update table on pagination's page change
  // Here we look after table's page change (observable) and
  // then map it to observable from bookService's getBooks request
  // (switchMap cancels previous observable subscription and opens new on each emission,
  // so in case of fast pages changing only response of last request to the bookService will be processed,
  // because subscription to previous requests' observables will be cancelled before new subscription registering) and
  // map each emitted values from Observable<Page<Book>> to books list and
  // at the end subscribe to created observable to update data source of table
  // ###### How to track pagination and sort changes simultaneously
  // Use merge to combine multiple observables into one observable
  ngAfterViewInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.

    // Rollback to first page on sorting change
    this.subscriptions.push(
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))
    );

    // Get new page from bookService on sorting change or on navigation to next/previous page
    this.subscriptions.push(
      merge(this.paginator.page, this.sort.sortChange)
        .pipe(startWith({}), this.booksMap())
        .subscribe((books) => this.dataSource.setData(books))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // I created separate pipeable operator to use in multiple places
  // (on page, sorting change and on new book creation).
  // Operator accepts any observable and on it's emission
  // makes request to bookService.getBooks and
  // maps received Page<Book> to array of Book[] type.
  // Reference: https://stackoverflow.com/a/62896009
  booksMap(): OperatorFunction<unknown, Book[]> {
    return (input$) =>
      input$.pipe(
        switchMap(() => {
          this.isLoadingBooks = true;
          return this.bookService
            .getBooks({
              pageIndex: this.paginator.pageIndex,
              sort: [
                { column: this.sort.active, direction: this.sort.direction },
              ],
            })
            .pipe(catchError(() => of({ totalElements: 0, content: [] })));
        }),
        map((page) => {
          this.isLoadingBooks = false;
          this.booksCount = page.totalElements;
          return page.content;
        })
      );
  }

  openBookDetails(bookId: string) {
    this.router.navigate(['/books', bookId]);
  }

  toggleAddBook() {
    this.showAddBook = !this.showAddBook;
  }

  addBook(book: Book) {
    this.bookService
      .saveBook(book)
      .pipe(this.booksMap())
      .subscribe((books) => this.dataSource.setData(books));
  }
}
