// models/projectUserModel.js
const pool = require('../config/db');

class ProjectUserModel {
    static async getUsersByProjectId(projectId) {
      const result = await pool.query(
        'SELECT pu.*, u.user_name AS user_name FROM tb_project_user pu JOIN tb_user u ON pu.user_id = u.id WHERE pu.project_id = $1',
        [projectId]
      );
      return result.rows;
    }
  
    static async addUserToProject(projectId, userId) {
      const result = await pool.query(
        'INSERT INTO tb_project_user (project_id, user_id, joined_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (project_id, user_id) DO NOTHING RETURNING *',
        [projectId, userId]
      );
      return result.rowCount > 0;
    }
  
    static async removeUserFromProject(projectId, userId) {
      const result = await pool.query(
        'DELETE FROM tb_project_user WHERE project_id = $1 AND user_id = $2',
        [projectId, userId]
      );
      return result.rowCount > 0;
    }
  
    static async getAllUsers() {
      const result = await pool.query('SELECT id, user_name AS user_name FROM tb_user');
      return result.rows;
    }
  
    static async getFirstProjectId() {
      try {
        const result = await pool.query('SELECT id FROM tb_project ORDER BY id ASC LIMIT 1');
        console.log('Query result:', result.rows);
        if (!Array.isArray(result.rows) || result.rows.length === 0) {
          console.log('No projects found or invalid result');
          return null;
        }
        return result.rows[0].id;
      } catch (error) {
        console.error('Error in getFirstProjectId:', error);
        throw error;
      }
    }
  
    static async getAllProjects() {
      const result = await pool.query('SELECT id, pjt_name FROM tb_project ORDER BY id ASC');
      return result.rows;
    }
  }
  
  module.exports = ProjectUserModel;