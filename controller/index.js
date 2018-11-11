const conn = require('../db/db.js')

module.exports = {

  //展示首页
  handleIndexGet(req, res) {
    const pageSize = 3
   let nowPage = req.query.page || 1
    const sql =`select articles.title,articles.ctime,articles.id,users.nickname from articles LEFT JOIN users ON articles.authorId=users.id order by articles.id desc;select count(*) as count from articles`

    conn.query(sql,(err,result) =>{
      console.log(result)
      if(err) return res.render('index.ejs',{ user:req.session.user,
        isLogin:req.session.isLogin,articles:[]})
        // 总页数
        const totalPage=Math.ceil(result[1][0].count/pageSize)
        res.render('index.ejs',{
          user:req.session.user,
          isLogin:req.session.isLogin,
          articles:result[0],
          totalPage:totalPage,
          nowPage:nowPage
        })
    })
    
 }
}