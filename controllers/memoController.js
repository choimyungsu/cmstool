
// controllers/memoController.js
const Memo = require('../models/memo');

const memoController = {

  async getMemo(req, res) {
    try {

      console.log("getMemo 요청 수신됨", req.query);
      const { memo_title, memo_writer,memo_dt,memo_contents } = req.query;
      const memo = await Memo.searchMemo({ memo_title, memo_writer, memo_dt, memo_contents });

      //const memo = await Memo.getAllMemos();
      
      res.render('index', {  // index.ejs를 렌더링
        title: 'Memo List',
        currentPage: 'pages/memo',  // 동적 페이지로 pages/memo지정 ,
        Memo: memo  // 사용자 데이터 전달
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

//검색
async searchMemos (req, res) {

  try {

    console.log("searchMemos 요청 수신됨", req.query);
    const { search_memo_title, search_memo_writer,search_memo_dt,search_memo_contents } = req.query;
    const memo = await Memo.searchMemo({ search_memo_title, search_memo_writer,search_memo_dt,search_memo_contents  });
    console.log(memo)
    return res.json({ success: true, message: 'Memo search successfully', data: memo  });
    /*
    res.render('index', {  // index.ejs를 렌더링
      title: 'Memo List',
      currentPage: 'pages/memo',  // 동적 페이지로 pages/memo지정 ,
      Memo: memo  // 사용자 데이터 전달
    });*/
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }

},


async getMemos(req, res) {
  try {
      console.log("getMemos 요청 수신됨", req.query);
      const { memo_title, memo_writer, memo_dt, memo_contents } = req.query;
      const memo = await Memo.searchMemo({ memo_title, memo_writer, memo_dt, memo_contents });

      // AJAX 요청인지 확인
      if (req.xhr || req.headers['accept'].includes('json')) {
          return res.json({ success: true, message: 'Memo search successfully', data: memo });
      }

      // 일반 요청이면 EJS 렌더링
      res.render('index', {  
          title: 'Memo List',
          currentPage: 'pages/memo',
          Memo: memo  
      });

  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
},

  // 메모 등록 처리
  async registerMemo(req, res) {
    try {
        console.log("POST 요청 수신됨", req.body);
        const { memo_title, memo_writer,memo_dt,memo_contents } = req.body;

        if (!memo_title || !memo_contents) {
            return res.status(400).json({ error: "제목과 내용을 입력하세요." });
        }

        const newMemo = await Memo.createMemo({ memo_title, memo_writer,memo_dt,memo_contents });
        
        //res.status(201).json(newMemo);
        res.json({ success: true, message: 'Memo created successfully' });
    } catch (error) {
        console.error("메모 등록 중 오류 발생:", error);
        res.status(500).json({ error: "서버 오류 발생" });
    }
},

// 메모 업데이트 처리
async updateMemo(req, res) {
  try {
    const { id } = req.params;
    const memoData = req.body;

    // 데이터 검증
    if (!memoData.memo_title && memoData.memo_title !== '') {
      return res.status(400).send('memo_title is required');
    }

    console.log('Updating memo with id:', id, 'data:', memoData);
    const updatedMemo = await Memo.updateMemo(id, memoData);

    if (!updatedMemo) {
      return res.status(404).send('Memo not found');
    }

    res.json({ success: true, message: 'Memo updated successfully' });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).send('Update Failed');
  }
},

//메모 삭제 처리
async deleteMemo(req, res) {
  try {
      const { id } = req.params;
      const result = await Memo.deleteMemo(id); // memo.js에 메서드 추가 필요
      if (result.rowCount === 0) {
          return res.status(404).json({ success: false, message: 'Memo not found' });
      }
      res.json({ success: true, message: 'Memo deleted successfully' });
  } catch (error) {
      console.error('Delete error:', error.message);
      res.status(500).json({ success: false, message: 'Delete Failed' });
  }
}



};

module.exports = memoController;