import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Checkout } from 'src/app/models/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BookDetailComponent } from '../book-detail/book-detail.component';

/**
 * This component retrieves from route checkout id and
 * basing on it retrieves and shows checkout detailed data formatted as table.
 * Also this component provides checkout editing and deletion functionality.
 * This component is similar to {@link BookDetailComponent book details component}.
 */
@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.scss'],
})
// TODO book return functionality
export class CheckoutDetailComponent implements OnInit, OnDestroy {
  checkout: Checkout;
  error: Error;
  subscription: Subscription;
  showEditCheckout: boolean;
  isProcessingRequest: boolean;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(map((params) => params.id))
      .pipe(
        switchMap((id) =>
          this.checkoutService.getCheckout(id).pipe(
            catchError((error) => {
              this.error = error;
              return throwError(error);
            })
          )
        )
      )
      .subscribe((checkout) => (this.checkout = checkout));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Used on submit event from checkout editing form.
  // Calls saveCheckout of checkout service and updates component's 'checkout' state,
  // which is used for depiction of checkout details table.
  editCheckout(checkout: Checkout) {
    this.error = null;
    this.isProcessingRequest = true;
    this.checkoutService
      .saveCheckout(checkout)
      .pipe(
        catchError((error) => {
          this.error = error;
          this.isProcessingRequest = false;
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.checkout = checkout;
        this.isProcessingRequest = false;
      });
  }

  // Toggling showing/hiding of checkout editing form.
  toggleEditCheckout() {
    this.showEditCheckout = !this.showEditCheckout;
  }

  // Used for requesting checkout deletion in checkout service.
  // This method is called after user confirmation from confirmation dialog.
  deleteCheckout() {
    this.error = null;
    this.isProcessingRequest = true;
    this.checkoutService
      .deleteCheckout(this.checkout.id)
      .pipe(
        catchError((error) => {
          this.error = error;
          this.isProcessingRequest = false;
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.isProcessingRequest = false;
        this.router.navigate(['/checkouts']);
      });
  }

  // Opens dialog to request deletion action confirmation from user.
  // It is called by 'delete' button click.
  openDeletionDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Deletion confirmation',
        content: `Checkout with id ${this.checkout.id} will be fully erased from the database. Please confirm deletion of the checkout.`,
      },
    });

    dialogRef.afterClosed().subscribe((canDelete) => {
      if (canDelete) this.deleteCheckout();
    });
  }

  // Sets current date as return date to checkout and sets associated book's status to 'RETURNED'
  markReturn() {
    console.log('returned');
  }
}
