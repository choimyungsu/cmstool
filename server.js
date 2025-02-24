const express = require('express');
const { Pool } = require("pg");
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); // body-parser 설치 필요


//엑셀업로드
const multer = require('multer');
const ExcelJS = require('exceljs');

// 업로드된 파일을 저장할 경로 설정
const upload = multer({ dest: 'uploads/' });

require('dotenv').config(); // 환경 변수를 .env 파일에서 로드하기 위한 모듈

/*
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});
*/

// 데이터베이스 연결 설정
const dbConfig = {
  // 공통 설정
  user: "postgres",
  password: "1234",
  database: "postgres",
  port: process.env.DB_PORT || 5432, // 기본 포트 5432 사용
};

// 환경에 따라 호스트 설정
if (process.env.NODE_ENV === 'production') {
  // Render에서 실행 중일 때 (Neon DB 연결)
  dbConfig.host = process.env.DATABASE_URL;
  dbConfig.ssl = {
    rejectUnauthorized: false, // Neon DB는 SSL 연결이 필요할 수 있음
  };
} else {
  // 로컬 환경일 때 (로컬 PostgreSQL 연결)
  dbConfig.host = process.env.LOCAL_DB_HOST || 'localhost';
}

// Pool 생성
const pool = new Pool(dbConfig);

//##################


const app = express();

// 미들웨어 설정
app.use(bodyParser.json()); // JSON 형식의 요청 본문 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 형식 파싱


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render("index", {
        currentPage:'pages/home',
      });
});

app.get('/stellar', async (req, res) => {

    try {
  
      //날짜별 보안이벤트 발생 건수
      const eventQuery = "SELECT TO_CHAR(TO_TIMESTAMP(stellar_alert_time / 1000) AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS event_date,  COUNT(*) AS event_count FROM stellar_alert_data GROUP BY event_date ORDER BY event_date";
      
      //보안이벤트 100 건
      const tableQuery = "SELECT to_timestamp(stellar_alert_time / 1000) AT TIME ZONE 'Asia/Seoul' as time2, * from stellar_alert_data limit 100";
      
      //보안이벤트 그룹별 건수 10건
      const eventGroupQuery = "SELECT xdr_event_name, COUNT(*) AS count FROM stellar_alert_data GROUP BY xdr_event_name ORDER BY count DESC LIMIT 10";
      
      //APP Top 5건
      const top5appQuery = "SELECT appid_name, COUNT(*) AS count FROM stellar_alert_data GROUP BY appid_name ORDER BY count DESC LIMIT 5";
  
      //킬체인단계 건수
      const killchainQuery = "SELECT xdr_event_xdr_killchain_stage, COUNT(*) AS count FROM stellar_alert_data GROUP BY xdr_event_xdr_killchain_stage ORDER BY count DESC";
      
      //목적지IP Top 5건
      const top5dstipQuery = "SELECT dstip, COUNT(*) AS count FROM stellar_alert_data GROUP BY dstip ORDER BY count DESC LIMIT 5";
  
  
      const eventResult = await pool.query(eventQuery);
      const tableResult = await pool.query(tableQuery);
      const eventGroupResult = await pool.query(eventGroupQuery);
      const top5appResult = await pool.query(top5appQuery);
      const killchainResult = await pool.query(killchainQuery);
      const top5dstipResult = await pool.query(top5dstipQuery);
  
      res.render('index', { 
        events: eventResult.rows,
        tableData: tableResult.rows,
        eventGroup: eventGroupResult.rows,
        top5app: top5appResult.rows,
        killchain: killchainResult.rows,
        top5dstip: top5dstipResult.rows,
        currentPage: 'pages/stellar' 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Database error");
    }
});

app.get('/asset', async (req, res) => {
    try {

        //자산건수 100 건
        const tableQuery = "SELECT TO_CHAR(regist_date, 'YYYY-MM-DD') as regist_date2, * from tb_asset limit 100"; 
        const tableResult = await pool.query(tableQuery);
    
        res.render("index", {
          tableData: tableResult.rows,
          currentPage:'pages/asset',
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
      }
});




// 📌 엑셀 파일 업로드 및 데이터베이스 저장 (POST)
app.post('/excel/upload', upload.single('excelFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('파일이 업로드되지 않았습니다.');
        }
  
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
  
        let data = [];
  
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) { // 첫 번째 행(헤더)은 제외
                data.push({
                    hostname: row.getCell(1).value,
                    ip: row.getCell(2).value,
                    subtype: row.getCell(3).value,
                    description: row.getCell(4).value,
                    importance: row.getCell(5).value,
                    location: row.getCell(6).value,
                    regist_date: row.getCell(7).value,
                    manager: row.getCell(8).value,
                    supplier: row.getCell(9).value
  
                });
            }
        });
  
        // PostgreSQL 데이터 삽입
        for (let row of data) {
            await pool.query(
                'INSERT INTO tb_asset (hostname,	ip,	subtype,	description,	importance,	location,	regist_date,	manager,	supplier ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [row.hostname, row.ip, row.subtype, row.description, row.importance, row.location,row.regist_date,row.manager,row.supplier]
            );
        }
  
        // 파일 삭제 (임시 파일 정리)
        fs.unlinkSync(filePath);
  
        res.json({ success: true, message: '업로드 성공!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류 발생');
    }
  });

  app.get('/wbs', async (req, res) => {
    try {

        //wbs    
        res.render("index", {
          currentPage:'pages/wbs',
        });
      } catch (err) {
        console.error(err);
        
      }
});

