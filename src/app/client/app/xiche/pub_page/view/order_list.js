var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var template = require('../template/order_list.tpl');
var itemTemplate = require('../template/order_list_item.tpl');
var XicheAPI = require('../lib/xiche_api.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    HybridAPI.invoke('getUserInfo')
        .done(function (userInfo) {
            $('body')
                .append(template({
                    userId: userInfo.user_id
                }));
            Widget.initWidgets();

            BasePage.afterInitWidget();
        })
        .fail(function () {
            Util.redirect('app/client/app/xiche/pub_page/view/login.js?from=list');
        });
};

exports.list = Widget.define({
    events: {
        'click [data-role="item"]:not(.disable)': function (e) {
            var $item = $(e.currentTarget);
            var id = $item.data('id');

            Util.redirect(
                'app/client/app/xiche/pub_page/view/order_detail.js?id=' + id);
        },
        'tap [data-role="loadMoreBtn"]': 'loadMore',
        'click [data-role="item"][data-status="4"], [data-role="item"][data-status="2"]': function (e) {
            var $item = $(e.currentTarget);
            var status = $item.data('status');

            if (status === 4) {
                this.config.$deleteOrderDialogText.text('订单已过期，是否删除订单？');
            } else {
                this.config.$deleteOrderDialogText.text('订单已取消，是否删除订单？');
            }

            this.config.$deleteOrderDialog
                .data('puid', $item.data('id'))
                .show();
        },
        'click [data-role="deleteOrderDialog"] [data-role="confirmBtn"]': 'deleteOrder',
        'click [data-role="deleteOrderDialog"] .js-cancel': function () {
            this.config.$deleteOrderDialog.hide();
        },
        'click [data-role="deleteOrderDialog"]': function (e) {
            if (e.target === this.config.$deleteOrderDialog[0]) {
                this.config.$deleteOrderDialog.hide();
            }
        }
    },
    init: function (config) {
        this.config = config;
        this.page = -1;
        this.pageSize = 10;
        this.loadMore();
    },
    loadMore: function () {
        var self = this;
        if (this.total && this.page * this.pageSize > this.total) {
            Util.toast('没有找到更多订单了');
            this.config.$loadMoreBtn.hide();
            return;
        }

        if (this.loading) {
            return;
        }
        this.loading = true;
        this.page++;
        this.config.$loadMoreBtn.text('加载中...');

        XicheAPI.getOrderList({
            userId: this.config.userId,
            page: this.page
        })
            .done(function (data) {
                self.total = data.total;
                $('body').removeClass('loading');

                if (data.total <= (self.page + 1) * self.pageSize) {
                    self.config.$loadMoreBtn.hide();
                }

                if (self.page === 0 && (!data.needsList || !data.needsList.length)) {
                    $('body').addClass('nothing');
                    $('.js-nothing-tip').text('没有查询到洗车订单哦，快去洗车');
                    return;
                }

                self.render(data.needsList);
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试');
            })
            .always(function () {
                self.loading = false;
                self.config.$loadMoreBtn.text('查看更多');
            });
    },
    render: function (data) {
        this.config.$list.append(itemTemplate({
            list: data
        }));
    },
    deleteOrder: function () {
        var config = this.config;
        var puid = config.$deleteOrderDialog.data('puid');
        var $item = config.$el.find('[data-role="item"][data-id="' + puid + '"]');
        var self = this;

        if (this.deleting) {
            return;
        }

        this.deleting = true;

        XicheAPI.deleteOrder({
            puid: puid
        })
            .done(function () {
                $item.remove();
                if ($('[data-role=item]').length === 0) {
                    Util.redirect(
                        (config.backUrl || 'app/client/app/xiche/pub_page/view/index.js') +
                        '?' + $.param(config.params || {})
                    );
                }
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试');
            })
            .always(function () {
                self.deleting = false;
                self.config.$deleteOrderDialog.hide();
            });
    }
});
