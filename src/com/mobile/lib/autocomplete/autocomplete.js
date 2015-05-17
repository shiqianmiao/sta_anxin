var $ = require('$');
var EventEmitter = require('com/mobile/lib/event/event.js');

function AutoComplete (config) {
    var self = this;
    var $input = $(config.$input);

    this.config = config;
    this.$input = $input;
    this.cache = {};

    if ($input.is(':focus')) {
        this.listenChange();
    }

    $input
        .on('focus', function () {
            self.listenChange();
        })
        .on('blur', function () {
            self.stopListeningChange();
        });

    this.on('change', function () {
        self.request($input.val().trim());
    });
}

AutoComplete.prototype = new EventEmitter();

AutoComplete.prototype.constructor = AutoComplete;

AutoComplete.prototype.listenChange = function () {
    var lastVal = null;
    var $input = this.$input;
    var self = this;

    clearInterval(this.timer);

    this.timer = setInterval(function () {
        var val = $input.val().trim();

        if (val !== lastVal) {
            self.emit('change');
        }
        lastVal = val;
    }, this.config.changeGap || 300);
};

AutoComplete.prototype.stopListeningChange = function () {
    clearInterval(this.timer);
};

AutoComplete.prototype.request = function (query) {
    var self = this;
    var $input = this.$input;

    if (this.cache[query]) {
        this.emit('data', this.cache[query], query);
        return;
    }

    this.config.getData(query, function (data) {
        self.cache[query] = data;

        if ($input.val().trim() === query && data) {
            self.emit('data', data, query);
        }else{
            self.trigger('empty', query);
        }
    });
};

return AutoComplete;