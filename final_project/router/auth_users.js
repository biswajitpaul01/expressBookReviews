const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const booksArray = Object.values(books);
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review_text } = req.body;
  const username = req.user.data;
  const findBookIndex = booksArray.findIndex((book) => book.isbn === isbn);
  let bookReviews =
    findBookIndex !== -1 ? booksArray[findBookIndex].reviews : {};

  bookReviews[username] = review_text;
  books[findBookIndex + 1].reviews = bookReviews;

  return res
    .status(300)
    .json({
      message: "Review added successfully.",
      books: Object.values(books),
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.data;
  const findBookIndex = booksArray.findIndex((book) => book.isbn === isbn);
  let bookReviews =
    findBookIndex !== -1 ? booksArray[findBookIndex].reviews : {};

  if (username in bookReviews) {
    delete bookReviews[username];
  }

  books[findBookIndex + 1].reviews = bookReviews;

  return res
    .status(300)
    .json({
      message: "Review deleted successfully.",
      books: Object.values(books),
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
