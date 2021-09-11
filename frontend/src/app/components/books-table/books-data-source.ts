import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { Book } from 'src/app/models/book';

// Reference https://material.angular.io/components/table/examples#table-dynamic-observable-data
export class BooksDataSource extends DataSource<Book> {
  private _dataStream = new Subject<Book[]>();

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
