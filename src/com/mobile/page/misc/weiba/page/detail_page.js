var Widget  = require('com/mobile/lib/widget/widget.js');
var service = require('com/mobile/page/misc/weiba/lib/service.js');
var Log     = require('com/mobile/lib/log/tracker.js');
var $       = require('$');
exports.like = Widget.define({
    events:{
        'click [data-role=add]': 'add',
        'click [data-role=sub]': 'sub'
    },
    init: function(config){
        this.config = config;
        this.$el    = config.$el;
        this.$left  = config.$left;
        this.$right = config.$right;
        this.good   = config.$praise.text() - 0;
        this.bad    = config.$tread.text() - 0;
        this.aid    = config.aid;
        this.hasAdd = false;
        this.hasSub = false;
        this.origin = config.origin || 'detail';
    },
    add: function(e){
        var self   = this;
        if ($(e.currentTarget).hasClass('visited')) {
            return;
        }
        service.postData({
            url: self.config.url,
            data:{
                aid: self.aid,
                type: 1
            }
        },function (err) {
            if (err) {
                window.alert(err);
                return;
            }
            self.hasAdd = true;
            self.config.$add.addClass('visited');
            self.config.$praise.text(self.good += 1);
            self.$left.addClass('active');
            Log.send('weiba_like_' + self.origin);
            setTimeout(function () {
                self.$left.removeClass('active');
            }, 1000);
        });
    },
    sub: function(e){
        var self  = this;
        if ($(e.currentTarget).hasClass('visited')) {
            return;
        }

        service.postData({
            url: self.config.url,
            data:{
                aid: self.aid,
                type: 0
            }
        },function (err) {
            if (err) {
                window.alert(err);
                return;
            }
            self.hasSub = true;
            self.config.$tread.text(self.bad += 1);
            self.$right.addClass('active');
            self.config.$sub.addClass('visited');
            Log.send('weiba_dislike_' + self.origin);
            setTimeout(function(){
                self.$right.removeClass('active');
            },1000);
        });
    }
});




