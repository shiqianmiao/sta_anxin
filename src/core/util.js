var $ = require('jquery');
var Util = exports;

Util.ua = {
    ie          : 0,
    opera       : 0,
    gecko       : 0,
    webkit      : 0,
    chrome      : 0,
    mobile      : null,
    air         : 0,
    ipad        : 0,
    iphone      : 0,
    ipod        : 0,
    ios         : null,
    android     : 0,
    os          : null
};

Util.guid = function ( prefix ) {
    prefix = prefix || '';
    return prefix  + '_' + Date.now() + Math.random();
}