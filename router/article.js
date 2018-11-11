const express = require('express')
const router = express.Router()
const controller = require('../controller/article.js')
router.get('/article/add',controller.handleArticleAddGet)
// 监听客户端发表文章的请求
router.post('/article/add',controller.handleArticleAddPost)
// 监听客户端查看文章详情的请求
router.get('/article/info/:id',controller.handleArticleInfoGet)
// 监听客户端编辑文章的请求
router.get('/article/edit/:id',controller.handleArticleEditGet)
// 监听客户端保存文章的请求
router.post('/article/edit',controller.handleArticleEditPost)
module.exports = router