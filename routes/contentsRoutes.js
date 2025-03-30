// router.js
const express = require('express');
const router = express.Router();
const contentsController = require('../controllers/contentsController');
const authController = require('../controllers/authController');


router.get('/contents', contentsController.getAllPage); // contents.ejs 렌더링
router.get('/contents/data', contentsController.getAll); // 데이터 조회 (JSON)
router.post('/contents/create', contentsController.create); // 생성
router.put('/contents/update/:id',authController.checkPermission('CONTENT_MANAGE'), contentsController.update); // 수정
router.delete('/contents/delete/:id',authController.checkPermission('CONTENT_MANAGE'), contentsController.delete); // 삭제
router.get('/contents/statuscodes', contentsController.getStatusCodes); // 상태 코드 조회
router.get('/contents/gubuncodes', contentsController.getGubunCodes); // Gubun 코드 조회 추가
router.get('/contents/search', contentsController.search); // 검색 엔드포인트 추가

module.exports = router;