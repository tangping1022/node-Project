var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (req, res, next) {

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      // 链接数据库失败
      console.log('链接数据库失败', err);
      res.render('error', {
        message: '链接数据库失败',
        error: err
      });
      return;
    }
    var db = client.db('node-project');

    db.collection('user').find().toArray(function (err, data) {
      if (err) {
        console.log('查询用户数据失败', err);
        // 有错误，渲染 error.ejs
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else {
        console.log(data);
        res.render('users', {
          list: data
        });
      }
      // 记得关闭数据库的链接
      client.close();
    })
  });
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