const { nanoid } = require("nanoid");
const books = require("./books");

const handler = {
  addBook: (req, h) => {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;

    if (!name) {
      return h
        .response({
          status: "fail",
          message: "Gagal menambahkan buku. Mohon isi nama buku",
        })
        .code(400);
    }
    if (readPage > pageCount) {
      return h
        .response({
          status: "fail",
          message:
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        })
        .code(400);
    }

    const book = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage ? true : false,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(book);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  },
  getAllBook: (req, h) => {
    const { reading, name, finished } = req.query;
    if (name) {
      const newbooks = books
        .filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
      return h.response({
        status: "success",
        data: {
          books: newbooks.length > 0 ? newbooks : [],
        },
      });
    }
    if (reading) {
      if (reading !== "1" && reading !== "0") {
        return h.response({
          status: "success",
          data: {
            books: [],
          },
        });
      }

      const state = reading === "1" ? true : false;

      const newBook = books
        .filter((b) => b.reading === state)
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
      return h.response({
        status: "success",
        data: {
          books: newBook,
        },
      });
    }
    if (finished) {
      if (finished !== "1" && finished !== "0") {
        return h.response({
          status: "success",
          data: {
            books: [],
          },
        });
      }

      const state = finished === "1" ? true : false;

      const newBook = books
        .filter((b) => b.finished === state)
        .map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        }));
      return h.response({
        status: "success",
        data: {
          books: newBook,
        },
      });
    }

    const response = h.response({
      status: "success",
      data: {
        books: books.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    response.code(200);

    return response;
  },
  getBookById: (req, h) => {
    const { bookId } = req.params;

    const book = books.filter((m) => m.id === bookId)[0];

    if (book !== undefined) {
      const response = h.response({
        status: "success",
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  },
  editBookById: (req, h) => {
    const { bookId } = req.params;

    const updatedAt = new Date().toISOString();
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;

    if (!name) {
      return h
        .response({
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        })
        .code(400);
    }
    if (readPage > pageCount) {
      return h
        .response({
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        })
        .code(400);
    }

    const bookIndex = books.findIndex((m) => m.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage ? true : false,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  },
  deleteBookById: (req, h) => {
    const { bookId } = req.params;
    const bookIndex = books.findIndex((m) => m.id === bookId);

    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      return h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
    }

    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  },
};

module.exports = handler;
