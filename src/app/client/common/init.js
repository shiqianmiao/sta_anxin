var hash = window.location.hash.replace(/^#/, '').split('?');
var $ = require('$');
var Logger = require('app/client/common/lib/log/log.js');
var viewPath = /^https?:\/\//.test(hash[0]) ? null : hash[0]; // 避免XSS漏洞
var config = getConfig() || {};
var timing = {START: Date.now() - window.GJ_START_TIMESTAMP};

Logger.setGjch(window.location.hash.replace(/^#/, '').split('?')[0]);

$('body')
    .on('touchstart', 'a, .js-touch-state', function () {
        $(this).addClass('touch');
    })
    .on('touchmove', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    })
    .on('touchend', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    })
    .on('touchcancel', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    });

function getConfig () {
    var config = '';
    var hash = window.location.hash.replace(/^#/, '').split('?');
    config = hash[1] ? hash[1] : '';

    if (!config) {
        return null;
    }

    return config.split('&')
        .map(function (pair) {
            return pair.split('=');
        })
        .reduce(function (obj, pair) {
            var val, key;
            key = pair[0].trim();

            val = decodeURIComponent((pair[1] || '').replace(/\+/g, '%20'));
            val = $.zepto.deserializeValue(val);

            if (key) {
                obj[key] = val;
            }

            return obj;
        }, {});
}

if (config.loadingTip) {
    $('.js-loading-tip').text(config.loadingTip).append('<br>努力加载中...');
}

// 兼容URL尾部被意外添加&或者?的问题
viewPath = viewPath.split(/&|\?/)[0];

require.async([viewPath], function (view) {
    var params;

    timing.VIEW = Date.now() - timing.START - window.GJ_START_TIMESTAMP;
    timing.DURATION = Date.now() - window.GJ_START_TIMESTAMP;
    params = $.param(config).replace(/&/g, '@');

    params = params ? '@' + params : '';

    if (!G.config('debug')) {
        Logger.send('p' + params + '&' + $.param(timing), 'http://tralog.ganji.com/ng/h5p.gif?');
        Logger.send('PAGE_VIEW' + params);
    }
    Logger.listen();

    view.init(config);

    if (view.update && 'onhashchange' in window) {
        window.addEventListener('hashchange', function () {
            view.update(getConfig());
        }, false);
    }
})
    .fail(function () {
        $('body').removeClass('loading').addClass('offline');
    });
