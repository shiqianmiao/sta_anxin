var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var async = require('com/mobile/lib/async/async.js');
var MD5 = require('com/mobile/lib/crypto/md5.js');
var $ = require('$');
var XICHE_H5_SIGN_ENCRYPT = 'xiche@ganji.com#u4&qwe!26uiv';
var DataShareAPI = new HttpAPI({
    path: '/datashare/'
});
var XICHE_CHANNEL = 'xiche@1.3.0';
var STANDARD_CODE = '1030991000007';

function makeToken(params) {
    var now = parseInt(Date.now() / 1000, 10);
    var str = Object.keys(JSON.parse(JSON.stringify(params)))
        .sort()
        .reduce(function(ret, key) {
            var val = params[key] === null ? '' : params[key];
            return ret + key + '=' + encodeURIComponent(val).replace(/%20/g, '+');
        }, '');

    str = MD5(str + XICHE_H5_SIGN_ENCRYPT + now);
    return $.param({
        token: str,
        timestamp: now
    });
}

function makePostRequest(interfaceName, data, callback) {
    DataShareAPI.request(
        'POST', {
            'interface': interfaceName,
            'X-Ganji-Channel': XICHE_CHANNEL
        },
        '?' + makeToken(data || {}), {
            jsonArgs: JSON.stringify(data || {})
        },
        callback
    );
}

function resultWraper(callback) {
    return function(err, data) {
        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback(new Error('网络异常请稍后再试'));
        }

        if (data.status) {
            var message = '';

            if (data.errMessage && data.errDetail) {
                message = (data.errMessage || '') + ': ' + (data.errDetail || '');
            } else if (data.errMessage) {
                message = data.errMessage;
            } else if (data.errDetail) {
                message = data.errDetail;
            }

            return callback(new Error(message));
        }

        return callback(null, data.data);
    };
}

// CreativeLifeSetNeedsCalendar
// 参数名 类型  是否必传    说明
// latlng  string  Y/N 坐标, 标准洗必传
// mapType int Y/N 地图类型，1百度地图 2 高德地图 3 GPS火星地图, 标准洗必传
// tplType int Y   模板类型 1 标准洗 2 套餐洗
exports.getCalendar = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeSetNeedsCalendar', {
        latlng: params.latlng || '',
        mapType: params.mapType || 1,
        tplType: params.tplType
    }, resultWraper(callback));
});

