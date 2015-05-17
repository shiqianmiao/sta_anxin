var $    = require('$');
var $tip = $('<div class="tip" style="z-index:999;"></div>').hide().appendTo('body');
var hideTipTimer;
exports.show = function (message, timeout) {
    if (message) {
        $tip.html(message).show();
    }

    if (timeout) {
        clearTimeout(hideTipTimer);
        hideTipTimer = setTimeout(function () {
            $tip.hide();
        }, timeout);
    }

    // $('body').append($tip);

    return {
        setMessage: function (message, timeout) {
            $tip.html(message);
            if (timeout) {
                clearTimeout(hideTipTimer);
                hideTipTimer = setTimeout(function () {
                    $tip.remove();
                }, timeout);
            }
        },
        remove: function () {
            $tip.remove();
        }
    };
};