const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const usersModel = {
    //注册
    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({
                    code: -100,
                    msg: "连接数据库失败"
                });
                return;
            }
            const db = client.db('nodeProject');
            let saveData = {
                username: data.username,
                pwd: data.pwd,
                pwdend: data.pwdend,
                nickname: data.nickname,
                phone: data.phone,
                isadmin: data.isadmin
            };

            async.series([
                function (callback) {
                    db.collection('users').find({
                        username: saveData.username
                    }).count(function (err, num) {
                        if (err) {
                            callback({
                                code: -101,
                                msg: "查询是否已注册失败"
                            })
                        } else if (num !== 0) {
                            console.log('用户已经注册过了');
                            callback({
                                code: -102,
                                msg: "用户已经注册过了"
                            })
                        } else {
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    db.collection('users').find().count(function (err, num) {
                        if (err) {
                            callback({
                                code: -101,
                                msg: "查询表的所有记录条数失败"
                            })
                        } else {
                            saveData._id = num + 1;
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    db.collection('users').insertOne(saveData, function (err) {
                        if (err) {
                            callback({
                                code: -101,
                                msg: "写入数据库失败"
                            })
                        } else {
                            callback(null);
                        }
                    })
                }
            ], function (err, results) {
                if (err) {
                    console.log('上面的操作可能出了问题', err);
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            })
        })
    },



}

module.exports = usersModel;