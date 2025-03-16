// controllers/treeContentsController.js
const treeContentsModel = require('../models/treeContentsModel');

const treeContentsController = {
    // 트리와 컨텐츠 링크 생성
    async link(req, res) {
        try {
            const { tree_id, contents_id } = req.body;
            const link = await treeContentsModel.link(tree_id, contents_id);
            if (!link) {
                return res.status(400).json({ error: 'Link already exists or failed' });
            }
            res.status(201).json(link);
        } catch (error) {
            console.error('Error linking content:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 트리와 컨텐츠 링크 해제
    async unlink(req, res) {
        try {
            const { tree_id, contents_id } = req.params;
            const link = await treeContentsModel.unlink(tree_id, contents_id);
            if (!link) {
                return res.status(404).json({ error: 'Link not found' });
            }
            res.json(link);
        } catch (error) {
            console.error('Error unlinking content:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // 특정 트리에 연결된 컨텐츠 조회
    async getLinkedContents(req, res) {
        try {
            const { tree_id } = req.params;
            const contents = await treeContentsModel.getLinkedContents(tree_id);
            res.json(contents);
        } catch (error) {
            console.error('Error fetching linked contents:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = treeContentsController;