require('../style/style.jcss');
var template = require('../template/apply.tpl');
var $ = require('$');
var Util = require('app/client/common/lib/util/util.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var HybridAPI = require('app/client/common/lib/api/index.js');


var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var httpApi = new HTTPApi({
    path: '/webapp/jr'
});

exports.init = function(config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        var url, formData;
        if(!userInfo) {
            url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
            return false;
        } else {

            formData = {
                phone: userInfo.phone,
                user_id: userInfo.user_id,
                product_id: config.product_id,
                down_payment: config.down_pay,
                month: config.total_month
            };

            httpApi.request('GET', {
                'interface': 'FenqiUserApplyInfo'
            }, '/fenqi/user/applyInfo', {
                    user_id: userInfo.user_id,
                    apply_no: config.apply_no || ''
                }).done(function(data){
                    if (data.status === 463 || data.status === 403) {
                        Util.toast('请重新登录', 2000);
                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url='+ encodeURIComponent(window.location.hash.slice(1));
                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    if(!data.status) {
                        formData = $.extend(formData, data.data);
                        initPage(formData);
                    }
                });

        }
    });

    function initPage(formData) {
        $('body')
            .removeClass('loading')
            .append(template({
                formData: formData
            }));

        initValidate();

        Widget.initWidgets();
    }

    function initValidate() {
        $('#validatorConfig1').data('config', {
            person_name: {
                rules: [
                    ['required', true, '忘记填写姓名啦'],
                    ['minLength', 2, '要填写2-4个汉字哦'],
                    ['maxLength', 4, '要填写2-4个汉字哦'],
                    ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', '要填写2-4个汉字哦']
                ]
            },
            person_marriage: {
                rules: [
                    ['required', true, '忘记选择婚姻状况啦']
                ]
            },
            person_education: {
                rules: [
                    ['required', true, '忘记选择教育程度啦']
                ]
            },
            card_id: {
                rules: [
                    ['required', true, '忘记填写身份证号码啦'],
                    ['minLength', 18, '身份证号码长度为18位'],
                    ['maxLength', 18, '身份证号码长度为18位'],
                    ['regexp', '^\\d{17}[0-9Xx]$', '身份证号码最后一位为x或者数字'],
                    ['custom', 'app/client/app/finance/fenqi/widget/fenqi.js#validCardId']
                ]
            },
            person_province:{
                rules: [
                    ['required', true, '忘记选择省份啦']
                ]
            },
            person_city:{
                rules: [
                    ['required', true, '忘记选择城市啦']
                ]
            },
            person_district:{
                rules: [
                    ['required', true, '忘记选择区域啦']
                ]
            },
            person_address: {
                rules: [
                    ['required', true, '忘记填写详细地址啦'],
                    ['minLength', 4, '要填写4-35个汉字或字母哦'],
                    ['maxLength', 35, '要填写4-35个汉字或字母哦'],
                    ['regexp', '[\\u4E00-\\u9FA5\\uF900-\\uFA2Da-zA-Z0-9\\s]+', '要填写4-35个汉字、字母或数字哦']
                ]
            },
            card_img1: {
                rules: [
                    ['required', true, '忘记上传图片啦'],
                    ['custom', 'app/client/app/finance/widget/loan.js#validImage']
                ]
            },
            card_img2: {
                rules: [
                    ['required', true, '忘记上传图片啦'],
                    ['custom', 'app/client/app/finance/widget/loan.js#validImage']
                ]
            },
            phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误'],
                    ['custom', 'app/client/app/finance/fenqi/widget/fenqi.js#validPhoneCompare']
                ]
            },
            phone_code: {
                rules: [
                    ['required', true, '忘记填写验证码啦'],
                    ['minLength', 4, '验证码格式错误'],
                    ['maxLength', 6, '验证码格式错误'],
                    ['custom', 'app/client/app/finance/fenqi/widget/fenqi.js#validAuthCode']
                ]
            }
        });

        $('#validatorConfig2').data('config', {
            company_name: {
                rules: [
                    ['required', true, '忘记填写公司名称啦']
                ]
            },
            company_phone: {
                rules: [
                    ['required', true, '忘记填写公司电话啦'],
                    ['regexp', '^0\\d{2,3}-[2-9][0-9]{6,7}(-\\d{2,5})?$', '电话号码格式错误']
                ]
            },
            company_type: {
                rules: [
                    ['required', true, '忘记选择公司性质啦']
                ]
            },
            company_province:{
                rules: [
                    ['required', true, '忘记选择省份啦']
                ]
            },
            company_city:{
                rules: [
                    ['required', true, '忘记选择城市啦']
                ]
            },
            company_district:{
                rules: [
                    ['required', true, '忘记选择区域啦']
                ]
            },
            company_address: {
                rules: [
                    ['required', true, '忘记填写详细地址啦'],
                    ['minLength', 4, '要填写4-35个汉字或字母哦'],
                    ['maxLength', 35, '要填写4-35个汉字或字母哦'],
                    ['regexp', '[\\u4E00-\\u9FA5\\uF900-\\uFA2Da-zA-Z0-9\\s]+', '要填写4-35个汉字、字母或数字哦']
                ]
            },
            company_position: {
                rules: [
                    ['required', true, '忘记选择公司职位啦']
                ]
            },
            company_year: {
                rules: [
                    ['required', true, '忘记选择工作年限啦'],
                    ['regexp', '^[1-9]\\d*$', '要填写正整数哦'],
                    ['min', 1, '现单位工作时长不能小于1'],
                    ['max', 50, '现单位工作时长不能大于50']
                ]
            }
        });

        $('#validatorConfig3').data('config', {
            direct_name: {
                rules: [
                    ['required', true, '忘记填写姓名啦'],
                    ['minLength', 2, '要填写2-4个汉字哦'],
                    ['maxLength', 4, '要填写2-4个汉字哦'],
                    ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', '要填写2-4个汉字哦']
                ]
            },
            direct_relationship: {
                rules: [
                    ['required', true, '忘记选择直系亲属关系啦']
                ]
            },
            direct_phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误'],
                    ['custom', 'app/client/app/finance/fenqi/widget/fenqi.js#validPhoneCompare']
                ]
            },
            other_name: {
                rules: [
                    ['required', true, '忘记填写姓名啦'],
                    ['minLength', 2, '要填写2-4个汉字哦'],
                    ['maxLength', 4, '要填写2-4个汉字哦'],
                    ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', '要填写2-4个汉字哦']
                ]
            },
            other_relationship: {
                rules: [
                    ['required', true, '忘记选择其它亲属关系啦']
                ]
            },
            other_phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误'],
                    ['custom', 'app/client/app/finance/fenqi/widget/fenqi.js#validPhoneCompare']
                ]
            }
        });

        $('#validatorConfig4').data('config', {
            bank_name: {
                rules: [
                    ['required', true, '忘记选择开卡银行啦']
                ]
            },
            bank_card: {
                rules: [
                    ['required', true, '忘记选择还款卡号啦'],
                    ['regexp', '^\\d{11,20}$', '还款卡号格式不对']
                ]
            }
        });

        $('#validatorConfig5').data('config', {
            target_name: {
                rules: [
                    ['required', true, '忘记填写姓名啦'],
                    ['minLength', 2, '要填写2-4个汉字哦'],
                    ['maxLength', 4, '要填写2-4个汉字哦'],
                    ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', '要填写2-4个汉字哦']
                ]
            },
            target_phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误']
                ]
            },
            target_address: {
                rules: [
                    ['required', true, '忘记选择收货地址啦']
                ]
            }
        });
    }
};