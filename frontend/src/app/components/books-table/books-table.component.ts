import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

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
export class BooksTableComponent implements AfterViewInit {
  dataSource: BooksDataSource = new BooksDataSource([]);
  displayedColumns: string[] = ['title', 'author', 'year', 'genre', 'status'];
  booksCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bookService: BookService) {}

  // TODO add loading state to table
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
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // Get new page from bookService on sorting change or on navigation to next/previous page
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() =>
          this.bookService.getBooks({
            pageIndex: this.paginator.pageIndex,
            sort: [
              { column: this.sort.active, direction: this.sort.direction },
            ],
          })
        ),
        map((page) => {
          this.booksCount = page.totalElements;
          return page.content;
        })
      )
      .subscribe((books) => this.dataSource.setData(books));
  }
}

// Reference https://material.angular.io/components/table/examples#table-dynamic-observable-data
class BooksDataSource extends DataSource<Book> {
  private _dataStream = new Subject<Book[]>();

  constructor(initialData: Book[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Book[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Book[]) {
    this._dataStream.next(data);
  }
}
