var $ = require('$');
var _ = require('underscore');

exports.init = function() {
    var $body = $('body');

    document.title = '赶集易洗车';

    // longhu UI
    var ca_s = exports.getSearch().ca_s;

    if (ca_s) {
        $body.addClass(ca_s);

        if (ca_s === 'longhu') {
            document.title = '千丁互联';
        }
    }
};

exports.afterInitWidget = function() {
    if (/boxcomputing.html/.test(window.location.pathname) ||
        /MiuiBrowser/.test(window.navigator.userAgent)) {
        // 条件2：小米浏览器或者小米黄页
        $('.yxc-brand').hide();
    }
};

exports.getSearch = (function() {
    var searchs;
    return function() {
        if (searchs) {
            return searchs;
        }
        return _.reduce(location.search.slice(1).split('&'), function(memo, item) {
            item = item.split('=');
            memo[item[0]] = item[1];
            return memo;
        }, {});
    };
})();