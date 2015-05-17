var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');

var XicheAPI = require('../lib/xiche_api.js');
var XicheUtil = require('../lib/util.js');
var template = require('../template/red_packet_list.tpl');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    XicheAPI.getRedPacketList({
        page_index: 0
    })
        .done(function (data) {
            $('body')
                .removeClass('loading')
                .append(template($.extend({}, data, {
                    isXmhy: BasePage.getSearch().ca_s === 'xmhy'
                })));

            Widget.initWidgets();

            BasePage.afterInitWidget();
        })
        .fail(function () {
            XicheUtil.redirectToLoginPage();
        });
};

exports.redPacketList = Widget.define({
    init: function (config) {
        var self = this;

        // init 里面取了第一页的，这里从第二页开始
        this.page = 1;
        this.config = config;

        $(window).on('scroll', function () {
            var top;
            if (self.loading) {
                return;
            }
            top = $(window).scrollTop();

            if (document.body.scrollHeight - $('body').height() - top < 50) {
                self.loadMore();
            }
        });
    },
    loadMore: function () {
        var self = this;

        if (this.loading) {
            return;
        }

        this.loading = true;

        Util.toast('加载中...', 1000);

        XicheAPI.getRedPacketList({page_index: this.page++ })
            .done(function (data) {
                if (!data.list || !data.list.length) {
                    Util.toast('加载完毕', 1000);
                    return;
                }

                self.loading = false;
                data.list.forEach(function (coupon) {
                    self.appendRedPacket(coupon);
                });
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试', 1000);
            });
    },
    appendRedPacket: function (redPacket) {
        var self = this;
        require.async('../template/red_packet_list_item.tpl', function (tpl) {
            self.config.$list.append(tpl({
                redPacket: redPacket
            }));
        });
    }
});
