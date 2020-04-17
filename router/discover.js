let pool=require('../pool.js');
let router=require('express').Router()
module.exports=router
// 获取轮播图图片/discover/carousel
router.get('/carousel',(req,res,next)=>{
  let sql='SELECT cid,cimg FROM wy_discover_carousel LIMIT 8';
  pool.query(sql,(err,result)=>{
    if(err){
      next(err)
      return
    }
    console.log(result);
    res.send(result)
  })
})
// 获取热门推荐/discover/rementuijian 
router.get('/rementuijian',(req,res,next)=>{
  let sql='SELECT reid,reimg,retitle,recount FROM wy_discover_rementuijian LIMIT 8';
  pool.query(sql,(err,result)=>{
    if(err){
      next(err)
      return
    }
    res.send(result)
  })
})
//获取新碟上架/discover/newmusic
router.get('/newmusic',(req,res,next)=>{
  let sql='SELECT newimg,newtitle,newman FROM wy_discover_newmusic';
  pool.query(sql,(err,result)=>{
    if(err){
      next(err);
      return
    }
    res.send(result)
  })
})
// 获取榜单/discover/榜单
router.get('/bangdan',(req,res,next)=>{
  let data={
    biaosheng:{},
    newmusic:{},
    yuanchuang:{}
  };
  //es6:Promise.all([...]).then(()=>{res.send(...)})
  // es7
  (async function(){
    // 事件一:查询飙升榜
    let p1=new Promise((resolve,reject)=>{
      let sql="SELECT bid,bmusicname,bmusictime,bmusicman,bmusicurl,bmusicimg,bdname,bdimg,bdtime,bdlei FROM wy_bangdan,wy_bangdan_img WHERE bdlei='biaosheng' AND bmusicclass=bdlei LIMIT 10";
      pool.query(sql,(err,result)=>{
        if(err){
          next(err);
          return
        }
        if(result.length>0){
          data.biaosheng.list=result;
          data.biaosheng.title='云音乐飙升榜';
          data.biaosheng.mclass='biaosheng';
          resolve();
        }
      })
    });
    // 事件二:查询新歌榜
    let p2=new Promise((resolve,reject)=>{
      let sql="SELECT bid,bmusicname,bmusictime,bmusicman,bmusicurl,bmusicimg,bdname,bdimg,bdtime,bdlei FROM wy_bangdan,wy_bangdan_img WHERE bdlei='newmusic' AND bmusicclass=bdlei LIMIT 10";
      pool.query(sql,(err,result)=>{
        if(err){
          next(err);
          return
        }
        if(result.length>0){
          data.newmusic.list=result;
          data.newmusic.title='云音乐新歌榜';
          data.newmusic.mclass='newmusic';
          resolve();
        }
      })
    })
    // 事件三:查询原创榜
    let p3=new Promise((resolve,reject)=>{
      let sql="SELECT bid,bmusicname,bmusictime,bmusicman,bmusicurl,bmusicimg,bdname,bdimg,bdtime,bdlei FROM wy_bangdan,wy_bangdan_img WHERE bdlei='yuanchuang' AND bmusicclass=bdlei LIMIT 10";
      pool.query(sql,(err,result)=>{
        if(err){
          next(err);
          return
        }
        if(result.length>0){
          data.yuanchuang.list=result;
          data.yuanchuang.title='网易云原创歌曲榜';
          data.yuanchuang.mclass='yuanchuang';
          resolve();
        }
      })
    })
    await Promise.all([p1,p2,p3])//.then(()=>{
      res.send(data)
    //})
  })()
})
// 获取歌曲列表/discover/...
router.get('/list',(req,res,next)=>{
  let data={};
  let lei=req.query.lei;
  if(!lei){
    lei='biaosheng'
  }
  Promise.all([
  new Promise((resolve,reject)=>{
    let sql="SELECT bid,bmusicname,bmusictime,bmusicman,bmusicurl,bmusicimg FROM wy_bangdan WHERE bmusicclass=? LIMIT 20";
    pool.query(sql,lei,(err,result)=>{
      if(err){
        next(err);
        return
      };
      data.data=result;
      data.title=lei;
      resolve()
    })
  }),
  new Promise((resolve,reject)=>{
    let sql="SELECT bdname,bdimg,bdtime,bdlei FROM wy_bangdan_img WHERE bdlei=? LIMIT 1";
    pool.query(sql,lei,(err,result)=>{
      if(err){
        next(err);
        return
      };
      data.head=result;
      resolve()
    })
  })]).then(()=>{
    console.log(data.head)
    res.send(data)
  })
})
// 获取全球音乐列表/discover/quan
router.get('/quan',(req,res,next)=>{
  let sql="SELECT timg,ttitle,status FROM wy_toplist LIMIT 15";
  pool.query(sql,(err,result)=>{
    if(err){
      next(err);
      return
    };
    if(result.length>0){
      res.send(result)
    }
  })
})
// 获取已加入的音乐/discover/joinman
router.get('/joinman',(req,res,next)=>{
  let sql="SELECT jname,jimg,jmiaosu FROM wy_joinman LIMIT 5";
  pool.query(sql,(err,result)=>{
    if(err){
      next(err);
      return
    }
    if(result.length>0){
      res.send(result)
    }
  })
})
// 获取热门主播/discover/hotman
router.get('/hotman',(req,res,next)=>{
  let sql="SELECT hname,himg,hmiaosu FROM wy_hotman LIMIT5";
  pool.query(sql,(err,result)=>{
    if(err){
      next(err);
      return
    }
    if(result.length>0){
      res.send(result)
    }
  })
})
//获取特色榜单
router.get('/tese',(req,res,next)=>{
  let sql="SELECT bid,bmusicname,bmusictime,bmusicman,bmusicurl,bmusicimg,bdname,bdimg,bdtime,bdlei FROM wy_bangdan,wy_bangdan_img WHERE bmusicclass=bdlei LIMIT 10";
  pool.query(sql,(err,result)=>{
    if(err){
      next(err);
      return
    }
    res.send(result)
  })
})