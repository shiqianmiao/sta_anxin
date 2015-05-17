// var Widget = require('com/mobile/lib/widget/widget.js');
var FormWidget = require('com/mobile/widget/form/form.js');
var $ = require('$');

module.exports = FormWidget.extend({
    events: {
        'error': function (e, errors) {
            var self = this;
            var order = this.getOrder();
            var firstError = order.length - 1;
            Object.keys(errors).forEach(function (key) {
                self.config.$field
                    .filter('[data-name="'+key+'"]')
                        .trigger('form-error', errors[key]);


                if (order.indexOf(key) < firstError) {
                    firstError = order.indexOf(key);
                }
            });

            firstError = order[firstError];

            $(window).scrollTop(self.config.$field.filter('[data-name="'+firstError+'"]').offset().top - 46);

            this.config.$el.one('focus', '[data-role="field"]', function () {
                self.config.$field.each(function () {
                    $(this).trigger('hide-inline-tip');
                });
            });
        },
        // 聚焦某个字段时，检查隐藏这个字段后面的所有字段的tip
        'focus [data-role="field"]': function (e) {
            var $field = $(e.currentTarget);
            var name = $field.data('name');
            var order = this.getOrder();
            var index = order.indexOf(name);

            if (index !== order.length - 1) {
                this.config.$field.filter('.error').each(function () {
                    if (order.indexOf($(this).data('name')) > index) {
                        $(this).trigger('hide-tip');
                    }
                });
            }
        },
        // 如果在操作某个字段时，隐藏当前字段的tip
        'input [data-role="field"]': function (e) {
            $(e.currentTarget).trigger('hide-tip');
            this.config.$field.filter('.error').trigger('hide-tip');
        },
        'change [data-role="field"]': function (e) {
            var $field = $(e.currentTarget);
            $field.trigger('hide-tip');
            this.onChange($field.data('name'));
        },
        'field-valid [data-role="field"][data-name="phone"]': function () {
            this.config.$field.filter('[data-name="username"]').trigger('change');
        },
        // 某个字段展现tip时，隐藏所有其他字段tip
        'show-tip [data-role="field"]': function (e) {
            var $field = $(e.currentTarget);
            var name = $field.data('name');

            this.config.$field.filter('.error').each(function () {
                var $this = $(this);

                if (!$this.is('[data-name="'+name+'"]')) {
                    $this.trigger('hide-tip');
                }
            });
        }
    },
    init: function (config) {
        this.super_.init.call(this, config);
    },
    getOrder: function () {
        return this.config.$field.map(function () {
            return $(this).data('name');
        }).toArray();
    }
});