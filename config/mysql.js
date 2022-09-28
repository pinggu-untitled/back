import mysql from 'mysql2';
import config from './config.js';

const pool = mysql.createPool(config.db);

export const db = pool.promise();
