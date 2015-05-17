require('app/client/app/finance/style/loan.jcss');

var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var template = require('../template/authenticate_detail.tpl');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');

exports.init = function(config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');
            if(config.open_id) {
                url += '&open_id=' + config.open_id;
            }

            Util.redirect(url);
        } else {
            var httpApi = new HTTPApi({
                path: '/webapp/jinrong'
            });

            httpApi.request('GET', {}, '/zizhi/getinfo', {
                user_id: userInfo.user_id
            }, function(err, data) {
                if(data.status - 0 === 403) {
                    Util.toast('请重新登录', 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                        Util.redirect(url);
                    }, 2000);

                    return false;
                }

                data = data.data;
                data.real_img_back = JSON.parse(data.img_back)[0][0].thumbUrl;
                data.real_img_front = JSON.parse(data.img_front)[0][0].thumbUrl;
                data.real_img_work = JSON.parse(data.img_work)[0][0].thumbUrl;

                var jigouTypeMap = {
                    '1': '银行',
                    '2': '小贷公司',
                    '3': '担保公司',
                    '4': '其它'
                };

                var statusTextMap = {
                    '1': '审核中',
                    '5': '已认证',
                    '6': '未通过'
                };

                data.statusText = statusTextMap[data.listing_status] || '未知';

                data.jigouTypeName = jigouTypeMap[data.jigou_type];

                $('body')
                    .removeClass('loading')
                    .append(template(data));
                Widget.initWidgets();
            });
        }
    });
};