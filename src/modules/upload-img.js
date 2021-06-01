const multer = require('multer');
const {v4: uuidv4} = require('uuid');//讓檔案產生隨機的編碼
//過濾不是這些檔案類型的檔案
const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
};


//multer自定义存储的方式(diskStorage/filename)，让开发者设定存储路径和命名
const storage = multer.diskStorage({
    //儲存的位置
    destination:(req,fle,cb)=>{
        console.log(123);
        //如果有錯誤資訊 要放在第一個參數
        //不建議放錯誤資訊 因為要catchError
        cb(null,__dirname + '/../../public/img')
    },
    //儲存的檔名
    filename:()=>(req,fle,cb)=>{
        let ext = extMap[file.mimetype];
        //生成獨一無二的128位元識別碼
        cb(null,uuid4() + ext);
    },
});

const fileFilter =(req,file,cb) => {
    cb(null,!!extMap[file.mimetype]);
};

//multer匯出當初透過建立的upload物件
module.exports = multer({storage, fileFilter});