(function () {
    var config = {
        alias: {
            'zepto': 'lib/zepto/zepto-1.0.js',
            '$': 'lib/zepto/zepto-1.0.js',
            'underscore': 'com/mobile/lib/underscore/underscore.js'
        }
    };

    if (window.location.href.indexOf('NG_ENABLE_LOCALSTORAGE') !== -1) {
        config.enableLocalstorage = true;
    }

    G.config(config);

    if (/\.anxinsta\.com$/.test(window.location.host)) {
        document.domain = 'anxinsta.com';
    }
})();
