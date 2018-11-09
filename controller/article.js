module.exports = {
    handleArticleAddGet (req,res) {
        // 判断用户的登录状态处理登录拦截
        if(!req.session.isLogin) return res.redirect('/')
        res.render('./article/add.ejs',{
        user: req.session.user,
        isLogin: req.session.isLogin
        })
    }
}