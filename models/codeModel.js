// models/codeModel.js
const pool = require('../config/db');

class CodeModel {
  // 마스터 코드 목록 조회
  static async getMasterCodes() {
    const query = 'SELECT * FROM tb_master_code ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  // 마스터 코드 단일 조회
  static async getMasterCodeById(id) {
    const query = 'SELECT * FROM tb_master_code WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 마스터 코드 생성
  static async createMasterCode(code_group, code_name) {
    const query = 'INSERT INTO tb_master_code (code_group, code_name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [code_group, code_name]);
    return result.rows[0];
  }

  // 마스터 코드 업데이트
  static async updateMasterCode(id, code_group, code_name) {
    const query = 'UPDATE tb_master_code SET code_group = $1, code_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [code_group, code_name, id]);
    return result.rows[0];
  }

  // 마스터 코드 삭제
  static async deleteMasterCode(id) {
    const query = 'DELETE FROM tb_master_code WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 슬레이브 코드 목록 조회 (특정 master_id 기준)
  static async getSlaveCodes(masterId) {
    const query = 'SELECT * FROM tb_slave_code WHERE master_id = $1 ORDER BY sort_order ASC';
    const result = await pool.query(query, [masterId]);
    return result.rows;
  }

  // 슬레이브 코드 단일 조회
  static async getSlaveCodeById(id) {
    const query = 'SELECT * FROM tb_slave_code WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 슬레이브 코드 생성
  static async createSlaveCode(master_id, code_value, code_name, sort_order, is_active) {
    const query = `
      INSERT INTO tb_slave_code (master_id, code_value, code_name, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await pool.query(query, [master_id, code_value, code_name, sort_order, is_active]);
    return result.rows[0];
  }

  // 슬레이브 코드 업데이트
  static async updateSlaveCode(id, master_id, code_value, code_name, sort_order, is_active) {
    const query = `
      UPDATE tb_slave_code 
      SET master_id = $2, code_value = $3, code_name = $4, sort_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id, master_id, code_value, code_name, sort_order, is_active]);
    return result.rows[0];
  }

  // 슬레이브 코드 삭제
  static async deleteSlaveCode(id) {
    const query = 'DELETE FROM tb_slave_code WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = CodeModel;