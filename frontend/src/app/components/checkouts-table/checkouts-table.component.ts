import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PageRequest } from 'src/app/models/page';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutsDataSource } from './checkouts-data-source';

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

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

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
          return this.checkoutService
            .getCheckouts({
              pageIndex: this.paginator.pageIndex,
              sort,
            })
            .pipe(catchError(() => of({ totalElements: 0, content: [] })));
        }),
        map((page) => {
          this.isLoadingCheckouts = false;
          this.checkoutsCount = page.totalElements;
          return page.content;
        })
      )
      .subscribe((checkouts) => this.dataSource.setData(checkouts));
  }

  // Used on checkout row click for navigation to checkout details view
  openCheckoutDetails(checkoutId: string) {
    this.router.navigate(['/checkouts', checkoutId]);
  }
}
