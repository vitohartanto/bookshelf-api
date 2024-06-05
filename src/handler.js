const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const getAllBooksByNameQuery = books
      .filter(
        (book) =>
          // eslint-disable-next-line implicit-arrow-linebreak, comma-dangle
          book.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
        // eslint-disable-next-line function-paren-newline
      )
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getAllBooksByNameQuery,
      },
    });

    response.code(200);
    return response;
  }

  if (reading === '0' || reading === '1') {
    const isReading = reading === '1';

    const getAllBooksByReadingQuery = books
      .filter((book) => book.reading === isReading)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getAllBooksByReadingQuery,
      },
    });

    response.code(200);
    return response;
  }

  if (finished === '0' || finished === '1') {
    const isFinished = finished === '1';

    const getAllBooksNameByFinishedQuery = books
      .filter((book) => book.finished === isFinished)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getAllBooksNameByFinishedQuery,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((bookItem) => bookItem.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = readPage === pageCount;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

/// /////////// BATASSSS

// const { nanoid } = require('nanoid');
// const books = require('./books.js');

// const addBookHandler = (request, h) => {
//   const {
//     name,
//     year,
//     author,
//     summary,
//     publisher,
//     pageCount,
//     readPage,
//     reading,
//   } = request.payload;

//   const id = nanoid(16);
//   const insertedAt = new Date().toISOString();
//   const updatedAt = insertedAt;
//   const finished = readPage === pageCount ? true : false;

//   const newBook = {
//     id,
//     name,
//     year,
//     author,
//     summary,
//     publisher,
//     pageCount,
//     readPage,
//     finished,
//     reading,
//     insertedAt,
//     updatedAt,
//   };

//   if (!name) {
//     return h
//       .response({
//         status: 'fail',
//         message: 'Gagal menambahkan buku. Mohon isi nama buku',
//       })
//       .code(400);
//   }

//   if (readPage > pageCount) {
//     return h
//       .response({
//         status: 'fail',
//         message:
//           'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
//       })
//       .code(400);
//   }

//   books.push(newBook);

//   const isSuccess = books.filter((book) => book.id === id).length > 0;

//   if (isSuccess) {
//     return h
//       .response({
//         status: 'success',
//         message: 'Buku berhasil ditambahkan',
//         data: {
//           bookId: id,
//         },
//       })
//       .code(201);
//   }
// };

// const getAllBooksHandler = (request, h) => {
//   const { name, reading, finished } = request.query;

//   if (name) {
//     const getAllBookByQueryName = books
//       .filter((book) =>
//         book.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
//       )
//       .map((book) => ({
//         id: book.id,
//         name: book.name,
//         publisher: book.publisher,
//       }));

//     return h
//       .response({
//         status: 'success',
//         data: {
//           books: getAllBookByQueryName,
//         },
//       })
//       .code(200);
//   }

//   if (reading === '0' || reading === '1') {
//     const isReading = reading === '1';

//     const getAllBookByQueryReading = books
//       .filter((book) => book.reading === isReading)
//       .map((book) => ({
//         id: book.id,
//         name: book.name,
//         publisher: book.publisher,
//       }));

//     return h
//       .response({
//         status: 'success',
//         data: {
//           books: getAllBookByQueryReading,
//         },
//       })
//       .code(200);
//   }

//   if (finished === '0' || finished === '1') {
//     const isFinished = finished === '1';

//     const getAllBookByQueryFinished = books
//       .filter((book) => book.finished === isFinished)
//       .map((book) => ({
//         id: book.id,
//         name: book.name,
//         publisher: book.publisher,
//       }));

//     return h
//       .response({
//         status: 'success',
//         data: {
//           books: getAllBookByQueryFinished,
//         },
//       })
//       .code(200);
//   }

//   return h
//     .response({
//       status: 'success',
//       data: {
//         books: books.map((book) => ({
//           id: book.id,
//           name: book.name,
//           publisher: book.publisher,
//         })),
//       },
//     })
//     .code(200);
// };

// const getBookByIdHandler = (request, h) => {
//   const { bookId } = request.params;

//   const book = books.find((book) => book.id === bookId);

//   if (book !== undefined) {
//     return h
//       .response({
//         status: 'success',
//         data: {
//           book,
//         },
//       })
//       .code(200);
//   }

//   return h
//     .response({
//       status: 'fail',
//       message: 'Buku tidak ditemukan',
//     })
//     .code(404);
// };

// const editBookByIdHandler = (request, h) => {
//   const { bookId } = request.params;

//   const {
//     name,
//     year,
//     author,
//     summary,
//     publisher,
//     pageCount,
//     readPage,
//     reading,
//   } = request.payload;

//   const finished = pageCount === readPage ? true : false;
//   const updatedAt = new Date().toISOString();

//   if (!name) {
//     return h
//       .response({
//         status: 'fail',
//         message: 'Gagal memperbarui buku. Mohon isi nama buku',
//       })
//       .code(400);
//   }

//   if (readPage > pageCount) {
//     return h
//       .response({
//         status: 'fail',
//         message:
//           'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
//       })
//       .code(400);
//   }

//   const index = books.findIndex((book) => book.id === bookId);

//   if (index !== -1) {
//     books[index] = {
//       ...books[index],
//       name,
//       year,
//       author,
//       summary,
//       publisher,
//       pageCount,
//       readPage,
//       reading,
//       finished,
//       updatedAt,
//     };

//     return h
//       .response({
//         status: 'success',
//         message: 'Buku berhasil diperbarui',
//       })
//       .code(200);
//   }

//   return h
//     .response({
//       status: 'fail',
//       message: 'Gagal memperbarui buku. Id tidak ditemukan',
//     })
//     .code(404);
// };

// const deleteBookByIdHandler = (request, h) => {
//   const { bookId } = request.params;

//   const index = books.findIndex((book) => book.id === bookId);

//   if (index !== -1) {
//     books.splice(index, 1);
//     return h
//       .response({
//         status: 'success',
//         message: 'Buku berhasil dihapus',
//       })
//       .code(200);
//   }

//   return h
//     .response({
//       status: 'fail',
//       message: 'Buku gagal dihapus. Id tidak ditemukan',
//     })
//     .code(404);
// };

// module.exports = {
//   addBookHandler,
//   getAllBooksHandler,
//   getBookByIdHandler,
//   editBookByIdHandler,
//   deleteBookByIdHandler,
// };
