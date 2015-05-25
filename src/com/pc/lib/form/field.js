var validate = require('./field.js');
var $ = require('jquery');

function Field (config) {
    var self = this;

    this.name   = config.name;
    this.form   = config.form || null;
    this.rules  = config.rules || {};
    this.$el    = $(config.$el);
    this.error = null;

    var next = this.$el.data('next');

    if (next) {
        this.$el.on('field-valid', function () {
            setTimeout(function () {
                self.form.fields[next].validate();
            }, 0);
        });
    }
}

module.exports = Field;

Field.prototype.validate = function () {
    var self  = this;
    var rules = this.rules;
    var value = this.getValue();

    // clean errors
    this.error = null;

    self.$el.trigger('field-validate-start');

    validate(this.form, rules, value, function (err) {
        self.$el.trigger('field-validate-end');
        if (err) {
            self.error = err;
            self.$el.trigger('field-error', [self.name, self.error]);
        } else {
            self.$el.trigger('field-valid', self.name);
        }
    });
};

Field.prototype.isInvalid = function () {
    return !!this.error;
};

Field.prototype.getValue = function () {
    var ret = $.map(this.$el.serializeArray(), function (row) {
        return row.value;
    });

    if (this.$el.size() === 1 && !this.$el.is(':checkbox') && !this.$el.is('select[multiple]')) {
        ret = ret[0];
    } else {
        ret = $.map(ret, function (row) {
            var r = !!row;
            if (r) {
                return r;
            }
        });
    }

    return ret;
};