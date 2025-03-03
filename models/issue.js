const pool = require('../config/db');

class IssueModel {
    static async getAllIssues() {
        const result = await pool.query('SELECT * FROM tb_issue ORDER BY created_at DESC');
        return result.rows;
    }

    static async getIssueById(id) {
        const result = await pool.query('SELECT * FROM tb_issue WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async createIssue(data) {
        const { project_id, issue_gubun, issue_title, issue_contents, issue_status, issue_progress, issue_patch_version, issue_finish_date, issue_create_date } = data;
        const result = await pool.query(
            'INSERT INTO tb_issue (project_id, issue_gubun, issue_title, issue_contents, issue_status, issue_progress, issue_patch_version, issue_finish_date, issue_create_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [project_id, issue_gubun, issue_title, issue_contents, issue_status, issue_progress, issue_patch_version, issue_finish_date, issue_create_date]
        );
        return result.rows[0];
    }

    static async updateIssue(id, data) {
        const { project_id, issue_gubun, issue_title, issue_contents, issue_status, issue_progress, issue_patch_version, issue_finish_date, issue_create_date } = data;
        const result = await pool.query(
            'UPDATE tb_issue SET project_id = $1, issue_gubun = $2, issue_title = $3, issue_contents = $4, issue_status = $5, issue_progress = $6, issue_patch_version = $7, issue_finish_date = $8, issue_create_date = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
            [project_id, issue_gubun, issue_title, issue_contents, issue_status, issue_progress, issue_patch_version, issue_finish_date, issue_create_date, id]
        );
        return result.rows[0];
    }

    static async deleteIssue(id) {
        const result = await pool.query('DELETE FROM tb_issue WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = IssueModel;