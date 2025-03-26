const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/book/:bookId', pageController.getBookView);
router.get('/book/:bookId/page/:pageNumber', pageController.getBookViewWithPage);
router.get('/page/create', pageController.getCreatePage);
router.post('/page', pageController.createPage);
router.get('/page/edit/:pageId', pageController.getEditPage);
router.post('/page/update', pageController.updatePage);
router.post('/bookmark/add', pageController.addBookmark);
router.post('/bookmark/remove', pageController.removeBookmark);

module.exports = router;