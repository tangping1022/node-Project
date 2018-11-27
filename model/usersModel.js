const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');
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
                        } else if (num === 0) {
                            saveData._id = num + 1;
                            callback(null);
                        } else {
                            db.collection('users').find({}).sort({
                                _id: -1
                            }).limit(1).toArray(function (err, result) {
                                saveData._id = parseInt(result[0]._id) + 1;
                                callback(null);
                            })
                        }
                    })
                },
                function (callback) {
                    db.collection('users').insertOne(saveData, function (err) {
                        console.log(saveData);
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
    /**
     * 
     * @param {object} data  //登录信息
     * @param {function} cb   //回调
     */
    login(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: "数据库连接失败"
                })
            } else {
                const db = cliect.db('nodeProject');
                db.collection('users').find({
                    username: data.username,
                    pwd: data.pwd
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('查询数据库失败', err);
                        cb({
                            code: -101,
                            msg: err
                        });
                        cliect.close();
                    } else if (data.length <= 0) {
                        console.log('用户不能登录');
                        cb({
                            code: -102,
                            msg: '用户名或密码错误'
                        });
                    } else {
                        cb(null, {
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isadmin: data[0].isadmin
                        });
                    }
                    cliect.close();
                })
            }
        })
    }


}

module.exports = usersModel;