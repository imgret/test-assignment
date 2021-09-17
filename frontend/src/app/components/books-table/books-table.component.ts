import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of, OperatorFunction, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookStatus } from 'src/app/models/book-status';
import { Page } from 'src/app/models/page';
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
  showFilterBooks: boolean;
  sortChangeSubscription: Subscription;
  tableUpdateSubscription: Subscription;

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

    this.dataSource.setData([]);

    // Rollback to first page on sorting change
    this.sortChangeSubscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );

    // Get new page from bookService on sorting change or on navigation to next/previous page
    // and set books from page into dataSource for table.
    this.tableUpdateSubscription = merge(
      this.paginator.page,
      this.sort.sortChange
    )
      .pipe(startWith({}), this.getAllBooks())
      .subscribe((books) => {
        this.dataSource.setData(books);
        this.isLoadingBooks = false;
      });
  }

  ngOnDestroy(): void {
    this.sortChangeSubscription.unsubscribe();
    this.tableUpdateSubscription.unsubscribe();
  }

  // Pipeable operator, which maps page of books into books list and as side effect updates booksCount state.
  mapPage(): OperatorFunction<Page<Book>, Book[]> {
    return (input$) =>
      input$.pipe(
        map((page) => {
          this.booksCount = page.totalElements;
          return page.content;
        })
      );
  }

  // I created separate pipeable operator to use in multiple places
  // (on page, sorting change and on new book creation).
  // Operator accepts any observable and on it's emission
  // makes request to bookService.getBooks and
  // maps received Page<Book> to array of Book[] type.
  // Also this operator internally manages isLoadingBooks and booksCount states,
  // which are used for showing/hiding table's progress bar and setting rows count in table accordingly.
  // Reference: https://stackoverflow.com/a/62896009
  getAllBooks(): OperatorFunction<unknown, Book[]> {
    return (input$) =>
      input$.pipe(
        switchMap(() => {
          this.isLoadingBooks = true;
          const filter = {
            pageIndex: this.paginator.pageIndex,
            sort: [
              { column: this.sort.active, direction: this.sort.direction },
            ],
          };
          return this.bookService
            .getBooks(filter)
            .pipe(catchError(() => of({ totalElements: 0, content: [] })));
        }),
        this.mapPage()
      );
  }

  // Used on book row click for navigation to book details view
  openBookDetails(bookId: string) {
    this.router.navigate(['/books', bookId]);
  }

  // Toggles state showAddBook, which is used to show/hide book creation form.
  // Also hides book filter form.
  toggleAddBook() {
    this.showFilterBooks = false;
    this.showAddBook = !this.showAddBook;
  }

  // Used on submit event from book creation form
  addBook(book: Book) {
    this.bookService
      .saveBook(book)
      .pipe(this.getAllBooks())
      .subscribe((books) => {
        this.dataSource.setData(books);
        this.isLoadingBooks = false;
        this.showAddBook = false;
      });
  }

  // Pipeable operator, which maps received value to books list in alignment with given search term.
  getSearchedBooks(searchTerm: string): OperatorFunction<unknown, Book[]> {
    return (input$) =>
      input$.pipe(
        switchMap(() => {
          this.isLoadingBooks = true;
          const filter = {
            pageIndex: this.paginator.pageIndex,
            sort: [
              { column: this.sort.active, direction: this.sort.direction },
            ],
          };
          return this.bookService
            .getSearchedBooks(searchTerm, filter)
            .pipe(catchError(() => of({ totalElements: 0, content: [] })));
        }),
        this.mapPage()
      );
  }

  // Is called when book search form emits onSubmit event.
  // Changes books retrieval operator in table's pagination and sorting subscription.
  // In case of empty searchTerm is used getAllBooks operator,
  // otherwise getSearchedBooks operator is used.
  searchBooks(searchTerm: string) {
    this.tableUpdateSubscription.unsubscribe();
    const getBooks =
      searchTerm === ''
        ? this.getAllBooks()
        : this.getSearchedBooks(searchTerm);
    this.tableUpdateSubscription = merge(
      this.paginator.page,
      this.sort.sortChange
    )
      .pipe(startWith({}), getBooks)
      .subscribe((books) => {
        this.dataSource.setData(books);
        this.isLoadingBooks = false;
      });
  }

  // Toggles state showFilterBooks, which is used to show/hide book filter form.
  // Also hides book addition form.
  toggleFilterBooks() {
    this.showAddBook = false;
    this.showFilterBooks = !this.showFilterBooks;
  }

  // Pipeable operator, which maps received value to books list in alignment with given filter options (currently only status).
  getFilteredBooks(status: BookStatus): OperatorFunction<unknown, Book[]> {
    return (input$) =>
      input$.pipe(
        switchMap(() => {
          this.isLoadingBooks = true;
          const filter = {
            pageIndex: this.paginator.pageIndex,
            sort: [
              { column: this.sort.active, direction: this.sort.direction },
            ],
          };
          return this.bookService
            .getBooksByStatus(status, filter)
            .pipe(catchError(() => of({ totalElements: 0, content: [] })));
        }),
        this.mapPage()
      );
  }

  // Is called when book filter form emits onSubmit event.
  // Changes books retrieval operator in table's pagination and sorting subscription.
  filterBooks(status: BookStatus) {
    this.showFilterBooks = false;
    this.tableUpdateSubscription.unsubscribe();
    this.tableUpdateSubscription = merge(
      this.paginator.page,
      this.sort.sortChange
    )
      .pipe(startWith({}), this.getFilteredBooks(status))
      .subscribe((books) => {
        this.dataSource.setData(books);
        this.isLoadingBooks = false;
      });
  }
}
