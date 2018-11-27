var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册处理
router.post('/regist', function (req, res) {
  usersModel.add(req.body, function (err) {
    if (err) {
      res.send('werror', err);
    } else {
      res.redirect('/login.html');
    }
  })
})

//登录处理
router.post('/login', function (req, res) {
  usersModel.login(req.body, function (err, data) {
    if (err) {
      res.render('werror', err);
    } else {
      res.cookie('username', data.username, {
        maxAge: 1000 * 60 * 1000
      });
      res.cookie('nickname', data.nickname, {
        maxAge: 1000 * 60 * 1000
      })
      res.cookie('isadmin', data.isadmin, {
        maxAge: 1000 * 60 * 1000
      })
      res.redirect('/');
    }
  })
})


//退出登录
router.get('/logout', function (req, res) {
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isadmin');
  res.redirect('/login.html');
})
module.exports = router;