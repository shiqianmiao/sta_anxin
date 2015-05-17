var $ = require('$');
var $iframe = $('<iframe src="http://sta.ganji.com/ng/com/mobile/lib/crossdomain_rpc/index.html"></iframe>');
var RPC = require('com/mobile/lib/rpc/rpc.js');

var done = module.async();
var rpc = new RPC();

$iframe.css('display', 'none');

$(window).on('message', function (e) {
    if (e.data === 'ready') {
        rpc.ready();
        done();
        return;
    }
    rpc.onMessage(e.data);
});

$('body').append($iframe);

rpc.send = function (message) {
    $iframe[0].contentWindow.postMessage(message, '*');
};

exports.init = function (file, callback) {
    rpc.invoke('load', file, function (err) {
        callback(err, rpc);
    });
};