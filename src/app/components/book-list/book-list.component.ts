import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { BooksService } from '../../services/book.service';
import { combineLatest, Observable, startWith, switchMap, tap } from 'rxjs';
import { Book } from '../../interfaces/book';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '../book-form/book-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatListModule,
    HttpClientModule,
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit, AfterViewInit {
  booksList$!: Observable<Book[]>;
  selectedBooks: Book[] = [];
  currentQuery = '';
  pageSize = 10;
  currentPage = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public bookService: BooksService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.booksList$ = this.bookService.books$;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.bookService.query$,
      this.paginator.page.pipe(
        startWith({ pageIndex: 0, pageSize: this.pageSize })
      ),
    ])
      .pipe(
        switchMap(([query, pageEvent]) => {
          this.currentQuery = query;
          const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
          return this.bookService
            .searchBooks(query, startIndex, pageEvent.pageSize)
            .pipe(tap((books) => this.bookService.updateBookList(books)));
        })
      )
      .subscribe();
    this.cdr.detectChanges();
  }

  getDetails(book: Book) {
    this.bookService.setSelecteBook(book);
    this.router.navigate(['/book_details', book.id]);
  }

  checkBook(book: Book, check: boolean) {
    if (check) {
      this.selectedBooks.push(book);
    } else {
      this.selectedBooks = this.selectedBooks.filter(
        (_bookItr) => _bookItr.id != book.id
      );
    }

    this.bookService.markedBooksSubject$.next(this.selectedBooks);
  }

  editBook(_bookToEdit: Book) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      height: '300px',
      width: '600px',
      data: _bookToEdit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result.value) {
        const book = {
          ...result.value,
          id: _bookToEdit.id,
        };

        this.bookService.updateBook(book);
        this.snackBar.open('Book updated successfully', 'Close');
      }
    });
  }
}
