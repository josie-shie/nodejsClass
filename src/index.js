require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
//路由設定：開始
//先定義的優先 如果404放在根目錄之前 也會先跑404



const app = express();

//註冊樣板引勤
//set跟路由沒有關係 必須放在所有路由的前面
app.set('view engine','ejs');
// 設定views路徑(選擇性設定)
// app.set('views', __dirname + '/../views');


//指定不會變動的html跟css檔案的資料夾為根目錄
//方法一
//app.use(express.static('public'))
//方法二 叫正規的寫法 但是要注意路徑
app.use(express.static(__dirname + '/../public'));
//用get的方法發用的請求
//路徑及方法都要符合 才會跑這裡
app.get('/',(req, res) => {
    //res.send('Hello IM GET');
    //指定樣板不需給付副名 也不需要路徑
    //這裡name的變數 會給home.ejs的name
    res.render('home',{name:'Josie'});
});

app.get('/form01.html',(req, res) => {
    res.send('IM POST');
});

app.get('/json-test',(req, res) => {
    const d = require(__dirname + '/../data/sales.json');
    //res.json(d);
    res.render('json-text', {sales: d});
});

app.get('/try-qs',(req, res) => {
    //在網址類加入的東西會帶入陣列中
    //從問號後開始localhost:3001/try-qs?a=1&b=2
    res.json(req.query);
});

//use可以接受所有的方法 
app.use((req, res) => {
    res.type('text/html')
    res.status(404).send('<h1>Page not found</h1>')
})
//路由設定：結束
app.listen(process.env.PORT,()=>{
    console.log(`server start:${port}`);
});