exports.updateCarInfo = Util.promisify(function(params, callback) {
    async.waterfall([
        function(next) {
            require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
                next(null, HybridAPI);
            });
        },
        function(HybridAPI, next) {
            HybridAPI.invoke('getUserInfo')
                .done(function(userInfo) {
                    next(null, userInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        },
        function(userInfo, next) {
            if (params && params.car_number) {
                if (params.car_id) {
                    makePostRequest('CreativeLifeUpdateCarInfo', {
                        user_id: userInfo.user_id || '',
                        car_id: params.car_id,
                        car_model_id: params.car_model_id || '',
                        car_color_id: params.car_color_id || '',
                        car_number: params.car_number || '',
                        car_img_url: params.car_img_url || ''
                    }, resultWraper(function(err, data) {
                        next(err, data);
                    }));
                } else {
                    makePostRequest('CreativeLifeCreateNewCar', {
                        user_id: userInfo.user_id || '',
                        car_model_id: params.car_model_id || '',
                        car_color_id: params.car_color_id || '',
                        car_number: params.car_number || '',
                        car_img_url: params.car_img_url || ''
                    }, resultWraper(function(err, data) {
                        next(err, data);
                    }));
                }
            } else {
                makePostRequest('CreativeLifeGetCarsList', {
                    user_id: userInfo.user_id || ''
                }, resultWraper(function(err, data) {
                    next(err, data);
                }));
            }
        }
    ], function(err, data) {
        callback(err, data);
    });
});

// 参数名 是否必传    类型  说明
// id  N   int 修改对应的id的地址项，为0表示新增地址
// user_id Y   int 用户id,必传
// address Y   varchar 类型名称（非具体地址，为家、公司或用户自定义的名称）
// address_name    Y   varchar 具体地址
// address_type    Y   int 地址类型 1 家 2 公司 3 其他 4历史记录
// address_remark  N   varchar 备注
// latlng  N   varchar 经纬度，非必填
// act N   varchar get/set
exports.updateUserAddress = Util.promisify(function(params, callback) {
    async.waterfall([
        function(next) {
            require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
                next(null, HybridAPI);
            });
        },
        function(HybridAPI, next) {
            HybridAPI.invoke('getUserInfo')
                .done(function(userInfo) {
                    next(null, userInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        },
        function(userInfo, next) {
            makePostRequest('CreativeLifeUserAddress', {
                id: params.id || '',
                user_id: userInfo.user_id || '',
                address: params.address || '',
                address_name: params.addressName || '',
                address_type: params.addressType || '',
                address_remark: params.addressRemark || '',
                latlng: params.latlng || '',
                act: params.act
            }, resultWraper(function(err, data) {
                next(err, data);
            }));
        }
    ], function(err, data) {
        callback(err, data);
    });
});

// 参数名 类型  是否必传    说明
// user_id string  Y   用户id
// open_id int Y   微信公众号对应的用户open_id
exports.bindOpenId = Util.promisify(function(params, callback) {
    async.waterfall([
        function(next) {
            require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
                next(null, HybridAPI);
            });
        },
        function(HybridAPI, next) {
            HybridAPI.invoke('getUserInfo')
                .done(function(userInfo) {
                    next(null, userInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        },
        function(userInfo, next) {
            makePostRequest('CreativeLifeBindOpenId', {
                user_id: userInfo.user_id,
                open_id: params.openId
            }, resultWraper(function(err, data) {
                next(err, data);
            }));
        }
    ], function(err, data) {
        callback(err, data);
    });
});

// 参数名 是否必传    类型  说明
// act Y   string  getUserInfo
// user_id Y   int 用户id
exports.getUserCenterInfo = Util.promisify(function(params, callback) {
    function request(userId, callback) {
        makePostRequest('CreativeLifeUserCenter', {
            act: 'getUserInfo',
            user_id: userId
        }, resultWraper(callback));
    }

    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo', null)
            .done(function(userInfo) {
                request(userInfo.user_id, function(err, data) {
                    if (err) {
                        return callback(err);
                    }

                    if (data) {
                        return callback(err, data);
                    }

                    HybridAPI.invoke('getCityInfo', null, function(err, cityInfo) {
                        cityInfo = cityInfo || {};
                        exports.registerXicheAccount({
                                user_id: userInfo.user_id,
                                city_id: cityInfo.city_id,
                                city_domain: cityInfo.city_domain
                            })
                            .done(function() {
                                request(userInfo.user_id, callback);
                            })
                            .fail(function() {
                                var err = new Error('请绑定手机号');
                                err.code = 'ERR_NEED_BIND_PHONE';
                                callback(err);
                            });
                    });
                });
            })
            .fail(function(err) {
                err = err || new Error();
                err.code = 'ERR_NEED_LOGIN';
                callback(err);
            });
    });
});

// CreativeLifeGetAllProductList
// 获取标准洗 + 特价促销商品列表
// 参数名       类型    是否必传   说明
// userId      int       N     用户ID,登录后必传.
// phone       string    N     手机号
// pageIndex   int       N     分页
// pageSize    int       N     每页数量
// carNumber   string    N     车牌
// productCode string    N     当前选中的产品code
exports.getPackagesList = Util.promisify(function(params, callback) {
    async.waterfall([
        function(next) {
            require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
                next(null, HybridAPI);
            });
        },
        function(HybridAPI, next) {
            HybridAPI.invoke('getUserInfo')
                .done(function(userInfo) {
                    next(null, userInfo);
                })
                .fail(function() {
                    next(null, {});
                });
        },
        function(userInfo, next) {
            makePostRequest('CreativeLifeGetAllProductList', {
                userId: userInfo.user_id,
                phone: userInfo.phone,
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                carNumber: params.carNumber,
                productCode: params.productCode,
                businessCode: params.businessCode
            }, resultWraper(function(err, data) {
                next(null, data);
            }));
        }
    ], function(err, data) {
        callback(err, data);
    });
});

// CreativeLifeGetSalesPromotionDetail
// 获取特价促销商品详细信息
// 参数名       类型     是否必传    说明
// productCode string    Y      商品编号
exports.getPromotionDetail = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeGetSalesPromotionDetail', {
        productCode: params.productCode
    }, resultWraper(callback));
});

