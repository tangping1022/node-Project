var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: 'C:tmp'
})
var fs = require('fs');
var path = require('path');
var usersModel = require('../model/usersModel.js');

router.get('/', function (req, res, next) {});

//注册处理
router.post('/regist', function (req, res) {
  usersModel.add(req.body, function (err) {
    if (err) {
      res.send('error', err);
    } else {
      res.redirect('/login.html');
    }
  })
});

//登录处理
router.post('/login', function (req, res) {
  usersModel.login(req.body, function (err, data) {
    if (err) {
      res.render('error', err);
    } else {
      res.cookie('username', data.username, {
        maxAge: 1000 * 60 * 10
      });
      res.cookie('nickname', data.nickname, {
        maxAge: 1000 * 60 * 10
      })
      res.cookie('isadmin', data.isadmin, {
        maxAge: 1000 * 60 * 10
      })
      res.redirect('/');
    }
  })
});

// 删除用户操作
router.get('/delete', function (req, res) {
  var id = parseInt(req.query.id);
  usersModel.userDelete({
    id: id
  }, function (err) {
    if (err) {
      res.send('error', err);
    } else {
      res.redirect('/users.html');
    }
  })
})

//模糊查询
router.get('/seach', function (req, res) {
  var name = req.query.name;
  var filter = new RegExp(name);
  let page = req.query.page || 1; //页码
  let pageSize = req.query.pageSize || 5; //每页显示条数
  usersModel.getUserSeach({
    nickname: filter,
    page: page,
    pageSize: pageSize
  }, function (err, data) {

    if (err) {
      res.render('error', {
        msg: '链接失败',
        error: err
      })

    } else {
      res.json({
        code: data.code,
        userList: data.userList,
        totalpage: data.totalpage,
        page: data.page,
        currentPage: data.page,
        pageSize: data.pageSize


      })
    }

  })

})
//获取手机页面select下拉列表
router.get('/getSelect', function (req, res) {
  usersModel.getSelectList(function (err, data) {

    if (err) {
      res.render('error', {
        msg: '链接失败',
        error: err
      })

    } else {
      res.json({
        // code: data.code,
        list: data.brandList

      })
    }
  })
})
//新增手机
router.post('/addPhone', upload.single('file'), function (req, res) {
  var phoneName = req.body.phoneName; //手机名称
  var brand = req.body.brand; //手机品牌

  var guided = req.body.guided; //官方价
  var price = req.body.price; //回收价

  if (phoneName == "") {
    res.render('error', {
      msg: '名称不能为空'
    })
  } else if (guided == "") {
    res.render('error', {
      msg: '官方价不能为空'
    })
  } else if (price == "") {
    res.render('error', {
      msg: '回收价不能为空'
    })
  } else {
    var filename = 'phoneImg/' + new Date().getTime() + "_" + req.file.originalname;
    var newFileName = path.resolve(__dirname, '../public/', filename);
    try {
      // fs.renameSync(req.file.path, newFileName);
      var data = fs.readFileSync(req.file.path);
      fs.writeFileSync(newFileName, data);

      usersModel.phoneAdd({
        phoneName: phoneName,
        brand: brand,
        guided: guided,
        price: price,
        filename: filename
      }, function (err) {
        if (err) {
          res.send('error', err);
        } else {
          res.redirect('/phone.html');
        }
      })
    } catch (error) {
      res.render('error', {
        msg: '新增失败'
      })
    }
  }
})

