import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Checkout } from 'src/app/models/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.scss'],
})
export class CheckoutDetailComponent implements OnInit {
  checkout$: Observable<Checkout>;
  error: Error;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.checkout$ = this.route.params.pipe(map((params) => params.id)).pipe(
      switchMap((id) =>
        this.checkoutService.getCheckout(id).pipe(
          catchError((error) => {
            this.error = error;
            return throwError(error);
          })
        )
      )
    );
  }
}
