// app.js
require('dotenv').config(); // 환경 변수 로드 (맨 위에서 호출)

const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// 라우트 설정
const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');
const wbsRoutes = require("./routes/wbsRoutes");
const issueRoutes = require("./routes/issueRoutes");
const stellarRoutes = require('./routes/stellarRoutes');
const projectRoutes = require('./routes/projectRoutes');
const codemgmtRoutes = require('./routes/codemgmtRoutes');
const projectUserRoutes = require('./routes/projectUserRoutes');
const authRoutes = require('./routes/authRoutes');
const treewbsRoutes = require('./routes/treewbsRoutes');
const contentsRoutes = require('./routes/contentsRoutes');
const treeRoutes = require('./routes/treeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const bookRoutes = require('./routes/bookRoutes'); //책
const pageRoutes = require('./routes/pageRoutes');
const authManagementRoutes = require('./routes/authManagementRoutes'); // 추가
const methodOverride = require('method-override');

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공 (CSS, JS, 이미지)
app.use(express.static(path.join(__dirname, 'public')));

// 미들웨어 설정
app.use(methodOverride('_method'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 세션 설정 (라우트 설정 전에 위치)
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be defined in .env file');
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS를 사용할 경우 secure: true로 설정
}));

// 로그인 여부 확인 미들웨어 (세션 설정 후 위치)
app.use((req, res, next) => {
  if (!req.session.user && req.path !== '/login' && req.path !== '/logout') {
    return res.redirect('/login');
  }
  next();
});

// 라우트 설정 (세션 및 미들웨어 설정 후 위치)
app.use('/', userRoutes);
app.use('/', memoRoutes);
app.use('/', wbsRoutes);
app.use('/', issueRoutes);
app.use('/', stellarRoutes);
app.use('/', projectRoutes);
app.use('/', codemgmtRoutes);
app.use('/', projectUserRoutes);
app.use('/', authRoutes);
app.use('/', treewbsRoutes);
app.use('/', contentsRoutes); // '/contents'로 시작하는 경로 처리
app.use('/', treeRoutes); // '/tree'로 시작하는 경로 처리
app.use('/', dashboardRoutes);
app.use('/', calendarRoutes);
app.use('/', bookRoutes);
app.use('/', pageRoutes);
app.use('/', authManagementRoutes); // 추가


// 루트 경로에서 대시보드 렌더링
// app.get('/', (req, res) => {
//   res.render("index", {
//     currentPage: 'pages/home',
//     user: req.session.user // user 객체 전달
//   });
// });

// app.get('/calendar', async (req, res) => {
//   try {
//     res.render("index", {
//       currentPage: 'pages/calendar',
//       user: req.session.user // user 객체 전달
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });

// 컬럼 비교하기
app.get('/compare', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/compare',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});


// 컬럼 비교하기 "따옴표도 없애고 비고"
app.get('/compare2', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/compare2',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});

// CISCO 네트워크 객체, 서비스 객체 추출
app.get('/networkextract', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/networkextract',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});

// CISCO 네트워크 객체, 서비스 객체 추출 (하위객체까지)
app.get('/networkextract2', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/networkextract2',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});

// CISCO NAT 정책 추출
app.get('/natextract', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/natextract',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});


// CISCO NAT 정책 추출(OLD)
app.get('/oldnatextract', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/oldnatextract',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});

// CSV파일읽고 Table 및 엑셀다운로드
app.get('/csvreadtable', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/csvreadtable',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});

// 입력한 정보를 기반으로 추출
app.get('/extract', async (req, res) => {
  try {
    res.render("index", {
      currentPage: 'pages/extract',
      user: req.session.user // user 객체 전달
    });
  } catch (err) {
    console.error(err);
  }
});




// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});