var express = require("express");
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



//插入数据
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db('nodeProject');
//     var myobj = {
//         name: '张三',
//         age: 12,
//         phone: '15623156431',
//         username: 'zahngsan',
//         password: '123456',
//         address: '深圳'
//     };
//     dbo.collection('users').insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("新增成功!");
//         db.close();
//     })
// })

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db('nodeProject');
    dbo.collection("users").find({}).toArray(function (err, result) {
        if (err) {
            throw err;
        } else {
            router.get('/', function (req, res, next) {
                res.render('users', {
                    data: result
                })
            })
        }
        // console.log(result);
        db.close();
    })
})