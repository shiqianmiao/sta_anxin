var $ = require('$');
var _ = require('underscore');
var EventEmitter = require('com/mobile/lib/event/event.js');

var Tip = function(config) {
    var config = config || {};
    var tmpl = '' +
        '<div class="tips-group" data-role="tip">' +
            '<%= message %>' +
        '</div>';
    var $el = this.$el = $( _.template(tmpl, {message: config.message}) ).appendTo(config.$container || 'body');
    var self = this;
    $el.css({
        top: config.top - 36,
        left: config.left - 20
    });

    if (config.events) {
        $.each(config.events, function (name, fn) {
            $el.on(name, fn.bind(self));
        });
    }
};

Tip.prototype = new EventEmitter();
Tip.prototype.constructor = Tip;

Tip.prototype.setContent = function(msg) {
    this.$el.text(msg);
};

Tip.prototype.show = function() {
    this.$el.show();
    this.emit('show');
};

Tip.prototype.hide = function() {
    this.$el.hide();
    this.emit('hide');
};

module.exports = Tip;
