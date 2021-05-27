var express = require('express');
var router = express.Router();
const {md5} = require('../tools/crypto.js')
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', function(req, res, next) {
    const passwd = req.body.pass
    var ps = md5(passwd) ;

    req.getConnection((err,conn)=>{
        if(err){
            res.end(JSON.stringify({
                "errCode":"-3002",
                "errMsg":"服务器出错了"
            }))
            return false
        }
        const sql = `select id from vue_user where name='${req.body.name}' and pass='${ps}' and status!=3`;
        console.log(sql)
        conn.query(sql,(err,data)=>{
            if(err){
                return next(err);
              }
              console.log(data)
            if(data!=false){
                const token = 'Bearer ' + jwt.sign({
                    _id: data[0].id,
                  },
                  'adhuiahsdjlj',
                  {
                    expiresIn: 3600 * 24 * 3
                  });
               res.end(JSON.stringify({
                   msg:'登录成功',
                   token: token,
                   code:200
               })) 
            }else{
                res.end(JSON.stringify({
                    msg:'用户名或者密码错误',
                    code:400
                })) 
            }
                //d19e7565e03bad210c91673b731cb0e6
                //cb03ee1e399366bf6572e0b9478064b4
        })
    })
   



});

module.exports = router;
