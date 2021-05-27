const http = require('http');
const fs = require('fs');

const server = http.createServer(async(req, res)=>{

    await fs.promises.writeFile(
        //
        __dirname + '/headers01.txt',
        JSON.stringify(req.headers),
        error => {
            if(error){
                res.end(error);
            } else {
                res.end('ok');
            }

        }
    );
    fs.readFile(__dirname + '/data01.html',(error,data)=>{

    });

});

server.listen(3000); // port number 埠號





