require('app/client/app/finance/style/template.jcss');
var template = require('../template/add_template.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.renderTmp = function(data) {
    if(data.type) {
        data.type = data.type + '';
        data.xd_type = data.type;
    } else {
        data.type = data.xd_type;
    }

    $('body')
        .removeClass('loading')
        .append(template({
            data: data
        }));

    $('#validatorConfig').data('config', {
        name: {
            rules: [
                ['required', true, '忘记填写名称啦'],
                ['minLength', 2, '要填写2-6个汉字哦'],
                ['maxLength', 6, '要填写2-6个汉字哦'],
                ['regexp', '^[\\u4E00-\\u9FA5\\uF900-\\uFA2DA-Za-z0-9]+$', '要填写2-6个汉字、字母或数字哦']
            ]
        },
        loan_money_min: {
            rules: [
                ['required', true, '忘记填写最小贷款金额啦'],
                ['regexp', '\\d+$', '贷款金额为整数'],
                ['min', 1, '最小贷款金额不能小于1'],
                ['max', 10000, '最大贷款金额不能大于10000'],
                ['compare', 'this <= loan_money_max', '最小贷款金额不能大于最大值']
            ]
        },
        loan_money_max: {
            rules: [
                ['required', true, '忘记填写最大贷款金额啦'],
                ['regexp', '\\d+$', '贷款金额为整数'],
                ['min', 1, '最小贷款金额不能小于1'],
                ['max', 10000, '最大贷款金额不能大于10000'],
                ['compare', 'this >= loan_money_min', '最小贷款金额不能超过最大贷款金额']
            ]
        },
        loan_month_min: {
            rules: [
                ['required', true, '忘记填写最小贷款期限啦'],
                ['regexp', '\\d+$', '贷款期限为整数'],
                ['min', 1, '最小贷款期限不能小于1'],
                ['max', 360, '最大贷款期限不能大于360'],
                ['compare', 'this <= loan_month_max', '最小贷款期限不能超过最大贷款期限']
            ]
        },
        loan_month_max: {
            rules: [
                ['required', true, '忘记填写最大贷款期限啦'],
                ['regexp', '\\d+$', '贷款期限为整数'],
                ['min', 1, '最小贷款期限不能小于1'],
                ['max', 360, '最大贷款期限不能大于360'],
                ['compare', 'this >= loan_month_min', '最小贷款期限不能超过最大贷款期限']
            ]
        },
        age_min: {
            rules: [
                ['required', true, '忘记填写最小年龄啦'],
                ['regexp', '\\d+$', '年龄为整数'],
                ['min', 16, '最小年龄不能小于16'],
                ['max', 70, '最大年龄不能大于70'],
                ['compare', 'this <= age_max', '最小年龄不能大于最大值']
            ]
        },
        age_max: {
            rules: [
                ['required', true, '忘记填写最大年龄啦'],
                ['regexp', '\\d+$', '年龄为整数'],
                ['min', 16, '最小年龄不能小于16'],
                ['max', 70, '最大年龄不能大于70'],
                ['compare', 'this >= age_min', '最小年龄不能超过最大年龄']
            ]
        },
        city_domain: {
            rules: [
                ['required', true, '忘记选择城市啦']
            ]
        },
        qiye_time: {
            rules: [
                ['required', true, '忘记选择经营时间啦']
            ]
        },
        qiye_type: {
            rules: [
                ['required', true, '忘记选择身份要求啦']
            ]
        },
        qiye_money: {
            rules: [
                ['required', true, '忘记选择企业半年流水啦']
            ]
        },
        qiye_fang: {
            rules: [
                ['required', true, '房产估值不能为空'],
                ['regexp', '^(-)?\\d*$', '房产估值必须为整数'],
                ['min', -1, '房产估值必须大于0']
            ]
        },
        qiye_che: {
            rules: [
                ['required', true, '车辆估值不能为空'],
                ['regexp', '^(-)?\\d*$', '车辆估值必须为整数'],
                ['min', -1, '车辆估值必须大于0']
            ]
        },
        card_record: {
            rules: [
                ['required', true, '忘记选择两年信用流水啦']
            ]
        },
        'loan_type': {
            rules: [
                ['required', true, '忘记选择贷款类型啦']
            ]
        },
        geren_company_type: {
            rules: [
                ['required', true, '忘记选择单位性质啦']
            ]
        },
        geren_salary_type: {
            rules: [
                ['required', true, '忘记选择工资发放形式啦']
            ]
        },
        geren_salary: {
            rules: [
                ['required', true, '忘记选择月收入啦']
            ]
        },
        geren_work_time: {
            rules: [
                ['required', true, '忘记选择贷款类型啦']
            ]
        },
        geren_shebao: {
            rules: [
                ['required', true, '忘记选择社保缴纳时长啦']
            ]
        },
        geren_gjj: {
            rules: [
                ['required', true, '忘记选择公积金缴纳时长啦']
            ]
        },
        geren_fang: {
            rules: [
                ['required', true, '忘记选择名下房产啦']
            ]
        },
        geren_che: {
            rules: [
                ['required', true, '忘记选择名下车辆啦']
            ]
        }
    });

    Widget.initWidgets();
};

exports.init = function(config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            Util.redirect('app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/add_template.js'));
        } else {

            if (config.id) {
                // edit
                httpApi.request('GET', {}, '/template/getinfo', {
                        user_id: userInfo.user_id,
                        id: config.id
                    })
                    .done(function(data) {
                        if(data.status - 0 === 403) {
                            Util.toast('请重新登录', 2000);
                            setTimeout(function() {
                                var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent('app/client/app/finance/controller/my_template.js');
                                Util.redirect(url);
                            }, 2000);

                            return false;
                        }

                        if (!data.status) {
                            exports.renderTmp(data.data);
                        } else {
                            Util.toast(data.message);
                        }
                    })
                    .fail(function() {
                        Util.toast('获取模版失败');
                    });

            } else {
                exports.renderTmp({
                    user_id: userInfo.user_id,
                    type: config.type
                });
            }


        }
    });
};