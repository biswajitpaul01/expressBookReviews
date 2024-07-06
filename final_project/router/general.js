const express = require("express");
let books = require("./booksdb.js");
const booksArray = Object.values(books);
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(300).json({ books: booksArray });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const booksByISBN = booksArray.find((book) => book.isbn === isbn);
  return res.status(300).json({ book: booksByISBN });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booksBySpecificAuthor = booksArray.filter(
    (book) => book.author === author
  );
  return res.status(300).json({ books: booksBySpecificAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const bookBySpecificTitle = booksArray.find((book) => book.title === title);
  return res.status(300).json({ book: bookBySpecificTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const getBookByISBN = booksArray.find((book) => book.isbn === isbn);
  return res.status(300).json({ reviews: getBookByISBN?.reviews });
});

module.exports.general = public_users;
