c
const moment = require('moment')
const conn = require('../db/db.js')
module.exports={
handleRegisterGet(req,res) {
    
    res.render('./user/register.ejs',{})
  },

  handleLoginGet(req,res) {
    res.render('./user/login.ejs',{})
  },

  handleRegisterPost(req,res){
    const user = req.body
    // 判断表单信息是否合法, 不合法返回错误状态码和信息
  if (user.username.trim().length === 0 ||
  user.password.trim().length === 0 ||
  user.nickname.trim().length === 0) return res.status(400).send({ status: 400, msg: '请填写完整的表单信息!' });
  
  // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
  const querySql = 'select count(*) as count from users where username = ?'
  conn.query(querySql, user.username, (err, result) => {
  // result是一个数组  数组中有一个对象  对象中有一个属性叫 count [ { count: 0 } ]
  //   console.log(err)
  if (err) return res.status(500).send({ status: 500, msg: '用户名查询失败!请重试!' })
   
  if (result[0].count != 0) return res.send({ status: 402, msg: '用户名已存在!请重试!' })
  console.log(result.msg)
  // 给用户添加创建时间的属性
  user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
  // 执行注册的用户逻辑
  const addSql ='insert into users set?'
  console.log(user)
  conn.query(addSql, user, (err, result) => {
      if (err || result.affectedRows != 1) return res.status(500).send({ status: 500, msg: '用户添加失败!请重试!' })
      res.send({ status: 200, msg: '用户注册成功!' });
    })
  
  })
  
  },

  handleLoginPost(req,res){
    const body =req.body
  //    console.log(body)
  // 查询执行sql语句
  const sql = 'select * from users where username=? and password=?'
  conn.query(sql,[body.username,body.password],(err,result) =>{
    if(err) return res.send({status:501,msg:'用户登录失败'})
    // console.log(result)
    if(result.length!==1) return res.send({status:502,msg:'用户登录失败'})
    res.send({status:200,msg:'登录成功'})
  })
  
  }
}