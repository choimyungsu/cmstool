const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getBookList);
router.get('/books/create', bookController.getCreateBookPage); // 책 생성 페이지
router.post('/books', bookController.createBook);
router.put('/books/publish/:bookId', bookController.publishBook);

module.exports = router;