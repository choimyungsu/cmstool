const pool = require('../config/db');

class ProjectModel {
    static async getAllProjects({ where = {} } = {}) {
        try {
            let query = 'SELECT * FROM tb_project';
            const conditions = [];
            const values = [];
            let paramIndex = 1;

            if (where.pjt_uid) {
                conditions.push(`pjt_uid LIKE $${paramIndex}`);
                values.push(where.pjt_uid['LIKE'] || where.pjt_uid);
                paramIndex++;
            }
            if (where.pjt_name) {
                conditions.push(`pjt_name LIKE $${paramIndex}`);
                values.push(where.pjt_name['LIKE'] || where.pjt_name);
                paramIndex++;
            }
            if (where.pjt_open) {
                conditions.push(`pjt_open LIKE $${paramIndex}`);
                values.push(where.pjt_open['LIKE'] || where.pjt_open);
                paramIndex++;
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            query += ' ORDER BY created_at DESC';

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error in getAllProjects:', error);
            throw error;
        }
    }

    static async getProjectById(id) {
        const result = await pool.query('SELECT * FROM tb_project WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async createProject(data) {
        const { pjt_uid, pjt_name, pjt_desc, pjt_open, pjt_start_date, pjt_end_date } = data;
        const result = await pool.query(
            'INSERT INTO tb_project (pjt_uid, pjt_name, pjt_desc, pjt_open, pjt_start_date, pjt_end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [pjt_uid, pjt_name, pjt_desc, pjt_open, pjt_start_date, pjt_end_date]
        );
        return result.rows[0];
    }

    static async updateProject(id, data) {
        const { pjt_uid, pjt_name, pjt_desc, pjt_open, pjt_start_date, pjt_end_date } = data;
        const result = await pool.query(
            'UPDATE tb_project SET pjt_uid = $1, pjt_name = $2, pjt_desc = $3, pjt_open = $4, pjt_start_date = $5, pjt_end_date = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
            [pjt_uid, pjt_name, pjt_desc, pjt_open, pjt_start_date, pjt_end_date, id]
        );
        return result.rows[0];
    }

    static async deleteProject(id) {
        const result = await pool.query('DELETE FROM tb_project WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = ProjectModel;