var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
exports.inputField = Widget.define({
    events: {
        'field-valid': function () {
            this.error = null;
            this.config.$el.removeClass('error').removeClass('show-tip');
            this.tip.hide();
        },
        'field-error': function (e, err) {
            this.error = err;
            this.config.$el.addClass('error');
            this.tip.setContent(err.message);
            this.tip.show();
        },
        'form-error': function (e, err) {
            this.error = err;
            this.tip.hide();
            this.config.$el.addClass('error');
            this.config.$el.removeClass('show-tip');
            this.config.$inlineTip.text(err.message).show();
        },
        'hide-tip': function () {
            this.tip.hide();
            if (this.config.$el.hasClass('error')) {
                this.config.$el.addClass('show-tip');
            }
        },
        'show-tip': function () {
            this.config.$el.removeClass('show-tip');
        },
        'hide-inline-tip': function () {
            this.config.$inlineTip.hide();
            if (this.config.$el.hasClass('error')) {
                this.config.$el.addClass('show-tip');
            }
        },
        'blur [data-role="input"]': function () {
            this.config.$el.removeClass('active');
        },
        'focus [data-role="input"]': function () {
            $(this.config.$inlineTip).hide();
            this.config.$el
                .removeClass('show-tip')
                .addClass('active');
            if (this.config.$el.hasClass('error')) {
                this.tip.setContent(this.error.message);
                this.tip.show();
            }
        },
        'click [data-role="sign"]': function () {
            this.tip.setContent(this.error.message);
            this.tip.show();
        },
        'input [data-role="input"]': function () {
            this.config.$el.removeClass('error');
        },
        'click [data-role="tip"]': function () {
            this.config.$tip.hide();
            this.config.$input.focus();
        },
        'reset': function () {
            this.tip.hide();
            $(this.config.$input).val('');
            this.config.$inlineTip.hide();
            this.config.$el
                .removeClass('error')
                .removeClass('show-tip');
        }
    },
    init: function (config) {
        var $tip = config.$tip;

        this.tip = {
            show: function () {
                $tip.show();
                config.$el.trigger('show-tip');
            },
            hide: function () {
                $tip.hide();
            },
            setContent: function (text) {
                $tip.text(text);
            }
        };
        this.config = config;
        this.name = config.name;

        config.$input = config.$input || config.$el.find('[name="'+ config.name +'"]');
    }
});

exports.selectField = Widget.define({
    events: {
        'field-valid': function () {
            this.error = null;
            this.config.$el.removeClass('error');
            this.tip.hide();
        },
        'field-error': function (e, err) {
            this.error = err;
            this.tip.setContent(err.message);
            this.config.$el.addClass('error');
            this.tip.show();
        },
        'form-error': function (e, err) {
            this.error = err;
            this.tip.hide();
            this.config.$inlineTip.text(err.message).show();
        },
        'hide-tip': function () {
            this.tip.hide();
        },
        'hide-inline-tip': function () {
            this.config.$inlineTip.hide();
        },
        'focus [data-role="select"]': function () {
            this.config.$el.addClass('active');
            this.config.$inlineTip.hide();
        },
        'blur [data-role="select"]': function () {
            this.config.$el.removeClass('active');
        }
    },
    init: function (config) {
        var $tip = config.$tip;
        var $el = config.$el;
        this.config = config;

        this.tip = {
            show: function () {
                $tip.show();
                $el.trigger('show-tip');
            },
            hide: function () {
                $tip.hide();
            },
            setContent: function (text) {
                $tip.text(text);
            }
        };
    }
});

exports.addressField = Widget.define({
    events: {
        'form-error [data-role="field"]': function (e, err) {
            this.error = err;
            this.config.$tip.hide();
            this.config.$inlineTip.text(err.message).show();
            $(e.currentTarget).addClass('error');
        },
        'field-error [data-role="field"]': function (e, err) {
            this.error = err;
            $(e.currentTarget)
                .addClass('error')
                .find('[data-role="tip"]')
                    .text(err.message)
                    .show();
        },
        'hide-tip [data-role="field"]': function (e) {
            $(e.currentTarget)
                .find('[data-role="tip"]')
                    .hide();
        },
        'hide-inline-tip': function () {
            this.config.$inlineTip.hide();
        },
        'focus [data-role="select"]': function () {
            this.config.$el.addClass('active');
            this.config.$inlineTip.hide();
            this.config.$tip.hide();
        },
        'blur [data-role="select"]': function () {
            this.config.$el.removeClass('active');
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.fieldSetWidget = Widget.define({
    events: {
        'form-error [data-role="field"]': function (e, err) {
            this.error = err;
            this.config.$tip.hide();
            this.config.$inlineTip.text(err.message).show();
            $(e.currentTarget).addClass('error');
        },
        'field-error [data-role="field"]': function (e, err) {
            this.error = err;
            $(e.currentTarget)
                .addClass('error')
                .find('[data-role="tip"]')
                    .text(err.message)
                    .show();
        },
        'hide-tip [data-role="field"]': function (e) {
            $(e.currentTarget)
                .find('[data-role="tip"]')
                    .hide();
        },
        'hide-inline-tip': function () {
            this.config.$inlineTip.hide();
        },
        'focus [data-role="field"]': function () {
            this.config.$el.addClass('active');
            this.config.$inlineTip.hide();
            this.config.$tip.hide();
        },
        'blur [data-role="field"]': function () {
            this.config.$el.removeClass('active');
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.userInfoFields = Widget.define({
    events: {
        'click [data-role="refreshCheckCode"]': function () {
            var $checkCode = this.config.$checkCode;
            var url = this.config.$checkCode.attr('src');

            $checkCode.attr('src', url.replace(/(nocache=.*)$/, 'nocache=' + Date.now()));
        },
        'change-to [data-role="tab"]': function () {
            this.toggleDisabled();
        }
    },
    init: function (config) {
        this.config = config;
        this.toggleDisabled();
    },
    toggleDisabled: function() {
        this.config.$tabTitle.each(function() {
            var isDisabeld = true;
            if($(this).hasClass('active')) {
                isDisabeld = false;
            }
            var id = $(this).data('for');
            $(id).find('[data-role="field"]').each(function() {
                $(this).data('isDisabeld', isDisabeld);
            });
        });
    }
});