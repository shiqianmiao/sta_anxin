var $      = require('jquery');
var Field  = require('js/util/form/field.js');

function Form (config) {
    if (config) {
        this.init(config);
    }
}

Form.prototype.init = function (config) {
    var self = this;
    var $form = $(config.$el);
    var field;

    var fields = self.fields = config.fields || {};
    self.$el   = $form;

    $form.find('input[name], textarea[name], select[name]').each(function () {
        var $field = $(this);
        var name = $field.attr('name');

        if (fields[name]) {
            fields[name].$el = $(fields[name].$el).add($field);
            return;
        }

        field = new Field({
            $el : $field,
            name: name,
            form: self,
            rules: $field.data('rules')
        });

        fields[name] = field;
    });

    $.each(fields, function (fieldName, field) {
        var events = (field.$el.data('validate-event') || 'change, blur').split(',');
        $.each(events, function (i, e) {
            e = $.trim(e);
            if (!e) {
                return;
            }

            field.$el.on(e, function () {
                if (!field.$el.is(':disabled')) {
                    field.validate();
                }
            });
        });
    });
};

Form.prototype.validate = function () {
    var self   = this;
    var defers = {};

    this.validated = true;
    this.error = {};

    var deferList = $.map(this.fields, function (field, name) {
        if (!field.$el.is(':disabled')) {
            defers[name] = field.validate()
                .fail(function () {
                    self.error[name] = field.error;
                });

            return defers[name];
        }
    });

    return $.when.apply($, deferList)
        .done(function () {
            self.$el.trigger('form-valid');
        })
        .fail(function () {
            self.$el.trigger('form-error');
        });
};

Form.prototype.getValues = function () {
    var data = this.$el.serializeArray();
    var row, ret = {}, val;
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
            ret[row.name] = val;
        }
    }
    return ret;
};

Form.prototype.isValid = function () {
    return this.error && $.isEmptyObject(this.error);
};

module.exports = Form;