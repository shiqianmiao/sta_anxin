var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/qunliao/template/qunliao_intro.tpl');
var Cookie      = require('com/mobile/lib/cookie/cookie.js');
var QLAPI       = require('app/client/app/misc/qunliao/service/qunliao_api.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var HybridAPI   = require('app/client/common/lib/api/index.js');

/*style*/
require('../style/style.css');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '赶集群组'
        }
    );
    QLAPI.get('', null, function (err, data) {
        var $body = $('body');
        if (err) {
            $body.addClass('offline');
            return;
        }
        if (!data) {
            $body.addClass('nothing');
            return;
        }
        $body.removeClass('loading');
        if (Cookie.get('h5_qunliao_has_like')) {
            data.hasLike = true;
        }
        if (data.counter) {
            data.counter = transCounter(data.counter);
        }
        $body.append(template({data: data}));
        Widget.initWidgets();
    });
};

exports.like = Widget.define({
    events: {
        'click': function () {
            this.like();
        }
    },
    init: function (config) {
        this.config     = config;
        this.$el        = config.$el;
        this.$count     = $('#count');
    },
    disabledButton: function () {
        this.$el.prop('disabled', true);
        this.$el.html('<i class="icon-heart"></i>已成功点赞');
    },
    like: function () {
        var self = this;
        self._getUserInfo()
            .done(function (userInfo) {
                QLAPI.post('zan/',{userId: userInfo.user_id}, function (err) {
                    if (err) {
                        return;
                    }
                    self.disabledButton();
                    var count = parseInt(self.$count.text(), 10);
                    self.$count.text(transCounter(++count));
                    self.setCookie();
                });

            });
    },
    _getUserInfo: function () {
        var getUserInfoDefer = $.Deferred();
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                userInfo = {};
                userInfo.user_id = 0;
            }
            getUserInfoDefer.resolve(userInfo);
        });
        return getUserInfoDefer;
    },
    setCookie: function () {
        Cookie.set('h5_qunliao_has_like','on',{
            domain : 'sta.ganji.com',
            expires: 24 * 60 * 60,
            path   : '/'
        });
    }
});
function transCounter (counter) {
    var counter  = counter.toString();
    var str      = '000000';
    return str.slice(0, -counter.length).concat(counter);
}