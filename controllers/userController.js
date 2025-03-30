// controllers/userController.js
const User = require('../models/user');

const userController = {
  async getUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.render('index', {  
        title: 'User List',
        currentPage: 'pages/users',  
        users: users,  
        user: req.session.user,
        projectList: req.session.projectList || [],
        selectedProjectId: req.session.selectedProjectId
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async registerUser(req, res) {
    try {
      console.log('Received req.body:', req.body); 
      const userData = req.body;
      await User.createUser(userData);
      res.json({ success: true, message: 'User registered successfully', redirect: '/users' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: 'Registration Failed: ' + error.message });
    }
  },

  async searchUsers(req, res) {
    try {
      const { search_user_id } = req.query;
      const users = await User.searchUsers({ search_user_id });
      return res.json({ success: true, message: 'Memo search successfully', data: users });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  // 추가된 search 함수: /user/search/:name 엔드포인트 처리
  async search(req, res) {
    try {
      const { name } = req.params; // URL 파라미터에서 이름 가져오기
      if (!name) {
        return res.status(400).json({ success: false, message: 'Search term is required' });
      }
      const users = await User.search(name); // models/user.js의 search 메서드 호출
      if (!users) {
        return res.status(404).json({ success: false, message: 'No users found' });
      }
      // 클라이언트가 기대하는 형식으로 응답 (contents.ejs의 $.get('/user/search')에 맞춤)
      res.json(users); 
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

module.exports = userController;