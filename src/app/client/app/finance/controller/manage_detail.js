require('app/client/app/finance/style/loan.jcss');
var template = require('../template/manage_detail.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.init = function(config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {
            httpApi.request('GET', {}, '/usercase/getinfo', {
                    user_id: userInfo.user_id,
                    case_id: config.case_id
                })
                .done(function(data) {
                    var globalMsgMap = {
                        '403': '请重新登录',
                        '407': '手机号未绑定'
                    };

                    if (data.status - 0 === 403 || data.status - 0 === 407) {
                        Util.toast(globalMsgMap[data.status+''], 2000);
                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url=';

                            if(data.status - 0 === 407) {
                                url = 'app/client/common/view/account/bind_phone.js?back_url=';
                            }

                            url += encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));

                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    if (!data.status) {
                        data = data.data || [];

                        var labelTextMap = {
                            '1': '新订单',
                            '2': '资质不符',
                            '3': '无效电话',
                            '4': '客户放弃',
                            '5': '进件审批',
                            '6': '审批被拒',
                            '7': '审批通过',
                            '8': '放款失败',
                            '9': '放款成功'
                        };

                        data.label_text = labelTextMap[data.order_status + ''];
                        if (data.order_status + '' === '1') {
                            data.isNew = 1;
                        }

                        if (data.xd_type - 0 === 1) {
                            data.xd_type_text = '个人贷款';
                        } else {
                            data.xd_type_text = '企业贷款';
                        }

                        data.islog = config.islog;

                        $('body')
                            .removeClass('loading')
                            .append(template({
                                detailInfo: data,
                                user_id: userInfo.user_id,
                                case_id: config.case_id
                            }));

                        Widget.initWidgets();
                    } else {
                        Util.toast(data.message);
                    }
                })
                .fail(function() {
                    Util.toast('获取数据失败');
                });
        }
    });
};