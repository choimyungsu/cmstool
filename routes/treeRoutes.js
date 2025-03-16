// routes/tree.js
const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
const treeContentsController = require('../controllers/treeContentsController');

router.get('/tree', treeController.getAllPage); // tree.ejs 렌더링
router.get('/tree/data', treeController.getAll); // 데이터 조회 (JSON)
router.post('/tree/create', treeController.create); // 생성
router.put('/tree/update/:id', treeController.update); // 수정
router.delete('/tree/delete/:id', treeController.delete); // 삭제

// 트리와 컨텐츠 링크 관련 라우터
router.post('/treecontents/link', treeContentsController.link);
router.delete('/treecontents/unlink/:tree_id/:contents_id', treeContentsController.unlink);
router.get('/treecontents/linked/:tree_id', treeContentsController.getLinkedContents);

module.exports = router;