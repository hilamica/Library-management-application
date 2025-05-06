import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/book.service';
import { Book } from '../../interfaces/book';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  selectedBook$!: Observable<Book | null>;

  constructor(private bookService: BooksService) {}

  ngOnInit(): void {
    this.selectedBook$ = this.bookService.selectedBook$;
  }
}
