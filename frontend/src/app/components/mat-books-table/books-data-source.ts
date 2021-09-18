import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from 'src/app/models/book';

// Material table component uses this as source of data for rows depiction.
// Reference https://material.angular.io/components/table/examples#table-dynamic-observable-data
export class BooksDataSource extends DataSource<Book> {
  private _dataStream = new BehaviorSubject<Book[]>([]);

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
