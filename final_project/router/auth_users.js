const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return !!username;
}

const authenticatedUser = (username,password)=>{ 
    const user = users.find((user) => user.username === username && user.password === password);

  return !!user;//returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Username and password required"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.accessToken?.data;
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated. Please log in to post a review" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already posted a review for the same ISBN
    if (book.reviews && book.reviews[username]) {
      // User has already posted a review for this book, modify the existing review
      book.reviews[username] = review;
    } else {
      // User has not posted a review for this book, add a new review
      book.reviews = { ...book.reviews, [username]: review };
    }
  
    return res.status(200).json({ message: "Review added/modified successfully" });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.accessToken?.data;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated. Please log in to delete a review" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has posted a review for the same ISBN
    if (book.reviews && book.reviews[username]) {
      // User has posted a review for this book, delete the review
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
