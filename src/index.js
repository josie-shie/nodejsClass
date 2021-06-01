
require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');

// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'}); // 設定暫存的資料夾
// const {v4: uuidv4} = require('uuid');//uuid為通用唯一辨識碼（英語：Universally Unique Identifier，縮寫：UUID）是用於電腦體系中以辨識資訊的一個128位元識別碼。 根據標準方法生成，不依賴中央機構的註冊和分配，UUID具有唯一性，這與其他大多數編號方案不同。 重複UUID碼概率接近零，

const upload = require(__dirname + '/modules/upload-img');

const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));  // middleware // 中介軟體
app.use(express.json()); 
// app.use(express.static('public'));
app.use(express.static(__dirname + '/../public'));

// 路由定義：開始


app.get('/', (req, res)=>{
    res.render('home', {name: 'Shinder'});
});

app.get('/json-test', (req, res)=>{
    const d = require(__dirname + '/../data/sales');
    // res.json(d);
    res.render('json-test', {sales: d});
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});


app.post('/try-post', (req, res)=>{
    res.json(req.body);
});

app.get('/try-post-form', (req, res)=>{
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res)=>{
    res.render('try-post-form', req.body);
});

app.get('/try-upload',  (req, res)=>{
    res.render('try-upload');
});
app.post('/try-upload', upload.single('avatar'), async (req, res)=>{
    console.log(req.file);

    // let newName = '';
    // if(extMap[req.file.mimetype]){
    //     newName = uuidv4() + extMap[req.file.mimetype];
    //      rename搬動檔案
    //     await fs.promises.rename(req.file.path, './public/img/' + newName);
    // }

    res.json({
        filename: req.file && req.file.filename,
        body: req.body,
    });
});

//upload.array上傳多檔案
app.post('/try-uploads', upload.array('photo', 6), (req, res)=>{
    console.log(req.files);
    res.json({
        files: req.files,
        body: req.body,
    });
});


app.get('/pending',  (req, res)=>{

});
//路由越寬鬆的放後面
///my-params1/hello 就應該放在寬松露油前面
//:action :id 可以自己設定參數 是較寬鬆的路由
app.get('/my-params1/:action/:id', (req, res)=>{
    res.json(req.params);
    });


// 404 放在所有的路由後面
app.use((req, res)=>{
    res.type('text/html');
    res.status(404).send('<h1>找不到頁面</h1>');
});
// 路由定義：結束

app.listen(port, ()=>{
    console.log(`server started: ${port}`);
});






