import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-book-search-form',
  templateUrl: './book-search-form.component.html',
  styleUrls: ['./book-search-form.component.scss'],
})
export class BookSearchFormComponent implements OnInit {
  searchTerm: string = '';

  @Output() onSubmit: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.searchTerm) this.onSubmit.emit(this.searchTerm);
  }
}
