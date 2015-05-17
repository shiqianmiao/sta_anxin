var $ = require('$');
module.exports = {
    getData: function (param, callback) {
        $.ajax($.extend({
            type:'GET',
            dataType:'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        }).fail(function () {
            callback('提示：网络错误！');
        });
    },
    postData: function (param, callback) {
        $.ajax($.extend({
            type: 'POST',
            dataType: 'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        })
        .fail(function () {
            callback('提示：网络错误！');
        });
    }
};