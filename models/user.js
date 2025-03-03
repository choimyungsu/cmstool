// models/user.js
const pool = require('../config/db');

class User {
  static async getAllUsers() {
    try {
      const result = await pool.query(`
        SELECT id, user_id,user_name, email,tel, organization, department, 
               created_at, updated_at 
        FROM tb_user 
        ORDER BY id
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  static async createUser(userData) {
    try {
      const { user_id, user_name, password, email, tel, organization, department } = userData;
      const result = await pool.query(`
        INSERT INTO tb_user (user_id, user_name, password, email, tel, organization, department)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, user_name, email,tel, organization, department, created_at, updated_at
      `, [user_id, user_name, password, email,tel, organization || null, department || null]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }


  
//검색 
static async searchUsers({ search_user_id}) {
  try {
      let query = `SELECT id, user_id, user_name, email,tel, organization, department, 
               created_at, updated_at FROM tb_user WHERE 1=1`;
      const values = [];

      if (search_user_id) {
        query += ` AND user_id LIKE $${values.length + 1}`;
        values.push(`%${search_user_id}%`);
      }
      
      const result = await pool.query(query, values);
      console.log('searchUsers SQL result',result)
      return result.rows;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

}

module.exports = User;