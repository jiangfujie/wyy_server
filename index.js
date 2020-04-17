const express=require('express')
let app=express();
app.listen(9090);
console.log('服务器启动')

// 请求主体的处理中间件
let bodyParser=require('body-parser');
app.use(bodyParser.json())


// cors跨域中间件
let cors=require('cors')
app.use(cors({
  origin:['htto://127.0.0.1:8080','http://localhost:8080'],
  credentials:true
}))

// 服务器端session处理中间件
let session=require('express-session');
app.use(session({
  secret:'128位安全字符串',
  saveUninitialized:true,
  resave:true   //是否重新保存session数据
}))

// 托管静态资源目录public
app.use(express.static('public'))

// 处理所有以/user开头的路由器
let userRouter=require('./router/user.js')
app.use('/user',userRouter)

// 处理所有以/discover开头的请求
let discoverRouter=require('./router/discover.js')
app.use('/discover',discoverRouter)











// 请求处理完成后的后置中间件
app.use((err,req,res,next)=>{
  res.status(500);
  res.send({
    code:500,
    msg:'err houzhizhongjianjian',
    err:err
  })
})





