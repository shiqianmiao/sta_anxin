var Widget    = require('com/mobile/lib/widget/widget.js');
var BaseForm  = require('com/mobile/widget/form2/form.js');
var template  = require('app/client/app/sm/template/prize/address.tpl');
var Util      = require('app/client/common/lib/util/util.js');
var SMAPI     = require('app/client/app/sm/service/sm_api.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Storage   = require('app/client/app/sm/util/storage.js');

require('../../style/style.css');


var $ = require('$');

exports.init = function (config){
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '填写收货信息'
        }
    );
    $('body')
        .removeClass('loading')
        .append(template({
            data: config.prize_info
        }));

    $('#form')
        .data('validations', {
            express_phone: {
                rules: [
                    ['required', true, '联系电话不能为空'],
                    ['regexp', '^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$|(^1[34578]\\d{9}$)', '电话格式不符']
                ]
            },
            express_consignee: {
                rules: [
                    ['required', true, '收货人不能为空'],
                    ['regexp', '/^[~`@#$%^&*]*$/', '收货人中不能包含特殊字符', true]
                ]
            },
            express_address: {
                rules: [
                    ['required', true, '地址不能为空'],
                    ['regexp', '/^[~`@#$%^&*]*$/', '收货地址中不能包含特殊字符', true]
                ]
            }
        })
        .on('adress-success', function (event, data) {
            var url = 'app/client/app/sm/view/prize/exchange_page.js?prize_info=';
            var prize_info = $.extend(config.prize_info, data);
            Storage.set('exchange_credite', Date.now());
            setTimeout(function () {
                    Util.redirect(url +  window.encodeURIComponent(JSON.stringify(prize_info)));
                }, 0);
        });

    Widget.initWidgets();
};

exports.form = BaseForm.extend({
    events: {
        'blur [data-role="field"]': function(e) {
            var trigger = $(e.currentTarget).data('trigger');
            if (trigger !== 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var self = this;
            SMAPI.createOrder(formData, function(err, data) {
                    if (err) {
                        Util.toast('提交失败，请稍后再试');
                        return;
                    }
                    self.config.$el.trigger('adress-success', $.extend({bought_time: data.bought_time}, formData));
                });
        },
        'countdown:end': function () {
            $('#errorPop').trigger('Events::alertPop');
            this.config.$subBtn.prop('disabled', true);
        },
        'Events::tipOff': function () {
            NativeAPI.invoke('back');
        }
    },
    init: function(config) {
        var self = this;
        this.super_.init.call(this, config);
        this.defaultFormData = config.$el.serializeObject();
        NativeAPI.registerHandler('back', function( params, callback){
            self.cancelOrder();
            callback({preventDefault:0});
        });
    },
    cancelOrder: function () {
        SMAPI.cancelOrder(this.defaultFormData);
    }
});

exports.countdown = Widget.define({
    events: {
    },
    init: function (config) {
        this.config = config;
        this.count  = (config.count || 1 ) * 60;
        this.timer  = 0;
        this.$el    = config.$el;
        this.$countdown = config.$countdown || config.$el;
        if (!config.stop) {
            this.start();
        }
    },
    tick: function (count) {
        this.render(--count);
    },
    render: function (count) {
        var sec = count % 60;
        var min = (count - sec <= 0) ? 0 : (count - sec)/60;
        var str = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
        this.$countdown.text(str);
    },
    loop: function () {
        var i = this.count;
        var self = this;
        this.timer = setInterval(function () {
            if (self.pause) {
                return;
            }
            if (i <= 1) {
                self.$el.trigger('countdown:end');
                clearInterval(self.timer);
                return;
            }
            self.tick(--i);
        }, 1000);
    },
    start: function () {
        this.loop();
    }
});
