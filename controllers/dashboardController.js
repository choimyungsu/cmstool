const dashboardModel = require('../models/dashboardModel');

exports.getDashboardData = async (req, res) => {
  try {
    const user = req.session.user; // 세션에서 사용자 정보 가져오기
    if (!user || !user.email) {
      return res.redirect('/login'); // 로그인 안 된 경우 리다이렉트
    }

    const email = user.email;

    // 모델에서 데이터 조회
    const projectCount = await dashboardModel.getProjectCount(email);
    const incompleteTaskCount = await dashboardModel.getIncompleteTaskCount(email);
    const openIssueCount = await dashboardModel.getOpenIssueCount(email);

    // 뷰 렌더링
    res.render('index', {
      currentPage: 'pages/home',
      user: user,
      projectCount: projectCount,
      incompleteTaskCount: incompleteTaskCount,
      openIssueCount: openIssueCount
    });
  } catch (error) {
    console.error('Error in dashboard controller:', error);
    res.status(500).send('Server Error');
  }
};