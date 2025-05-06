import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'book_details/:id', pathMatch: 'full' },
  // { path: 'add_book', component:  addBookComponent },
  // { path: 'edit_book', component:  editBookComponent },
  { path: 'book_details/:id', component: BookDetailsComponent },
  // { path: 'books_list', component: BookListComponent },
];
