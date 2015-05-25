var $ = require('jquery');
var async = require('js/util/async/async.js');

function ValidatorFactory (form, rules, value, callback) {
    var validators = [];
    var context = {
        form: form
    };

    rules.required = rules.required || [ false ];

    if (rules.required[0] === false && (!value || ($.isArray(value) && !value.length))) {
        return callback();
    }

    if (rules.required[0] && ((!value && value !== 0 ) || ($.isArray(value) && !value.length))) {
        return callback(new Error(rules.required[1]));
    }

    $.each(rules, function (rule, setting) {
        rule = map[rule];
        if (!rule) {
            return;
        }

        validators.push([$.proxy(rule, context), setting]);
    });

    async.each(
        validators,
        function (validator, next) {
            var config = validator[1];
            var fn = validator[0];

            fn(value, config, next);
        },
        callback
    );
}

function maxLengthValidator (value, config, callback) {
    var len = config[0];
    var msg = config[1];
    var err = null;
    if (!value || value.length > len) {
        err = new Error(msg);
    }

    callback(err);
}

function minLengthValidator (value, config, callback) {
    var len = config[0];
    var msg = config[1];
    var err = null;
    if (value && value.length < len) {
        err = new Error(msg);
    }

    callback(err);
}

function maxValidator (value, config, callback) {
    var max = config[0];
    var msg = config[1];
    var err = null;

    if (value > max) {
        err = new Error(msg);
    }

    callback(err);
}

function minValidator (value, config, callback) {
    var min = config[0];
    var msg = config[1];
    var err = null;

    if (value < min) {
        err = new Error(msg);
    }

    callback(err);
}

function formatValidator (value, config, callback) {
    var format = config[0];
    var msg = config[1];
    var err = null;

    var EMAIL_RE = /^[_a-z0-9\-]+(\.[_a-z0-9\-]+)*@[a-z0-9\-]+(\.[a-z0-9\-]+)*(\.[a-z]+)$/;
    var PHONE_RE = /^1[3458]\d{9}$/;

    switch (format) {
        case 'email':
            err = EMAIL_RE.test(value) ? null : new Error(msg);
            break;

        case 'phone':
            err = PHONE_RE.test(value) ? null : new Error(msg);
            break;
        default:
            break;
    }

    callback(err);
}

function compareValidator (value, config, callback) {
    var setting = config[0];
    var msg = config[1];
    var err = null;
    var fn = new Function('data', 'with(data){ return ' + setting + '}');

    if (!fn.call(value, this.form.getValues())) {
        err = new Error(msg);
    }

    callback(err);
}

function regexpValidator(value, rules, callback) {
    var err = null;
    var ret = [];
    if (!$.isArray(rules[0])) {
        rules = [rules];
    }
    // format: [re, msg, isReverse, option];
    var ret = $.map(rules, function (rule) {
        var re = new RegExp(rule[0], rule[4]);
        var isReverse = rule[2];
        var msg = rule[1];
        var test = re.test(value);

        if (isReverse) {
            test = !test;
        }

        if (!test) {
            return msg;
        }
    });

    if (ret.length) {
        err = new Error(ret[0]);
    }

    callback(err);
}

function customizeValidator(value, rules, callback) {
    var self = this;

    if (!$.isArray(rules[0])) {
        rules = [[].slice.call(arguments, 1, arguments.length)];
    }

    async.each(
        rules,
        function (rule, next) {
            var path = rule[0].split('#');

            require.async(path[0], function (fn) {
                if (path[1]) {
                    fn = fn[path[1]];
                }

                fn.call(self, value, rule.slice(1, rule.length), next);
            });
        },
        callback
    );
}

function ajaxValidator(value, rules, callback) {
    if (!$.isArray(rules)) {
        rules = [rules];
    }

    async.each(
        rules,
        function (rule, next) {
            $.ajax(rule)
                .done(function (data) {
                    if (data.error) {
                        next(new Error(data.error));
                    } else {
                        next();
                    }
                })
                .fail(function () {
                    next(new Error('网络错误, 请稍候再试'));
                });
        },
        callback
    );
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
    customize: customizeValidator,
    ajax: ajaxValidator
};