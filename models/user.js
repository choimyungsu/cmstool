// models/user.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');//패스워드 암호화

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

  // static async createUser(userData) {
  //   try {
  //     const { user_id, user_name, password, email, tel, organization, department } = userData;
  //     const result = await pool.query(`
  //       INSERT INTO tb_user (user_id, user_name, password, email, tel, organization, department)
  //       VALUES ($1, $2, $3, $4, $5, $6, $7)
  //       RETURNING id, user_id, user_name, email,tel, organization, department, created_at, updated_at
  //     `, [user_id, user_name, password, email,tel, organization || null, department || null]);
  //     return result.rows[0];
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  static async createUser(userData) {
    try {
      const { user_id, user_name, password, email, tel, organization, department } = userData;
      // 비밀번호 검증
      if (!password) {
        throw new Error('Password is required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(`
        INSERT INTO tb_user (user_id, user_name, password, email, tel, organization, department)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, user_name, email,tel, organization, department, created_at, updated_at
      `, [user_id, user_name, hashedPassword, email,tel, organization || null, department || null]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // 암호화 패스워드 등록
  // static async createUser(username, email, password) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const result = await db.query(
  //     'INSERT INTO tb_user (username, email, password) VALUES ($1, $2, $3) RETURNING *',
  //     [username, email, hashedPassword]
  //   );
  //   return result.rows[0];
  // }



  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM tb_user WHERE email = $1', [email]);
    return result.rows[0];
  }



  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
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


static async search(user_name) {
  console.log("🔍 Searching for user:", user_name);

  const query = 'SELECT id, user_name, email FROM tb_user WHERE user_name LIKE $1';
  const values = [`%${user_name}%`];

  console.log("Executing SQL:", query, values); // SQL 로그 추가

  const result = await pool.query(query, values);
  return result.rows;
}



}

module.exports = User;