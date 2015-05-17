var Widget = require('com/mobile/lib/widget/widget.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');
var tpl = require('./index.tpl');

exports.init = function () {
    $('body').removeClass('loading').append(tpl());
    Widget.initWidgets();
};

exports.open = Widget.define({
    events: {
        'tap [data-role="btn"]': function () {
            var data = {};
            var $input = this.config.$input;
            data[$input.attr('name')] = $input.val();

            NativeAPI.invoke('createNativeView', {
                name: this.config.name,
                data: data
            });
        }
    }
});