require('app/client/app/finance/style/loan.jcss');

var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var template = require('../template/authenticate.tpl');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var FinanceUtil = require('app/client/app/finance/controller/util.js');

var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.init = function(config) {
    // 更新open_id
    if(config.open_id) {
        FinanceUtil.saveOpenId(config.open_id);
    }
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent('app/client/app/finance/controller/authenticate.js');
            if(config.open_id) {
                url += '&open_id=' + config.open_id;
            }

            Util.redirect(url);

        } else {
            if (config.edit) {
                exports.goAuthPage(config, userInfo);
                return false;
            }

            // 获取资质状态
            httpApi.request('GET', {}, '/zizhi/getlistingstatus', {
                user_id: userInfo.user_id
            }, function(err, data) {
                data = data.data;

                if (!data.listing_status) {
                    // 未认证过 认证页
                    exports.goAuthPage(config, userInfo);
                } else {
                    // 去详情页
                    Util.redirect('app/client/app/finance/controller/authenticate_detail.js');
                }
            });
        }
    });
};

exports.goAuthPage = function(config, userInfo) {
    var lastFn = function() {
        $('#validatorConfig').data('config', {
            real_name: {
                rules: [
                    ['required', true, '忘记填写姓名啦'],
                    ['minLength', 2, '要填写2-4个汉字哦'],
                    ['maxLength', 4, '要填写2-4个汉字哦'],
                    ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', '要填写2-4个汉字哦']
                ]
            },
            id_card: {
                rules: [
                    ['required', true, '忘记填写身份证号码啦'],
                    ['minLength', 18, '身份证号码长度为18位'],
                    ['maxLength', 18, '身份证号码长度为18位'],
                    ['regexp', '^\\d{17}[0-9Xx]$', '身份证号码最后一位为x或者数字']
                ]
            },
            city_domain: {
                rules: [
                    ['required', true, '忘记选择城市啦']
                ]
            },
            jigou_type: {
                rules: [
                    ['required', true, '忘记选择机构类型啦']
                ]
            },
            jigou_id: {
                rules: [
                    ['required', true, '忘记选择机构名称啦']
                ]
            },
            jigou_phone: {
                rules: [
                    ['required', true, '忘记选择机构固定电话啦'],
                    ['regexp', '^(0\\d{2,3}-)?[2-9][0-9]{6,7}(-\\d{2,5})?$', '固定电话号码格式错误']
                ]
            },
            jigou_addr: {
                rules: [
                    ['required', true, '忘记填写机构地址啦'],
                    ['minLength', 4, '要填写4-25个汉字或字母哦'],
                    ['maxLength', 25, '要填写4-25个汉字或字母哦'],
                    ['regexp', '[\\u4E00-\\u9FA5\\uF900-\\uFA2Da-zA-Z0-9\\s]+', '要填写4-16个汉字、字母或数字哦']
                ]
            },
            img_front: {
                rules: [
                    ['required', true, '忘记上传图片啦'],
                    ['custom', 'app/client/app/finance/widget/loan.js#validImage']
                ]
            },
            img_back: {
                rules: [
                    ['required', true, '忘记上传图片啦'],
                    ['custom', 'app/client/app/finance/widget/loan.js#validImage']
                ]
            },
            img_work: {
                rules: [
                    ['required', true, '忘记上传图片啦'],
                    ['custom', 'app/client/app/finance/widget/loan.js#validImage']
                ]
            }
        });

        Widget.initWidgets();
    };

    if (config.edit) {
        httpApi.request('GET', {}, '/zizhi/getinfo', {
            user_id: userInfo.user_id
        }, function(err, data) {
            if(data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent('app/client/app/finance/controller/authenticate.js');
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            data = data.data;
            if (err || !data) {
                Util.toast('数据获取失败');
                return false;
            }

            var jigouTypeMap = {
                '1': '银行',
                '2': '小贷公司',
                '3': '担保公司',
                '4': '其它'
            };

            data.jigouTypeName = jigouTypeMap[data.jigou_type];

            $('body')
                .removeClass('loading')
                .append(template(data));

            lastFn();
        });
    } else {
        $('body')
            .removeClass('loading')
            .append(template({
                real_name: '',
                id_card: '',
                city_domain: '',
                city_name: '',
                jigou_type: '',
                jigouTypeName: '',
                jigou_id: '',
                jigou_name: '',
                jigou_addr: '',
                jigou_phone: '',
                img_front: '',
                img_back: '',
                img_work: '',
                user_id: userInfo.user_id,
                id: ''
            }));

        lastFn();
    }
};
