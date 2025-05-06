import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public bookToEdit: Book | null) {
    this.bookToEdit = bookToEdit || null;
  }

  saveBookForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.saveBookForm = new FormGroup({
      title: new FormControl(this.bookToEdit?.title || '', Validators.required),
      authors: new FormControl(
        this.bookToEdit?.authors || '',
        Validators.required
      ),
      publishedDate: new FormControl(
        this.bookToEdit?.publishedDate || new Date(),
        Validators.required
      ),
      description: new FormControl(
        this.bookToEdit?.description || '',
        Validators.required
      ),
    });
  }
}
