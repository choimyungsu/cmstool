// controllers/memoController.js
const Memo = require('../models/memo');

const memoController = {
  async getMemo(req, res) {
    try {
      const { memo_title, memo_writer, memo_dt, memo_contents } = req.query;
      const memo = await Memo.searchMemo({ memo_title, memo_writer, memo_dt, memo_contents });

      res.render('index', {
        title: 'Memo List',
        currentPage: 'pages/memo',
        Memo: memo,
        user: req.session.user,
        projectList: req.session.projectList || [],
        selectedProjectId: req.session.selectedProjectId
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async searchMemos(req, res) {
    try {
      const { search_memo_title, search_memo_writer, search_memo_dt, search_memo_contents } = req.query;
      const memo = await Memo.searchMemo({ search_memo_title, search_memo_writer, search_memo_dt, search_memo_contents });
      return res.json({ success: true, message: 'Memo search successfully', data: memo });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async getMemos(req, res) {
    try {
      const { memo_title, memo_writer, memo_dt, memo_contents } = req.query;
      const memo = await Memo.searchMemo({ memo_title, memo_writer, memo_dt, memo_contents });

      if (req.xhr || req.headers['accept'].includes('json')) {
        return res.json({ success: true, message: 'Memo search successfully', data: memo });
      }

      res.render('index', {
        title: 'Memo List',
        currentPage: 'pages/memo',
        Memo: memo,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async registerMemo(req, res) {
    try {
      const { memo_title, memo_writer, memo_dt, memo_contents } = req.body;

      if (!memo_title || !memo_contents) {
        return res.status(400).json({ error: "제목과 내용을 입력하세요." });
      }

      const newMemo = await Memo.createMemo({ memo_title, memo_writer, memo_dt, memo_contents });
      res.json({ success: true, message: 'Memo created successfully' });
    } catch (error) {
      console.error("메모 등록 중 오류 발생:", error);
      res.status(500).json({ error: "서버 오류 발생" });
    }
  },

  async updateMemo(req, res) {
    try {
      const { id } = req.params;
      const memoData = req.body;

      if (!memoData.memo_title && memoData.memo_title !== '') {
        return res.status(400).send('memo_title is required');
      }

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

  async deleteMemo(req, res) {
    try {
      const { id } = req.params;
      const result = await Memo.deleteMemo(id);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Memo not found' });
      }
      res.json({ success: true, message: 'Memo deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error.message);
      res.status(500).json({ success: false, message: 'Delete Failed' });
    }
  },

  // 새로운 엔드포인트: memo_contents 조회
  async getMemoContents(req, res) {
    try {
      const { id } = req.params;
      const memoContents = await Memo.getMemoContents(id);
      if (!memoContents) {
        return res.status(404).json({ success: false, message: 'Memo not found' });
      }
      res.json({ success: true, data: memoContents });
    } catch (error) {
      console.error('Get memo contents error:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch memo contents' });
    }
  }
};

module.exports = memoController;