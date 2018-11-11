const express = require('express')
const router = express.Router()
const controller=require('../controller/index.js')


// 用户请求的 项目首页
router.get('/', controller.handleIndexGet);

module.exports = router