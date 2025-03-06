const pool = require('../config/db');

class IssueModel {
    // static async getAllIssues() {
    //     const result = await pool.query('SELECT * FROM tb_issue ORDER BY created_at DESC');
    //     return result.rows;
    // }

    static async getAllIssues({ where = {} } = {}) {
        try {
            // Base query
            let query = 'SELECT * FROM tb_issue';
            const conditions = [];
            const values = [];
            let paramIndex = 1;

            // Process whereClause
            if (where.issue_title) {
                conditions.push(`issue_title LIKE $${paramIndex}`);
                // Extract the value from the object (e.g., { 'LIKE': '%value%' })
                const value = where.issue_title['LIKE'] || where.issue_title;
                values.push(value);
                paramIndex++;
            }
            if (where.issue_status) {
                conditions.push(`issue_status LIKE $${paramIndex}`);
                const value = where.issue_status['LIKE'] || where.issue_status;
                values.push(value);
                paramIndex++;
            }
            if (where.issue_finish_date) {
                conditions.push(`issue_finish_date = $${paramIndex}`);
                values.push(where.issue_finish_date); // Exact match, no object here
                paramIndex++;
            }
            if (where.issue_contents) {
                conditions.push(`issue_contents LIKE $${paramIndex}`);
                const value = where.issue_contents['LIKE'] || where.issue_contents;
                values.push(value);
                paramIndex++;
            }

            // Append WHERE clause if conditions exist
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            // Add ORDER BY clause
            query += ' ORDER BY created_at DESC';

            // Execute query
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error in getAllIssues:', error);
            throw error; // Re-throw to be caught by the controller
        }
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