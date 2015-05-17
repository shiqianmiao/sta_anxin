var Widget = require('com/mobile/lib/widget/widget.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

function handleError (err) {
    window.alert('出错了！[code:'+err.code+']: ' + err.message);
}

function checkField (fields, data) {
    fields.forEach(function (field) {
        if (!(field in data)) {
            window.alert('缺失 ' + field + ' 字段');
        }
    });
}

exports.run = function () {
    Widget.initWidgets();
};

exports.confirm = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'confirm',
            {
                title: '这是标题',
                message: '这是消息',
                yes_btn_text: '确定按钮',
                no_btn_text: '取消按钮'
            },
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                switch(data.value) {
                    case data.YES:
                        window.alert('你点了确定按钮');
                        break;
                    case data.NO:
                        window.alert('你点了取消按钮');
                        break;
                    case data.CLOSE:
                        window.alert('你使用其他方式关闭了弹窗');
                        break;
                    default:
                        window.alert('未知动作，返回code是['+data.value+']');
                }
            }
        );
    });
};

exports.alert = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'alert',
            {
                title: '这是标题',
                message: '这是消息',
                btn_text: '确定按钮'
            },
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                switch(data.value) {
                    case data.YES:
                        window.alert('你点了确定按钮');
                        break;
                    case data.CLOSE:
                        window.alert('你使用其他方式关闭了弹窗');
                        break;
                    default:
                        window.alert('未知动作，返回code是['+data.value+']');
                }
            }
        );
    });
};

exports.createWebView = function (config) {
    config.$el.on('click', function () {
        window.alert('我应该要弹出一个新窗口，指向：' + config.url);
        NativeAPI.invoke(
            'createWebView',
            {
                url: config.url,
                control: config.control
            }
        );
    });
};

exports.getUserInfo = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'getUserInfo',
            null,
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                checkField(['user_id', 'username'], data);

                window.alert(JSON.stringify(data));
            }
        );
    });
};

exports.getDeviceInfo = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'getDeviceInfo',
            null,
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                checkField(['GjData-Version', 'customerId','clientAgent','versionId','model','agency','contentformat','userId','token','mac'], data);

                window.alert(JSON.stringify(data));
            }
        );
    });
};

exports.getCityInfo = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'getCityInfo',
            null,
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                checkField(['city_name', 'city_id'], data);

                window.alert(JSON.stringify(data));
            }
        );
    });
};

exports.login = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'login',
            null,
            function (err, data) {
                if (err) {
                    return handleError(err);
                }
                checkField(['username', 'user_id'], data);

                window.alert(JSON.stringify(data));
            }
        );
    });
};

exports.webViewCallback = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'webViewCallback',
            {
                url: './callback.html'
            }
        );
    });
};

exports.makePhoneCall = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'makePhoneCall',
            {
                number: config.number
            },
            function () {
                window.alert('电话拨打结束');
            }
        );
    });
};

exports.updateTitle = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'updateTitle',
            {
                text: config.title
            }
        );
    });
};

exports.weixinShare = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke(
            'weixinShare',
            {
                type: config.type,
                text: config.title,
                image: config.image,
                url: config.url,
                istimeline: config.istimeline
            },
            function (err, data) {
                if (err) {
                    return window.alert(err.message);
                }

                window.alert(JSON.stringify(data));
            }
        );
    });
};