app.get('/report', async (req, res) => {
    try {
        //보안이벤트 100 건
        const tableQuery = "SELECT * from tb_report";
        const tableResult = await pool.query(tableQuery);
        //report    
        res.render("index", {
          tableData: tableResult.rows,
          currentPage:'pages/report',
        });
      } catch (err) {
        console.error(err);
        
      }
});

// 데이터 저장 엔드포인트
app.post('/save-report', async (req, res) => {
    const { project, reporter_name, report_date, content } = req.body;

    try {
        const query = `
            INSERT INTO tb_report (project, reporter_name, report_date, contents)
            VALUES ($1, $2, $3, $4 )
            RETURNING id;
        `;
        const values = [project, reporter_name, report_date, content];
        
        const result = await pool.query(query, values);
        res.json({ success: true, message: '데이터가 저장되었습니다.', id: result.rows[0].id });
    } catch (error) {
        console.error('데이터 저장 오류:', error);
        res.status(500).json({ success: false, message: '데이터 저장에 실패했습니다.' });
    }
});

// 데이터 업데이트 엔드포인트
app.put('/update-report/:id', async (req, res) => {
    const id = req.params.id;
    const { project, reporter_name, report_date, content } = req.body;

    if (!project || !reporter_name || !report_date || !content) {
        return res.status(400).json({ success: false, message: '필수 필드가 누락되었습니다.' });
    }

    try {
        const query = `
            UPDATE tb_report 
            SET project = $1, reporter_name = $2, report_date = $3, contents = $4, created_at = NOW()
            WHERE id = $5
            RETURNING id;
        `;
        const values = [project, reporter_name, report_date, content, id];
        
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: '보고서를 찾을 수 없습니다.' });
        }
        res.json({ success: true, message: '데이터가 수정되었습니다.', id: result.rows[0].id });
    } catch (error) {
        console.error('데이터 수정 오류:', error);
        res.status(500).json({ success: false, message: '데이터 수정에 실패했습니다.' });
    }
});

app.get('/issue', async (req, res) => {
    try {

        //issue    
        res.render("index", {
          currentPage:'pages/issue',
        });
      } catch (err) {
        console.error(err);
        
      }
});

app.get('/compare', async (req, res) => {
  try {

      //issue    
      res.render("index", {
        currentPage:'pages/compare',
      });
    } catch (err) {
      console.error(err);
      
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
