var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
module.exports = Widget.define({
    events: {
        'touchstart [data-id]'   : 'emitScrollToStart',
        'click [data-role="letterIndex"]' : function (e) {
            e.preventDefault();
        }
    },
    init: function (config) {
        var self = this;

        this.config = config;
        this.refer = config.refer || '#bottomUp';

        Widget.ready($(this.refer), function (wg){
            var defer = wg.getInstanceDefer();
            defer.done(function (iscroll) {
                self.iScroll = iscroll;
            });
        });
    },
    emitScrollToStart: function(e) {
        var $cur = $(e.currentTarget);

        var $ele = $($cur.data('id'));

        if ($ele.length > 0) {
            this.iScroll.scrollToElement($ele.get(0), 0);
        }
    }
});