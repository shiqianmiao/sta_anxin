var Widget = require('com/mobile/lib/widget/widget.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var $      = require('$');
exports.unlock = Widget.define({
    events : {
        'touchmove [data-role="slider"]': 'slider',
        'touchend  [data-role="slider"]': 'reset',
        'unlock'                        : 'unlock',
        'click [data-role="close"]'     : 'close'
    },
    init: function (config) {
        this.config = config;
        this.$el    = config.$el;
        this.$lockContent = config.$lockContent;
    },
    slider: function (event) {
        event.preventDefault();
        var el = event.target;
        var touch = event.touches[0];
        var scale = this.$lockContent[0].clientWidth - 50;
        var curX = touch.pageX - this.$lockContent[0].offsetLeft - 73;
        if(curX <= 0) {
            return;
        }
        if (curX > 30) {
            this.config.$dot[0].style.opacity = 30;
            this.config.$arrow[0].style.display = 'none';
        }
        if(curX > 50){
            this.config.$dot[0].style.opacity = 0;
        }
        if (curX > scale) {
            curX = scale;
            this.$el.trigger('unlock');
        }
        el.style.webkitTransform = 'translateX(' + curX + 'px)';
    },
    reset : function (event) {
        var el = event.target;
        el.style.webkitTransition = '-webkit-transform 0.3s ease-in';
        $(el).on( 'webkitTransitionEnd', function() { el.style.webkitTransition = 'none'; }, false );
        el.style.webkitTransform = 'translateX(0px)';
        this.config.$dot[0].style.opacity = 100;
        this.config.$arrow[0].style.display = 'block';
    },
    unlock : function () {
        var self = this;
        window.location.href = self.config.url;
        self.close();
    },
    close : function () {
        this.$el.hide();
        try{
            Cookie.set('wap_xunyuan','off',{
                domain : '3g.ganji.com',
                expires: 7*24*3600,
                path   : '/'
            });
        }catch(ex){}
    }
});