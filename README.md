# 📚 Library Management App

This is an Angular standalone application for managing a book list, integrated with the Google Books API.

---

## ✨ Features

- 🔍 **Search Books** – Live search powered by the Google Books API.  
- 📑 **Pagination** – Navigate through results using Angular Material's paginator.  
- ➕ **Add Books** – Add custom books to your personal collection.  
- ✏️ **Edit Books** – Update existing book details via a dialog form.  
- 🗑️ **Delete Books** – Remove one or multiple selected books.  
- ✅ **Select Books** – Select a book to view or modify.  
- ⚙️ **Reactive State** – State is managed with `BehaviorSubject`s to ensure consistency and real-time updates.

---

## 🛠️ Tech Stack

- **Angular 17** (using standalone components)
- **RxJS** – `combineLatest`, `switchMap`, `tap`, `BehaviorSubject`
- **Angular Material** – dialogs, form fields, buttons, paginator
- **Google Books API**
- **TypeScript**

---

## 🚀 Installation & Running the App

### 1. Clone the Repository

```bash
git clone https://github.com/hilamica/Library-management-application.git
cd book-management-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App Locally

```bash
ng serve
```

Then open your browser at [http://localhost:4200]

---

## 📖 Notes

- The app uses the public [Google Books API](https://developers.google.com/books) for search queries.
- All book data (created/edited locally) is managed in memory (no backend database yet).
