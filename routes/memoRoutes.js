// routes/memoRoutes.js
const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.get('/memo', memoController.getMemo);
router.post('/memoRegister', memoController.registerMemo);
router.put('/memoUpdate/:id', memoController.updateMemo);   // 업데이트
router.delete('/memoDelete/:id', memoController.deleteMemo);
router.get('/memoSearch', memoController.searchMemos); //검색

module.exports = router;