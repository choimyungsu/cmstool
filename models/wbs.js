const pool = require("../config/db");

// 모든 WBS 조회
exports.getAllWbs = async () => {
    const result = await pool.query(
        `SELECT *  FROM tb_wbs ORDER BY id ASC `
    );
    return result.rows;
};

// 특정 WBS 조회
exports.getWbsById = async (id) => {
    const result = await pool.query("SELECT * FROM tb_wbs WHERE id = $1", [id]);
    return result.rows[0];
};

// WBS 생성
// exports.createWbs = async (data) => {
//     const { project_id, task_name, start_date, end_date, task_progress, task_user } = data;
//     const result = await pool.query(
//         `INSERT INTO tb_wbs (project_id, task_name, start_date, end_date, task_progress, task_user)
//          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//         [project_id, task_name, start_date, end_date, task_progress, task_user]
//     );
//     return result.rows[0];
// };

exports.createWbs = async (data) => {
    const query = `
        INSERT INTO tb_wbs (project_id, task_name, start_date, end_date, task_progress, task_user)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
        data.project_id,
        data.task_name,
        data.start_date,
        data.end_date,
        data.task_progress,
        data.task_user
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// WBS 업데이트
exports.updateWbs = async (id, data) => {
    const { project_id, task_name, start_date, end_date, task_progress, task_user } = data;
    const result = await pool.query(
        `UPDATE tb_wbs SET project_id=$1, task_name=$2, start_date=$3, end_date=$4, 
         task_progress=$5, task_user=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
        [project_id, task_name, start_date, end_date, task_progress, task_user, id]
    );
    return result.rows[0];
};

// WBS 삭제
exports.deleteWbs = async (id) => {
    await pool.query("DELETE FROM tb_wbs WHERE id = $1", [id]);
};
