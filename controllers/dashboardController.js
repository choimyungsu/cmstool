const dashboardModel = require('../models/dashboardModel');

exports.getDashboardData = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || !user.email) {
      return res.redirect('/login');
    }

    const email = user.email;
    let selectedProjectId = req.session.selectedProjectId;
    console.log('dashboardcontroller Project ID (before):', selectedProjectId);

    let projectList = req.session.projectList;
    if (!projectList) {
      projectList = await dashboardModel.getProjectList(email);
      req.session.projectList = projectList;
    }

    if (!selectedProjectId && projectList.length > 0) {
      selectedProjectId = projectList[0].id;
      req.session.selectedProjectId = selectedProjectId;
    }

    console.log('dashboardcontroller Project ID (after):', selectedProjectId);

    const projectCount = await dashboardModel.getProjectCount(email);
    const incompleteTaskCount = await dashboardModel.getIncompleteTaskCount(email);
    const openIssueCount = await dashboardModel.getOpenIssueCount(email);
    const delayCount = await dashboardModel.getDelayCount(email);

    res.render('index', {
      currentPage: 'pages/home',
      user: user,
      projectCount: projectCount,
      incompleteTaskCount: incompleteTaskCount,
      openIssueCount: openIssueCount,
      delayCount: delayCount,
      projectList: projectList,
      selectedProjectId: selectedProjectId
    });
  } catch (error) {
    console.error('Error in dashboard controller:', error);
    res.status(500).send('Server Error');
  }
};

exports.getDetails = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || !user.email) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const email = user.email;
    const type = req.params.type;

    let data;
    switch (type) {
      case 'projects':
        data = await dashboardModel.getProjectList(email);
        break;
      case 'tasks':
        data = await dashboardModel.getIncompleteTasksByProject(email);
        break;
      case 'issues':
        data = await dashboardModel.getOpenIssuesByProject(email);
        break;
      case 'delays':
        data = await dashboardModel.getDelaysByProject(email);
        break;
      default:
        return res.status(400).json({ error: '잘못된 요청 타입입니다.' });
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    res.status(500).json({ error: '서버 오류' });
  }
};

module.exports = exports;