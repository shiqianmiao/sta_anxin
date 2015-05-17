var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var indexAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var BaseAPI = new HttpAPI({
    path: '/api/common/'
});


exports.post = function (interfaceName, data, callback) {
    BaseAPI.request(
        'POST',
        {
            'X-Ganji-Agent': 'H5'

        },
        interfaceName || '',
        data,
        callback
    );
};

exports.get = function (interfaceName, data, callback) {
    BaseAPI.request(
        'GET',
        {
            'X-Ganji-Agent': 'H5'
        },
        interfaceName || '',
        data,
        callback
    );
};

function resultWraper (callback) {
    return function (err, data) {
        if (err) {
            window.console.log(err);
            return callback(err);
        }

        if (!data) {
            window.console.log(data);
            return callback(new Error('网络异常请稍后再试'));
        }

        return callback(null, data);
    };
}

/*exports.getNearInfo = Util.promisify(function (params, callback) {
    var data = {
        tplId : params.tplId,
        hasMusic : params.hasMusic,
        toWho : params.toWho,
        greetingArea : params.greetingArea,
        fromWho : params.fromWho,
        hasRecord : params.hasRecord,
        recordUrl : params.recordUrl,
        recordLength : params.recordLength
    };
    exports.post('greetingcards/', {card_info: JSON.stringify(data)}, resultWraper(callback));
});*/

exports.getCityInfo = Util.promisify(function (params, callback) {
    exports.get( 'default/geo/province/' + params + '/cities/', null, resultWraper(callback));
});

exports.getProvinceInfo = Util.promisify(function (params, callback) {
    exports.get( 'default/geo/province/' + params, null, resultWraper(callback));
});

exports.getPv = Util.promisify(function (params, callback) {
    exports.get( 'operation/lottery/0/pinchepv/' + params, null, resultWraper(callback));
});

var async = module.async();
var cityInfo = {};
var userInfo = {};
var groupId;

var init = function() {
    NativeAPI.invoke('getCityInfo', null, function(err, cityData) {

        if (err && err.code === -32603) {
            cityData = {
                city_id: 12
            };

            groupId = 70010903;
        }

        cityInfo = cityData;

        NativeAPI.invoke('getUserInfo', null, function (err, userData) {

            if (err && err.code === -32603) {
                userData = {
                    user_id: 500056286
                };
            }

            userInfo = userData;

            async();
        });
    });
};

init();

/*ImGetGroupInfo
 @params

 token:移动客户端的sscode(必传)
 clientType:客户端的customerId(必传)
 clientVersion:客户端的版本号（必传）
 groupId:群id,(必传)
 memberCount:获取的成员数量，默认为6，最大为6(可选)
 curCityId:当前城市id，必传

 @return
 "data":{
          “ picUrls”：["http://image.ganjistatic1.com/gjfstmp2/M00/00/00/wKgCzFK0GtWIOoXzAAA86ise6mkAAAAFQIwUKoAAD0C848_0-0_9-0.png",
              "http://image.ganjistatic1.com/gjfstmp2/M00/00/00/wKgCzFK0GtWIOoXzAAA86ise6mkAAAAFQIwUKoAAD0C848_0-0_9-0.png"],
          "name":"西二旗搬家公司",
          "groupId":70010348,
          "level":1,
          "location":"西二旗百度大厦",
          "coordinate":"123.22222,121,333333",
          “labels”:["搬家"，“拉货”]，//
          "industryId":1,//行业id,只有内部运营群才有
          "jobId":2,//职位id,只有内部运营群才有
          "owner":{"userId": 50003672,
                       "nickName":"qyb",
                       "avatar":"http://image.ganjistatic1.com/gjfstmp2/M00/00/00/wKgCzFK0GtWIOoXzAAA86ise6mkAAAAFQIwUKoAAD0C848_0-0_9-0.png"},
          "createTime":"1414637254",
          "updateTime":"1414637254",
          "introduction":"这个世界上最快的搬家公司，10分钟搞定",
          "currentCount":10,//当前群的人数
          "maxCount":20,//当前群最大人数
          "authority":1/2/3/4,1表示群组，2表示管理员，3表示普通成员，4表示非群中成员
          "members":[{"userId":50003604,"nickName":"121", "avatar":"asdf.jpg"},
                            {"userId":50002990,"nickName":"qinlodestar2", "avatar":"asdf.jpg}]
 }
*/
exports.ImGetGroupInfo = Util.promisify(function (params, callback) {
    var data = {
        groupId : params.groupId || groupId,
        curCityId: cityInfo.city_id,
        memberCount: params.memberCount || 6
    };

    getData('group/ImGetGroupInfo', data, callback);
});

exports.ImGetHomeGroup = Util.promisify(function (params, callback) {
    var data = {
        provinceId : params.provinceId,
        cityId : params.cityId,
        curCityId : params.curCityId
    };
    getData('search/ImGetHomeGroup', data, callback);
});

exports.ImApplyJoinGroupBySelf = Util.promisify(function (params, callback) {
    var data = {
        groupId : params.groupId,
        curCityId : params.curCityId,
        token : params.token
    };
    getData('group/ImApplyJoinGroupBySelf', data, callback);
});

function getData(path, params, callback, type) {
    var defer = $.Deferred();

    callback = callback || function () {};

    defer
        .done(function (data) {
            callback(null, data);
        })
        .fail(function (err) {
            callback(err);
        });
    indexAPI.invoke(
        'getDeviceInfo',
        null,
        function(err, deviceInfo){
            if (err) {
                deviceInfo = {
                    'customerId': '705',
                    'clientAgent': 'sdk#320*480',
                    'GjData-Version': '1.0',
                    'versionId': '5.7.0',
                    'model': 'Generic/AnyPhone',
                    'agency': 'agencydefaultid',
                    'contentformat': 'json2',
                    'userId': '1615BBAAF41ABDC59CFA7EBE8C643919',
                    'token': '52617950743134537162574f30614f6352615657472f2b6f',
                    'mac': '787987779',
                    'os': '',
                    'env': 'online'
                };
                // defer.reject(new Error('无法获取设备信息!'));
                // return;
            }

            var baseUrl = 'http://webim.ganji.com/';
            params.clientType = deviceInfo.customerId;
            params.clientVersion = deviceInfo.versionId;

            // 服务端约定：
            // 没有token，就token参数都不用传
            // 传了token就需要保证token是正确的
            if (deviceInfo.token) {
                params.token = deviceInfo.token;
            }

            params._rand = Math.random();

            var headers = {
                'customerId': deviceInfo.customerId,
                'clientAgent': deviceInfo.clientAgent,
                'GjData-Version': deviceInfo['GjData-Version'],
                'versionId': deviceInfo.versionId,
                'model': deviceInfo.model,
                'agency': deviceInfo.agency,
                'contentformat': deviceInfo.contentformat,
                'userId': deviceInfo.userId,
                'mac': deviceInfo.mac
            };

            if (deviceInfo.token) {
                headers.token = deviceInfo.token;
            }

            $.ajax({
                type : type || 'GET',
                url: baseUrl + path,
                data: params,
                dataType: 'json',
                headers: headers
            })
                .done(function (data) {
                    var err = null;
                    if (data.errorCode) {
                        err = new Error(data.errorMsg);
                        err.code = data.errorCode;
                        defer.reject(err);
                    } else {
                        defer.resolve(data);
                    }
                })
                .fail(function () {
                    defer.reject(new Error('网络异常'));
                });
        }
    );
    return defer.promise();
}
