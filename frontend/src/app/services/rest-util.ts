import { HttpParams } from '@angular/common/http';
import { PageRequest } from '../models/page';

export class RestUtil {
  public static buildParamsFromPageRequest(
    filter: Partial<PageRequest>
  ): HttpParams {
    const { pageIndex, pageSize, sort } = filter;
    // using let and reassigning params, because httpParams is immutable, so .set() returns new object.
    let params = new HttpParams();
    if (pageIndex != null) {
      params = params.set('page', String(pageIndex));
    }
    if (pageSize != null) {
      params = params.set('size', String(pageSize));
    }
    if (sort != null) {
      // process list of columns to sort and if column is undefined then skip it
      sort.forEach(
        ({ column, direction }) =>
          column &&
          (params = params.set('sort', column + ',' + direction ?? ''))
      );
    }
    return params;
  }
}
