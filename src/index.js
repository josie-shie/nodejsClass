require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
app.get('/',(req, res) => {
    res.send('Hello');
});

app.listen(process.env.PORT,()=>{
    console.log(`server start:${port}`);
});