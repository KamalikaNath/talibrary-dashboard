import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TALibraryDashboard.css"; // Custom styling

const TALibraryDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:8000/api/books");
    setBooks(response.data);
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.publishedYear) {
      alert("Please fill in all fields.");
      return;
    }

    await axios.post("http://localhost:8000/api/books", newBook);
    setNewBook({ title: "", author: "", isbn: "", publishedYear: "" });
    fetchBooks();
  };

  const handleEditBook = (book) => {
    setEditingBook({ ...book });
  };

  const handleUpdateBook = async () => {
    await axios.put(`http://localhost:8000/api/books/${editingBook.id}`, editingBook);
    setEditingBook(null);
    fetchBooks();
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`http://localhost:8000/api/books/${id}`);
    fetchBooks();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fuzzyMatch = (text, search) =>
    text.toLowerCase().includes(search.toLowerCase());

  const filteredBooks = books.filter((book) =>
    fuzzyMatch(book.title, filters.title) &&
    fuzzyMatch(book.author, filters.author) &&
    fuzzyMatch(book.isbn, filters.isbn) &&
    book.publishedYear.toString().includes(filters.publishedYear)
  );

  return (
    <div className="container">
      <h1>TA Library Dashboard</h1>

      <div className="form-container">
        <h2>Add New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
        <input
          type="number"
          placeholder="Published Year"
          value={newBook.publishedYear}
          onChange={(e) =>
            setNewBook({ ...newBook, publishedYear: e.target.value })
          }
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div className="filter-container">
        <h2>Filter Books</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={filters.author}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={filters.isbn}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="publishedYear"
          placeholder="Published Year"
          value={filters.publishedYear}
          onChange={handleFilterChange}
        />
      </div>

      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Published Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) =>
            editingBook?.id === book.id ? (
              <tr key={book.id}>
                <td>
                  <input
                    type="text"
                    value={editingBook.title}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, title: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        author: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingBook.isbn}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        isbn: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editingBook.publishedYear}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        publishedYear: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <button onClick={handleUpdateBook}>Save</button>
                  <button onClick={() => setEditingBook(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.publishedYear}</td>
                <td>
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                  <button onClick={() => handleDeleteBook(book.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TALibraryDashboard;
