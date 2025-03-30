// contentsModel.js
const pool = require("../config/db");

const contentsModel = {
    // 모든 데이터 조회
    async getAll() {
        const result = await pool.query('SELECT id, title, gubun, status, create_user FROM tb_contents ORDER BY id');
        return result.rows;
    },

    // 특정 ID로 데이터 조회
    async getById(id) {
        const result = await pool.query('SELECT * FROM tb_contents WHERE id = $1', [id]);
        return result.rows[0]; // 단일 객체 반환
    },

    // 데이터 생성
    async create(content) {
        const {
            title, gubun, note1, note2, note3, status, create_user, assignee,
            start_date, end_date, plan_date, memo1, memo2, create_user_id ,assignee_id
        } = content;
        // assignee_id가 빈 문자열이면 null로 변환
        const sanitizedAssigneeId = (assignee_id === "" || assignee_id === undefined) ? null : assignee_id;
        const result = await pool.query(
            `INSERT INTO tb_contents (
                title, gubun, note1, note2, note3, status, create_user, assignee,
                start_date, end_date, plan_date, memo1, memo2, create_user_id ,assignee_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15) RETURNING *`,
            [title, gubun, note1, note2, note3, status, create_user, assignee,
             start_date, end_date, plan_date, memo1, memo2,create_user_id,sanitizedAssigneeId ]
        );
        return result.rows[0];
    },

    // 데이터 수정
    async update(id, content) {
        const {
            title, gubun, note1, note2, note3, status, create_user, assignee,
            start_date, end_date, plan_date, memo1, memo2,create_user_id,assignee_id
        } = content;

        // assignee_id가 빈 문자열이면 null로 변환
        const sanitizedAssigneeId = (assignee_id === "" || assignee_id === undefined) ? null : assignee_id;
        const result = await pool.query(
            `UPDATE tb_contents SET
                title = COALESCE($1, title),
                gubun = COALESCE($2, gubun),
                note1 = COALESCE($3, note1),
                note2 = COALESCE($4, note2),
                note3 = COALESCE($5, note3),
                status = COALESCE($6, status),
                create_user = COALESCE($7, create_user),
                assignee = COALESCE($8, assignee),
                start_date = COALESCE($9, start_date),
                end_date = COALESCE($10, end_date),
                plan_date = COALESCE($11, plan_date),
                memo1 = COALESCE($12, memo1),
                memo2 = COALESCE($13, memo2),
                create_user_id = COALESCE($14, create_user_id),
                assignee_id = COALESCE($15, assignee_id)
            WHERE id = $16 RETURNING *`,
            [title, gubun, note1, note2, note3, status, create_user, assignee,
             start_date, end_date, plan_date, memo1, memo2,create_user_id,sanitizedAssigneeId, id]
        );
        return result.rows[0];
    },

    // 데이터 삭제
    async delete(id) {
        const result = await pool.query('DELETE FROM tb_contents WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    // 코드 조회 (tb_master_code와 tb_slave_code에서)
    async getCodesByGroup(codeGroup) {
        const result = await pool.query(`
            SELECT sc.id, sc.code_value, sc.code_name
            FROM tb_master_code mc
            JOIN tb_slave_code sc ON mc.id = sc.master_id
            WHERE mc.code_group = $1
            ORDER BY sc.sort_order
        `, [codeGroup]);
        return result.rows;
    },

    // 상태 코드 조회
    async getStatusCodes() {
        return await this.getCodesByGroup('status');
    },

    // Gubun 코드 조회
    async getGubunCodes() {
        return await this.getCodesByGroup('contents_gubun');
    },

// 검색 기능
   // 검색 기능
   async search({ integratedSearch, gubun, status, createUser, assignee }) {
    let query = 'SELECT * FROM tb_contents WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (integratedSearch) {
        query += `
            AND (LOWER(title) LIKE $${paramIndex}
            OR LOWER(note1) LIKE $${paramIndex}
            OR LOWER(note2) LIKE $${paramIndex}
            OR LOWER(note3) LIKE $${paramIndex}
            OR LOWER(memo1) LIKE $${paramIndex}
            OR LOWER(memo2) LIKE $${paramIndex})
        `;
        values.push(`%${integratedSearch}%`);
        paramIndex++;
    }

    if (gubun) {
        query += ` AND gubun = $${paramIndex}`;
        values.push(gubun);
        paramIndex++;
    }

    if (status) {
        query += ` AND status = $${paramIndex}`;
        values.push(status);
        paramIndex++;
    }

    if (createUser) {
        query += ` AND LOWER(create_user) LIKE $${paramIndex}`;
        values.push(`%${createUser}%`);
        paramIndex++;
    }

    if (assignee) {
        query += ` AND LOWER(assignee) LIKE $${paramIndex}`;
        values.push(`%${assignee}%`);
        paramIndex++;
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    return result.rows;
   }
};

module.exports = contentsModel;