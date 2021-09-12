import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { Checkout } from 'src/app/models/checkout';

// Material table component uses this as source of data for rows depiction.
// Reference https://material.angular.io/components/table/examples#table-dynamic-observable-data
export class CheckoutsDataSource extends DataSource<Checkout> {
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
