var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var Swipe = require('com/mobile/lib/swipe/swipe.js');

module.exports = Widget.define({
    events: {
        'touchmove': function(e) {
            e.preventDefault();
        },
        'click': function() {
            this.config.$el.hide();
            this.showBottom();
        }
    },
    init: function(config) {
        this.config = config;
        this.config.$bottomPanel = $('.fixed-conn');
        this.hideBottom();

        this.swipe = new Swipe( config.$swipe.get(0), {
            startSlide: config.initIndex || 0,
            speed: 400,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            callback: function(index) {
                config.$index
                    .removeClass('active')
                    .eq(index)
                        .addClass('active');
            },
            transitionEnd: function() {}
        });
    },
    reopen: function(index) {
        this.hideBottom();
        this.config.$el.show();
        this.swipe.slide(index);
    },
    showBottom: function() {
        this.config.$bottomPanel.show();
    },
    hideBottom: function() {
        this.config.$bottomPanel.hide();
    }
});