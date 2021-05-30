//使用 dotenv 套件

//[1]為了不在程式碼的各處加入新的環境變數，而想要集中在 .env 檔中管理它，所以有大神寫了 dotenv [
//[2] 可以在程式一開始就載入所有的環境變數。
//[3]也可以避免在不同的應用程式之間，使用了共用的環境變數。(因為是用 .env 檔載入在該專案中)

require('dotenv').config();
const {MY_USER,MY_DBNAME} = process.env;
console.log({MY_USER,MY_DBNAME});


//.env裡面不能有註解 也不需要用“”