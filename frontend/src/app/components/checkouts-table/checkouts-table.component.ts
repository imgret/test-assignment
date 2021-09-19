import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { merge, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PageRequest } from 'src/app/models/page';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MatCheckoutsTableComponent } from '../mat-checkouts-table/mat-checkouts-table.component';
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
export class CheckoutsTableComponent implements AfterViewInit, OnDestroy {
  dataSource: CheckoutsDataSource = new CheckoutsDataSource([]);
  checkoutsCount: number = 0;
  isLoadingCheckouts = true;
  subscriptions: Subscription[] = [];

  @ViewChild(MatCheckoutsTableComponent)
  checkoutsTable: MatCheckoutsTableComponent;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Rollback to first page on sorting change
    this.subscriptions.push(
      this.checkoutsTable.sort.sortChange.subscribe(
        () => (this.checkoutsTable.paginator.pageIndex = 0)
      )
    );

    // Get new page from checkoutService on sorting change or on navigation to next/previous page
    this.subscriptions.push(
      merge(
        this.checkoutsTable.paginator.page,
        this.checkoutsTable.sort.sortChange
      )
        .pipe(
          startWith({}),
          switchMap(() => {
            let sort: PageRequest['sort'];
            // multiple checkout fields sorting is used
            // because 'borrower' is the column composed from two fields of checkout (borrowerFirstName, borrowerLastName)
            if (this.checkoutsTable.sort.active === 'borrower') {
              sort = [
                {
                  column: 'borrowerLastName',
                  direction: this.checkoutsTable.sort.direction,
                },
                {
                  column: 'borrowerFirstName',
                  direction: this.checkoutsTable.sort.direction,
                },
              ];
            } else {
              sort = [
                {
                  column: this.checkoutsTable.sort.active,
                  direction: this.checkoutsTable.sort.direction,
                },
              ];
            }
            this.isLoadingCheckouts = true;
            return this.checkoutService
              .getCheckouts({
                pageIndex: this.checkoutsTable.paginator.pageIndex,
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
        .subscribe((checkouts) => this.dataSource.setData(checkouts))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Used on checkout row click for navigation to checkout details view
  openCheckoutDetails(checkoutId: string) {
    this.router.navigate(['/checkouts', checkoutId]);
  }
}
