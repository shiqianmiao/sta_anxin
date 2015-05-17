var $ = require('$');

exports.countdown = function(config) {
    require.async('com/mobile/lib/countdown/countdown.js', function() {
        var sixMonths = new Date(new Date().getTime() + 5000 * 1000);
        config.$el.countdown(sixMonths)
            .on('updateCountdown', function(event) {
                $(this).html(event.strftime('' + '<span>%H</span>' + '<span>%M</span>' + '<span>%S</span>'));
            }).on('finishCountdown', function() {
                $(this).html('<span>00</span><span>00</span><span>00</span>');
            });
    });
};