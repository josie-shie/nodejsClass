const http = require('http');
const fs = require('fs');

//
const server = http.createServer(async (req, res)=>{
    //try catch去抓取錯誤
    //await讓程式碼能夠依照順序執行 await只能接promise物件
    //promises是防止程式碼形成callback hell，使用用than去接值 再繼續執行下個function
    try{
        await fs.promises.writeFile(__dirname + '/headers02.txt', JSON.stringify(req.headers) );
        res.end('ok !');
    } catch(ex){
        res.end('error: ' + ex);
    }
});

server.listen(3000); // port number 埠號





