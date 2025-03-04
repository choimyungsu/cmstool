const pool = require('../config/db');

// 날짜별 보안이벤트 발생 건수
const getEventsByDate = async () => {
    const query = `
      SELECT TO_CHAR(TO_TIMESTAMP(stellar_alert_time / 1000) AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS event_date, 
             COUNT(*) AS event_count 
      FROM stellar_alert_data 
      GROUP BY event_date 
      ORDER BY event_date`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  // 최근 보안이벤트 100건
  const getRecentEvents = async () => {
    const query = `
      SELECT to_timestamp(stellar_alert_time / 1000) AT TIME ZONE 'Asia/Seoul' as time2, * 
      FROM stellar_alert_data 
      LIMIT 100`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  // 보안이벤트 그룹별 건수 상위 10건
  const getEventGroups = async () => {
    const query = `
      SELECT xdr_event_name, COUNT(*) AS count 
      FROM stellar_alert_data 
      GROUP BY xdr_event_name 
      ORDER BY count DESC 
      LIMIT 10`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  // APP Top 5건
  const getTop5Apps = async () => {
    const query = `
      SELECT appid_name, COUNT(*) AS count 
      FROM stellar_alert_data 
      GROUP BY appid_name 
      ORDER BY count DESC 
      LIMIT 5`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  // 킬체인 단계 건수
  const getKillchainStages = async () => {
    const query = `
      SELECT xdr_event_xdr_killchain_stage, COUNT(*) AS count 
      FROM stellar_alert_data 
      GROUP BY xdr_event_xdr_killchain_stage 
      ORDER BY count DESC`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  // 목적지 IP Top 5건
  const getTop5DstIps = async () => {
    const query = `
      SELECT dstip, COUNT(*) AS count 
      FROM stellar_alert_data 
      GROUP BY dstip 
      ORDER BY count DESC 
      LIMIT 5`;
    const result = await pool.query(query);
    return result.rows;
  };
  
  module.exports = {
    getEventsByDate,
    getRecentEvents,
    getEventGroups,
    getTop5Apps,
    getKillchainStages,
    getTop5DstIps
  };