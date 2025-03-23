const pool = require('../config/db');

const calendarModel = {
    async getAllEvents() {
        const query = `
            SELECT id, title, start, "end", all_day, background_color, border_color, created_by
            FROM tb_calendar;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async addEvent(title, start, end, allDay, backgroundColor, borderColor, createdBy) {
        const query = `
            INSERT INTO tb_calendar (title, start, "end", all_day, background_color, border_color, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [title, start, end || null, allDay, backgroundColor, borderColor, createdBy];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateEvent(id, start, end, allDay) {
        const query = `
            UPDATE tb_calendar
            SET start = $2, "end" = $3, all_day = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id, start, end || null, allDay];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async deleteEvent(id) {
        const query = `
            DELETE FROM tb_calendar
            WHERE id = $1
            RETURNING *;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = calendarModel;