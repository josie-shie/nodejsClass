const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../modules/mysql2-connect');
const upload = require(__dirname + '/../modules/upload-img');

const router = express.Router();

//router.get('/list', async (req, res)=>{
let getListData = async (req)=>{

    let output = {
        success: false,
        error:'', 
        totalRows:0,
        totalPages:0,
        page:0,
        row:[],
    };

    let page = req.query.page || 1;
    page = parseInt(page);//parseInt強制轉換為整數

    //COUNT(1) num -> 指定count出來的總資料束的欄位為num 也可以自己建立名稱
    let t_sql = "SELECT COUNT(1) num FROM `address_book` ";
    let [r1] = await db.query(t_sql);
    //console.log(r1);
    const perPage = 5; // 每頁要呈現幾筆資料
    const totalRows = r1[0].num; // 資料表的總筆數

    const totalPages = Math.ceil(totalRows/perPage); // 總共有幾頁

    let rows = []; // 某分頁的資料預設為空的
    if(totalRows > 0) {
        //判斷頁數是否正確 如果不合理套入預設值
        if(page < 1){
            //req的fun裡面放output 不會有res的fun
            output.error = 'page值太小';
            return output;
        
        }else if(page > totalPages){
            
            output.error = 'page值太小大';
            return output;
        //頁碼在合理範圍才讀取資料庫
        }else{

            const sql = `SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`;

            //將資料庫的生日格式轉為format(要轉換的格式)
            [rows] = await db.query(sql);
            rows.forEach(el=>{
                el.birthday = moment(el.birthday).format('YYYY-MM-DD')
            });
        }
    }
    if(! output.error){
        output = {
            success: true,
            error: null,
            totalRows,
            totalPages,
            page,
            rows,
        };
    }
    return output;
};

//創造模組的路由

router.get('/list', async (req, res)=>{
    const output = await getListData(req);

    if(output.error){
        return res.redirect(req.baseUrl + req.url.split('?')[0]);
    }
    res.render('address-book/list',output);
});

router.get('/list2', (req, res)=>{
    res.render('address-book/list2');
});

//將取得資料方式模組化 這樣可以許多程式套用同一個取資料的模組
 router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req));
})

router.get('/add', async (req, res)=>{
    res.render('address-book/add2');
});

//新增資料
/*較繁複的寫法
router.post('/add', async (req, res)=>{
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

    const [results] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday,
        req.body.address,
    ]);

    res.json({
        body: req.body,
        results
    });
});
 */

//叫簡約的寫法
//將data設置物件帶入 
//因為是將data展開 所以切記欄位名稱樣對應到
//如果送的是multipart from data 要用upload.none()阻止上傳檔案 但是要解析body
router.post('/add', upload.none() ,async (req, res)=>{
    // TODO: 輸入的資料檢查

    let output = {
        success: false,
        error: '',
        insertId: 0
    };

    //將req.body展開
    const data = {
        ...req.body,
        created_at: new Date()
    }
    //PHP不能有一個問號帶入陣列的寫法
    const sql = "INSERT INTO `address_book` SET ?";
    //解構[result]並賦予它值（資料庫撈出來的資料）
    const [results] = await db.query(sql, [ data ]);

    if(results.affectedRows===1){
        output.success = true;
        output.insertId = results.insertId;
    } else {
        output.error = '資料新增失敗';
    }

    output = {...output, body: req.body};
    res.json(output);
});

//刪除
router.get('/del/:sid', async (req, res)=>{
    // 測試查看 Referer
    // return res.json([req.get('Referer'), req.headers]); 

    const sql = "DELETE FROM `address_book` WHERE sid=?";
    //req.params.sid req路徑裡的sid
    await db.query(sql, [req.params.sid]);

    if(req.get('Referer')){
        res.redirect( req.get('Referer') ); //如果擋頭有從哪一頁過來的連結就跳回那一頁
    } else {
        res.redirect('/address-book/list');//沒有就回第一頁
    }
});

//修改

router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.sid]);
    console.log(rs);

    // 如果沒有找到資料就轉向到列表頁
    if(! rs.length){
        return res.redirect('/address-book/list');
    }
    //將生日轉換為format的格式
    rs[0].birthday = moment(rs[0].birthday).format('YYYY-MM-DD')
    res.render('address-book/edit', rs[0]);
});


router.post('/edit/:sid', upload.none(), async (req, res)=>{
    let output = {
        success: false,
        type: 'danger',
        error: '',
        results: {},
    };
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    const [results] = await db.query(sql, [req.body, req.params.sid]);
    console.log(results);
    output.results = results;
    if(results.affectedRows && results.changedRows){
        output.success = true;
        output.type = 'success';
    } else if(results.affectedRows){
        output.error = '資料沒有修改';
        output.type = 'warning';
    } else {
        output.error = '資料修改發生錯誤';
    }
    res.json(output);
});




router.get('/escape', async (req, res)=>{
    const str = "ab'c";
    res.send(db.escape(str)); // 做單引號跳脫，同時用單引號包裹
});

module.exports = router;
        


//res.json({totalRows, totalPages, page, rows});
//
//res.render('address-book/list',{totalRows, totalPages, page, rows});
    




// const express = require('express');
// const db = require(__dirname + '/../modules/mysql2-connect');

// const router = express.Router();

// router.get('/list', async (req, res)=>{
    
//     //如果沒有頁數停在第一頁
//     //強制將頁數轉為整數 如給沒有就是第一頁
//     let page = req.query.page || 1;
//     page = parseInt(page) || 1;//強制轉成數字
    
//     //
//     const t_sql = "SELECT COUNT(2) num FROM `address_book` ";
//     let [r1] = await db.query(t_sql);//解構附值//將r1以陣列的放式蒐集
//     perPage = 5;// 每頁有幾筆
//     const totaleRows = r1[0].num;  //資料表總比數

//     const totalePages = Math.ceil(totaleRows/perPage);

//     let rows = [];//某分頁的資料預設為空陣列
//     if (totaleRows > 0){
//         if(page < 0){
//             //因為不會有頁數小於1需要使用return直接讓程式停止
//             //redirect('?page=1')-> 保持原來的路徑
//             //redirect('/page=1')-> 跳轉至其他頁
//             //redirect('http://page=1')-> 跳轉至其他網頁
//             return res.redirect('?page=1');
//         }
//         if(page > totalePages){
//             return res.redirect('?pag=' + totalePages);
//         }
//         const sql = `SELECT * FROM address_book LIMT ${(page-1)*perPage},${perPage}`;

//         [row] =await db.query(sql);

//     }


//     res.json({totaleRows,totalePages,page,rows});//
     
// });

// module.exports = router;