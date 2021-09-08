import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { Checkout } from 'src/app/models/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { PageRequest } from 'src/app/models/page';

/**
 * Checkouts table component
 *
 * Very similar to BooksTableComponent. Only small adoption of functionality was required.
 * Like checkout multiple fields sorting in one request.
 */
@Component({
  selector: 'app-checkouts-table',
  templateUrl: './checkouts-table.component.html',
  styleUrls: ['./checkouts-table.component.scss'],
})
// TODO create checkout details view and add navigation from table to details view
export class CheckoutsTableComponent implements AfterViewInit {
  dataSource: CheckoutsDataSource = new CheckoutsDataSource([]);
  displayedColumns: string[] = [
    'borrowedBookTitle',
    'borrowedBookAuthor',
    'borrower',
    'checkedOutDate',
    'dueDate',
    'returnedDate',
  ];
  checkoutsCount: number = 0;
  isLoadingCheckouts = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private checkoutService: CheckoutService) {}

  ngAfterViewInit(): void {
    // Rollback to first page on sorting change
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // Get new page from checkoutService on sorting change or on navigation to next/previous page
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          let sort: PageRequest['sort'];
          // multiple checkout fields sorting is used
          // because 'borrower' is the column composed from two fields of checkout (borrowerFirstName, borrowerLastName)
          if (this.sort.active === 'borrower') {
            sort = [
              { column: 'borrowerFirstName', direction: this.sort.direction },
              { column: 'borrowerLastName', direction: this.sort.direction },
            ];
          } else {
            sort = [
              { column: this.sort.active, direction: this.sort.direction },
            ];
          }
          this.isLoadingCheckouts = true;
          return this.checkoutService.getCheckouts({
            pageIndex: this.paginator.pageIndex,
            sort,
          });
        }),
        map((page) => {
          this.isLoadingCheckouts = false;
          this.checkoutsCount = page.totalElements;
          return page.content;
        })
      )
      .subscribe((checkouts) => this.dataSource.setData(checkouts));
  }
}

// Reference https://material.angular.io/components/table/examples#table-dynamic-observable-data
class CheckoutsDataSource extends DataSource<Checkout> {
  private _dataStream = new Subject<Checkout[]>();

  constructor(initialData: Checkout[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Checkout[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Checkout[]) {
    this._dataStream.next(data);
  }
}
