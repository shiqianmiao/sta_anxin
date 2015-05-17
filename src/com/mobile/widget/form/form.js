var Widget = require('com/mobile/lib/widget/widget.js');
var Form   = require('com/mobile/lib/form/form.js');
var $ = require('$');

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            Fn = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof Fn && oThis ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        Fn.prototype = this.prototype;
        fBound.prototype = new Fn();
        return fBound;
    };
}

module.exports = Widget.define({
    events: {
        'submit': function (e) {
            var self = this;
            if (this.isValid && !this.isChanged) {
                if(self.config.disabledSubmit) {
                    self.config.$el.trigger('Form::Valid');
                    return false;
                }

                if(self.isSubmited) {
                    return false;
                }
                self.isSubmited = true;
                return;
            }

            e.preventDefault();

            this.validate(function (err) {
                self.isChanged = false;
                if (!err) {
                    if(self.config.disabledSubmit) {
                        self.config.$el.trigger('Form::Valid');
                    } else {
                        self.config.$el.submit();
                    }
                }
            });
        },
        'change [data-role="field"]': function (e) {
            this.onChange($(e.currentTarget).data('name'));
        }
    },
    init: function (config) {
        var self = this;
        this.fields = {};
        this.config = config;
        this.isValid = null;
        $(this.config.$field).each(function () {
            var $field = $(this);
            var name = $field.data('name');
            var rules = $field.data('rules');

            self.fields[name] = rules;
        });

        this.form = new Form({
            fields: this.fields
        });
        this.form.getValues = this.getValues.bind(this);
    },
    onChange: function (name) {
        this.isChanged = true;
        this.validateField(name);
    },
    validateField: function (name) {
        var $field = this.config.$field.filter('[data-name="'+name+'"]');
        if ($field.data('isDisabeld')) {
            return;
        }
        this.form.fields[name].validate(this.getValues()[name], function (err) {
            if (err) {
                $field.trigger('field-error', err);
            } else {
                $field.trigger('field-valid');
            }
        });
    },
    validate: function (callback) {
        var self = this;
        var $form = this.config.$el;
        this.isValid = null;

        var fileds = self.form.fields;
        this.config.$field.each(function () {
            var $field = $(this);
            var name = $field.data('name');
            if ($field.data('isDisabeld')) {
                fileds[name].disable();
            } else {
                fileds[name].enable();
            }
        });

        this.form.validate(this.getValues(), function (err) {
            self.isValid = !err;
            if (self.isValid) {
                $form.trigger('valid');
            } else {
                $form.trigger('error', err);
            }
            callback(err);
        });
    },
    getValues: function () {
        return this.config.$el.serializeObject();
    }
});