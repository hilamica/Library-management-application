import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BooksService } from '../../services/book.service';
import { Book } from '../../interfaces/book';
import { v4 as uuidv4 } from 'uuid';

import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BookFormComponent } from '../book-form/book-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  constructor(
    private bookService: BooksService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  isDeleteButtonDisable: boolean = true;
  markedBooks: Book[] = [];
  newBook!: Book;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.bookService.markedBooksSubject$.subscribe((markedBooks) => {
      if (markedBooks.length > 0) {
        this.markedBooks = markedBooks;
        this.isDeleteButtonDisable = false;
      } else {
        this.isDeleteButtonDisable = true;
      }
    });
  }

  ngAfterViewInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query: string | null) => {
        this.bookService.setQuery(query?.trim() || '');
      });
  }

  search(query: string) {
    this.bookService.setQuery(query);
  }

  deleteBooks() {
    const markedBookIds = this.markedBooks.map((book) => book.id);
    this.bookService.deleteBooks(markedBookIds);
    this.snackBar.open('Book was deleted successfully!', 'Close', {
      duration: 3000,
    });
  }

  clearText() {
    this.searchControl.setValue('');
    // this.search('angular');
  }

  addNewBook() {
    let dialogRef = this.dialog.open(BookFormComponent, {
      height: '300px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const book = {
          id: uuidv4(),
          authors: result.controls['authors'].value.split(','),
          title: result.controls['title'].value,
          description: result.controls['description'].value,
          publishedDate: result.controls['publishedDate'].value,
        } as Book;

        this.bookService.addBook(book);
        this.snackBar.open('Book was added successfully!', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