//修改手机
router.post('/UpdatePhone', upload.single('file'), function (req, res) {
  var id = req.body.id;
  var phoneName = req.body.phoneName;
  var brand = req.body.brand;
  var guided = req.body.guided;
  var price = req.body.price;

  if (phoneName == "") {
    res.render('error', {
      msg: '名称不能为空'
    })
  } else if (guided == "") {
    res.render('error', {
      msg: '官方价不能为空'
    })
  } else if (price == "") {
    res.render('error', {
      msg: '回收价不能为空'
    })
  } else {
    if (req.file == undefined) {
      try {
        // var data = fs.readFileSync(req.file.path);
        // fs.writeFileSync(newFileName, data);

        usersModel.phoneUpdate({
          id: id,
          phoneName: phoneName,
          brand: brand,
          guided: guided,
          price: price,
          // filename: filename
        }, function (err) {
          if (err) {
            res.send('error', err);
          } else {
            res.redirect('/phone.html');
          }
        })
      } catch (error) {
        res.render('error', error);
      }
    } else {
      var filename = 'phoneImg/' + new Date().getTime() + "_" + req.file.originalname;
      var newFileName = path.resolve(__dirname, '../public/', filename);
      try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFileName, data);

        usersModel.phoneUpdate({
          id: id,
          phoneName: phoneName,
          brand: brand,
          guided: guided,
          price: price,
          filename: filename
        }, function (err) {
          if (err) {
            res.send('error', err);
          } else {
            res.redirect('/phone.html');
          }
        })
      } catch (error) {
        res.render('error', error);
      }
    }
  }
})

//删除手机
router.get("/phoneDel", function (req, res) {
  // console.log(req.query.id)
  var id = req.query.id;
  // console.log(id)
  usersModel.phoneDelete({
    id: id
  }, function (err) {
    if (err) {
      res.send('error', err);
    } else {
      res.redirect('/phone.html');
    }
  })
})



//新增品牌
router.post("/addBrand", upload.single('file'), function (req, res) {

  var brandName = req.body.brandName; //品牌名称
  if (brandName == "") {
    res.render('error', {
      msg: '品牌名称不能为空'
    })
  } else if (req.file == undefined) {
    try {
      usersModel.brandAdd({
        brandName: brandName,
        // filename: filename
      }, function (err) {
        if (err) {
          res.send('error', err);
        } else {
          res.redirect('/brand.html');
        }
      })
    } catch (error) {
      res.render('error', {
        msg: '新增失败'
      })
    }
  } else {
    var filename = 'phoneImg/' + new Date().getTime() + "_" + req.file.originalname;
    var newFileName = path.resolve(__dirname, '../public/', filename);
    try {
      var data = fs.readFileSync(req.file.path);
      fs.writeFileSync(newFileName, data);

      usersModel.brandAdd({
        brandName: brandName,
        filename: filename
      }, function (err) {
        if (err) {
          res.send('error', err);
        } else {
          res.redirect('/brand.html');
        }
      })
    } catch (error) {
      res.render('error', {
        msg: '新增失败'
      })
    }

  }


})

//修改品牌
router.post('/UpdateBrand', upload.single('file'), function (req, res) {
  var id = req.body.id;
  var brandName = req.body.brandName;

  if (brandName == "") {
    res.render('error', {
      msg: '品牌名称不能为空'
    })
  } else {
    if (req.file == undefined) {
      try {
        // var data = fs.readFileSync(req.file.path);
        // fs.writeFileSync(newFileName, data);
        usersModel.brandUpdate({
          id: id,
          brandName: brandName,
          // filename: filename
        }, function (err) {
          if (err) {
            res.send('error', err);
          } else {
            res.redirect('/brand.html');
          }
        })
      } catch (error) {
        res.render('error', error);
      }
    } else {
      var filename = 'phoneImg/' + new Date().getTime() + "_" + req.file.originalname;
      var newFileName = path.resolve(__dirname, '../public/', filename);
      try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFileName, data);

        usersModel.brandUpdate({
          id: id,
          brandName: brandName,
          filename: filename
        }, function (err) {
          if (err) {
            res.send('error', err);
          } else {
            res.redirect('/brand.html');
          }
        })
      } catch (error) {
        res.render('error', error);
      }
    }

  }
})
//删除品牌

router.get("/brandDel", function (req, res) {
  // console.log(req.query.id)
  var id = req.query.id;
  // console.log(id)
  usersModel.brandDelete({
    id: id
  }, function (err) {
    if (err) {
      res.send('error', err);
    } else {
      res.redirect('/brand.html');
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