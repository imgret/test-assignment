import { Component, Input, OnInit } from '@angular/core';
import { Checkout } from 'src/app/models/checkout';

@Component({
  selector: 'app-checkout-detail-table',
  templateUrl: './checkout-detail-table.component.html',
  styleUrls: ['./checkout-detail-table.component.scss'],
})
export class CheckoutDetailTableComponent implements OnInit {
  @Input() checkout: Checkout;

  constructor() {}

  ngOnInit(): void {}
}
