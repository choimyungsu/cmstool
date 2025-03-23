// routes/memoRoutes.js
const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.get('/memo', memoController.getMemo);
router.post('/memoRegister', memoController.registerMemo);
router.put('/memoUpdate/:id', memoController.updateMemo);
router.delete('/memoDelete/:id', memoController.deleteMemo);
router.get('/memoSearch', memoController.searchMemos);
router.get('/memoContents/:id', memoController.getMemoContents); // 새 엔드포인트 추가

module.exports = router;