var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');
var DataShareAPI = new HttpAPI({
    path : '/webapp/myad/'
});
var indexAPI = require('app/client/common/lib/api/index.js');
var async = module.async();
var userInfo;
var init = function() {
    indexAPI.invoke('getUserInfo', null, function(err, info) {
        if (err && err.code === -32603) {
            async();
            return new Error('无法获取用户ID');
        }
        userInfo = info;

        async();
    });
};

init();
var env;
if (NativeAPI.isSupport()) {
    if ($('body').hasClass('ios')) {
        env = 3;
    } else {
        env = 2;
    }
} else {
    env = '1';
}
function makePostRequest (data, callback) {
    data.data = JSON.stringify(data.data);
    DataShareAPI.request(
        'POST',
        {},
        '',
        data,
        callback
    );
}
function resultWraper (callback) {
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback(new Error('网络异常请稍后再试'));
        }

        return callback(null, data);
    };
}
//• getPurchase
/*智能推广购买选项 提供帖子的购买选项 POST
* @Params
* controller=SelfDirection
* action=getPurchaseOptionAction
* data={
*     "user_id":  500008372,
*     "puid":  400008372,
* }
* env= 0 1 2 3
*
* @Return
  {
    "Code": 0, 
    "Message": "", 
    "Data": {
        "puid": 97984019, 
    "is_modify"：1 //是否修改订单。1为修改，0为购买
        "post_title": "赚钱招商加盟项目", // 帖子标题
        "self_city":{
           "city_id": 12, 
           "city_name": "北京" // 帖子所属城市
        },
        "self_major":{
           "major_id": 183,
           "major_name": "招商加盟",  // 帖子所属major
        },
       "all_city":{
           "city_id": 9999, 
           "city_name": "全国" // 全国，固定为9999
        },
        "all_major":{
           "major_id": 8888,
           "major_name": "智能投放", // 智能投放，固定为8888
        },
       "cities":[{// 已选择城市列表（修改订单时有值）
           "city_id": 12, 
           "city_name": "北京" 
        },{},...],
        "majors":[{// 已选择投放类别（修改订单时有值）
         "major_id": 183,
           "major_name": "招商加盟", // 智能投放，固定为8888
        },{},...],
        "suggest_price": 4, // 建议出价
        "unit_price": 1.12, // 点击单击（修改订单时有值）
        "budget": 1000, // 预算（修改订单时有值）
        "auto_renew":  1,    //是否自动续费（修改订单时有值）
        "coupon":{ // 已使用优惠券信息（修改订单时有值）
                 "user_id": "500008372",
                 "useful_life": "1425052799",   //优惠券到期时间
                 "amount": "0.12",   //优惠折扣
                 "code": "k5g9ubdu3t",  //优惠码
                 "puid": "0",        
                 "use_status": "0",     //使用状态，0表示未使用
                 "effect_time": "0",    //未使用，生效时间都为0
                 "effect_duration": "39225600",  //使用时长/秒
                 "use_range_limit": "2",  //类型，1账户型2订单型
                 "order_identify": "3_12324633"   //绑定的订单
              },
        "user_balance": 400,  // 用户账户余额/元
    }
}
*
*
*/
exports.getPurchaseOption = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'getPurchaseOptionAction',
        data : {
            user_id : userInfo.user_id,
            puid : params.puid,
            code: params.code
        },
        env : env
    }, resultWraper(callback));
});
/*• getCouponListAction
* 智能推广获取优惠券列表
* 提供客户可以使用的优惠券列表 POST
* @params
*   controller=SelfDirection
    action=getCouponListAction
    data={
        "user_id":  500008372
    }
    env=0 1 2 3
* @return
  {
    "Code": 0,
    "Message": "",
    "Data":[
              {
                 "user_id": "500008372",
                 "useful_life": "1425052799",   //优惠券到期时间
                 "amount": "0.12",   //优惠折扣
                 "code": "k5g9ubdu3t",  //优惠码
                 "puid": "0",        
                 "use_status": "0",     //使用状态，0表示未使用
                 "effect_time": "0",    //未使用，生效时间都为0
                 "effect_duration": "39225600",  //使用时长，单位为秒
                 "use_range_limit": "2",  //优惠券类型，1为账户型2订单型
                 "order_identify": "3_12324633"   //绑定的订单
              },
              ...
            ]
  }
*
*
*/
exports.getCouponList = Util.promisify(function(callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'getCouponListAction',
        data : {
            user_id : userInfo.user_id
        },
        env : env
    }, resultWraper(callback));
});
/* • checkCouponValidAction
* 智能推广检查优惠券是否可用 提供单个优惠券后端校验接口 POST
*
* @params
*   controller=SelfDirection
    action=checkCouponValidAction
    data={
    "user_id":  500008372
    "puid":  97964952
    "code":  "9tqh85jfju"
    }
    env= 0 1 2 3
*  @return
    {
        "Code": 0,
        "Message": "",
        "Data":{
                  "user_id": "500008372",
                  "useful_life": "1425052799",
                  "amount": "0.12",
                  "code": "9tqh85jfju",
                  "puid": "0",
                  "use_status": "0",
                  "effect_time": "0",
                  "effect_duration": "39225600",
                  "use_range_limit": "2",
                  "order_identify": ""
                }
    }
*
*/
exports.checkCouponValid = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'checkCouponValidAction',
        data : {
            user_id : userInfo.user_id,
            puid : params.puid,
            code : params.code
        },
        env : env
    }, resultWraper(callback));
});
/* •    purchaseAction
* 智能推广订单购买  提供智能推广订单提交后的订单入库接口交互 POST
*
*
*
*
*
*/
exports.purchase = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'purchaseAction',
        data : {
            user_id : userInfo.user_id,
            majors : params.majors,
            cities : params.cities,
            unit_price : params.unit_price,
            budget : params.budget,
            auto_renew : params.auto_renew,
            puid : params.puid,
            coupon_code : params.coupon_code,
            suggest_price : params.suggest_price
        },
        env : env
    }, resultWraper(callback));
});
/* •    updateOrderAction
*  智能推广更新订单 更新订单
*
*
*
*
*/
exports.updateOrder = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'updateOrderFieldsAction',
        data : {
            user_id : userInfo.user_id,
            majors : params.majors || '',
            cities : params.cities || '',
            unit_price : params.unit_price,
            budget : params.budget,
            auto_renew : params.auto_renew,
            puid : params.puid,
            coupon_code : params.coupon_code,
            suggest_price : params.suggest_price
        },
        env : env
    }, resultWraper(callback));
});
/* •  getClickRecordAction
*     获取点击记录  获取一个puid最新智能订单的点击记录
*
*
*
*
*
*/
exports.getClickRecord = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'getClickRecordAction',
        data : {
            user_id : userInfo.user_id,
            puid : params.puid,
            page_id : params.page_id || 0
        },
        env : env
    }, resultWraper(callback));
});
/* •  getOrderDetailAction
*   获取订单详情 获取一个puid的最新订单详情
*
*
*
*/
exports.getOrderDetail = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'getOrderDetailAction',
        data : {
            user_id : userInfo.user_id,
            puid : params.puid
        },
        env : env
    }, resultWraper(callback));
});
exports.updateOrderStatus = Util.promisify(function(params, callback){
    makePostRequest({
        controller : 'SelfDirection',
        action : 'updateOrderStatusAction',
        data : {
            user_id : userInfo.user_id,
            puid : params.puid,
            status : params.status
        },
        env : env
    }, resultWraper(callback));
});