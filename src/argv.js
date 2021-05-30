// process.argv，這是一個陣列（Array 實例），索引 0 是 'node' 指令名稱，索引 1 是你的 .js 檔案路徑，如果有指定引數的話，這些引數會是從索引 2 開始儲存
console.log(process.argv);

//$ node process-args.js 参数1 参数2 参数3
//=>回傳為
//0: /usr/local/bin/node
//1: /Users/mjr/work/node/process-args.js
//2: 参数1
//3: 参数2
//4: 参数3


//補充：
//通常不太需要指令名稱與檔案路徑，因此，可以只擷取之後索引 1 之後的引數：
//var args = process.argv.slice(2);//擷取索引值2
//console.log('Hello, ' + args[0]);//此時陣列只剩下只剩下一個數，就是我們的引數