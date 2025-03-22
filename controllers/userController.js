// controllers/userController.js
const User = require('../models/user');

const userController = {
  async getUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.render('index', {  // index.ejs를 렌더링
        title: 'User List',
        currentPage: 'pages/users',  // 동적 페이지로 pages/users 지정
        users: users,  // 사용자 데이터 전달
        user: req.session.user ,
        projectList: req.session.projectList || [], // 세션에서 프로젝트 리스트 가져오기
        selectedProjectId: req.session.selectedProjectId // 선택된 프로젝트 ID 전달
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  // 사용자 등록 처리
  // async registerUser(req, res) {
  //   try {
  //     const userData = req.body;
  //     await User.createUser(userData);
  //     res.redirect('/users'); // 등록 후 사용자 목록으로 리다이렉트
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Registration Failed');
  //   }
  // },



  // 사용자 등록 처리 (에러발생시 모달창으로 띄우기 위함)
  async registerUser(req, res) {
    try {
      console.log('Received req.body:', req.body); // 디버깅 로그
      const userData = req.body;
      await User.createUser(userData);
      res.json({ success: true, message: 'User registered successfully', redirect: '/users' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: 'Registration Failed: ' + error.message });
    }
  },

  //검색
async searchUsers (req, res) {

  try {

    //console.log("searchUsers 요청 수신됨", req.query);
    const { search_user_id } = req.query;
    const users = await User.searchUsers({ search_user_id  });
    //console.log(users)
    return res.json({ success: true, message: 'Memo search successfully', data: users  });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }

}


  



};

module.exports = userController;