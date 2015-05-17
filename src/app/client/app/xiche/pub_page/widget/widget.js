var Util = require('app/client/common/lib/util/util.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.link = function (config) {
    config.$el.on('click', function () {
        if (/^https?:\/\//.test(config.url)) {
            window.location.href = config.url;
        } else {
            Util.redirect(config.url);
        }
    });
};

exports.list = Widget.define({
    events: {
        'click [data-role="item"]': function (e) {
            this.selectItem($(e.currentTarget).data('id'));
        },
        'click [data-role="select"]': function (e) {
            var $cur = $(e.currentTarget);
            var config = this.config;

            $.extend(config.params, $cur.data());

            $cur.addClass('active');

            var url = $cur.data('url');
            this.redirect(url);
        },
        'click [data-role="cancel"]': function () {
            this.back();
        }
    },
    init: function(config) {
        this.config = config;
        config.params = config.params || {};
    },
    redirect: function (url) {
        Util.redirect( url +
            (url.indexOf('?') === -1 ? '?' : '&') + $.param(this.config.params));
    },
    back: function () {
        Util.redirect(
            (this.config.backUrl || 'app/client/app/xiche/pub_page/view/index.js') +
            '?' + $.param(this.config.params)
        );
    },
    selectItem: function (id) {
        if (id) {
            this.config.params[this.config.name] = id;
        }

        Util.redirect(
            (this.config.nextUrl || 'app/client/app/xiche/pub_page/view/index.js') +
            '?' + $.param(this.config.params)
        );
    }
});

exports.letterNav = Widget.define({
    events: {
        'touchmove': function (e) {
            var y = e.touches[0].clientY - this.startY;
            e.preventDefault();
            if (y < 0) {
                return;
            }
            y = parseInt(y / this.height * this.letters.length, 10);
            if (y > this.letters.length - 1) {
                y = this.letters.length - 1;
            }
            this.show(this.letters[y]);
        },
        'touchstart [data-letter]': function (e) {
            this.show($(e.currentTarget).data('letter'));
        }
    },
    init: function (config) {
        var $letter = config.$letter;
        this.config = config;

        this.letters = $letter.map(function () {
            return $(this).data('letter');
        }).toArray();

        this.startY = $letter.eq(0).position().top;
        this.height = $letter.eq($letter.size() - 1).position().top - this.startY;
    },
    show: function (letter) {
        this.config.$el.trigger('enter-letter', letter);
    }
});