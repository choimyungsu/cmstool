const stellarModel = require('../models/stellar'); // models/stellar.js 가져오기

const stellarController = {
  async getStellarData(req, res) {
    try {
      // 모델에서 데이터 가져오기
      const events = await stellarModel.getEventsByDate();
      const tableData = await stellarModel.getRecentEvents();
      const eventGroup = await stellarModel.getEventGroups();
      const top5app = await stellarModel.getTop5Apps();
      const killchain = await stellarModel.getKillchainStages();
      const top5dstip = await stellarModel.getTop5DstIps();

      // 뷰 렌더링
      res.render('index', {
        events,
        tableData,
        eventGroup,
        top5app,
        killchain,
        top5dstip,
        currentPage: 'pages/stellar',
        user: req.session.user ,
        projectList: req.session.projectList || [], // 세션에서 프로젝트 리스트 가져오기
        selectedProjectId: req.session.selectedProjectId // 선택된 프로젝트 ID 전달
      });
    } catch (err) {
      console.error('Controller Error:', err.stack);
      res.status(500).send('Database error');
    }
  }
};

module.exports = stellarController; // 컨트롤러 객체 내보내기