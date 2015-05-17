var $ = require('$');
var async = require('com/mobile/lib/async/async.js');

function ValidatorFactory (form, rules, value, callback) {
    var validators = [];
    var requiredRule = [];
    var context = {
        form: form
    };

    if (typeof value === 'string') {
        value = value.trim();

        if (parseInt(value, 10).toString() === value.toString()) {
            value = parseInt(value, 10);

        }
    }

    $.each(rules, function (i, rule) {
        var validator = map[rule[0]];

        if (rule[0] === 'required') {
            requiredRule = [rule[1], rule[2]];
        }

        if (!validator) {
            return;
        }

        validators.push([$.proxy(validator, context), rule.slice(1, rule.length)]);
    });

    if (typeof requiredRule[0] === 'string') {
        requiredRule[0] = (new Function('data', 'with(data){ return ' + requiredRule[0] + '}')).call(value, form.getValues());
    }


    if (requiredRule[0] === false && (!value || ($.isArray(value) && !value.length))) {
        return callback();
    }

    if (requiredRule[0] === true && ((!value && value !== 0 ) || ($.isArray(value) && !value.length))) {
        return callback(new Error(requiredRule[1]));
    }

    async.eachSeries(
        validators,
        function (validator, next) {
            var fn = validator[0];
            var config = validator[1];

            fn(value, config, next);
        },
        callback
    );
}

function maxLengthValidator (value, config, callback) {
    var len = config[0];
    var msg = config[1];

    if (typeof value.length === 'undefined') {
        value = value.toString();
    }

    callback(!value || value.length > len ? new Error(msg) : null);
}

function minLengthValidator (value, config, callback) {
    var len = config[0];
    var msg = config[1];

    if (typeof value.length === 'undefined') {
        value = value.toString();
    }

    callback(value && value.length < len ? new Error(msg) : null);
}

function maxValidator (value, config, callback) {
    var max = config[0];
    var msg = config[1];

    callback(value > max ? new Error(msg) : null);
}

function minValidator (value, config, callback) {
    var min = config[0];
    var msg = config[1];

    callback(value < min ? new Error(msg) : null);
}

function formatValidator (value, config, callback) {
    var format = config[0];
    var msg = config[1];
    var err = null;

    var EMAIL_RE = /^[_a-z0-9\-]+(\.[_a-z0-9\-]+)*@[a-z0-9\-]+(\.[a-z0-9\-]+)*(\.[a-z]+)$/;
    var PHONE_RE = /^1[34578]\d{9}$/;

    switch (format) {
        case 'email':
            err = EMAIL_RE.test(value) ? null : new Error(msg);
            break;

        case 'phone':
            err = PHONE_RE.test(value) ? null : new Error(msg);
            break;
        case 'number':
            err = /^[+-]?[0-9]*$/.test(value) ? null : new Error(msg);
            break;
        case 'chinese_english':
            err = /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+$/.test(value) ? null : new Error(msg);
            break;
        default:
            break;
    }

    callback(err);
}

function compareValidator (value, config, callback) {
    var setting = config[0];
    var msg = config[1];
    var fn = new Function('data', 'with(data){ return ' + setting + '}');

    callback(fn.call(value, this.form.getValues()) ? null : new Error(msg));
}


function regexpValidator(value, rule, callback) {// rule format: [re, msg, isReverse, option];
    var re = new RegExp(rule[0], rule[4]);
    var isReverse = rule[2];
    var msg = rule[1];
    var test = re.test(value);

    if (isReverse) {
        test = !test;
    }

    callback(test ? null : new Error(msg));
}

function customValidator(value, rule, callback) {
    var self = this;
    var path = rule[0].split('#');

    require.async(path[0], function (fn) {
        if (path[1]) {
            fn = fn[path[1]];
        }

        fn.call(self, value, rule.slice(1, rule.length), callback);
    });
}

function ajaxValidator(value, rule, callback) {
    rule.data = rule.data || {};
    rule.data.value = value;

    $.ajax(rule)
        .done(function (data) {
            if (data.error) {
                callback(new Error(data.error));
            } else {
                callback();
            }
        })
        .fail(function () {
            callback(new Error('网络错误, 请稍候再试'));
        });
}

module.exports = ValidatorFactory;

var map = ValidatorFactory.map = {
    minLength: minLengthValidator,
    maxLength: maxLengthValidator,
    max: maxValidator,
    min: minValidator,
    format: formatValidator,
    compare: compareValidator,
    regexp: regexpValidator,
    custom: customValidator,
    ajax: ajaxValidator
};