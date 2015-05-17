var $ = require('$');
var template = require('../template/index.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var cg = require('../cracking-glass.js');
var Share = require('com/mobile/widget/share/share.js');
var WeixinApi = require('com/mobile/lib/wxapi/wxapi2.js');
var Util = require('app/client/common/lib/util/util.js');
var Shake = require('com/mobile/widget/shake/shake.js').shake;

/*style*/
require('../style/style.jcss');

exports.share = Widget.define({
    events: {
        'click .close': 'close'
    },
    init: function(config) {
        this.config = config;
    },
    close: function() {
        this.config.$el.removeClass('active');
        return false;
    }
});

exports.shareBtn = function(config) {
    var share;
    var weixin = new WeixinApi();
    var shareObj = {
        url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/april_fool/view/index.js',
        title: '再不玩儿我，你就老了！',
        desc: '听说玩儿过我的人，98%都找到了真爱，不知道准不准？',
        imgUrl: 'http://stacdn201.ganjistatic1.com/att/project/app/april_fool/img/wechat.jpg',
        imageTitle: '再不玩儿我，你就老了！'
    };
    weixin.ready(function(API) {
        API.registerShareEvents(shareObj);
    });
    share = new Share({
        $btnEl: config.$el,
        shareObj: shareObj
    });
};

var $container, $canvas, $shrewmouse, width, height;

exports.init = function() {
    $('body').removeClass('loading');
    $('body').append(template({}));
    document.title = '再不玩儿我，你就老了！';

    var $shake = $('#shake');
    var $share = $('#share');
    $shrewmouse = $('.shrewmouse');
    $container = $('#draw-picker');
    $canvas = $container.find('canvas');
    width = $container.width();
    height = $container.height();

    Widget.initWidgets();

    $canvas.css({
        position: 'absolute',
        width: width,
        height: height
    }).each(function() {
        this.width = width;
        this.height = height;
    });
    var glassContainer = new GlassContainer($container);

    var HIT_EVENT = 'touchstart.hit';

    $container.on(HIT_EVENT, function(e) {
        var pos = $container.offset(),
            x = e.pageX || e.changedTouches[0].pageX - pos.left - 5,
            y = e.pageY || e.changedTouches[0].pageY - pos.top - 5;

        if (isHint(e)) {
            $shrewmouse.addClass('active');

            glassContainer.startCreak();
            glassContainer.crack({
                x: x,
                y: y
            });
        } else {
            $shrewmouse.removeClass('pause');
        }
    });

    glassContainer.$elem.on('crack', function() {
        if (glassContainer.crackTime === 3) {
            glassContainer.stopCreak();
            $container.off(HIT_EVENT);

            setTimeout(function() {
                $('#beat').removeClass('active');
                $shake.addClass('active');
                bindShakeEvent(function() {
                    $container.removeClass('active');
                    $shake.removeClass('active');
                    $share.addClass('active');
                });
            }, 4000);
        }
    });
};

exports.groupList = function(config) {
    config.$el.find('[data-group-id]').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            Util.redirect('app/client/app/misc/car_share/view/group_join.js?city_id=12&group_id=' + $(this).data('groupId'));
        });
    });
};

function isHint(e) {
    $shrewmouse.addClass('pause');
    var $mouse = $('.mouse');
    var offset = $mouse.offset();

    var x = e.pageX || e.changedTouches[0].pageX;
    var y = e.pageY || e.changedTouches[0].pageY;

    if (offset.left < x && x < offset.left + offset.width &&
        offset.top < y && y < offset.top + offset.height) {
        return true;
    }
    return false;
}

function GlassContainer($elem) {
    this.$elem = $elem;
    $elem.data('object', this);

    this.CRACK_EVENT = 'touchstart.crack';
    this.isCrack = false;
    this.crackTime = 0;

    this.$canvas = $elem.find('canvas');
    this.glass = new Glass(this.$canvas[0]);
}
GlassContainer.prototype.show = function() {
    this.$elem.addClass('active');
};
GlassContainer.prototype.hide = function() {
    this.$elem.removeClass('active');
};
GlassContainer.prototype.startCreak = function() {
    this._bindCrackEvent();
};
GlassContainer.prototype.stopCreak = function() {
    this._offCrackEvent();
};
GlassContainer.prototype.crack = function(center) {
    this.glass.crack(center);
    this.crackTime += 1;
    this.$elem.trigger('crack');
};
GlassContainer.prototype._bindCrackEvent = function() {
    var me = this;
    var pos = this.$elem.offset();
    this.isCrack = true;
    this.$elem.on(this.CRACK_EVENT, function(e) {
        var center = {
            x: e.pageX || e.changedTouches[0].pageX - pos.left - 5,
            y: e.pageY || e.changedTouches[0].pageY - pos.top - 5
        };
        me.crack(center);
    });
};
GlassContainer.prototype._offCrackEvent = function() {
    this.isCrack = false;
    this.$elem.off(this.CRACK_EVENT);
};

function Glass(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.cache_canvas = document.createElement('canvas');
    this.cache_ctx = this.cache_canvas.getContext('2d');
    this.cache_canvas.width = 1280;
    this.cache_canvas.height = 2560;
    cg.renderCrackEffectAll(this.cache_ctx, {
        x: this.cache_canvas.width / 2,
        y: this.cache_canvas.height / 2
    });
    this.cache_image = new Image();
    this.cache_image.src = this.cache_canvas.toDataURL();
}

Glass.prototype.crack = function(center) {
    var ccw = this.cache_canvas.width,
        cch = this.cache_canvas.height;

    this.ctx.drawImage(this.cache_canvas, center.x - ccw / 2, center.y - cch / 2);
};

function bindShakeEvent(callback) {
    var shake = Shake.extend({
        onShake: function(){
            callback();
        }
    });
    shake({sensitivity: 20});
}
