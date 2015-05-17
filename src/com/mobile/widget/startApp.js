var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var Log       = require('com/mobile/lib/log/tracker.js');

module.exports = Widget.define({
    events:{
        'click': 'openApp'
    },
    init: function(config){
        $('body').addClass('fixed-guide');

        this.config = config;
        this.start();
    },
    start: function(){
        var url = window.location.href;
        var config = this.config;
        if(url.indexOf('isappinstalled=1')>0){
            config.$el.text('打开');
        }
        else{
            config.$el.text('下载');
        }
    },
    openApp : function (){
        var self = this;
        Log.send('weixin_gjsh_dl@atype=click', function () {
            window.location.href = self.config.downloadUrl;
        });
    }
});