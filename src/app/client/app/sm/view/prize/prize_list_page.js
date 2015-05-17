var $         = require('$');
var Widget    = require('com/mobile/lib/widget/widget.js');
var template  = require('app/client/app/sm/template/prize/prize_list_page.tpl');
var BasePage  = require('app/client/app/sm/view/base_page.js');

var moreTpl   = require('app/client/app/sm/template/widget/log_list_more.tpl');

var HybridAPI = require('app/client/common/lib/api/index.js');
var SMAPI     = require('app/client/app/sm/service/sm_api.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var DataParser  = require('app/client/app/sm/util/date_parse.js');
/*style*/
require('../../style/style.css');

exports.init = function () {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '我的奖品'
        }
    );
    HybridAPI.invoke('getUserInfo', null)
    .done(function (userInfo) {
        SMAPI.getUserProducts(userInfo.user_id, function (err, data) {
            $body.removeClass('loading');
            if (err) {
                $body.addClass('offline');
                return;
            }
            if (!data) {
                $body.addClass('nothing');
                return;
            }
            data.forEach(function (item) {
                item.openDate = item.bought_time && DataParser.parseToYMD(item.bought_time * 1000, true);
                if (item.product_type !== '10') {
                    item.endDate  = item.bought_time && DataParser.parseToYMD(item.code_expire * 1000, true);
                }
            });
            $body.append(template({data: data}));
            BasePage.bindNativeA();
            Widget.initWidgets();
        });
    }).fail(function () {
        $body.addClass('offline');
    });
};

exports.copyCode = Widget.define({
    events: {
        'click [data-role="copy"]': function (e) {
            e.preventDefault();
            this.copy();
        }
    },
    init: function (config) {
        this.config = config;
    },
    copy: function () {
        var $code = this.config.$code;
        // $code.focus();
        $code[0].setSelectionRange(0, $code.val().length);
        $code.prop('readonly', true);
    }
});
exports.loadMore = BasePage.loadMore.extend({
    loadMore: function () {
        var self = this;
        if (self.pending) {
            return;
        }
        self.removeScrollListener();
        self.config.$el.addClass('active');
        self.pending = true;

        SMAPI.getPointsLog({
            userId: self.config.userId,
            pageIndex: ++self.offset
        }, function (err, data) {
            if (err) {
                self.$el.html(err.message);
                return;
            }
            if (data.list.length <= 0) {
                self.$el.html('没有了');
                return;
            }
            self.render(data.list);

            self.pending = false;
            self.$el.removeClass('active');
            if (self.config.scrollAble) {
                self.listenScroll();
            }
        });
    },
    render: function (data) {
        data.forEach(function (item) {
            if (item.create_time) {
                item.openDate = DataParser.parseToYMD(item.create_time * 1000);
            }
        });
        $('#feed').append(moreTpl({data: data}));
    }
});