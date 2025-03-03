const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // body-parser 설치 필요


// 라우트 설정
const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');
const wbsRoutes = require("./routes/wbsRoutes");
const issueRoutes = require("./routes/issueRoutes");


// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공 (CSS, JS, 이미지)
app.use(express.static(path.join(__dirname, 'public')));



// 미들웨어 설정
// app.use(bodyParser.json()); // JSON 형식의 요청 본문 파싱
// app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 형식 파싱
app.use(bodyParser.json({ limit: '50mb' }));  // JSON 요청 크기 제한
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // URL 인코딩된 데이터 크기 제한




app.use('/', userRoutes); // '/users' 경로가 여기서 처리됨
app.use('/', memoRoutes); // '/memo' 경로가 여기서 처리됨
app.use('/', wbsRoutes);// '/wbs' 경로가 여기서 처리됨
app.use('/', issueRoutes);// '/issue' 경로가 여기서 처리됨

// 루트 경로에서 대시보드 렌더링
app.get('/', (req, res) => {

  res.render("index", {
    currentPage:'pages/home',
  });

});

app.get('/calendar', async (req, res) => {
    try {    
        res.render("index", {
          currentPage:'pages/calendar',
        });
      } catch (err) {
        console.error(err);
      }
});

app.get('/compare', async (req, res) => {
  try {    
      res.render("index", {
        currentPage:'pages/compare',
      });
    } catch (err) {
      console.error(err);
    }
});


// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});