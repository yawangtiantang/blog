const express = require('express')
const app = express()
const bodyParser =require('body-parser')
const fs =require('fs')
const path=require('path')
// 导入session中间件
const session = require('express-session')
app.set('view engine','ejs')
app.set('views','./views')
// 注册session中间件
app.use(session({
  secret:'这是一个加密的密钥',
  resave:false,
  saveUninitialized:false

}))
// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use('/node_modules',express.static('./node_modules'))
// 注册路由模块
// const router1 =require('./router/index.js')
// app.use(router1)

// const router2 =require('./router/user.js')
// app.use(router2)

// 使用 循环的方式，进行路由的自动注册
fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
    if (err) return console.log('读取 router 目录中的路由失败！')
    // 循环router目录下的每一个文件名
    filenames.forEach(fname => {
      // 每循环一次，拼接出一个完整的路由模块地址
      // 然后，使用 require 导入这个路由模块
      const router = require(path.join(__dirname, './router', fname))
      app.use(router)
    })
  })
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})
