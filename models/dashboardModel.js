const pool = require("../config/db");

const dashboardModel = {

  // 1. 참여 중인 프로젝트 수 조회
  async getProjectCount(email) {
    const query = `
      SELECT COUNT(DISTINCT tp.id) AS project_count
      FROM tb_user tu
      JOIN tb_project_user tpu ON tu.id = tpu.user_id
      JOIN tb_project tp ON tpu.project_id = tp.id
      WHERE tu.email = $1
      AND tpu.status = 'ACTIVE';
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0].project_count;
  },

  // 2. 미완료 태스크 수 조회
  async getIncompleteTaskCount(email) {
    const query = `
      SELECT COUNT(*) AS incomplete_task_count
      FROM tb_treewbs ttw
      JOIN tb_user tu ON ttw.assignee = tu.user_name
      WHERE tu.email = $1
      AND ttw.progress < 100;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0].incomplete_task_count;
  },

  // 3. 미완료 이슈 수 조회
  async getOpenIssueCount(email) {
    const query = `
      SELECT COUNT(*) AS open_issue_count
      FROM tb_contents tc
      JOIN tb_user tu ON tc.assignee = tu.user_name
      WHERE tu.email = $1
      AND tc.gubun = '이슈'
      AND tc.status != '완료';
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0].open_issue_count;
  }
};


module.exports = dashboardModel;