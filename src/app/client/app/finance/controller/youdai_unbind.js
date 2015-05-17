var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var AccountAPI = require('app/client/common/view/account/lib/api.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrongyd'
});


exports.init = function(config) {
    var open_id = config.open_id;

    httpApi.request('GET', {}, '/user/unbind', {
            open_id: open_id
        })
        .done(function() {
            AccountAPI.logout();

            Util.toast('解除绑定成功', 2000);
            setTimeout(function() {
                var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/youtdai_list.js');
                Util.redirect(url);
            }, 2000);
        });
};