// CreativeLifeSuggestAddress
// q string Y 查询关键词
// region string Y 所在城市
// userId int N 登录 userId ,没有传空
exports.getAddressSuggesstion = Util.promisify(function(params, callback) {
    var data = {
        region: params.cityName,
        userId: params.userId || '',
        q: params.keyword
    };

    makePostRequest('CreativeLifeSuggestAddress', data, resultWraper(function(err, data) {
        if (err) {
            return callback(err);
        }

        if (typeof data !== 'string') {
            err = new Error('服务器返回数据格式错误，请稍后再试');
            return callback(err);
        }

        try {
            data = JSON.parse(data);
        } catch (ex) {
            err = new Error('服务器返回JSON格式错误，请稍后再试');
            return callback(err);
        }

        if (data.status === 0) {
            return callback(null, data.results.filter(function(row) {
                return !!row.location;
            }));
        } else {
            err = new Error(data.message);
            return callback(err);
        }
    }));
});

// CreativeLifeGetServiceArea
exports.getAvaliableServiceArea = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeGetServiceArea', null, resultWraper(callback));
});

// CreativeLifeCheckLatlngIsServiceArea
exports.checkIsLatlngAvaliable = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeCheckLatlngIsServiceArea', {
        latlng: params.latlng,
        mapType: params.mapType || 1
    }, resultWraper(callback));
});

// CreativeLifeUserAddress
// id	N	int	修改对应的id的地址项，为0表示新增地址
// user_id	Y	int	用户id,必传
// address_name	Y	varchar	地标
// address	Y	varchar	类型名称（非具体地址，为家、公司或用户自定义的名称）
// address_type	Y	int	地址类型 1 家 2 公司 3 其他 4历史记录
// address_remark	N	varchar	备注
// latlng	N	varchar	经纬度，非必填
// act	N	varchar	get/set
exports.getUserAddress = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeUserAddress', {
        user_id: params.userId,
        act: 'get'
    }, resultWraper(callback));
});

// CreativeLifeSetNeedsTimeline
// currentDate string N 洗车日期（YYYY-MM-DD）,不输入默认为当天
// latlng string Y 坐标
// mapType int Y 地图类型，1百度地图 2 高德地图 3 GPS火星地图
exports.getAvaliableTime = Util.promisify(function(params, callback) {
    var data = {
        currentDate: params.date || '',
        latlng: params.latlng || '',
        mapType: params.mapType || 1
    };
    makePostRequest('CreativeLifeSetNeedsTimeline', data, resultWraper(callback));
});

// CreativeLifeGetThridpartPayUrl
// 参数名 是否必传    类型  说明
// userId  int Y   登录用户id
// orderId int Y   订单id
// amount  double  Y   订单金额，单位：元
// payType string  Y   支付类型，alipay：支付宝 weixin: 微信 balance 余额 baidu:百度钱包
// clientType  int N   支付调用方式 2 wap 3 app, 默认app
exports.getThirdpartPayUrl = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                var data = {
                    userId: userInfo.user_id,
                    orderId: params.orderId,
                    amount: params.amount,
                    payType: params.payType,
                    clientType: params.clientType || 2
                };

                makePostRequest('CreativeLifeGetThridpartPayUrl',
                    data,
                    resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请重新登录后再试'));
            });

    });
});

// CreativeLifeCreateNeeds
// userId   int Y   登录用户id
// cityId   int Y   城市id
// categoryId   int Y   类别id
// phone    string  Y   联系电话
// carNumber    string  Y   车牌号码
// address  string  Y   服务地址
// latlng   string  Y   服务地点经纬度
// jobTime  string  Y   服务预约时间，格式：开始时间,结束时间,时间类型(1 现在 2 全天 3 指定时段)
// isWashInterior   int N   需要清洗内饰 0否 1是
// content  string  N   备注
// payPrice double  Y   需要支付价格
// makeSure int N   是否点击确认继续下单，默认为0，当为1时需要判断payPrice是否与实际支付金额相符
// inviteCode   string  Y   邀请码
// mapType  int Y   地图类型，1百度地图 2 高德地图
// carCategory  string  Y   车的分类，v1.1及以上必传
// carColorId   int Y   车的颜色ID，v1.1及以上必传
// carModelId   int Y   车系ID，v1.1及以上必传
// couponPuid   int N   优惠券puid, 当选择可使用的优惠券时提交 v1.2.0+
// useRedPackage    int N   是否使用红包余额，0不使用, 1使用 (v1.2.0之前版本有余额直接抵扣) v1.2.0+
// tplType int Y/N 模板类型 1 马上预约 2 特价套餐预约 v1.3-
// productCode int Y/N TC商品编号，当tplType=2时必传
// third_user_info string N 小米黄页必传
exports.createNeeds = Util.promisify(function(params, callback) {
    require.async(['app/client/common/lib/api/index.js'], function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeCreateNeeds', {
                    userId: userInfo.user_id,
                    cityId: params.cityId,
                    categoryId: 71,
                    phone: userInfo.phone,
                    carNumber: params.carNumber,
                    address: params.address,
                    latlng: params.latlng,
                    jobTime: params.jobTime,
                    isWashInterior: params.isWashInterior,
                    content: params.addressComment || '',
                    payPrice: params.payPrice,
                    mapType: params.mapType || 1,
                    carCategory: params.carCategory,
                    carColorId: params.carColorId,
                    carModelId: params.carModelId,
                    tplType: String(params.productCode) === STANDARD_CODE ? 1 : 2,
                    useRedPackage: params.useRedPackage,
                    couponPuid: params.couponPuid,
                    productCode: params.productCode,
                    businessCode: params.businessCode,
                    inviteCode: params.inviteCode,
                    third_user_info: params.third_user_info
                }, resultWraper(callback));
            })
            .fail(function(err) {
                callback(err);
            });
    });
});

