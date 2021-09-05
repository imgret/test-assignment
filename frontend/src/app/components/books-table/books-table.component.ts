import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';

/**
 * Books table component
 *
 * Inspired by BooksListComponent and material table from https://material.angular.io/components/table/overview
 */
@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss'],
})
export class BooksTableComponent implements OnInit {
  books$: Observable<Page<Book> | Error>;
  displayedColumns = ['title', 'author', 'year', 'genre', 'status'];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({});
  }
}
