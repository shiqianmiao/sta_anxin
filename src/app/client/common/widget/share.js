var Widget = require('com/mobile/lib/widget/widget.js');
var gjLog = require('app/client/common/lib/log/log.js');
var $ = require('$');

exports.share = Widget.define({
    events : {
        'click [data-role="appstart"]' : function(e){
            var $target = $(e.currentTarget);
            var gjalog = $target.data('gjalog');
            var $popup = this.config.$popup;
            this.config.$mask.addClass('active');
            if ($('body').hasClass('android')) {
                $popup.filter('[data-env="android"]').addClass('active');
            } else {
                $popup.filter('[data-env="ios"]').addClass('active');
            }
            if (gjalog) {
                gjLog.send(gjalog);
            }
        },
        'click [data-role="closePopup"]' : function(e){
            var $target = $(e.currentTarget);
            this.config.$mask.removeClass('active');
            $target.parents('[data-role="popup"]').removeClass('active');
        },
        'click [data-role="downloadapp"]' : function(e){
            var $target = $(e.currentTarget);
            var gjalog = $target.data('gjalog');
            if (gjalog) {
                gjLog.send(gjalog, function(){
                    window.location.href = $target.data('href');
                });
            } else {
                window.location.href = $target.data('href');
            }
        }
    },
    init: function(config){
        this.config = config;
    }
});