// src/db_connect2.js
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: 'T1st@localhost',
    database: 'proj57',
    waitForConnections: true, //是否等待連線才繼續往下
    connectionLimit: 10, // 最大連線數 
    queueLimit: 0 //排隊的數量
});
module.exports = pool.promise(); // 滙出promise 幫裝過的 pool