// CreativeLifeGetOrderPriceInfo
//
// 根据条件可以获取订单实际支付金额和显示总金额
//
// 参数名           类型     是否必传    说明
// phone           string  Y   手机号
// carNumber       string  Y   车牌，当tplType=1时必传
// carCategory     string  Y   车的类型，当tplType=1时必传
// tplType int     Y/N 模板类型 1 马上预约 2 特价套餐预约 默认为1
// productCode     int Y/N TC商品编号，当tplType=2时必传
// userId          int Y   用户ID，登录后必传, v1.2.0+
// couponPuid      int N   优惠券puid, 当选择可使用的优惠券时提交 v1.2.0+
// useRedPackage   int N   是否使用红包余额，0不使用, 1使用 (v1.2.0之前版本有余额直接抵扣) v1.2.0+
// business_code   string  N   合作码 v1.5.0+
exports.getPrice = Util.promisify(function(params, callback) {
    require.async([
        'app/client/common/lib/api/index.js'
    ], function(HybridAPI) {
        async.auto({
            userInfo: function(next) {
                HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
                    next(null, userInfo);
                });
            },
            userPrice: ['userInfo', function(next, result) {
                var userInfo = result.userInfo || {};

                if (userInfo.user_id || userInfo.phone || params.carNumber) {
                    makePostRequest('CreativeLifeGetOrderPriceInfo', {
                        phone: userInfo.phone || '',
                        userId: userInfo.user_id || '',
                        couponPuid: params.couponPuid || '',
                        useRedPackage: params.useRedPackage || '',
                        carNumber: params.carNumber,
                        carCategory: params.carCategory || '',
                        productCode: params.productCode,
                        tplType: String(params.productCode) === STANDARD_CODE ? 1 : 2,
                        businessCode: params.businessCode
                    }, resultWraper(function(err, price) {
                        if (err) {
                            price = null;
                        }
                        next(null, price);
                    }));
                } else {
                    next(null, null);
                }
            }],
            commonPrice: ['userInfo', 'userPrice', function(next, result) {
                if (result.userPrice) {
                    return next(null, null);
                }

                makePostRequest('CreativeLifeGetNeedsTemplate', {
                    categoryId: 71,
                    cityId: params.cityId,
                    businessCode: params.businessCode
                }, resultWraper(function(err, data) {
                    if (!err && data) {
                        data = {
                            payAmount: data.priceInfo.payAmount,
                            prompt: data.prompt
                        };
                    }
                    next(err, data);
                }));
            }]
        }, function(err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result.userPrice || result.commonPrice);
        });
    });
});

