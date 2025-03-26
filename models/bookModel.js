const pool = require('../config/db');

class Book {
    static async getAllBooks(userId) {
        const query = `
            SELECT * FROM tb_book 
            WHERE is_published = TRUE OR author_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async createBook(bookData) {
        const { title, cover_image, author_id } = bookData;
        const query = `
            INSERT INTO tb_book (title, cover_image, author_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [title, cover_image, author_id]);
        return result.rows[0];
    }

    static async publishBook(bookId) {
        const query = `
            UPDATE tb_book
            SET is_published = TRUE
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [bookId]);
        return result.rows[0];
    }
}

module.exports = Book;