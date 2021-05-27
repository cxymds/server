var express = require('express');
var router = express.Router();
var config = require('../config/config')
var axios = require('axios');
var moment = require('moment');
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //错误处理
  if(req.query.code==undefined || req.query.code==''){
  	res.end(JSON.stringify({
  		'errCode':"-3001",
  		'errMsg':"请传递code"
  	}));
    return false;
  }	
  //获取openid的接口
  let url = config.WeiXin_Login_API + `appid=${config.Mini_Info.appId}&secret=${config.Mini_Info.secret}&js_code=${req.query.code}&grant_type=authorization_code` 
  //向微信公开接口发送请求
  axios.get(url).then((e)=>{
    if(!e.data.openid || !e.data.session_key){
      //处理微信没有返回openid或者session_key
      if(err){
        res.end(JSON.stringify({
          "errCode":"-3006",
          "errMsg":"服务器对接出错了"
        }))
        return false
      }
    }
    //处理参数缺失的问题
    if(!req.query.username || !req.query.gender || !req.query.province || !req.query.userfaceImage){
       res.end(JSON.stringify({
        "errCode":"-3005",
        "errMsg":"传递的参数有误"
      }))
      return false
    }

  	//数据库注册用户
  	req.getConnection((err,conn)=>{
  		//处理数据库连接失败
      if(err){
  			res.end(JSON.stringify({
  				"errCode":"-3002",
  				"errMsg":"服务器出错了"
  			}))
        return false
  		}

      //检测是否存在该用户
      let sql = 'select id from users where uid=\''+e.data.openid+'\'';
      conn.query(sql,(err,data)=>{
        if(err){
          res.end(JSON.stringify({
            "errCode":"-3009",
            "errMsg":"服务器出错了"
          }))
          return false;
        }
  
        if(data.length==0){
          var newsql = `insert into users(uid,uname,ugender,uaddress,ubanlance,uavatar,token,sessionkey,create_time,update_time) 
          values('${e.data.openid}','${req.query.username}',${req.query.gender},'${req.query.province}',100,'${req.query.userfaceImage}','asbdjbashjdhas','${e.data.session_key}','${moment().format('YYYY-MM-DD HH:mm:ss')}','${moment().format('YYYY-MM-DD HH:mm:ss')}')`;
        }else{
          //准备sql
          var newsql = `update users set update_time='${moment().format('YYYY-MM-DD HH:mm:ss')}' where uid='`+e.data.openid+'\''
        } 

        conn.query(newsql,(err,data)=>{
          if(err){
            res.end(JSON.stringify({
              "errCode":"-3003",
              "errMsg":"服务器出错了"
            }))
            return false;
          }
          const token = 'Bearer ' + jwt.sign({
              _id: e.data.openid,
            },
            config.SCRET_KEY,
            {
              expiresIn: 3600 * 24 * 3
            });
          res.end(JSON.stringify({
              "code":"200",
              "token":token
            }))
        });
        
      })
  	});
  }).catch(err=>{
  		var data ={"code":-1,msg:"获取微信授权失败"}
  		res.end(JSON.stringify(data))
  })
});

module.exports = router;
