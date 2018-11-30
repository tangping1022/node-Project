const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');
const usersModel = {
    /**
     * 
     * @param {*} data 注册
     * @param {*} cb 
     */
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
                nickname: data.nickname,
                age: data.age,
                sex: data.sex,
                isadmin: data.isadmin,
                date: new Date().getTime()
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
    },


    /**
     * 
     * @param {*} data 用户信息
     * @param {*} cb 
     */

    getUserList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });
            } else {
                var db = client.db('nodeProject');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                var totalSize = 0;
                async.parallel([
                        function (callback) {
                            db.collection('users').find().count(function (err, num) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    totalSize = num;

                                    callback(null);
                                }
                            })
                        },
                        function (callback) {
                            db.collection('users').find().limit(limitNum).skip(skipNum).sort({
                                "date": -1
                            }).toArray(function (err, data) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    callback(null, data);
                                }
                            })
                        }
                    ],
                    function (err, result) {
                        if (err) {
                            cb(err);
                        } else {

                            cb(null, {
                                totalpage: Math.ceil(totalSize / data.pageSize),
                                userList: result[1],
                                page: data.page,
                                pageSize: data.pageSize
                            })
                        }
                    })
            }
        })

    },
    /**
     * 
     * @param {*} data 查询手机信息
     * @param {*} cb   回调
     */
    phoneList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });
            } else {
                var db = client.db('nodeProject');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                var totalSize = 0;
                async.parallel([
                        function (callback) {
                            db.collection('phone').find().count(function (err, num) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    totalSize = num;

                                    callback(null);
                                }
                            })
                        },
                        function (callback) {
                            db.collection('phone').find().limit(limitNum).skip(skipNum).sort({
                                "date": -1
                            }).toArray(function (err, data) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    callback(null, data);
                                }
                            })
                        }
                    ],
                    function (err, result) {
                        if (err) {
                            cb(err);
                        } else {

                            cb(null, {
                                totalpage: Math.ceil(totalSize / data.pageSize),
                                phoneList: result[1],
                                page: data.page,
                                pageSize: data.pageSize
                            })
                        }
                    })
            }
        })
    },
    /**
     * 
     * @param {*} data 用户模糊查询
     * @param {*} cb //回调
     */
    getUserSeach(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });
            } else {
                var db = cliect.db('nodeProject');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                var totalSize = 0;
                async.parallel([
                        function (callback) {
                            db.collection('users').find({
                                nickname: data.nickname
                            }).count(function (err, num) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    totalSize = num;

                                    callback(null);
                                }
                            })
                        },
                        function (callback) {
                            const db = cliect.db('nodeProject');
                            db.collection('users').find({
                                nickname: data.nickname
                            }).limit(limitNum).skip(skipNum).toArray(function (err, data) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    callback(null, data);
                                }
                            })
                        }
                    ],
                    function (err, result) {
                        if (err) {
                            cb(err);
                        } else {

                            cb(null, {
                                code: 0,
                                totalpage: Math.ceil(totalSize / data.pageSize),
                                userList: result[1],
                                page: data.page,
                                pageSize: data.pageSize
                            })
                        }
                        cliect.close();
                    })
            }

            // else {
            //     const db = cliect.db('nodeProject');
            //     db.collection('users').find({
            //         nickname: data.nickname
            //     }).toArray(function (err, data) {
            //         if (err) {
            //             console.log('查询数据库失败', err);
            //             cb({
            //                 code: -101,
            //                 msg: err
            //             });
            //             cliect.close();
            //         } else {
            //             cb(null, {
            //                 code: 0,
            //                 list: data
            //             });
            //         }
            //         cliect.close();
            //     })
            // }
        })
    },
    /**
     * 
     * @param {*} data 用户删除
     * @param {*} cb 
     */
    userDelete(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                const db = cliect.db('nodeProject');
                db.collection('users').deleteOne({
                    _id: data.id
                }, function (err) {
                    if (err) {
                        cb({
                            code: -100,
                            msg: '删除失败'
                        });
                    } else {
                        cb(null, {
                            code: 0
                        })
                    }
                    cliect.close();
                })
            }
        })
    },

    /**
     * 
     * @param {*} data  新增手机信息
     * @param {*} cb 
     */
    phoneAdd(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                const db = cliect.db('nodeProject');
                db.collection('phone').insertOne({
                    phoneName: data.phoneName,
                    brand: data.brand,
                    guided: data.guided,
                    price: data.price,
                    filename: data.filename,
                    date: new Date().getTime()
                }, function (err) {
                    if (err) {
                        cb({
                            code: -100,
                            msg: '删除失败'
                        });
                    } else {
                        cb(null, {
                            code: 0
                        })
                    }
                    cliect.close();
                })
            }
        })
    },
    /**
     * 
     * @param {*} data  修改手机信息
     * @param {*} cb 
     */
    phoneUpdate(data, cb) {
        // console.log()
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                if (data.filename == undefined) {
                    const db = cliect.db('nodeProject');
                    var id = data.id;
                    db.collection('phone').updateOne({
                        _id: objectId(id)
                    }, {
                        $set: {
                            phoneName: data.phoneName,
                            brand: data.brand,
                            guided: data.guided,
                            price: data.price
                        }
                    }, function (err, data) {

                        if (err) {
                            cb({
                                code: -100,
                                msg: '修改失败'
                            });
                        } else {
                            cb(null, {
                                code: 0
                            })
                        }
                        cliect.close();
                    })
                } else {
                    const db = cliect.db('nodeProject');
                    var id = data.id;
                    db.collection('phone').updateOne({
                        _id: objectId(id)
                    }, {
                        $set: {
                            phoneName: data.phoneName,
                            brand: data.brand,
                            guided: data.guided,
                            price: data.price,
                            filename: data.filename
                        }
                    }, function (err, data) {

                        if (err) {
                            cb({
                                code: -100,
                                msg: '修改失败'
                            });
                        } else {
                            cb(null, {
                                code: 0
                            })
                        }
                        cliect.close();
                    })
                }
            }
        })
    },

    /**
     * 
     * @param {*} data  删除手机
     * @param {*} cb 
     */

    phoneDelete(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                const db = cliect.db('nodeProject');
                var id = data.id;
                db.collection('phone').deleteOne({
                    _id: objectId(id)
                }, function (err) {
                    if (err) {
                        cb({
                            code: -100,
                            msg: '删除失败'
                        });
                    } else {
                        cb(null, {
                            code: 0
                        })
                    }
                    cliect.close();
                })
            }
        })
    },
    /**
     * 
     * @param {*} data 获取select下拉框
     * @param {*} cb 
     */

    getSelectList(cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });
            } else {
                var db = client.db('nodeProject');
                db.collection('brand').find().toArray(function (err, data) {
                    if (err) {
                        cb({
                            code: -101,
                            msg: '查询数据库失败'
                        })
                    } else {
                        cb(null, {
                            brandList: data,
                        });
                    }
                    client.close();
                })

            }

        })
    },


    /**
     * 
     * @param {*} data   新增品牌
     * @param {*} cb 
     */
    brandAdd(data, cb) {

        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                const db = cliect.db('nodeProject');
                db.collection('brand').find().count(function (err, num) {
                    if (err) {
                        callback({
                            code: -101,
                            msg: "查询表的所有记录条数失败"
                        })
                    } else {
                        var bId = num + 1;
                        db.collection('brand').insertOne({
                            brandName: data.brandName,
                            filename: data.filename,
                            bId: bId,
                            date: new Date().getTime()
                        }, function (err) {
                            if (err) {
                                cb({
                                    code: -100,
                                    msg: '删除失败'
                                });
                            } else {
                                cb(null, {
                                    code: 0
                                })
                            }
                            cliect.close();
                        })
                    }
                })
            }
        })
    },

    /**
     * 
     * @param {*} data  查询品牌信息
     * @param {*} cb 
     */
    brandList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });
            } else {
                var db = client.db('nodeProject');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                var totalSize = 0;
                async.parallel([
                        function (callback) {
                            db.collection('brand').find().count(function (err, num) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    totalSize = num;

                                    callback(null);
                                }
                            })
                        },
                        function (callback) {
                            db.collection('brand').find().limit(limitNum).skip(skipNum).sort({
                                "date": -1
                            }).toArray(function (err, data) {
                                if (err) {
                                    callback({
                                        code: -101,
                                        msg: '查询数据库失败'
                                    })
                                } else {
                                    callback(null, data);
                                }
                            })
                        }
                    ],
                    function (err, result) {
                        if (err) {
                            cb(err);
                        } else {

                            cb(null, {
                                totalpage: Math.ceil(totalSize / data.pageSize),
                                brandList: result[1],
                                page: data.page,
                                pageSize: data.pageSize
                            })
                        }
                    })
            }
        })
    },
    /**
     * 
     * @param {*} data 修改品牌信息
     * @param {*} cb 
     */
    brandUpdate(data, cb) {
        console.log(data)
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                if (data.filename == undefined) {
                    const db = cliect.db('nodeProject');
                    var id = data.id;
                    db.collection('brand').updateOne({
                        _id: objectId(id)
                    }, {
                        $set: {
                            brandName: data.brandName
                        }
                    }, function (err, data) {

                        if (err) {
                            cb({
                                code: -100,
                                msg: '修改失败'
                            });
                        } else {
                            cb(null, {
                                code: 0
                            })
                        }
                        cliect.close();
                    })
                } else {
                    const db = cliect.db('nodeProject');
                    var id = data.id;
                    db.collection('brand').updateOne({
                        _id: objectId(id)
                    }, {
                        $set: {
                            brandName: data.brandName,
                            filename: data.filename
                        }
                    }, function (err, data) {

                        if (err) {
                            cb({
                                code: -100,
                                msg: '修改失败'
                            });
                        } else {
                            cb(null, {
                                code: 0
                            })
                        }
                        cliect.close();
                    })
                }
            }
        })
    },
    brandDelete(data, cb) {
        MongoClient.connect(url, function (err, cliect) {
            if (err) {
                cb({
                    code: -100,
                    msg: '连接数据库失败'
                });

            } else {
                const db = cliect.db('nodeProject');
                var id = data.id;
                db.collection('brand').deleteOne({
                    _id: objectId(id)
                }, function (err) {
                    if (err) {
                        cb({
                            code: -100,
                            msg: '删除失败'
                        });
                    } else {
                        cb(null, {
                            code: 0
                        })
                    }
                    cliect.close();
                })
            }
        })
    }
}

module.exports = usersModel;