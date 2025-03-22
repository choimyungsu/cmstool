



// controllers/projectUserController.js
const ProjectUserModel = require('../models/projectUserModel');

const projectUserController = {
  async getProjectUsers(req, res) {
    try {
      let projectId = req.params.projectId;
      // projectId가 없는 경우 가장 먼저 나오는 프로젝트 ID를 가져옴
      if (!projectId) {
        projectId = await ProjectUserModel.getFirstProjectId();
        if (!projectId) {
          return res.status(404).send('No projects found. Please create a project first.');
        }
      }
      const projectUsers = await ProjectUserModel.getUsersByProjectId(projectId);
      const allUsers = await ProjectUserModel.getAllUsers();
      const projects = await ProjectUserModel.getAllProjects(); // 프로젝트 목록 가져오기

      // AJAX 요청인 경우 JSON으로 반환
      if (req.xhr || req.headers.accept.includes('json')) {
        return res.json({ projectUsers, projectId });
      }

  
      res.render('index', {
        currentPage: 'pages/pjt_user',
        projectId,
        projectUsers,
        allUsers,
        projects,
        user: req.session.user ,
        projectList: req.session.projectList || [], // 세션에서 프로젝트 리스트 가져오기
        selectedProjectId: req.session.selectedProjectId // 선택된 프로젝트 ID 전달
      });



    } catch (error) {
      console.error('Error fetching project users:', error);
      res.status(500).send('Server Error');
    }
  },

  async addUserToProject(req, res) {
    try {
      const { projectId, userId } = req.body;
      const success = await ProjectUserModel.addUserToProject(projectId, userId);
      res.json({ success });
    } catch (error) {
      console.error('Error adding user to project:', error);
      res.status(500).json({ success: false });
    }
  },

  async removeUserFromProject(req, res) {
    try {
      const { projectId, userId } = req.body;
      const success = await ProjectUserModel.removeUserFromProject(projectId, userId);
      res.json({ success });
    } catch (error) {
      console.error('Error removing user from project:', error);
      res.status(500).json({ success: false });
    }
  },
};

module.exports = projectUserController;