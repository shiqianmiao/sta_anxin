var $ = require('$');

module.exports = (function () {
    var $tip = $('<div class="toast"></div>').hide().appendTo('body');
    var hideTipTimer;
    return function (message, timeout) {
        if (message) {
            $tip.html('<span>'+ message +'</span>').show();
        }

        if (timeout) {
            clearTimeout(hideTipTimer);
            hideTipTimer = setTimeout(function () {
                $tip.hide();
            }, timeout);
        }

        $('body').append($tip);

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
})();