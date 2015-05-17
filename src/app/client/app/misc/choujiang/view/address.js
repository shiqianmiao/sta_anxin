var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/choujiang/template/address.tpl');
var CJAPI       = require('app/client/app/misc/choujiang/service/api.js');
var BaseForm  = require('com/mobile/widget/form2/form.js');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
require('../style/style.css');

var BasePage    = require('app/client/app/misc/choujiang/widget/base_page.js');
var User = BasePage.user;

var $ = require('$');

exports.init = function (config){
    var refer = config.refer;
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': (refer && refer.isMod) ? (refer.isFirst ? '填写收货信息' : '修改收货信息') : '填写收货信息'
        }
    );
    User.getUserInfo(function (userInfo) {
        var userId = userInfo && userInfo.user_id;
        CJAPI.getAddress({user_id: userId}, function (err, data) {
            var $body = $('body');
            $body.removeClass('loading');
            if (err) {
                $body.addClass('offline');
                return;
            }
            if (!data) {
                $body.addClass('nothing');
                return;
            }
            data.user_id = userId;
            data.name = refer.productName;
            data.is_mod  = refer.isMod;
            data.is_first= refer.isFirst;
            $body.append(template({data: data}));
            $('#form')
            .data('validations', {
                express_phone: {
                    rules: [
                        ['required', true, '*手机号不能为空'],
                        ['regexp', '^1[34578]\\d{9}$', '*手机格式不符']
                    ]
                },
                express_consignee: {
                    rules: [
                        ['required', true, '*收货人不能为空'],
                        ['regexp', '/^[~`@#$%^&*]*$/', '*收货人中不能包含特殊字符', true]
                    ]
                },
                express_address: {
                    rules: [
                        ['required', true, '*地址不能为空'],
                        ['regexp', '/^[~`@#$%^&*]*$/', '*收货地址中不能包含特殊字符', true]
                    ]
                }
            })
            .on('address-success', function () {
                if (refer && refer.isMod) {
                    NativeAPI.invoke('webViewCallback', {url: window.location.pathname + '#app/client/app/misc/choujiang/view/prize_list_page.js'});
                } else {
                    var url = 'app/client/app/misc/choujiang/view/prize_list_page.js';
                    Util.redirect(url);
                }
            });
            Widget.initWidgets();
        });
    });
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
            CJAPI.saveAddress(self.config.isMod, formData, function(err) {
                    if (err) {
                        Util.toast('提交失败，请稍后再试');
                        return;
                    }
                    self.config.$el.trigger('address-success', formData);
                });
        }
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.defaultFormData = config.$el.serializeObject();
    }
});
