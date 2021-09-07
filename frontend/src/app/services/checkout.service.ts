import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../models/page';
import { Checkout } from '../models/checkout';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly baseUrl = environment.backendUrl + '/api/checkout';

  constructor(private http: HttpClient) {}

  getCheckouts(filter: Partial<PageRequest>): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/getCheckouts';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Checkout>>(url, { params });
  }

  getCheckout(checkOutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckout';
    const params = new HttpParams().set('checkOutId', checkOutId);
    return this.http.get<Checkout>(url, { params });
  }

  saveCheckout(checkout: Checkout): Observable<void> {
    const url = this.baseUrl + '/checkout';
    return this.http.post<void>(url, checkout);
  }

  deleteCheckout(checkOutId: string): Observable<void> {
    const url = this.baseUrl + '/checkout';
    const params = new HttpParams().set('checkOutId', checkOutId);
    return this.http.delete<void>(url, { params });
  }
}
