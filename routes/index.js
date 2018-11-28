var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');

/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.cookies.username) {
    res.render('index', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isadmin: parseInt(req.cookies.isadmin) ? '(管理员)' : ' '
    });
  } else {
    res.redirect('/login.html');
  }

});

// router.get('/users.html', function (req, res) {


//   res.render('users');
// })
router.get('/brand.html', function (req, res) {
  if (req.cookies.username && parseInt(req.cookies.isadmin)) {
    res.render('brand', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isadmin: parseInt(req.cookies.isadmin) ? '(管理员)' : ' '
    });
  } else {
    res.redirect('/login.html');
  }
})
router.get('/phone.html', function (req, res) {
  if (req.cookies.username && parseInt(req.cookies.isadmin)) {
    res.render('phone', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isadmin: parseInt(req.cookies.isadmin) ? '(管理员)' : ' '
    });
  } else {
    res.redirect('/login.html');
  }
})
router.get('/login.html', function (req, res) {
  res.render('login');
})
router.get('/regist.html', function (req, res) {
  res.render('regist');
})

// 用户管理界面
router.get('/users.html', function (req, res) {
  if (req.cookies.username && parseInt(req.cookies.isadmin)) {
    let page = req.query.page || 1; //页码
    let pageSize = req.query.pageSize || 5; //每页显示条数
    usersModel.getUserList({
      page: page,
      pageSize: pageSize
    }, function (err, data) {
      if (err) {
        res.render('error', err);
      } else {

        res.render('users', {
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isadmin: parseInt(req.cookies.isadmin) ? '(管理员)' : '',
          userList: data.userList,
          totalpage: data.totalpage,
          page: data.page,
          currentPage: data.page,
          pageSize: data.pageSize
        });
      }
    })













  } else {
    res.redirect('/login.html');
  }
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";




module.exports = router;