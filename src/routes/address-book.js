const express = require('express');
const db = require(__dirname + '/../modules/mysql2-connect');

const router = express.Router();

router.get('/list', async (req, res)=>{
    let t_sql = "SELECT COUNT(2) num FROM `address_book` ";
    let [r1] = await db.query(t_sql);
    res.json(r1);
});

module.exports = router;