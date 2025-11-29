/**
 * ES6 Database Query Helper
 * For use in ES6 modules (like events.js)
 */
import pool from './db.js';

export const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

