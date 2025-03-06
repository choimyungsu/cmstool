const IssueModel = require('../models/issue');
const multer = require('multer');
const xlsx = require('xlsx');

// 파일 업로드 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('excelFileInput');

const Op = { like: 'LIKE' }; // Mock Op object to avoid ReferenceError

class IssueController {
    // 이슈 목록 페이지
    // static async getIssues(req, res) {
    //     try {
    //         const issues = await IssueModel.getAllIssues();
    //         res.render('index', { currentPage: 'pages/issue', issues, selectedIssue: null, activeTab: 'issueList' });
    //     } catch (error) {
    //         console.error('List error:', error);
    //         res.status(500).send('서버 오류: ' + error.message);
    //     }
    // }




    static async getIssues(req, res) {
        try {
            const { search_issue_title, search_issue_status, search_issue_finish_date, search_issue_contents } = req.query;
    
            // Build the where clause for Sequelize (or adjust for your DB query method)
            const whereClause = {};
            if (search_issue_title) {
                whereClause.issue_title = { [Op.like]: `%${search_issue_title}%` };
            }
            if (search_issue_status) {
                whereClause.issue_status = { [Op.like]: `%${search_issue_status}%` };
            }
            if (search_issue_finish_date) {
                whereClause.issue_finish_date = search_issue_finish_date; // Exact match for date
            }
            if (search_issue_contents) {
                whereClause.issue_contents = { [Op.like]: `%${search_issue_contents}%` };
            }
    
            const issues = await IssueModel.getAllIssues({ where: whereClause });
            // Render the template and pass search parameters to retain input values
            res.render('index', { 
                currentPage: 'pages/issue', 
                issues, 
                selectedIssue: null, 
                activeTab: 'issueList',
                search_issue_title: search_issue_title || '', // Pass search values
                search_issue_status: search_issue_status || '',
                search_issue_finish_date: search_issue_finish_date || '',
                search_issue_contents: search_issue_contents || ''
            });
            
        } catch (error) {
            console.error('List error:', error);
            res.status(500).send('Server Error');
        }
    };






    // 특정 이슈 상세 조회
    static async getIssueDetail(req, res) {
        const { id } = req.params;
        try {
            const issues = await IssueModel.getAllIssues();
            const selectedIssue = await IssueModel.getIssueById(id);
            res.render('index', { currentPage: 'pages/issue', issues, selectedIssue, activeTab: 'issueList' });
        } catch (error) {
            console.error('Detail error:', error);
            res.status(500).send('상세 조회 오류: ' + error.message);
        }
    }

    // 이슈 생성
    static async createIssue(req, res) {
        try {
            await IssueModel.createIssue(req.body);
            res.redirect('/issue');
        } catch (error) {
            console.error('Create error:', error);
            res.status(500).send('이슈 생성 오류: ' + error.message);
        }
    }

    // 이슈 업데이트 (updateWbs로 라우터에서 정의됨)
    static async updateIssue(req, res) {
        const { id } = req.params;
        try {
            await IssueModel.updateIssue(id, req.body);
            res.redirect('/issue');
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).send('이슈 업데이트 오류: ' + error.message);
        }
    }

    // 이슈 삭제 (deleteWbs로 라우터에서 정의됨)
    static async deleteIssue(req, res) {
        const { id } = req.params;
        try {
            await IssueModel.deleteIssue(id);
            res.redirect('/issue');
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).send('이슈 삭제 오류: ' + error.message);
        }
    }

    // 엑셀 파일로 이슈 임포트
    static importIssue(req, res) {
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
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(worksheet);

                // 엑셀 데이터 형식 가정
                const issueData = jsonData.map(row => ({
                    project_id: row.project_id || '',
                    issue_gubun: row.issue_gubun || '',
                    issue_title: row.issue_title || '',
                    issue_contents: row.issue_contents || '',
                    issue_status: row.issue_status || '',
                    issue_progress: row.issue_progress || '',
                    issue_patch_version: row.issue_patch_version || '',
                    issue_finish_date: row.issue_finish_date || '',
                    issue_create_date: row.issue_create_date || '',
                    issue_fixplan_date: row.issue_fixplan_date || ''
                }));

                // 데이터베이스에 일괄 삽입
                for (const data of issueData) {
                    await IssueModel.createIssue(data);
                }

                res.json({ success: true, message: '데이터가 성공적으로 import되었습니다.' });
            } catch (error) {
                console.error('Import error:', error);
                res.status(500).json({ success: false, message: '데이터 import 중 오류가 발생했습니다.' });
            }
        });
    }

// 엑셀 다운로드 메서드 추가
static async downloadExcel(req, res) {
    try {
        const issues = await IssueModel.getAllIssues();
        const worksheetData = issues.map(issue => ({
            'ID': issue.id,
            'Project ID': issue.project_id,
            'Issue 구분': issue.issue_gubun,
            'Issue 제목': issue.issue_title,
            '내용': issue.issue_contents,
            '상태': issue.issue_status,
            '진행 상황': issue.issue_progress,
            '패치 버전': issue.issue_patch_version,
            '완료일': issue.issue_finish_date,
            '생성일': issue.issue_create_date,
            '조치예정일': issue.issue_fixplan_date,
            '시스템 생성일': issue.created_at,
            '시스템 변경일': issue.updated_at
        }));

        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Issues');
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=issues_export.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (error) {
        console.error('Excel download error:', error);
        res.status(500).send('엑셀 다운로드 중 오류가 발생했습니다.');
    }
}








}

module.exports = IssueController;