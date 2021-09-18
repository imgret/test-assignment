import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BooksDataSource } from './books-data-source';

@Component({
  selector: 'app-mat-books-table',
  templateUrl: './mat-books-table.component.html',
  styleUrls: ['./mat-books-table.component.scss'],
})
export class MatBooksTableComponent implements OnInit {
  displayedColumns = ['title', 'author', 'year', 'genre', 'status'];

  @Input() dataSource: BooksDataSource;
  @Input() length: number;
  @Input() pageSize: number;
  @Input() loading: boolean;

  // Emits book id
  @Output() onRowClick: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  constructor() {}

  ngOnInit(): void {}

  handleRowClick(bookId: string) {
    this.onRowClick.emit(bookId);
  }
}
