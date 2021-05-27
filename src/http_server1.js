const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200,{
        //純文字為 text/plain
        'Content-Type' : 'text/html'
    });

    res.end(
        `<h2>Hola123</h2>
         <p>${req.url}</p>`
    );
    
});

server.listen(3000);