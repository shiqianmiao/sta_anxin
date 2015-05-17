var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var BaseAPI = new HttpAPI({
    path: '/api/common/shop/'
});

exports.put = function (interfaceName, data, callback) {
    BaseAPI.request(
        'PUT',
        {
            'X-Ganji-Agent': 'H5',
            'Content-Type':'application/json'

        },
        interfaceName || '',
        data,
        callback
    );
};

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
exports.remove = function (interfaceName, data, callback) {
    BaseAPI.request(
        'DELETE',
        {
            'X-Ganji-Agent': 'H5'
        },
        interfaceName || '',
        data,
        callback
    );
};

function resultWraper (callback) {
    if (!callback) {
        return null;
    }
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

/*
 * getUser
 * @description 获取用户总积分
 * GET /webapp/shop/usercredit/:loginId/
*/
exports.getUser = Util.promisify(function (params, callback) {
    exports.get('usercredit/'+ params.userId +'/', null, resultWraper(callback));
});

/*
 * postTaskId
 * @description 做赚积分任务
 *@param {task_id:''}
 * POST /webapp/shop/usercredit/:loginId/
*/
exports.postTaskId = Util.promisify(function (params, callback) {
    var data = {
        task_id: params.taskId
    };
    exports.post('usercredit/'+ params.userId +'/', data, resultWraper(callback));
});


/*
 * getTaskList
 * @description 任务列表
 * get /webapp/shop/credittasks/
*/
exports.getTaskList = Util.promisify(function (callback) {
    exports.get('credittasks/', null, resultWraper(callback));
});

/*
 * getUserTaskList
 * @description 用户任务列表
 * @param {id:''}
 * get /webapp/shop/usercredit/:id/products/
*/
exports.getUserTaskList = Util.promisify(function (userId, callback) {
    exports.get('credittasks/', {login_id : userId}, resultWraper(callback));
});

/*
 * getTaskIntro
 * @description 用户任务详情
 * @param {id:''}
 * get  /webapp/shop/usercredit/tasks/:id/
*/
exports.getTaskIntro = Util.promisify(function (taskId, callback) {
    exports.get('credittasks/'+ taskId + '/', null, resultWraper(callback));
});


/*
 * getProductList
 * @description 获取商品列表
 * @param {type:'all'}
 * get /webapp/shop/products/?type=all
*/
exports.getProductList = Util.promisify(function (type, callback) {
    exports.get('products/', {type: type}, resultWraper(callback));
});

/*
 * getProductDetail
 * @description 获取商品详情
 *@param {id:''}
 * get /webapp/shop/products/:id
*/
exports.getProductDetail = Util.promisify(function (id, callback) {
    exports.get('products/'+ id +'/', null, resultWraper(callback));
});

/*
 * buyProduct
 * @description 积分兑换商品
 * @param {id:''}
 * POST /webapp/shop/usercredit/:id/products/
*/
exports.buyProduct = Util.promisify(function (params, callback) {
    if (params.product_type && params.product_type === 10) {
        exports.post('usercredit/'+ params.userId +'/orders/', {product_id: params.productId}, callback);
        return;
    }
    exports.post('usercredit/'+ params.userId +'/products/', {product_id: params.productId}, callback);
});


/*
 * getUserProducts
 * @description 我的奖品
 * @param {id:''}
 * GET /webapp/shop/usercredit/:id/products/
*/
exports.getUserProducts = Util.promisify(function (userId, callback) {
    exports.get('usercredit/'+ userId +'/products/', null, resultWraper(callback));
});


/*
 * getPointsLog
 * @description 积分明细 Detail list of user earn or consume creidt.
 * @param {id:''}
 * GET /webapp/shop/usercredit/:id/details/?page_index=0
*/
exports.getPointsLog = Util.promisify(function (params, callback) {
    exports.get('usercredit/'+ params.userId +'/details/', {page_index: params.pageIndex}, resultWraper(callback));
});


/*
 * createOrder
 * @description 创建订单
 * @param {product_id:''}
 * post usercredit/:user_id/orders/:order_id/
*/
exports.createOrder = Util.promisify(function (params, callback) {
    exports.put('usercredit/'+ params.user_id +'/orders/' + params.order_id + '/', JSON.stringify(params), resultWraper(callback));
});

/*
 * cancelOrder
 * @description
 * @param {id:''}
 * DELETE usercredit/:user_id/orders/:order_id/
*/
exports.cancelOrder = Util.promisify(function (params, callback) {
    exports.remove('usercredit/'+ params.user_id +'/orders/' + params.order_id + '/', resultWraper(callback));
});


/*
 * getProductNews
 * @description 获取商品更新数据
 * @param {type:''}
 * GET api/common/shop/products/?type=new
*/
exports.getProductNews = Util.promisify(function (callback) {
    exports.get('products/', {type: 'new'}, resultWraper(callback));
});

/*
 * getBannerList
 * @description banner 列表
 * @param {city_id:'12', page_type: '1'}
 * GET /api/common/operation/banners/
*/
exports.getBannerList = Util.promisify(function (callback) {
    var get = function (interfaceName, data, callback) {
        var BaseAPI = new HttpAPI({
                path: '/api/common/'
            });
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
    get('operation/banners/', {city_id: '12', page_type: '1', category_id: 1000}, resultWraper(callback));
});


