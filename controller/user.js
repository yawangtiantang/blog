const moment = require('moment')
const conn = require('../db/db.js')
// 导入加密模块
const bcrypt = require('bcrypt')
// 定义一个 幂次
const saltRounds = 10 // 2^10

module.exports = {
  handleRegisterGet(req, res) {

    res.render('./user/register.ejs', {})
  },

  handleLoginGet(req, res) {
    res.render('./user/login.ejs', {})
  },

  handleRegisterPost(req, res) {
    const user = req.body
    // 判断表单信息是否合法, 不合法返回错误状态码和信息
    if (user.username.trim().length === 0 ||
      user.password.trim().length === 0 ||
      user.nickname.trim().length === 0) return res.status(400).send({
      status: 400,
      msg: '请填写完整的表单信息!'
    });

    // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
    const querySql = 'select count(*) as count from users where username = ?'
    conn.query(querySql, user.username, (err, result) => {
      // result是一个数组  数组中有一个对象  对象中有一个属性叫 count [ { count: 0 } ]
      //   console.log(err)
      if (err) return res.status(500).send({
        status: 500,
        msg: '用户名查询失败!请重试!'
      })

      if (result[0].count != 0) return res.send({
        status: 402,
        msg: '用户名已存在!请重试!'
      })
      console.log(result.msg)
      // 给用户添加创建时间的属性
      user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
      // 在执行Sql语句之前，先对用户提供的密码，做一层加密，防止密码被泄露之后，明文被盗取的清空
    // bcrypt.hash('要被加密的密码', 循环的幂次, 回调函数)
    bcrypt.hash(user.password, saltRounds, (err,pwd) =>{
      if(err) return res.send({status:506,msg:'注册用户失败'})
      // 把加密之后的新密码，赋值给 body.password
      user.password = pwd
      // 执行注册的用户逻辑
      const addSql = 'insert into users set?'
      // console.log(user)
      conn.query(addSql, user, (err, result) => {
        if (err || result.affectedRows != 1) return res.status(500).send({
          status: 500,
          msg: '用户添加失败!请重试!'
        })
        res.send({
          status: 200,
          msg: '用户注册成功!'
        });
      })

    })

    })
      
  },

  handleLoginPost(req, res) {
    // const user = req.body
    // //    console.log(body)
    // // 查询执行sql语句
    // const sql = 'select * from users where username=? and password=?'
    // conn.query(sql, [user.username, user.password], (err, result) => {
    //   if (err) return res.send({
    //     status: 501,
    //     msg: '用户登录失败'
    //   })
    //   // console.log(result)
    //   if (result.length !== 1) return res.send({
    //     status: 502,
    //     msg: '用户登录失败'
    //   })
    //   // console.log(req.session)
    //   // console.log(result)
    //  // 登录成功后存储用户信息到session中
    //  req.session.user = result[0]
    //  // 存储登录状态
    //  req.session.isLogin = true
    // //  设置cookie的有效期
    // let hour = 1000*60*60*24*30
    // req.session.cookie.expires=new Date(Date.now()+hour)
    //   res.send({
    //     status: 200,
    //     msg: '登录成功'
    //   })
    // })


const user = req.body
    //    console.log(body)
    // 查询执行sql语句
    const sql = 'select * from users where username=? '
    conn.query(sql, [user.username], (err, result) => {
      if (err) return res.send({
        status: 501,
        msg: '用户登录失败'
      })
      // console.log(result)
      if (result.length !== 1) return res.send({
        status: 502,
        msg: '用户登录失败'
      })
      // 对比 密码的方法
    // bcrypt.compare('用户输入的密码', '数据库中记录的密码', 回调函数)
    bcrypt.compare(user.password,result[0].password,(err,compareResult)=>{
        if(err) return res.send({status:503,msg:'登录失败'})
        if(!compareResult) return res.send({ msg: '用户登录失败', status: 504 })
    })
      
      
      // console.log(req.session)
      // console.log(result)
     // 登录成功后存储用户信息到session中
     req.session.user = result[0]
     // 存储登录状态
     req.session.isLogin = true
    //  设置cookie的有效期
    let hour = 1000*60*60*24*30
    req.session.cookie.expires=new Date(Date.now()+hour)
      res.send({
        status: 200,
        msg: '登录成功'
      })
    })


  },
  handleLogoutGet(req, res) {
    req.session.destroy(err => { 
      
      res.redirect('/') 
    })
  }
  
}
