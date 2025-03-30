const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

router.get("/project", ProjectController.getProjects);              // 프로젝트 리스트 조회
router.get("/view/:id", ProjectController.getProjectDetail);        // 특정 프로젝트 상세 조회
//미들웨어추가 생성권한이 있는지
router.post("/createProject", authController.checkPermission('PROJECT_MANAGE'), ProjectController.createProject);     // 프로젝트 생성
router.post("/updateProject/:id", ProjectController.updateProject); // 프로젝트 업데이트
router.post("/deleteProject/:id", ProjectController.deleteProject); // 프로젝트 삭제

router.post("/project/import", ProjectController.importProject);    // 엑셀 import 라우터 추가
router.get("/project/export", ProjectController.downloadExcel);     // 엑셀 다운로드 경로 추가

module.exports = router;