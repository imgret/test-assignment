import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import { MatBooksTableComponent } from '../mat-books-table/mat-books-table.component';

@Component({
  selector: 'app-favorite-books',
  templateUrl: './favorite-books.component.html',
  styleUrls: ['./favorite-books.component.scss'],
})
export class FavoriteBooksComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Book>;
  booksCount: number;
  pageSize: number;
  subscription: Subscription;

  @ViewChild(MatBooksTableComponent) booksTable: MatBooksTableComponent;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.bookService
      .getFavoriteBooks()
      .pipe(delay(0))
      // delay(0) helps to postpone value emission and then
      // booksTable initializes just in time to use it in subscribe's callback
      // (otherwise booksTable is undefined in ngOnInit method)
      .subscribe((favoriteBooks) => {
        const bookList = Object.values(favoriteBooks);
        this.dataSource = new MatTableDataSource(bookList);
        this.dataSource.sort = this.booksTable?.sort;
        this.dataSource.paginator = this.booksTable?.paginator;
        this.booksCount = bookList.length;
        this.pageSize = bookList.length > 20 ? 20 : bookList.length;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Used on table's row click for navigation to book details view
  openBookDetails(bookId: string) {
    this.router.navigate(['/books', bookId]);
  }
}
