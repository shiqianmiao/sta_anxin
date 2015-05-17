var Util = require('app/client/common/lib/util/util.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var indexAPI = require('app/client/common/lib/api/index.js');

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

/**
 * ImRobGroupOwner
 * 获取群竞选
 *
 * @param token:移动客户端的sscode(必传)
 * @param clientType:客户端的customerId(必传)
 * @param clientVersion:客户端的版本号（必传）
 * @param groupId:群id（必传）
 * @param curCityId:必传
 * @param content: 竞选理由（必传）
 *
 * @return
 * {
 *    "requestTime":111,//系统当前时间
 *    "responseTime":222,
 *    "errorCode":0,//错误码，0表示能够建群，错误码：40001,40002,40003,40004,42006,42101,42102,42103
 *    "errorMsg":""，
 *    “data”:{
 *          "status":0/1,//0表示抢失败，2表示抢成功
 *         }
 * }
 */
exports.ImRobGroupOwner = Util.promisify(function(params, callback) {
    var data = {
        groupId: params.groupId || groupId,
        content: params.content,
        curCityId: cityInfo.city_id
    };

    getData('group/ImRobGroupOwner', data, callback);
});

/**
 * ImGetGroupElectionInfo
 * 获取群竞选
 *
 * @params token:移动客户端的sscode(必传)
 * @params clientType:客户端的customerId(必传)
 * @params clientVersion:客户端的版本号（必传）
 * @params groupId:群id（必传）
 * @params userId:必选
 * @params curCityId:必传
 *
 * @return
 * {
 *    "requestTime":111,//系统当前时间
 *    "responseTime":222,
 *    "errorCode":0,//错误码，0表示能够建群，错误码：40001,40002,40003,40004,42006,42101,42102,42103
 *    "errorMsg":""，
 *    “data”:{
 *          "status":0/1,//0表示选举结束，1表示可以选举
 *          "currentTime":1232333,
 *          "startTime":1234556
 *        }
 * }
 */
exports.ImGetGroupElectionInfo = Util.promisify(function(params, callback) {
    var data = {
        groupId: params.groupId || groupId,
        userId : userInfo.user_id,
        curCityId: cityInfo.city_id
    };

    getData('group/ImGetGroupElectionInfo', data, callback);
});

/* ImGetGroupLevel
* @params
*
* token:移动客户端的sscode(必传)
* clientType:客户端的customerId(必传)
* clientVersion:客户端的版本号（必传）
* groupId:群id,(必传)
* curCityId:当前城市id，必传
*
* @return
* "data":{"level":1,"activeDegree":5,"levelMaxDegree":7}//群的等级、群的活跃度、当前等级的最大活跃度
*/
exports.ImGetGroupLevel = Util.promisify(function (params, callback) {
    var data = {
        groupId: params.groupId || groupId,
        curCityId: cityInfo.city_id
    };

    getData('group/ImGetGroupLevel', data, callback);
});

/* ImGetImUserLevel
 @params

token:会话（必选）
clientType：客户端类型  701  805（必选） 范围无  暂时不用
clientVersion客户端版本号  5.8 5.9（必选）范围无  暂时不用
curCityId:1 // (必选)当前城市ID
userId:要获取A的经验，就填写A的userId（必选）范围  群聊用户

 @return

    "data": {
        "requestTime": 12313,
        "responseTime": 12321,
        "errorCode": 0,//错误返回非0
        "errorMsg": "",
        "data": {
            "userId": 2341234312,
            "imId": 12312,
            "activeLevel": 1231,
            "activeValue": 123
        }
    }
*/
exports.ImGetImUserLevel = Util.promisify(function (params, callback) {
    var data = {
        userId : params.userId || userInfo.user_id,
        curCityId: cityInfo.city_id
    };
    getData('friend/ImGetImUserLevel', data, callback);
});

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

                        window.alert(data.errorMsg);
                        defer.reject(err);
                    } else {
                        defer.resolve(data.data);
                    }
                })
                .fail(function () {
                    defer.reject(new Error('网络异常'));
                });
        }
    );
    return defer.promise();
}