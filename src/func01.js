const
f1 = a=> a*a;
console.log(f1(9));

//需要匯出程式 另一個程式碼才能吃到
module.exports = f1;