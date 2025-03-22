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
  },

  // 4. 지연일정(오늘보다 완료일이 작은것) 수 조회
  async getDelayCount(email) {
    const query = `
      SELECT COUNT(*) AS open_issue_count
      FROM tb_treewbs tc
      JOIN tb_user tu ON tc.assignee = tu.user_name
      WHERE tu.email = $1
      AND tc.progress != 100
      AND tc.end_date !='' 
	    AND tc.end_date is not null 
      AND TO_DATE(tc.end_date, 'YYYY-MM-DD') < CURRENT_DATE;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0].open_issue_count;
  },

  // 5. 프로젝트 목록 조회 (추가)
  async getProjectList(email) {
    const query = `
      SELECT DISTINCT tp.id, tp.pjt_name
      FROM tb_user tu
      JOIN tb_project_user tpu ON tu.id = tpu.user_id
      JOIN tb_project tp ON tpu.project_id = tp.id
      WHERE tu.email = $1
      AND tpu.status = 'ACTIVE';
    `;
    const result = await pool.query(query, [email]);
    return result.rows; // [{ id, project_name }, ...] 형태로 반환
  },
// 프로젝트별 미완료 태스크 조회
async getIncompleteTasksByProject(email) {
  const query = `
    SELECT tp.pjt_name, ttw.task, ttw.progress
    FROM tb_treewbs ttw
    JOIN tb_user tu ON ttw.assignee = tu.user_name
    JOIN tb_project tp ON ttw.project_id = tp.id
    WHERE tu.email = $1
    AND ttw.progress < 100
    ORDER BY tp.pjt_name, ttw.task;
  `;
  const result = await pool.query(query, [email]);
  return result.rows;
},

// 프로젝트별 미완료 이슈 조회
async getOpenIssuesByProject(email) {
  const query = `


SELECT tc.title,tc.status
      FROM tb_contents tc
      JOIN tb_user tu ON tc.assignee = tu.user_name
      WHERE tu.email = $1
      AND tc.gubun = '이슈'
      AND tc.status != '완료';



  `;
  const result = await pool.query(query, [email]);
  return result.rows;
},

// 프로젝트별 지연 데이터 조회
async getDelaysByProject(email) {
  const query = `
    SELECT tp.pjt_name, tc.task, tc.end_date
    FROM tb_treewbs tc
    JOIN tb_user tu ON tc.assignee = tu.user_name
    JOIN tb_project tp ON tc.project_id = tp.id
    WHERE tu.email = $1
    AND tc.progress != 100
    AND tc.end_date != ''
    AND tc.end_date IS NOT NULL
    AND TO_DATE(tc.end_date, 'YYYY-MM-DD') < CURRENT_DATE
    ORDER BY tp.pjt_name, tc.task;
  `;
  const result = await pool.query(query, [email]);
  return result.rows;
}





};


module.exports = dashboardModel;