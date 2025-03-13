// models/memo.js
const pool = require('../config/db');

class Memo {
  static async getAllMemos() {
    try {
      const result = await pool.query(`
        SELECT id, memo_title, memo_writer, memo_dt, memo_contents, 
               created_at, updated_at 
        FROM tb_memo 
        ORDER BY id
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  static async createMemo(memoData) {
    try {
      const { memo_title, memo_writer, memo_dt, memo_contents } = memoData;
      const result = await pool.query(`
        INSERT INTO tb_memo (memo_title, memo_writer, memo_dt, memo_contents)
        VALUES ($1, $2, $3, $4)
        RETURNING id, memo_title, memo_writer, memo_dt, memo_contents, created_at, updated_at
      `, [memo_title, memo_writer, memo_dt, memo_contents]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateMemo(id, memoData) {
    try {
      const { memo_title, memo_writer, memo_dt, memo_contents } = memoData || {};
      const safeMemoTitle = memo_title || "No Title";
      const safeMemoWriter = memo_writer || "Anonymous";
      const safeMemoDt = memo_dt || new Date().toISOString().split('T')[0];
      const safeMemoContents = memo_contents || "<p>No content</p>";

      const result = await pool.query(`
        UPDATE tb_memo
        SET memo_title = $1,
            memo_writer = $2,
            memo_dt = $3,
            memo_contents = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, memo_title, memo_writer, memo_dt, memo_contents, created_at, updated_at
      `, [safeMemoTitle, safeMemoWriter, safeMemoDt, safeMemoContents, id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteMemo(id) {
    try {
        const result = await pool.query(
            `DELETE FROM tb_memo WHERE id = $1 RETURNING *`,
            [id]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

//검색
static async searchMemo({ search_memo_title, search_memo_writer,search_memo_dt,search_memo_contents}) {
  try {
      let query = `SELECT id, memo_title, memo_writer, memo_dt, memo_contents, 
               created_at, updated_at FROM tb_memo WHERE 1=1`;
      const values = [];

      if (search_memo_title) {
        query += ` AND memo_title LIKE $${values.length + 1}`;
        values.push(`%${search_memo_title}%`);
      }
      if (search_memo_writer) {
          query += ` AND memo_writer LIKE $${values.length + 1}`;
          values.push(`%${search_memo_writer}%`);
      }
      if (search_memo_dt) {
          query += ` AND memo_dt LIKE $${values.length + 1}`;
          values.push(search_memo_dt);
      }
      if (search_memo_contents) {
          query += ` AND memo_contents LIKE $${values.length + 1}`;
          values.push(`%${search_memo_contents}%`);
      }

      //console.log('SearchMemo SQL', query, values); // 쿼리와 값 분리 출력
      const result = await pool.query(query, values);
      //console.log('SearchMemo SQL result',result)
      return result.rows;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

}

module.exports = Memo;