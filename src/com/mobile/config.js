(function () {
    var config = {
        alias: {
            'zepto': 'com/mobile/lib/zepto/zepto.cmb.js',
            '$': 'com/mobile/lib/zepto/zepto.cmb.js',
            'underscore': 'com/mobile/lib/underscore/underscore.js'
        }
    };

    if (window.location.href.indexOf('NG_ENABLE_LOCALSTORAGE') !== -1) {
        config.enableLocalstorage = true;
    }

    G.config(config);

    if (/\.ganji\.com$/.test(window.location.host)) {
        document.domain = 'ganji.com';
    }
})();