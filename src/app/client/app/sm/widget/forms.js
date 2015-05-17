var BaseField = require('com/mobile/widget/form2/BaseField.js');

exports.inputField = BaseField.extend({
    events: {
        'focus [data-role="input"]': function() {
            var self = this;

            if(this.error) {
                this.$tipSpan
                        .addClass('active')
                        .text(this.error.message);

                this.timer = setTimeout(function() {
                    self.$tipSpan.removeClass('active');
                }, 3000);
            }
        },
        'blur [data-role="input"]': function() {
            clearTimeout(this.timer);
            this.$tipSpan.removeClass('active');
        },
        'field-valid': function() {
            this.error = null;
            // 选择性校验
            if (this.config.condition) {
                if (!this.$input.val()) {
                    this.updateTip(null, '');
                    return false;
                }
            } else  {
                this.updateTip(null, '');
            }

        },
        'field-error': function(e, err) {
            this.error = err;
            this.updateTip('has-warning', '');
        },
        'field-focus': function() {
            this.$input.focus();
        }
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.$tipSpan = config.$tipSpan;
    },
    updateTip: function(className) {
        this.config.$warning.removeClass('has-warning valid-valid');
        if (className) {
            this.config.$warning.addClass(className);
        }
    }
});
