var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.cookies.username) {
    res.render('index', {
      title: 'Express'
    });
  } else {
    res.redirect('/login.html');
  }

});

// router.get('/users.html', function (req, res) {


//   res.render('users');
// })
router.get('/brand.html', function (req, res) {
  res.render('brand');
})
router.get('/phone.html', function (req, res) {
  res.render('phone');
})
router.get('/login.html', function (req, res) {
  res.render('login');
})
router.get('/regist.html', function (req, res) {
  res.render('regist');
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


//渲染数据到页面上 
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db('nodeProject');
  dbo.collection("users").find({}).toArray(function (err, result) {
    if (err) {
      throw err;
    } else {
      router.get('/users.html', function (req, res) {
        res.render('users', {
          data: result
        })
      })
    }
    // console.log(result);
    db.close();
  })
})

module.exports = router;