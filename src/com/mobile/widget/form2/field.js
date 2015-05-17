var validate = require('com/mobile/widget/form2/validator.js');
var EventEmitter = require('com/mobile/lib/event/event.js');

function Field(config) {
    this.form = config.form || null;
    this.rules = config.rules || {};
    this.isDisabled = false;
    this.isValid = null;
}

Field.prototype = new EventEmitter();

Field.prototype.constructor = Field;

Field.prototype.validate = function(value, callback) {
    var self = this;
    this.isValid = null;

    validate(this.form, this.rules, value, function(err) {
        if (err) {
            self.trigger('error', self.error);
        } else {
            self.trigger('valid');
        }
        self.isValid = !err;
        if (callback) {
            callback(err);
        }
    });
};

Field.prototype.disable = function() {
    this.isDisabled = true;
};

Field.prototype.enable = function() {
    this.isDisabled = false;
};

module.exports = Field;