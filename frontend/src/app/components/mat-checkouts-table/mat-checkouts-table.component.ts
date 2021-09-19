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
import { CheckoutsDataSource } from '../checkouts-table/checkouts-data-source';

@Component({
  selector: 'app-mat-checkouts-table',
  templateUrl: './mat-checkouts-table.component.html',
  styleUrls: ['./mat-checkouts-table.component.scss'],
})
export class MatCheckoutsTableComponent implements OnInit {
  displayedColumns = [
    'borrowedBookTitle',
    'borrowedBookAuthor',
    'borrower',
    'checkedOutDate',
    'dueDate',
    'returnedDate',
  ];

  @Input() dataSource: CheckoutsDataSource;
  @Input() length: number;
  @Input() pageSize: number;
  @Input() loading: boolean;

  // Emits checkout id
  @Output() onRowClick: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  constructor() {}

  ngOnInit(): void {}

  handleRowClick(checkoutId: string) {
    this.onRowClick.emit(checkoutId);
  }
}
