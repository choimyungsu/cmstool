// models/treeContentsModel.js
const pool = require("../config/db");

const treeContentsModel = {
    // 트리와 컨텐츠 링크 생성
    async link(treeId, contentsId) {
        const result = await pool.query(
            `INSERT INTO tb_tree_contents (tree_id, contents_id) VALUES ($1, $2) ON CONFLICT (tree_id, contents_id) DO NOTHING RETURNING *`,
            [treeId, contentsId]
        );
        return result.rows[0];
    },

    // 트리와 컨텐츠 링크 해제
    async unlink(treeId, contentsId) {
        const result = await pool.query(
            'DELETE FROM tb_tree_contents WHERE tree_id = $1 AND contents_id = $2 RETURNING *',
            [treeId, contentsId]
        );
        return result.rows[0];
    },

    // 특정 트리에 연결된 컨텐츠 조회
    async getLinkedContents(treeId) {
        const result = await pool.query(
            `SELECT c.* FROM tb_tree_contents tc
             JOIN tb_contents c ON tc.contents_id = c.id
             WHERE tc.tree_id = $1`,
            [treeId]
        );
        return result.rows;
    }
};

module.exports = treeContentsModel;