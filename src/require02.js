
const Person = require(__dirname + '/Person.js');
//__dirname檔案的路徑

const p2 = new Person('Andy',25);
console.log(p2);
console.log('' + p2);
console.log(JSON.stringify(p2));

