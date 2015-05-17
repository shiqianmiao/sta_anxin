var Field  = require('./field.js');
var EventEmitter  = require('com/mobile/lib/event/event.js');
var async  = require('com/mobile/lib/async/async.js');

function Form (config) {
    var self = this;
    this.fields = {};
    this.isValid = null;

    if (config.fields) {
        Object.keys(config.fields).forEach(function (field) {
            self.setField(field, config.fields[field]);
        });
    }
}

Form.prototype = new EventEmitter();
Form.prototype.constructor = Form;

Form.prototype.setField = function (key, rules) {
    this.fields[key] = new Field({
        form: this,
        rules: rules
    });
};

Form.prototype.validate = function (values, callback) {
    var self   = this;

    this.isValid = null;

    async.reduce(
        Object.keys(this.fields),
        {},
        function (errors, field, next) {
            if (self.fields[field].isDisabled) {
                next(null, errors);
                return;
            }
            self.fields[field].validate(values[field], function (err) {
                if (err) {
                    errors[field] = err;
                }

                next(null, errors);
            });
        },
        function (err, errors) {
            var errorFields = Object.keys(errors);
            if (!errorFields.length) {
                self.isValid = true;
                self.trigger('valid');
                return callback(null);
            }

            if (errors) {
                self.isValid = true;
                self.trigger('error');
                return callback(errors);
            }
        }
    );
};

module.exports = Form;