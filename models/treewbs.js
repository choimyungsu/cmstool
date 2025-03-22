const pool = require("../config/db");

const treewbsModel = {
    async getAll(projectId) {
        const result = await pool.query(
            'SELECT * FROM tb_treewbs WHERE project_id = $1 ORDER BY id',
            [projectId]
        );
        return result.rows;
    },

    async create(node) {
        const { task, start_date, end_date, progress, assignee, parent_id, project_id } = node;
        const result = await pool.query(
            'INSERT INTO tb_treewbs (task, start_date, end_date, progress, assignee, parent_id, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [task, start_date, end_date, progress, assignee, parent_id, project_id]
        );
        return result.rows[0];
    },

    async update(id, node) {
        const { task, start_date, end_date, progress, assignee, parent_id, project_id } = node;
        const result = await pool.query(
            'UPDATE tb_treewbs SET task = COALESCE($1, task), start_date = COALESCE($2, start_date), end_date = COALESCE($3, end_date), progress = COALESCE($4, progress), assignee = COALESCE($5, assignee), parent_id = COALESCE($6, parent_id), project_id = COALESCE($7, project_id) WHERE id = $8 RETURNING *',
            [task, start_date, end_date, progress, assignee, parent_id, project_id, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query(
            'DELETE FROM tb_treewbs WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = treewbsModel;