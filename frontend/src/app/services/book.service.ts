import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { Book } from '../models/book';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';
import { BookStatus } from '../models/book-status';
import { LocalStorageService } from './local-storage.service';
import { DataStorage } from '../models/data-storage';
import { map, take } from 'rxjs/operators';
import { FavoriteBooks } from '../models/favorite-books';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly baseUrl = environment.backendUrl + '/api/book';

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  getBooks(filter: Partial<PageRequest>): Observable<Page<Book>> {
    const url = this.baseUrl + '/getBooks';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Book>>(url, { params });
  }

  getSearchedBooks(
    searchTerm: string,
    filter: Partial<PageRequest>
  ): Observable<Page<Book>> {
    const url = this.baseUrl + '/search';
    const params = RestUtil.buildParamsFromPageRequest(filter).set(
      'term',
      searchTerm
    );
    return this.http.get<Page<Book>>(url, { params });
  }

  getBooksByStatus(
    status: BookStatus,
    filter: Partial<PageRequest>
  ): Observable<Page<Book>> {
    const url = this.baseUrl + '/getBooks';
    const params = RestUtil.buildParamsFromPageRequest(filter).set(
      'status',
      status
    );
    return this.http.get<Page<Book>>(url, { params });
  }

  getBook(bookId: string): Observable<Book> {
    const url = this.baseUrl + '/getBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.get<Book>(url, { params });
  }

  saveBook(book: Book): Observable<void> {
    const url = this.baseUrl + '/saveBook';
    return this.http.post<void>(url, book);
  }

  deleteBook(bookId: string): Observable<void> {
    const url = this.baseUrl + '/deleteBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.delete<void>(url, { params });
  }

  getFavoriteBooks(): Observable<FavoriteBooks> {
    return this.localStorage.dataStorage$.pipe(
      map((data) => data.favoriteBooks)
    );
  }

  getFavoriteBook(bookId: string): Observable<Book> {
    return this.localStorage.dataStorage$.pipe(
      map((data) => data.favoriteBooks[bookId])
    );
  }

  addFavoriteBook(book: Book): void {
    this.localStorage.dataStorage$.pipe(take(1)).subscribe((data) => {
      const newFavoriteBooks: FavoriteBooks = {
        ...data.favoriteBooks,
        [book.id]: book,
      };
      const newData: DataStorage = { ...data, favoriteBooks: newFavoriteBooks };
      this.localStorage.setData(newData);
    });
  }

  removeFavoriteBook(bookId: string): void {
    this.localStorage.dataStorage$.pipe(take(1)).subscribe((data) => {
      const newFavoriteBooks: FavoriteBooks = Object.entries(data.favoriteBooks)
        .filter(([_bookId]) => bookId !== _bookId)
        .reduce<FavoriteBooks>((accumulator, [key, value]) => {
          accumulator[key] = value;
          return accumulator;
        }, {});
      const newData: DataStorage = { ...data, favoriteBooks: newFavoriteBooks };
      this.localStorage.setData(newData);
    });
  }
}
