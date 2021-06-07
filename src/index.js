
require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/modules/mysql2-connect');
//存放sessionStore好處是純在這裡不會因為server重啟就不見
const sessionStore = new MysqlStore({}, db);
const cors = require('cors')



// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'}); // 設定暫存的資料夾
// const {v4: uuidv4} = require('uuid');//uuid為通用唯一辨識碼（英語：Universally Unique Identifier，縮寫：UUID）是用於電腦體系中以辨識資訊的一個128;位元識別碼。 根據標準方法生成，不依賴中央機構的註冊和分配，UUID具有唯一性，這與其他大多數編號方案不同。 重複UUID碼概率接近零，

const upload = require(__dirname + '/modules/upload-img');

const fs = require('fs');

const app = express();
    
app.set('view engine', 'ejs');

const corsOptions ={

    origin: function (origin,cb){
        
    }

}
//app.use(cors());

app.use(session({
    // 新用戶沒有使用到session 物件時不會建立session 和發送cookie
    saveUninitialized: false,//必須設定否則warring
    resave: false, //必須設定否則warring 沒變更內容是否強制回存
    secret: '加密用的字串可以隨便打 zsexdrctfvgybhjnkml',
    store: sessionStore,
    cookie: {
    //預設為瀏覽器關閉cookie就失效
    // cookie的有效期限 20分鐘，單位毫秒
    maxAge: 1200000, 

    }
}));

app.use(express.urlencoded({extended: false}));  // middleware // 中介軟體
app.use(express.json()); 
// app.use(express.static('public'));
app.use(express.static(__dirname + '/../public'));
//將某資料夾掛在網址abc底下
//app.use('abc',express.static(__dirname + '/../public'));

//
app.use((req, res, next) => {
    // res.locals = {
    //     email:'全域的middeware:email',
    //     password:'全域的middeware:password'
    // }
    //必須使用next讓他往下傳遞
    res.locals.admin = req.session.admin || {};//把登入的session資料放入locals
    next();
});

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
    //res.render('try-post-form');
    res.locals = {
        email:'這是預設值email',
        password:'這是預設password'
    }
    res.render('try-post-form')
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

app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=>{
    //res.json(req.url);
    let u = req.url.slice(3);//去除/M/這三個字元
    u = u.split('?')[0];//去除quer string
    u = u.split('-').join('-');//將數字的'-'替換成空字串''
    //u = u.replace(/-/g,'');//方法二 將數字的'-'替換成空字串'' g=所有的字串
    res.send(`<h2>${u}</h2>`);//讀入新的u
});

// app.use( require(__dirname + '/routes/admin2') );
const admin2 = require(__dirname + '/routes/admin2');
//將admin2掛載網址/admin3之下
app.use('/admin3', admin2);
app.use(admin2);


//確認有無session與製造session
app.get('/try-sess', (req, res)=>{
    req.session.my_var = req.session.my_var || 0; // 預設為0
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    })
});

app.get('/login', (req, res)=>{
    if(req.session.admin){
        res.redirect('/');  // 若是已登入，轉向到首頁
    } else {
        res.render('login');
    }
});

//＝＝＝＝＝登入並核對帳號密碼有無正確＝＝＝＝＝＝＝

app.post('/login', (req, res)=>{
    const accounts = {
        josie: {
            nickname: '小喬',
            pw: '7788',
        },
        ming: {
            nickname: '小明',
            pw: '222222',
        },
    };
    const output = {
        success: false,
        code: 0,
        error: '帳號或密碼錯誤',
        body: req.body,
    };

    if(req.body && req.body.account && accounts[req.body.account]){
        output.code = 100;
        const item = accounts[req.body.account];
        if(req.body.password && req.body.password===item.pw){

            req.session.admin = {
                account: req.body.account,
                ...item
            };
            output.success = true;
            output.error = '';
            output.code = 200;
        }
    }

    res.json(output)
});

//＝＝＝＝登出＝＝＝＝＝
app.get('/logout', (req, res)=>{
    delete req.session.admin;
    res.redirect('/');
});


const moment = require('moment-timezone');

app.get('/try-moment', (req, res)=>{
const fm = 'YYYY-MM-DD HH:mm:ss';
const m1 = moment(new Date());
const m2 = moment('2021-04-15');

res.json({
    
    t1: m1.format(fm),
    //tz('Europe/London')曲的當地時間
    //format()格式化
    'london-mo2': m1.tz('Europe/London').format(fm),//夏日節約時間會影響
    t1a: m1.tz('Europe/London').format(fm),
    t2: m2.format(fm),
    
    });
});

app.get('/try-db', (req, res)=>{
    db.query('SELECT * FROM `address_book` LIMIT 5')
    //promise只會傳遞一個值 如果需要接多個值需要用陣列接住[r]
    .then(([r])=>{
        console.log(r);
    })
    //如果有錯誤要使用catch
    .catch(error=>{
        res.send(error)
    });
});


app.use('/address-book', require(__dirname + '/routes/address-book'));



// 404 放在所有的路由後面
app.use((req, res)=>{
    res.type('text/html');
    res.status(404).send('<h1>找不到頁面</h1>');
});


// 路由定義：結束

app.listen(port, ()=>{
    console.log(`server started: ${port}`);
});






