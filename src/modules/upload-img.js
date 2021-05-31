const multer = require('multer');
const {v4: uuidv4} = require('uuid');//讓檔案產生隨機的編碼
const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/Web': '.wep',
};
const storage =multer.diskStorage({
    //儲存的位置
    destination:(req,fle,cb)=>{
        //沒有錯誤所以第一個是空值?
        cb(null,__dirname + '/../../public/img')
    },
    //儲存的檔名
    filename:()=>(req,fle,cb)=>{
        let ext = extMap[file.mimetype];
        cb(null,uuid4() + ext);
    },
});

const fileFilter =(req,file,cb)=>{
    cb(null,!!extMap[file.mimetype]);
}
const fs = require('fs');