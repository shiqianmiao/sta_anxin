var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var template = require('../template/order_detail.tpl');
var XicheAPI = require('../lib/xiche_api.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function(config) {
    BasePage.init();

    HybridAPI.invoke('getUserInfo')
        .done(function(userInfo) {
            XicheAPI.getOrderDetail({
                    userId: userInfo.user_id,
                    puid: config.id
                })
                .done(function(data) {
                    // '2'  订单取消， '4'  订单过期
                    if (data.needsStatus === '2' || data.needsStatus === '4') {
                        Util.redirect(
                            'app/client/app/xiche/pub_page/view/order_list.js?' +
                            $.param(config)
                        );
                    }

                    $('body')
                        .removeClass('loading')
                        .append(template({
                            post: data,
                            needsPuid: config.id
                        }));

                    Widget.initWidgets();

                    BasePage.afterInitWidget();
                })
                .fail(function() {
                    $('body')
                        .removeClass('loading')
                        .addClass('offline');
                });
        })
        .fail(function() {
            $('body')
                .removeClass('loading')
                .addClass('offline');
        });
};

exports.detail = Widget.define({
    events: {
        'click [data-role="back"]': 'back',
        'click [data-role="cancelNeedsBtn"]': 'showCancelNeedsDialog',
        'click .js-popup .js-cancel': function(e) {
            $(e.currentTarget).closest('.js-popup').hide();
        },
        'click [data-role="phoneDialog"]': function(e) {
            if (e.target === this.config.$phoneDialog[0]) {
                this.config.$phoneDialog.hide();
            }
        },
        'click [data-role="cancelOrderDialog"]': function(e) {
            if (e.target === this.config.$cancelOrderDialog[0]) {
                this.config.$cancelOrderDialog.hide();
            }
        },
        'click [data-role="cancelOrderDialog"] [data-role="confirmBtn"]': 'cancelNeeds',
        'click [data-role="payBtn"]': 'pay',
        'click [data-role="image"]': function(e) {
            this.showImageDialog($(e.currentTarget).attr('src'));
        },
        'click [data-role="bigImageDialog"]': 'hideImageDialog',
        'click [data-role="phoneBtn"]': 'showPhoneDialog',
        'touchstart [data-role="starWraper"]': function(e) {
            var pos = this.config.$starWraper.position();
            var width = this.config.$starWraper.width();
            var delt = e.touches[0].pageX - pos.left;
            var index = Math.ceil(delt / width * 5);
            var $star = this.config.$star.eq(index - 1);

            $star.siblings().removeClass('active');

            this.config.$starInput.val($star.index() + 1);

            do {
                $star.addClass('active');
                $star = $star.prev();
            } while ($star.length);
        },
        'click [data-role="submitCommentBtn"]': 'saveComment'
    },
    init: function(config) {
        this.config = config;
    },
    saveComment: function() {
        var level = this.config.$starInput.val();
        var comment = this.config.$commentText.val();
        var needsInfo = this.config.needsInfo;
        if (!level) {
            Util.toast('请选择评价星级');
            return;
        }

        XicheAPI.saveOrderComment({
                needs_puid: this.config.needsPuid,
                employee_puid: needsInfo.employeeInfo.employeePuid,
                employee_user_id: needsInfo.employeeInfo.employeeId,
                city_id: 12,
                level: level,
                comment: comment || ''
            })
            .done(function() {
                Util.toast('评价成功');
                window.location.reload();
            })
            .fail(function() {
                Util.toast('网络异常，请稍后再试');
            });
    },
    cancelNeeds: function() {
        var self = this;
        if (this.canceling) {
            return;
        }
        this.canceling = true;

        XicheAPI.cancelOrder({
                puid: this.config.needsInfo.needs_puid
            })
            .done(function() {
                self.back();
            })
            .fail(function() {
                Util.toast('网络异常，请稍后再试');
            });
    },
    pay: function() {
        Util.redirect(
            'app/client/app/xiche/pub_page/view/choose_payment.js?' +
            $.param({
                order_id: this.config.needsInfo.orderInfo.order_id,
                amount: this.config.needsInfo.orderInfo.pay_amount,
                puid: this.config.needsInfo.needs_puid
            })
        );
    },
    showPhoneDialog: function() {
        this.config.$phoneDialog.show();
    },
    showImageDialog: function(url) {
        var img = new Image();
        var width = $('body').width();
        img.src = url.replace(/\d*-\d*c?_\d-\d/, width + '-' + width + '_9-0');

        this.config.$bigImageDialog
            .html(img)
            .show();
    },
    hideImageDialog: function() {
        this.config.$bigImageDialog.hide();
    },
    showCancelNeedsDialog: function() {
        this.config.$cancelOrderDialog.show();
    },
    back: function() {
        Util.redirect('app/client/app/xiche/pub_page/view/order_list.js');
    }
});