// CreativeLifeGetNeedsTemplate
// 参数名 类型  是否必传    说明
// categoryId  int Y   类别id，71洗车
// cityId  int Y   城市id
// userId  int Y/N 登录用户id，登录用户必传
// phone   string  Y/N 登录用户手机号，登录用户必传 v1.1.0+
// carNumber   string  Y/N 车牌号码，如果用户填写了必传 v1.3.0+
// tplType int Y/N 模板类型 1 马上预约 2 特价套餐预约 v1.1.0+
// productCode int Y/N TC商品编号，当tplType=2时必传 v1.1.0+
// businessCode    string  Y/N 合作码 v1.5.0+
exports.getNeedsTemplate = Util.promisify(function(params, callback) {
    async.waterfall([
        function(next) {
            require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
                next(null, HybridAPI);
            });
        },
        function(HybridAPI, next) {
            HybridAPI.invoke('getUserInfo')
                .done(function(userInfo) {
                    next(null, userInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        },
        function(userInfo, next) {
            makePostRequest('CreativeLifeGetNeedsTemplate', {
                categoryId: 71,
                cityId: params.cityId || '',
                userId: userInfo.user_id || '',
                phone: userInfo.phone || '',
                carNumber: params.carNumber || '',
                tplType: params.tplType || '',
                productCode: params.productCode || '',
                businessCode: params.businessCode || ''
            }, resultWraper(function(err, data) {
                next(err, data);
            }));
        }
    ], function(err, data) {
        callback(err, data);
    });
});

// CreativeLifeGetNeedsOrderStatusDetail
exports.getOrderDetail = Util.promisify(function(params, callback) {
    makePostRequest(
        'CreativeLifeGetNeedsOrderStatusDetail', {
            userId: params.userId,
            needsPuid: params.puid
        },
        resultWraper(callback)
    );
});

// CreativeLifeGetMyNeedsList
// userId	int	Y	登录用户id
// pageIndex	int	N	分页
// pageSize	int	N	每页数量
exports.getOrderList = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeGetMyNeedsList', {
        userId: params.userId,
        pageIndex: params.page,
        pageSize: 10
    }, resultWraper(callback));
});

// CreativeLifeCancelOrder
exports.cancelOrder = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeCancelOrder', {
                    user_id: userInfo.user_id,
                    needs_puid: params.puid,
                    cancel_type: 1
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请先登录后再试'));
            });
    });
});

// CreativeLifeDeleteNeeds
exports.deleteOrder = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeDeleteNeeds', {
                    userId: userInfo.user_id,
                    needsPuid: params.puid
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请先登录后再试'));
            });
    });
});

// CreativeLifeSaveComment
exports.saveOrderComment = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeSaveComment', {
                    needs_puid: params.needs_puid,
                    employee_puid: params.employee_puid,
                    employee_user_id: params.empolly_user_id,
                    comment_user_id: userInfo.user_id,
                    city_id: params.city_id,
                    category_id: 71,
                    phone: userInfo.phone,
                    comment_level: params.level,
                    comment_content: params.comment
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请先登录后再试'));
            });
    });
});

// UserPhoneAuth
exports.sendPhoneAuthCode = Util.promisify(function(params, callback) {
    require.async('app/client/common/view/account/lib/api.js', function(AccountAPI) {
        params.channel = XICHE_CHANNEL;
        AccountAPI.sendAuthCode(params, callback);
    });
});

exports.loginByPhoneAuthCode = Util.promisify(function(params, callback) {
    require.async('app/client/common/view/account/lib/api.js', function(AccountAPI) {
        params.channel = XICHE_CHANNEL;
        AccountAPI.loginByPhoneAuthCode(params, callback);
    });
});

exports.logout = Util.promisify(function(callback) {
    require.async('app/client/common/view/account/lib/api.js', function(AccountAPI) {
        AccountAPI.logout();
        callback();
    });
});

exports.bindPhone = Util.promisify(function(params, callback) {
    params.channel = XICHE_CHANNEL;

    require.async([
        'app/client/common/view/account/lib/api.js',
        'app/client/common/lib/api/index.js'
    ], function(AccountAPI, HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                params.user_id = userInfo.user_id;
                AccountAPI.bindPhone(params, callback);
            })
            .fail(callback);
    });
});

exports.getRedPacketList = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeRedPackageList', {
                    user_id: userInfo.user_id,
                    page_index: params.page_index,
                    page_size: 10
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请登录后再试'));
            });
    });
});

exports.getCouponList = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeSpecialList', {
                    user_id: userInfo.user_id,
                    page_index: params.page_index,
                    page_size: 10,
                    tc_product_code: params.productCode
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请登录后再试'));
            });
    });
});

exports.redeemCoupon = Util.promisify(function(params, callback) {
    require.async('app/client/common/lib/api/index.js', function(HybridAPI) {
        HybridAPI.invoke('getUserInfo')
            .done(function(userInfo) {
                makePostRequest('CreativeLifeExchangeSpecial', {
                    user_id: userInfo.user_id,
                    special_code: params.couponCode,
                    product_code: params.productCode
                }, resultWraper(callback));
            })
            .fail(function() {
                callback(new Error('请登录后再试'));
            });
    });
});

exports.registerXicheAccount = Util.promisify(function(params, callback) {
    makePostRequest('CreativeLifeUserRegister', {
        user_id: params.user_id,
        city_id: params.city_id
    }, resultWraper(callback));
});