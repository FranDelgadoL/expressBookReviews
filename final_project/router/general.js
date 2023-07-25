const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required for registration" });
    }

    // Check if the username already exists
    if (users.hasOwnProperty(username)) {
        return res.status(409).json({ message: "Username already exists. Please choose a different username." });
    }

    // Add the new user to the list of users
    users[username] = { username, password };

    return res.status(200).json({ message: "User successfully registered" });
});
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify({books},null,4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Find the book with the matching ISBN in the 'books' array
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Book found, send the book details in the response
    return res.status(200).json({ message: "Book details by ISBN", book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookArray = Object.values(books);
    const booksByAuthor = bookArray.filter((book) => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found for the provided author" });
      }
    
      // Books found, send the list of books by the author in the response
      return res.status(200).json({ message: "Books by the author", booksByAuthor });
  });

// Get all books based on title
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Find the book with the matching ISBN in the 'books' object
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews
    if (!book.reviews || Object.keys(book.reviews).length === 0) {
      return res.status(200).json({ message: "No reviews available for this book" });
    }
  
    // Book found and has reviews, send the reviews in the response
    return res.status(200).json({ message: "Book reviews by ISBN", reviews: book.reviews });
});

module.exports.general = public_users;
