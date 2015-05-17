var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

module.exports = Widget.define({
    events: {
        'click [data-role="tabTitle"]': function (e) {
            this.changeTab($(e.currentTarget).data('for'));
        }
    },
    init: function (config) {
        this.config = config;

        this.$tabContents = this.config.$tabTitle.map(function () {
            return $($(this).data('for'));
        });
    },
    changeTab: function (to) {
        this.$tabContents
            .hide()
            .filter(to)
                .show();

        this.config.$tabTitle
            .removeClass('active')
            .filter('[data-for="' + to + '"]')
                .addClass('active');
        this.config.$el.trigger('change-to', to);
    }
});