const handler = require("./handler");
const route = [
  {
    method: "POST",
    path: "/books",
    handler: handler.addBook,
  },
  {
    method: "GET",
    path: "/books",
    handler: handler.getAllBook,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: handler.getBookById,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: handler.editBookById,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: handler.deleteBookById,
  },
];

module.exports = route;
