const express = require('express');
const router = express.Router();
const stellarController = require('../controllers/stellarController'); // 컨트롤러 가져오기

// '/stellar' 경로에 GET 요청 처리
router.get('/stellar', stellarController.getStellarData);

module.exports = router; // Express Router 객체 내보내기