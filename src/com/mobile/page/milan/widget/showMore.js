var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

module.exports = Widget.define({
    events: {
        'click [data-role="toggle"]': function () {
            var $el = this.config.$el;
            var hasActive = $el.hasClass('active');

            if (hasActive) {
                this.config.$text.text(this.config.unFoldText);
                $(window).scrollTop($el.offset().top);
            } else {
                this.config.$text.text(this.config.foldText);
            }

            this.config.$el.toggleClass('active');
        }
    },
    init: function (config) {
        this.config = config;
        this.config.foldText = config.foldText || '收起';
        this.config.unFoldText = config.unFoldText || '查看更多';
    }
});