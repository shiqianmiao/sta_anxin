/**
 * @desc 公共js
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-30
 */

// dependences
var $ = require('$');
var Public = exports;

Public.showQrCode = function(config) {
    var $el = config.$el;
    var qrCodeUrl = $el.data('qrcode');
    var html = '<div class="alert-mark flex-center er-close-mark" id="er-window" ><img src="' + qrCodeUrl + '" class="erpic" /></div>';
    $el.on('tap', function(){
        var $qrWindow = $('#er-window');
        if ($qrWindow.length > 0) {
            $qrWindow.removeClass('window-hide');
        } else {
            $('body').append(html);
            $qrWindow = $('#er-window');
        }
        $qrWindow.on('touchend', function(event){
            $qrWindow.addClass('window-hide');
            $qrWindow.off('touchend');
            event.preventDefault();
        });
    });
};