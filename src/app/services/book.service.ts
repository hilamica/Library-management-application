import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { Book } from '../interfaces/book';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  totalItems: number = 0;
  pageIndex!: number;
  pageSize!: number;

  constructor(private http: HttpClient) {}

  private selectedBookSubject$ = new BehaviorSubject<Book | null>(null);
  selectedBook$ = this.selectedBookSubject$.asObservable();

  markedBooksSubject$ = new Subject<Book[]>();

  public booksSubject$ = new BehaviorSubject<Book[]>([]);
  books$ = this.booksSubject$.asObservable();

  private querySubject$ = new BehaviorSubject<string>('angular');
  query$ = this.querySubject$.asObservable();

  private totalResultsSubject$ = new BehaviorSubject<number>(0);
  totalResults$ = this.totalResultsSubject$.asObservable();

  setQuery(query: string) {
    if (query === '') {
      query = 'angular';
    }
    this.querySubject$.next(query);
  }

  searchBooks(
    query: string,
    startIndex = 0,
    maxResults = 10
  ): Observable<Book[]> {
    const url = `${this.API_URL}${query}&startIndex=${startIndex}&maxResults=${maxResults}`;
    return this.http.get<any>(url).pipe(
      tap((response) =>
        this.totalResultsSubject$.next(response.totalItems || 0)
      ),
      map(
        (response) =>
          response.items?.map(
            (item: any) =>
              ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || [],
                description: item.volumeInfo.description || '',
                publishedDate: item.volumeInfo.publishedDate || '',
              } as Book)
          ) || []
      ),
      tap((books) => this.booksSubject$.next(books))
    );
  }

  setSelecteBook(_selectedBook: Book) {
    this.selectedBookSubject$.next(_selectedBook);
  }

  deleteBooks(_deleteBooksIds: string[]) {
    // delete selected books
    let currentBooksList = this.booksSubject$.getValue();
    const filtterdBooks = currentBooksList.filter(
      (book) => !_deleteBooksIds.includes(book.id)
    );
    console.log('Updated list after deletion:', filtterdBooks);

    this.booksSubject$.next(filtterdBooks);
    //check if the current books that is present is on on the selected
    const presentedBook = this.selectedBookSubject$.getValue()?.id;
    if (presentedBook && _deleteBooksIds.includes(presentedBook)) {
      this.selectedBookSubject$.next(null);
    }

    this.markedBooksSubject$.next([]);
  }

  updateBookList(books: Book[]) {
    this.booksSubject$.next(books);
  }

  addBook(book: Book) {
    let currentList = this.booksSubject$.getValue();
    this.booksSubject$.next([book, ...currentList]);
  }

  updateBook(bookToUpdate: any) {
    let books = this.booksSubject$.getValue();
    const updatedList = books.map((book) =>
      book.id === bookToUpdate?.id ? bookToUpdate : book
    );
    this.booksSubject$.next(updatedList);

    //check if the current books that is present is on on the selected
    const presentedBook = this.selectedBookSubject$.getValue()?.id;
    if (presentedBook) {
      this.selectedBookSubject$.next(bookToUpdate);
    }
  }
}
