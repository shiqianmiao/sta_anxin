var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');

var template = require('../template/intro/intro_page.tpl');

require('app/client/app/fw/service/style/service.css');
exports.init = function () {
    $('body').removeClass('loading').append(template());
    Widget.initWidgets();
};
exports.bangbangcall = Widget.define({
    events: {
        'click': function(e){
            var $target = $(e.currentTarget);
            NativeAPI.invoke(
                'makePhoneCall',
                {
                    number: $target.data('phonenumber')
                }
            );
        }
    },
    init: function(config){
        this.config = config;
    }
});