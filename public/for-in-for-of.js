let arr = ['a','b','c','d',{'e':'e_value','f':'f_value'}];

for(let index in arr){
    console.log(index);
}
// 0,1,2,3,4
//---------------------------------------------------
//若想要用for in 取value，也是可以
for(let index in arr){
    console.log(arr[index]);
}
//a,b,c,d,{'e':'e_value','f':'f_value'}
//---------------------------------------------------
//for in 會遍歷自定義屬性
arr.name='myArray';
for(let index in arr){
    console.log(index);
}
// 0,1,2,3,4,name
//若寫console.log(arr[index])，自定義的name則會印出其內容'myArray'
//---------------------------------------------------
//但用for of，則可以寫的更優雅。且不會遍歷自定義屬性
//自定義屬性為不為index的值 
for(let value of arr){
    console.log(value);
}
//a,b,c,d,{'e':'e_value','f':'f_value'}