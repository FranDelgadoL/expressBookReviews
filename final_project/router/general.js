const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booksList = JSON.stringify(books, null, 2);
    return res.status(300).json({message: "Books available", booksList});
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbnDetails = req.params.isbn;
    return res.status(300).json({ message: "Book details by ISBN", isbnDetails});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Find all books with the matching author in the 'books' array
    const booksByAuthor = books.filter((book) => book.author.toLowerCase() === author.toLowerCase());
  
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No books found for the provided author" });
    }
  
    // Books found, send the list of books by the author in the response
    return res.status(200).json({ message: "Books by the author", booksByAuthor });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Find all books with the matching title in the 'books' array
    const booksWithTitle = books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
  
    if (booksWithTitle.length === 0) {
      return res.status(404).json({ message: "No books found with the provided title" });
    }
  
    // Books found, send the list of books with the provided title in the response
    return res.status(200).json({ message: "Books with the provided title", booksWithTitle });
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Find the book with the matching ISBN in the 'books' array
    const book = books.find((book) => book.isbn === isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews
    if (!book.reviews || book.reviews.length === 0) {
      return res.status(200).json({ message: "No reviews available for this book" });
    }
  
    // Book found and has reviews, send the reviews in the response
    return res.status(200).json({ message: "Book reviews by ISBN", reviews: book.reviews });
  });

module.exports.general = public_users;
