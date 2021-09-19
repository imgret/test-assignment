import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { merge, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PageRequest } from 'src/app/models/page';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutsDataSource } from '../mat-checkouts-table/checkouts-data-source';
import { MatCheckoutsTableComponent } from '../mat-checkouts-table/mat-checkouts-table.component';

@Component({
  selector: 'app-late-checkouts',
  templateUrl: './late-checkouts.component.html',
  styleUrls: ['./late-checkouts.component.scss'],
})
export class LateCheckoutsComponent implements AfterViewInit {
  dataSource: CheckoutsDataSource = new CheckoutsDataSource([]);
  checkoutsCount: number = 0;
  pageSize: number = 20;
  isLoadingCheckouts: boolean = true;
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
              .getLateCheckouts({
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

  // Used on table's row click for navigation to checkout details view
  openCheckoutDetails(checkoutId: string) {
    this.router.navigate(['/checkouts', checkoutId]);
  }
}
