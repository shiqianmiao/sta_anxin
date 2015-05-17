var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events: {

    },
    init: function (config) {
        this.config = config;
        this.value = null;
    },
    checkChange: function () {
        var $el = this.config.$el;
        var value = $el.data('value') || $el.val();

        if (value !== this.value) {
            this.value = value;
            this.config.$el.trigger('value-change');
        }
    }
});