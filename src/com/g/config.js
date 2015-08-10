(function () {
    var now = parseInt(Date.now() / 1000, 10);
    var defaultVersion = now - (now % 604800);
    G.config({
        baseUrl: 'http://s1.anxinsta.com/',
        map: [
            [/^(.*\/\/)((.*)\.(js|css|tpl))$/, function (url, server, path, filename, ext) {
                var key = path.replace('s1.anxinsta.com/', '');
                var versions = G.config('version') || {};
                var version = versions[key] || G.config('defaultVersion') || parseInt(defaultVersion + '0', 10);

                return server + filename + '.__' + version + '__.' + ext;
            }]
        ]
    });
})();