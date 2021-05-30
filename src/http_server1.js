//載入 Node.js 原生模組 http
const http = require('http');

// 2 - 建立server
const server = http.createServer((req, res) => {
    // 在此處理 客戶端向 http server 發送過來的 req。
    //用writeHead() 的方法設定response header
    res.writeHead(200,{
        //純文字為 text/plain
        'Content-Type' : 'text/html'
        //res.write 寫入response body
        //res.write('<html><body>This is student Page.</body></html>');
    });

    //在end裡寫入也是其中的方法
    //<p>${req.url}</p>`為<p>中帶入req的url
    res.end(
        `<h2>Hola123</h2>
        <p>${req.url}</p>`
    );
    
});

//3 - 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
server.listen(3000);