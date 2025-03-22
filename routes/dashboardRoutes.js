const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 대시보드 데이터 조회
router.get('/', dashboardController.getDashboardData);

// 프로젝트 선택 처리
router.get('/select-project/:id', (req, res) => {
  const projectId = req.params.id;
  const redirectUrl = req.query.redirect || '/';

  // 세션에서 프로젝트 리스트 가져오기
  const projectList = req.session.projectList || [];
  
  // 디버깅 로그 추가
//   console.log('Project List:', projectList);
//   console.log('Session User:', req.session.user);
//   console.log('Requested Project ID:', projectId);

  // 프로젝트 ID 유효성 검사
  const isValidProject = projectList.some(p => String(p.id) === projectId);
  //console.log('Is Valid Project:', isValidProject);

  if (!isValidProject) {
    return res.status(403).send('접근 권한이 없습니다.');
  }

  // 세션에 선택된 프로젝트 ID 저장
  req.session.selectedProjectId = projectId;

  // 세션 저장 완료 후 리다이렉트
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).send('세션 저장 오류');
    }
    console.log('Session saved with selectedProjectId:', req.session.selectedProjectId);
    res.redirect(redirectUrl);
  });
});

// 상세 데이터 조회
router.get('/dashboard/details/:type', dashboardController.getDetails);

module.exports = router;