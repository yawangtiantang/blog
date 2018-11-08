const express = require('express')
const router = express.Router()
const controller=require('../controller/user.js')
// 用户请求的是注册页面
router.get('/register',controller.handleRegisterGet)
// 用户请求的是登录页面
router.get('/login',controller.handleLoginGet)
// 要注册新用户了
router.post('/register',controller.handleRegisterPost);


// 监听登录请求
router.post('/login',controller.handleLoginPost)

module.exports = router