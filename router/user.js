let pool=require('../pool.js');
let router=require('express').Router()
module.exports=router
// 登录接口
router.post('/login',(req,res,next)=>{
  let phone=req.body.phone;
  let upwd=req.body.upwd;
  console.log(phone,upwd)
  if(!phone){
    res.send({
      code:401,
      msg:'none-phone'
    });
    return
  }
  if(!upwd){
    res.send({
      code:402,
      msg:'none-upwd'
    })
    return
  }
  let sql='SELECT id,avatar,uname FROM wy_user WHERE phone=? AND upwd=?';
  pool.query(sql,[phone,upwd],(err,result)=>{
    console.log(sql)
    if(err){
      next(err)
      return
    }
    if(result.length>0){
      res.send({
        code:200,
        msg:'ok',
        userInfo:result[0]
      })
    }else{
      res.send({
        code:400,
        msg:'phone or upwd err'
      })
    }
  })
})
// 注册接口
router.post('/register',(req,res,next)=>{
  let phone=req.body.phone;
  let upwd=req.body.upwd;
  if(!phone){
    res.send({
      code:401,
      msg:'none-phone'
    });
    return
  };
  if(!upwd){
    res.send({
      code:402,
      msg:'none-upwd'
    });
    return
  };
  // 注册前先检查该号码是否已经注册
  let sql="SELECT phone FROM wy_user WHERE phone=? LIMIT 1";
  pool.query(sql,phone,(err,result)=>{
    if(err){
      next(err);
      return
    }
    if(result.length>0){
      res.send({
        code:201,
        msg:'phone exists'
      })
    }else{
      let sql='INSERT INTO wy_user(phone,upwd) VALUES(?,?)';
        console.log(phone,upwd);
        pool.query(sql,[phone,upwd],(err,result)=>{
        if(err){
          next(err);
          return
        }
        if(result.affectedRows!==0){
          res.send({
            code:200,
            uid:result.insertId
          })
        }
      })
    }
  })
})
// 检测手机号码是否已被注册过
router.get('/check_phone',(req,res,next)=>{
  let phone=req.query.phone;
  if(!phone){
    res.send({
      code:401,
      msg:"none-phone"
    })
    return
  };
  let sql="SELECT phone FROM wy_user WHERE phone=? LIMIT 1";
  pool.query(sql,phone,(err,result)=>{
    if(err){
      next(err);
      return
    }
    if(result.length>0){
      res.send({
        code:201,
        msg:'phone exists'
      })
    }else{
      res.send({
        code:200,
        msg:'phone ok'
      })
    }
  })
})