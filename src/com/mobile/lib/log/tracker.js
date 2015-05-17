var Cookie = require('com/mobile/lib/cookie/cookie.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var Uuid = require('com/mobile/lib/uuid/uuid.js');
var $ = require('$');
var userInfo = {};
var storage = new Storage('tracker');

try {
    userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
} catch (ex) {
    userInfo = {};
}

var urlParams = parseQueryString(window.location.search);
var server   = 'analytics.ganji.com';
var gjch     = $('head').data('gjch') || '-';
var gc       = $('head').data('gc') || '-';
var guid     = Cookie.get('__utmganji_v20110909') || storage.get('__utmganji_v20110909') || getUuid() || '-';
var sid      = Cookie.get('GANJISESSID') || '-';

var ifid     = Cookie.get('ifid') || getIfid() || '-';
var caInfo   = $('head').data('cainfo') || getCaInfo() || Cookie.get('cainfo') || {};
var userId   = userInfo.user_id;
var ua       = getUaInfo();
var refer    = document.referrer ? encodeURIComponent(document.referrer) : '-';
var caName   = encodeURIComponent(caInfo.ca_name || '-');
var caSource = encodeURIComponent(caInfo.ca_source || '-');
var caKw     = encodeURIComponent(caInfo.ca_kw || '-');
var caId     = encodeURIComponent(caInfo.ca_id || '-');
var caN     = encodeURIComponent(caInfo.ca_n || '-');
var caS     = encodeURIComponent(caInfo.ca_s || '-');
var caI     = encodeURIComponent(caInfo.ca_i || '-');
function getUuid () {
    //generateUUIDV4
    var uuid = Uuid.generateUUIDV4();

    //setCookie 1 years
    if (uuid) {

        Cookie.set('__utmganji_v20110909', uuid, {
            expires: 2*365*8640,
            path: '/',
            domain: '.ganji.com'
        });
    }
    //set localstorage
    storage.set('__utmganji_v20110909', uuid);
    return uuid;
}


function getIfid () {
    return urlParams.ifid;
}

function getCaInfo () {
    //url parse
    var ca_source = urlParams.ca_source;
    var ca_name = urlParams.ca_name;
    var cainfo;
    if(ca_source && ca_name){
    //setcookie
        cainfo = {
            ca_source: ca_source,
            ca_name: ca_name
        };

        Cookie.set('cainfo', JSON.stringify(cainfo), {
            path:'/',
            domain: '.ganji.com'
        });
    }
    return cainfo;
}

function parseQueryString (query) {
    return query.replace(/^\?/, '')
            .split('&')
            .map(function (pair) {
                return pair.split('=');
            })
            .reduce(function (obj, pair) {
                if (pair[0].trim()) {
                    obj[pair[0]] = pair[1];
                }

                return obj;
            }, {});
}

function getUaInfo () {
    var ua = window.navigator.userAgent || '';
    var match = ua.match(/Mozilla\/5.0 \((.*)\) AppleWebKit(.*?) .*like Gecko\)([\S]*) (.*) Safari.*/);
    var device, os;

    if (!match || !match[1]) {
        return 'UNKNOW ' + ua;
    }
    try {
        if (/like Mac OS X/.test(match[1])) {
            os = 'iOS ' + ((match[1].match(/([\d_]*)* like Mac OS X/) || [])[1] || '');
        } else if (/Android/.test(match[1])) {
            os = (match[1].match(/Android.*?;/) || [])[0];
        } else {
            os = 'unknow';
        }

        device = (match[1].match(/^(iPad[^;]*|iPhone[^;]*|iPod[^;]*)/) || match[1].match('.*;(.*)') || [])[1];
        device = device ? device.trim() : '';

        ua = [
            'device:' + device,
            'os:' + os,
            'webkit:' + (match[2] || '').replace('/', ''),
            'browser:' + match[4],
            'lang:' + (window.navigator.language || window.navigator.browserLanguage)
        ].join('|');
        return ua;
    } catch (ex) {
        return 'UNKNOW ' + ua;
    }
}

exports.listen = function () {
    $('body').on('tap', '[data-gjalog]', function (e) {
        var gjalog = $(e.currentTarget).attr('data-gjalog') || '';
        var match;
        if ((match = /^(\d*)$/.exec(gjalog.split('@')[0])) && match[1].substr(-2)[0] === '1') {
            exports.send(gjalog.replace(/\d{8}($|@)/, '00000010$1'));
        } else if (gjalog.indexOf('atype=click') !== -1) {
            exports.send(gjalog);
        }
    });
};

var showLogCache = {};
exports.sendShow = function() {
    $('[data-gjalog]').each(function() {
        var gjalog = $(this).data('gjalog');
        var match;
        if (showLogCache[gjalog]) {
            return;
        }

        showLogCache[gjalog] = true;

        if ((match = /^(\d*)$/.exec(gjalog.split('@')[0])) && match[1].substr(-1)[0] === '1') {
            exports.send(gjalog.replace(/\d{8}($|@)/, '00000001$1'));
        } else if (gjalog.indexOf('atype=') !== -1) {
            var arr = gjalog.split('atype=');
            if(arr[1] && arr[1].indexOf('show') !== -1) {
                exports.send(gjalog);
            }
        }
    });
};

exports.send = function (gjalog, cb) {
    var img = new Image();
    var done = false;
    var url = '//' + server + '/wape.gif?';

    if (gjalog && /^\d*$/.test(gjalog.split('@')[0])) {
        gjalog = 'ge=' + gjalog;
    } else {
        gjalog = 'gjalog=' + gjalog;
    }

    url += [
        'gjch=' + gjch,
        'gc=' + gc,
        'uuid=' + guid,
        'gjuser=' + userId,
        'sid=' + sid,
        'ca_name=' + caName,
        'ca_source=' + caSource,
        'ca_kw=' + caKw,
        'ca_id=' + caId,
        'ca_n=' + caN,
        'ca_s=' + caS,
        'ca_i=' + caI,
        'refer=' + refer,
        'ua=' + ua,
        gjalog,
        'ifid=' + ifid,
        'rnd=' + Math.random()
    ].join('&');

    function callback (err) {
        if (done) {
            return;
        }

        done = true;
        if (cb) {
            cb(err || null);
        }
    }

    img.onload = function () {
        callback();
    };

    img.onerror = function () {
        callback(new Error('network error'));
    };

    setTimeout(function () {
        callback(new Error('timeout'));
    }, 10000);

    img.src = url;
};