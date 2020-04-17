let mysql=require('mysql');
module.exports=mysql.createPool({
  port:'3306',
  host:'127.0.0.1',
  user:'root',
  password:'',
  database:'wangyiyun',
  connectionLimit:10
})