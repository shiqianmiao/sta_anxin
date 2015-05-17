var $         = require('$');
var Widget    = require('com/mobile/lib/widget/widget.js');
var template  = require('app/client/app/sm/template/points/points_log_page.tpl');
var SMAPI     = require('app/client/app/sm/service/sm_api.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var DataParser= require('app/client/app/sm/util/date_parse.js');
var moreTpl   = require('app/client/app/sm/template/widget/log_list_more.tpl');
var BasePage  = require('app/client/app/sm/view/base_page.js');
require('../../style/style.css');

exports.init = function (config) {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '积分明细'
        }
    );
    HybridAPI.invoke('getUserInfo', null)
        .done(function (userInfo) {
            SMAPI.getPointsLog({
                userId: userInfo.user_id,
                pageIndex: config.page_index || 0
            }, function (err, data) {
                $body.removeClass('loading');
                if (err) {
                    $body.addClass('offline');
                    return;
                }
                data.list.forEach(function (item) {
                    if (item.create_time) {
                        item.openDate = DataParser.parseToYMD(item.create_time * 1000);
                    }
                });

                $body.append(template({data: data.list, credit: data.credit, userInfo: userInfo}));
                BasePage.bindNativeA();
                Widget.initWidgets();
            });
        }).fail(function () {
            $body.removeClass('loading');
            $body.addClass('offline');
        });
};
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
                self.$el.html('没有更多了');
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
        $('#feedList').append(moreTpl({data: data}));
    }
});