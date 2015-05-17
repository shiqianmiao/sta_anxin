var Util = require('app/client/common/lib/util/util.js');

exports.redirectToLoginPage = function (action) {
    action = action || 'login';
    Util.redirect('app/client/app/xiche/pub_page/view/login.js?action='+action+'&back_url=' +
        window.location.hash.replace(/^#/, ''));
};

exports.redirectToIndexPage = function () {
    Util.redirect('app/client/app/xiche/pub_page/view/index.js');
};