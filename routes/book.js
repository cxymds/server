var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	//验证令牌是否过期
	if(req.user.exp<Math.ceil(new Date().getTime()/1000)){
		res.end(JSON.stringify({
			code: -3008,
			errMsg:'登录已过期'
		}))
		return false;
	}

	//处理业务逻辑 返回booklist
	req.getConnection((err,conn)=>{
		if(err){
			res.end();
			return false;
		}

		const sql = `select * from books`;
		conn.query(sql,(err,data)=>{
			if(err){
				res.end();
			}
			console.log(data)
			res.end(JSON.stringify(data))
		});
	})

});

module.exports = router;
