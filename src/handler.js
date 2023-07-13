const { books } = require("./books");
const { v4: uuidv4 } = require("uuid");

const check = (value) => (value % 2 == 0 ? true : false);

const checkReadStatus = (readCount, pageCount) => {
  if (readCount < pageCount) {
    return false;
  } else if (readCount === pageCount) {
    return true;
  }
};

// todo Routing

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query;

  if (name !== undefined || finished !== undefined || reading !== undefined) {
    const result = books.filter((item) => {
      let finishedValue = check(finished);
      let readingValue = check(reading);
      return (
        (name !== undefined &&
          item.name.toLowerCase() === name.toLowerCase()) ||
        (finished !== undefined && item.finished === finishedValue) ||
        (reading !== undefined && item.reading === readingValue)
      );
    });
    return h
      .response({
        message: "success",
        data: {
          books: result.map((item) => {
            return {
              id: item.id,
              name: item.name,
              publisher: item.publisher,
            };
          }),
        },
      })
      .code(200);
  }

  if (books.length == []) {
    return h
      .response({
        status: "success",
        data: {
          books: [],
        },
      })
      .code(200);
  }
  return h
    .response({
      status: "success",
      data: {
        books: books.map((item) => {
          return {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
          };
        }),
      },
    })
    .code(200);
};

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

  if (name == "" || name == undefined) {
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

  const id = uuidv4();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let readingValue = reading === "true";

  const newBook = {
    id,
    name,
    year: Number(year),
    author,
    summary,
    publisher,
    pageCount: Number(pageCount),
    readPage: Number(readPage),
    finished: checkReadStatus(readPage, pageCount),
    reading: readingValue,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  return h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    })
    .code(201);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const findBook = books.findIndex((item) => item.id == id);

  if (findBook == -1) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }
  books.splice(findBook, 1);
  return h
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const detailBook = books.find((item) => item.id == id);

  if (detailBook == undefined) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }
  return h
    .response({
      status: "success",
      data: {
        book: detailBook,
      },
    })
    .code(200);
};
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
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

  const index = books.findIndex((item) => item.id == id);

  const updatedAt = new Date().toISOString();

  if (index == -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  if (name == undefined || name == "") {
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
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }
  let readingValue = reading === "true";

  const updateData = {
    ...books[index],
    name,
    year: Number(year),
    author,
    summary,
    publisher,
    pageCount: Number(pageCount),
    readPage: Number(readPage),
    finished: checkReadStatus(readPage, pageCount),
    reading: readingValue,
    updatedAt,
  };
  books[index] = updateData;
  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  getBookByIdHandler,
};
