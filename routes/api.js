/*
*
*
* Complete the API routing below
*
*
*/

'use strict';

const crypto = require('crypto');

// in-memory storage: [{ _id, title, comments: [] }]
let books = [];

const newId = () => crypto.randomBytes(12).toString('hex');
const findBook = (id) => books.find(b => b._id === id);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      res.json(books.map(b => ({ _id: b._id, title: b.title, commentcount: b.comments.length })));
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.send('missing required field title');
      const book = { _id: newId(), title, comments: [] };
      books.push(book);
      res.json({ _id: book._id, title: book.title });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      books = [];
      res.send('complete delete successful');
    });

  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = findBook(bookid);
      if (!book) return res.send('no book exists');
      res.json(book);
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send('missing required field comment');
      const book = findBook(bookid);
      if (!book) return res.send('no book exists');
      book.comments.push(comment);
      res.json(book);
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const book = findBook(bookid);
      if (!book) return res.send('no book exists');
      books = books.filter(b => b._id !== bookid);
      res.send('delete successful');
    });

};
