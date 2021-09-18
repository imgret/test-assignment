import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { CheckoutsTableComponent } from './components/checkouts-table/checkouts-table.component';
import { CheckoutDetailComponent } from './components/checkout-detail/checkout-detail.component';
import { FavoriteBooksComponent } from './components/favorite-books/favorite-books.component';

const routes: Routes = [
  { path: 'books', component: BooksTableComponent },
  { path: 'books/favorite', component: FavoriteBooksComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'checkouts', component: CheckoutsTableComponent },
  { path: 'checkouts/:id', component: CheckoutDetailComponent },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
