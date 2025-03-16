// contentsController.js
const contentsModel = require('../models/contentsModel');

const contentsController = {
    // contents.ejs 렌더링 및 상태 코드 데이터 제공
    async getAllPage(req, res) {
        try {
            const statusCodes = await contentsModel.getStatusCodes();
            res.render('index', {
                currentPage: 'pages/contents',
                user: req.session.user,
                statusCodes: statusCodes // 셀렉트 박스용 상태 코드
            });
        } catch (error) {
            console.error('Error rendering contents page:', error);
            res.status(500).send('Server Error');
        }
    },

    // 모든 데이터 조회 또는 특정 ID로 데이터 조회 (JSON)
    async getAll(req, res) {
        try {
            const id = req.query.id;
            if (id) {
                const content = await contentsModel.getById(id);
                if (!content) {
                    return res.status(404).json({ error: 'Content not found' });
                }
                console.log('Fetched content by ID:', content); // 디버깅 로그
                res.json(content);
            } else {
                const contents = await contentsModel.getAll();
                res.json(contents);
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 데이터 생성
    async create(req, res) {
        try {
            const content = await contentsModel.create(req.body);
            res.status(201).json(content);
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 데이터 수정
    async update(req, res) {
        try {
            const content = await contentsModel.update(req.params.id, req.body);
            res.json(content);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 데이터 삭제
    async delete(req, res) {
        try {
            const content = await contentsModel.delete(req.params.id);
            res.json(content);
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 상태 코드 조회 (JSON)
    async getStatusCodes(req, res) {
        try {
            const statusCodes = await contentsModel.getStatusCodes();
            res.json(statusCodes);
        } catch (error) {
            console.error('Error fetching status codes:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 검색 기능 추가
    async search(req, res) {
        try {
            const { integratedSearch, status, createUser, assignee } = req.query;
            const contents = await contentsModel.search({
                integratedSearch: integratedSearch || '',
                status: status || '',
                createUser: createUser || '',
                assignee: assignee || ''
            });
            res.json(contents);
        } catch (error) {
            console.error('Error searching contents:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = contentsController;