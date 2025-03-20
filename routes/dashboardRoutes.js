const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 대시보드 데이터 조회
router.get('/', dashboardController.getDashboardData);

module.exports = router;