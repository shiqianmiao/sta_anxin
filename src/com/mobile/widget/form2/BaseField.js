var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    init: function(config) {
        var $form = config.$el.parents('form');
        this.name = config.name;
        this.$el = config.$el;
        this.$input = config.$input || config.$el.find('[name="' + config.name + '"]');
        var validations = $form.data('validations') || $('#' + $form.data('configId')).data('config');
        if (!validations) {
            return null;
        }
        var validatorConfig = validations[this.name];

        if (!validatorConfig) {
            throw new Error('Not Found validatorConfig for Filed::' + this.name);
        }

        if (!this.$el.data('tipSpanId')) {
            this.$el.data('tipSpanId', validatorConfig.tipSpanId);
            config.tipSpanId = validatorConfig.tipSpanId;
        }

        if (!this.$el.data('focusMessage')) {
            this.$el.data('focusMessage', validatorConfig.focusMessage);
            config.focusMessage = validatorConfig.focusMessage;
        }

        if (!this.$el.data('defaultMessage')) {
            this.$el.data('defaultMessage', validatorConfig.defaultMessage);
            config.defaultMessage = validatorConfig.defaultMessage;
        }

        this.$tipSpan = $('#' + config.tipSpanId);
        this.config = config;
    }
});