//node裡的require 呼叫出f1是not define因為沒有宣告f1
// require(__dirname + '/func01.js');
// console.log(f1(9));

const f2 = require(__dirname + '/func01.js');
//__dirname檔案的路徑
console.log(__dirname);
console.log(f2(9));

