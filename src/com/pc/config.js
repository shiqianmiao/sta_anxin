(function () {
    var config = {
        alias: {
            "jquery": "lib/jquery/jquery-1.8.2.js",
            "underscore": "lib/underscore/underscore.js",
            "events": "lib/event/event.js",
            "widget": "lib/widget/widget.js",
            "uploader": "widget/imageUploader/image_uploader.cmb.js",
            "validator": "widget/form/form.cmb.js",
            "util": "core/util.js",
        }
    };

    if (window.location.href.indexOf('NG_ENABLE_LOCALSTORAGE') !== -1) {
        config.enableLocalstorage = true;
    }

    G.config(config);

    /*if (/\.anxinsta\.com$/.test(window.location.host)) {
        document.domain = 'anxinsta.com';
    }*/
    if (/\.anxin365\.com$/.test(window.location.host)) {
        document.domain = 'anxin365.com';
    }
})();