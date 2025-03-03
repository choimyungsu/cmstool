// config/db.js
const { Pool } = require('pg');

// 기본 DB 설정
const dbConfig = {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "postgres",
    port: process.env.DB_PORT || 5432,
};

// 환경에 따라 설정
if (process.env.NODE_ENV === 'production') {
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_uYbwV3oOGl8J@ep-twilight-wildflower-a1ulzpbw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

    const url = new URL(databaseUrl);

    dbConfig.host = url.hostname;
    dbConfig.user = url.username;
    dbConfig.password = url.password;
    dbConfig.database = url.pathname.split('/')[1];
    dbConfig.port = url.port || 5432;
    dbConfig.ssl = { rejectUnauthorized: false };
} else {
    dbConfig.host = process.env.LOCAL_DB_HOST || 'localhost';
}

// Pool 생성
const pool = new Pool(dbConfig);

module.exports = pool;