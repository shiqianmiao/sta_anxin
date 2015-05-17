var Field = require('com/mobile/widget/form2/field.js');
var EventEmitter = require('com/mobile/lib/event/event.js');
var async = require('com/mobile/lib/async/async.js');
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

function getKeys(obj) {
    var ret = [];
    $.each(obj, function(key) {
        ret.push(key);
    });
    return ret;
}
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

function Form(config) {
    var self = this;
    this.fields = {};
    this.isValid = null;
    if (config.fields) {
        $.each(config.fields, function(name, field) {
            self.setField(name, field);
        });
    }
}
Form.prototype = new EventEmitter();
Form.prototype.constructor = Form;
Form.prototype.setField = function(key, rules) {
    this.fields[key] = new Field({
        form: this,
        rules: rules
    });
};
Form.prototype.validate = function(values, callback) {
    var self = this;
    this.isValid = null;
    async.reduce(getKeys(this.fields), {}, function(errors, field, next) {
        if (self.fields[field].isDisabled) {
            next(null, errors);
            return;
        }
        self.fields[field].validate(values[field], function(err) {
            if (err) {
                errors[field] = err;
            }
            next(null, errors);
        });
    }, function(err, errors) {
        var errorFields = getKeys(errors);
        if (!errorFields.length) {
            self.isValid = true;
            return callback(null);
        }
        if (errors) {
            self.isValid = false;
            return callback(errors);
        }
    });
};
module.exports = Widget.define({
    init: function(config) {
        var self = this;
        this.fields = {};
        this.config = config;
        this.isValid = null;
        this.form = new Form({
            fields: this.fields
        });

        var validations = config.validations || $('#' + config.configId).data('config');
        if (!validations) {
            throw new Error('Not Found Form::ValidatorConfig');
        }
        $(this.config.$field).each(function() {
            var $field = $(this);
            var name = $field.data('name');
            var validation = validations[name];
            var rules = validation.rules;
            $field.data('rules', rules);
            self.form.setField(name, rules);
            //checkbox
            var type = $field.find('[name="' + name + '"]').attr('type');
            if (type === 'checkbox') {
                self.form.fields[name]._type = 'checkbox';
            }
        });
        this.fileds = this.form.fields;
        this.config.$el.attr('novalidate', 'novalidate');
        this.form.getValues = this.getValues.bind(this);
        // 相关事件
        this.config.$el.on('reValid', '[data-role="field"]', function() {
            var name = $(this).data('name');
            self.validateField(name);
        }).on('form-error', function(e, err) {
            //对第一个元素focus
            $.each(err, function(name) {
                if (name) {
                    var $field = self.config.$field.filter('[data-name="' + name + '"]');
                    $field.trigger('field-focus');
                    return false;
                }
            });
        }).on('submit', function(e) {
            var $form = $(this);
            if ($form.data('allowSubmit')) {
                return true;
            }
            e.preventDefault();
            self.validate(function(err) {
                var allowSubmit = false;
                if (!err) {
                    allowSubmit = true;
                    // 提交表单
                    if (!$form.data('disabledSubmit')) {
                        $form.data('allowSubmit', allowSubmit);
                        setTimeout(function() {
                            $form.submit();
                        }, 50);
                    }
                }
            });
        });
    },
    validateField: function(name) {
        var $field = this.config.$field.filter('[data-name="' + name + '"]');
        this.form.fields[name].rules = $field.data('rules');
        if ($field.data('isDisabled') || $field.data('isDisabeld')) {
            return;
        }
        this.form.fields[name].validate(this.getValues()[name], function(err) {
            if (err) {
                $field.trigger('field-error', err);
            } else {
                $field.trigger('field-valid');
            }
        });
    },
    validate: function(callback) {
        var self = this;
        var $form = this.config.$el;
        this.isValid = null;
        $(this.config.$field).each(function() {
            var $field = $(this);
            var name = $field.data('name');
            if ($field.data('isDisabled') || $field.data('isDisabeld')) {
                self.fileds[name].disable();
            } else {
                self.fileds[name].enable();
            }
            self.form.fields[name].rules = $field.data('rules');
        });
        this.form.validate(this.getValues(), function(err) {
            self.isValid = !err;
            if (self.isValid) {
                $form.trigger('form-valid');
            } else {
                $form.trigger('form-error', err);
            }
            self.config.$field.each(function() {
                var $field = $(this);
                var name = $field.data('name');
                if (err && err[name]) {
                    $field.trigger('field-error', err[name]);
                } else if (!$field.data('isDisabled') && !$field.data('isDisabeld')) {
                    $field.trigger('field-valid');
                }
            });
            callback(err);
        });
    },
    getValues: function() {
        var data = this.config.$el.serializeArray();
        var row, ret = {},
            val;
        for (var i = data.length - 1; i >= 0; i--) {
            row = data[i];
            val = parseInt(row.value, 10);
            if (val.toString() !== row.value) {
                val = row.value;
            }
            if (ret[row.name]) {
                if (ret[row.name].push) {
                    ret[row.name].push(val);
                } else {
                    ret[row.name] = [ret[row.name], val];
                }
            } else {
                if (this.form.fields[row.name] && this.form.fields[row.name]._type === 'checkbox') {
                    ret[row.name] = [val];
                } else {
                    ret[row.name] = val;
                }
            }
        }
        return ret;
    }
});
