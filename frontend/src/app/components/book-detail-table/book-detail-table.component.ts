import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-book-detail-table',
  templateUrl: './book-detail-table.component.html',
  styleUrls: ['./book-detail-table.component.scss'],
})
export class BookDetailTableComponent implements OnInit {
  @Input() book: Book;

  constructor() {}

  ngOnInit(): void {}
}
