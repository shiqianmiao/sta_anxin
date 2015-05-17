(function () {
    G.config({
        baseUrl: 'http://sta2.anxin365.com',
        alias: {
            'zepto': 'com/mobile/lib/zepto/zepto.cmb.js',
            '$': 'com/mobile/lib/zepto/zepto.cmb.js',
            'underscore': 'com/mobile/lib/underscore/underscore.js'
        },
        map: [
            [/^(.*\/ng\/)((.*)\.(js|css|tpl|jcss|jjson))$/, function (url, server, path, filename, ext) {
                var versions = G.config('version') || {};
                var version = versions[path] || G.config('defaultVersion');

                if (path === 'version.js') {
                    return 'http://sta.ganji.com/ng/version.js';
                }

                return server + filename + '.__' + version + '__.' + ext;
            }]
        ],
        enableLocalstorage: true,
        debug: false
    });

    if (/\.ganji\.com$/.test(window.location.host)) {
        document.domain = 'ganji.com';
    }
})();