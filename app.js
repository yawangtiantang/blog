const express = require('express')
const app = express()
const bodyParser =require('body-parser')

app.set('view engine','ejs')
app.set('views','./views')
// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use('/node_modules',express.static('./node_modules'))
// 用户请求的是首页
const router1 =require('./router/index.js')
app.use(router1)
// 用户请求的是用户页面
const router2 =require('./router/user.js')
app.use(router2)
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})
