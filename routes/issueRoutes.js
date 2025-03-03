const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/issueController');

router.get("/issue", IssueController.getIssues);              // 이슈 리스트 조회
router.get("/view/:id", IssueController.getIssueDetail); // 특정 이슈 상세 조회
router.post("/createIssue", IssueController.createIssue);     // 이슈 생성
router.post("/updateIssue/:id", IssueController.updateIssue);  // 이슈업데이트
router.post("/deleteIssue/:id", IssueController.deleteIssue);  // 이슈삭제


router.post("/issue/import", IssueController.importIssue);// 엑셀 import 라우터 추가
router.get("/issue/export", IssueController.downloadExcel); // 엑셀 다운로드 경로 추가

module.exports = router;

