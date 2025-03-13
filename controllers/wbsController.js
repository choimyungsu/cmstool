const Wbs = require("../models/wbs");
const multer = require('multer');
const xlsx = require('xlsx');

// 파일 업로드 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('excelFileInput');

// WBS 목록 페이지
exports.listWbs = async (req, res) => {
    const tasks = await Wbs.getAllWbs();
    res.render("index", { 
        currentPage: "pages/wbs", 
        tasks,
        user: req.session.user  
    });
};

// WBS 생성
exports.createWbs = async (req, res) => {
    await Wbs.createWbs(req.body);
    res.redirect("/wbs");
};

// WBS 업데이트
exports.updateWbs = async (req, res) => {
    const { id } = req.params;
    await Wbs.updateWbs(id, req.body);
    res.redirect("/wbs");
};

// WBS 삭제
exports.deleteWbs = async (req, res) => {
    const { id } = req.params;
    await Wbs.deleteWbs(id);
    res.redirect("/wbs");
};

// 엑셀 파일 import 처리
exports.importWbs = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ success: false, message: '파일 업로드 오류' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
        }

        try {
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // 첫 번째 시트 사용
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            // 엑셀 데이터 형식 가정 (id는 자동 증가로 처리, 생략 가능)
            const wbsData = jsonData.map(row => ({
                project_id: row.project_id || '',
                task_name: row.task_name || '',
                start_date: row.start_date || '',
                end_date: row.end_date || '',
                task_progress: row.task_progress || 0,
                task_user: row.task_user || ''
            }));

            // 데이터베이스에 일괄 삽입
            for (const data of wbsData) {
                await Wbs.createWbs(data);
            }

            res.json({ success: true, message: '데이터가 성공적으로 import되었습니다.' });
        } catch (error) {
            console.error('Import error:', error);
            res.status(500).json({ success: false, message: '데이터 import 중 오류가 발생했습니다.' });
        }
    });
};