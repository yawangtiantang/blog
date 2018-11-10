const conn = require('../db/db.js')
const moment = require('moment')
const marked = require('marked')
module.exports = {
    handleArticleAddGet (req,res) {
        // 判断用户的登录状态处理登录拦截
        if(!req.session.isLogin) return res.redirect('/')
        res.render('./article/add.ejs',{
        user: req.session.user,
        isLogin: req.session.isLogin
        })
    },
    // 处理客户端发表文章的逻辑
    handleArticleAddPost(req, res) {
        if (!req.session.isLogin) return res.status(400).send({ status: 400, msg: '您的登录信息已失效, 请保存文章后重新登录' });
        const body = req.body
    
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        body.authorId = req.session.user.id
        // console.log(body)
        const insertSql = 'insert into articles set ?'
        conn.query(insertSql, body, (err, result) => {
          if (err) return res.status(500).send({ status: 500, msg: '文章发表失败,请重试!' })
        //   console.log(result)
        if(result.affectedRows!==1) return res.status(500).send({ status: 500, msg: '文章发表失败,请重试!' })
        res.send({ status: 200, msg: 'ok', insertId: result.insertId });
        })
      },
   
    handleArticleInfoGet (req,res) {
        // console.log(req.params)
       // 获取文章Id
  const id = req.params.id
  // 根据 Id 查询文章信息
  const sql = 'select * from articles where id=?'
  conn.query(sql, id, (err, result) => {
    if (err) return res.send({ msg: err.message, status: 500 })
    if (result.length !== 1) return res.redirect('/')
    // 在render之前要把markdown文本转换为html
    const html = marked(result[0].content)
    // console.log(html)
    result[0].content = html
    // 渲染详情页面
    res.render('./article/info.ejs', { user: req.session.user, isLogin: req.session.isLogin, article: result[0] })
  })
}
}


