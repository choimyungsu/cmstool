// models/treeModel.js
const pool = require("../config/db");

const treeModel = {
    // 모든 데이터 조회
    async getAll() {
        const result = await pool.query('SELECT * FROM tb_tree ORDER BY parent_id, seq');
        return result.rows;
    },

    // 데이터 생성
    async create(tree) {
        const { task, parent_id } = tree;
        const result = await pool.query(
            `INSERT INTO tb_tree (task, parent_id) VALUES ($1, $2) RETURNING *`,
            [task, parent_id]
        );
        return result.rows[0];
    },

    // 데이터 수정
    async update(id, tree) {
        const { task, parent_id, seq } = tree;
        const result = await pool.query(
            `UPDATE tb_tree SET task = COALESCE($1, task), parent_id = COALESCE($2, parent_id), seq = COALESCE($3, seq) WHERE id = $4 RETURNING *`,
            [task, parent_id,seq, id]
        );
        return result.rows[0];
    },

    // 데이터 삭제
    async delete(id) {
        const result = await pool.query('DELETE FROM tb_tree WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};

module.exports = treeModel;