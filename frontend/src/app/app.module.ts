import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { CheckoutsTableComponent } from './components/checkouts-table/checkouts-table.component';
import { CheckoutDetailComponent } from './components/checkout-detail/checkout-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { BookDetailTableComponent } from './components/book-detail-table/book-detail-table.component';
import { CheckoutDetailTableComponent } from './components/checkout-detail-table/checkout-detail-table.component';
import { BookSearchFormComponent } from './components/book-search-form/book-search-form.component';
import { BookFilterFormComponent } from './components/book-filter-form/book-filter-form.component';
import { MatBooksTableComponent } from './components/mat-books-table/mat-books-table.component';
import { FavoriteBooksComponent } from './components/favorite-books/favorite-books.component';
import { LateCheckoutsComponent } from './components/late-checkouts/late-checkouts.component';
import { MatCheckoutsTableComponent } from './components/mat-checkouts-table/mat-checkouts-table.component';

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    BookDetailComponent,
    BooksTableComponent,
    CheckoutsTableComponent,
    CheckoutDetailComponent,
    ConfirmationDialogComponent,
    BookFormComponent,
    CheckoutFormComponent,
    BookDetailTableComponent,
    CheckoutDetailTableComponent,
    BookSearchFormComponent,
    BookFilterFormComponent,
    MatBooksTableComponent,
    FavoriteBooksComponent,
    LateCheckoutsComponent,
    MatCheckoutsTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
