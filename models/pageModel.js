const pool = require('../config/db');

class Page {
    static async getPagesByBook(bookId) {
        const query = `
            SELECT * FROM tb_page
            WHERE book_id = $1
            ORDER BY page_number
        `;
        const result = await pool.query(query, [bookId]);
        return result.rows;
    }

    static async getPageById(pageId) {
        const res = await pool.query(
            'SELECT * FROM tb_page WHERE id = $1',
            [pageId]
        );
        return res.rows[0];
    }

    static async createPage(pageData) {
        const { book_id, chapter_id, page_number, content, watermark_text, watermark_size } = pageData;
        const query = `
            INSERT INTO tb_page (book_id, chapter_id, page_number, content, watermark_text, watermark_size)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [
            book_id,
            chapter_id,
            page_number,
            content,
            watermark_text,
            watermark_size || 40
        ]);
        return result.rows[0];
    }

    static async shiftPageNumbers(bookId, pageNumber) {
        await pool.query(
            `UPDATE tb_page
             SET page_number = page_number + 1
             WHERE book_id = $1 AND page_number >= $2`,
            [bookId, pageNumber]
        );
    }

    static async updatePage(pageData) {
        const { id, book_id, chapter_id, page_number, content, watermark_text, watermark_size } = pageData;
        const currentPage = await this.getPageById(id);
        if (!currentPage) {
            throw new Error('페이지가 존재하지 않습니다.');
        }

        if (currentPage.page_number !== page_number) {
            await pool.query(
                `UPDATE tb_page
                 SET page_number = page_number + 1
                 WHERE book_id = $1 AND page_number >= $2 AND id != $3`,
                [book_id, page_number, id]
            );
        }

        const query = `
            UPDATE tb_page
            SET chapter_id = $1, page_number = $2, content = $3, watermark_text = $4, watermark_size = $5
            WHERE id = $6 AND book_id = $7
            RETURNING *
        `;
        const result = await pool.query(query, [
            chapter_id,
            page_number,
            content,
            watermark_text,
            watermark_size || 40,
            id,
            book_id
        ]);

        if (result.rows.length === 0) {
            throw new Error('페이지 업데이트 실패');
        }
        return result.rows[0];
    }

    static async getBookmark(userId, pageId) {
        if (!userId || !pageId) {
            console.warn('getBookmark: userId or pageId is missing', { userId, pageId });
            return null; // 에러 대신 null 반환
        }
        const query = `
            SELECT * FROM tb_bookmarks
            WHERE user_id = $1 AND page_id = $2
        `;
        const result = await pool.query(query, [userId, pageId]);
        return result.rows[0];
    }

    static async addBookmark(userId, pageId, bookId) {
        if (!userId || !pageId || !bookId) {
            throw new Error('userId, pageId, bookId는 필수입니다.');
        }
        const query = `
            INSERT INTO tb_bookmarks (user_id, page_id, book_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, page_id) DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [userId, pageId, bookId]);
        return result.rows[0];
    }

    static async removeBookmark(userId, pageId) {
        if (!userId || !pageId) {
            throw new Error('userId와 pageId는 필수입니다.');
        }
        const query = `
            DELETE FROM tb_bookmarks
            WHERE user_id = $1 AND page_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [userId, pageId]);
        return result.rows[0];
    }

    
    static async getAllBookmarksByBook(userId, bookId) {
        try {
            const query = `
                SELECT b.*, p.page_number
                FROM tb_bookmarks b
                JOIN tb_page p ON b.page_id = p.id
                WHERE b.user_id = $1 AND b.book_id = $2
                ORDER BY p.page_number ASC
            `;
            const result = await pool.query(query, [userId, bookId]);
            return result.rows; // PostgreSQL의 pool.query는 result.rows를 반환
        } catch (error) {
            console.error('Error in getAllBookmarksByBook:', {
                message: error.message,
                userId,
                bookId,
                stack: error.stack
            });
            throw new Error(`Failed to fetch bookmarks for book: ${error.message}`);
        }
    }
}

module.exports = Page;