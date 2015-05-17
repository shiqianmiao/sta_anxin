var Widget = require('com/mobile/lib/widget/widget.js');
var $      = require('$');

exports.vertical = Widget.define({
    events : {
        'touchstart' : 'touchstart',
        'touchmove'  : 'touchmove',
        'touchcancel': 'touchcancel',
        'touchend'   : 'touchend',
        'click [data-role="scroll"]': function(e) {
            e.preventDefault();
            this.scrollTo();
        }
    },
    init: function (config) {
        this.config  = config;
        this.$el     = config.$el;
        this.pageY   = 0;
        this.pageX   = 0;
        this.current = 0;
        this.swipe   = config.swipe || 'Y';
        this.gape    = config.gape  || 50;
        this.dir     = 'DOWN';
        this.height;
        this.width;
        this.initPage();
    },
    initPage: function (index) {
        var children = this.$el.children('[data-role="item"]');
        this.limit   = this.config.limit || children.size();
        var target   = index ?
                        children[index] : children[0];
        this.height  = this.$el.parent()[0].clientHeight;
        this.width   = this.$el.parent()[0].clientWidth;
        if (!$(target)) {
            return;
        }
        $(target).addClass('moving');
        $(target).css('-webkit-transform', 'translate3d(0, 0, 0)');
        setTimeout(function() {
            $(target).removeClass('moving');
            $(target).addClass('active');
        }, 300);
    },
    touchstart: function (e) {
        var touch  = e.touches[0];
        this.pageY = touch.pageY;
        this.pageX = touch.pageX;
        this.flag  = null;
        this.move  = 0;
        if (this.current === this.limit-2) {
            this.$el.find('#page_job_list').trigger('SCROLL::Reset');
        }
    },
    touchmove: function (e) {
        var touch        = e.touches[0];
        var curY         = touch.pageY - this.pageY;
        var curX         = touch.pageX - this.pageX;
        var $cur         = this.getCurrent();
        var $preSibling  = $cur.prev();
        var $nextSibling = $cur.next();
        var clientHeight = this.height;
        var clientWidth  = this.width;
        if (this.$el.hasClass('page-scroll')) {
            return;
        }
        if (this.current === 0 && curY > 0) {
            return;
        }
        if (this.current === this.limit-1 && curY < 0 ) {
            return;
        }
        if (!this.flag) {
            this.flag = Math.abs(curX) > Math.abs(curY) ? 'X' : 'Y';
            if (this.flag === this.swipe) {
                $cur.addClass('moving');
                $preSibling.addClass('moving');
                $nextSibling.addClass('moving');
            }
        }
        if (this.flag === this.swipe) {
            e.preventDefault();
            e.stopPropagation();
            switch (this.swipe) {
                case 'X':
                    this.move = curX;
                    this.setX($cur, curX);
                    $preSibling[0] && this.setX($preSibling, curX - clientWidth);
                    $nextSibling[0] && this.setX($nextSibling, curX + clientWidth);
                    break;
                case 'Y':
                    this.move = curY;
                    this.setY($cur, curY);
                    $preSibling[0] && this.setY($preSibling, curY - clientHeight);
                    $nextSibling[0] && this.setY($nextSibling, curY + clientHeight);
                    break;
            }
        }
    },
    touchend: function (e) {
        var move         = this.move;
        var $cur         = this.getCurrent();
        var $preSibling  = $cur.prev();
        var $nextSibling = $cur.next();
        $cur.removeClass('moving');
        $preSibling[0] && $preSibling.removeClass('moving');
        $nextSibling[0] && $nextSibling.removeClass('moving');
        if (!this.flag) {
            return ;
        }
        e.preventDefault();
        if (move < -this.gape && $nextSibling[0]) {
            return this.next();
        }
        if (move > this.gape && $preSibling[0]) {
            return this.pre();
        }

        this.reset();
    },
    touchcancel: function () {
        var $cur         = this.getCurrent();
        var $preSibling  = $cur.prev();
        var $nextSibling = $cur.next();
        $cur.removeClass('moving');
        $preSibling[0] && $preSibling.removeClass('moving');
        $nextSibling[0] && $nextSibling.removeClass('moving');
        this.reset();
    },
    reset: function () {
        var height       = this.$el.parent()[0].clientHeight;
        var width       = this.$el.parent()[0].clientWidth;
        var $cur         = this.getCurrent();
        var $preSibling  = $cur.prev();
        var $nextSibling = $cur.next();
        var dir          = this.swipe;
        this.setCurrent($cur);

        $preSibling[0] && this['set' + dir]($preSibling, -(dir === 'Y'? height : width));
        $nextSibling[0] && this['set' + dir]($nextSibling, dir === 'Y'? height : width);
    },
    setY: function ($el, y, unit) {
        $el[0] && ($el.css('-webkit-transform', 'translate3d(0, ' + y + (unit || 'px') + ', 0)'));
    },
    setX: function ($el, x, unit) {
        $el[0] && ($el.css('-webkit-transform', 'translate3d(' + x + (unit || 'px') + ', 0, 0)'));
    },
    setCurrent: function ($cur, index) {
        $cur && ($cur.css('-webkit-transform', 'translate3d(0, 0, 0)'));
        if (index) {
            this.current  = index;
        }
    },
    getCurrent: function () {
        var children = this.$el.children('[data-role="item"]');
        return $(children[this.current]);
    },
    pre: function () {
        this.go(this.current - 1);
    },
    next: function () {
        this.go(this.current + 1);
    },
    go: function (target) {
        var $target  = $(this.$el.children()[target]);
        var $cur     = this.getCurrent();
        var tag      = target < this.current ? -1 : 1;
        var clientHeight = this.$el.parent()[0].clientHeight;
        var clientWidth = this.$el.parent()[0].clientHeight;
        if (target === this.current || target < 0 || target >= this.limit){
            return;
        }
        this.current = target;
        this['set' + this.swipe]($cur, -tag * (this.swipe === 'Y' ? clientHeight : clientWidth));
        this.setCurrent($target, target);
        this.finish($cur, $target);
    },
    scrollTo: function () {
        return;
    },
    finish: function ($el, $target) {
        this.flag = null;
        $el && $el.removeClass('active');
        $target && $target.addClass('active');
    }
});

exports.horizontal = Widget.define({
    events: {
        'touchstart': function (e) {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.touchFrom = 1;

        },
        'touchend': function (e) {
            var $slide = $(e.currentTarget);
            if (this.touchFrom === 2 && this.maxMoveDist > 15) {
                this.maxMoveDist = 0;
                this[this.direction]($slide);
                e.preventDefault();
            }
        },
        'touchmove': function (e) {
            var touch = e.touches[0];
            var distX = touch.clientX - this.startX;
            var distY = touch.clientY - this.startY;
            if(this.touchFrom === 1) {
                if(Math.abs(distX) > Math.abs(distY)) {
                    this.touchFrom = 2;
                } else {
                    this.touchFrom = 3;
                }
            }
            if(this.touchFrom === 2) {
                e.preventDefault();
                e.stopPropagation();
                var $slide = $(e.currentTarget);
                var $slideItem = $slide.find('[data-role="item"]');
                var total = $slideItem.size();

                var width = $slideItem.width();
                var translateX = $slide.data('translateX') || 0;

                if (translateX + distX > 0 || Math.abs(translateX + distX) > width * (total - 1)) {
                    return;
                }

                if (this.maxMoveDist < Math.abs(distX)) {
                    this.maxMoveDist = Math.abs(distX);
                }
                $slide.css($.fx.cssPrefix + 'transform', 'translate3d('+(translateX + distX)+'px, 0, 0)');
                this.direction = distX < 0 ? 'next' : 'prev';
            }
            if (this.touchFrom === 3 && distY < -10 && this.isBottom) {
                if (!this.isNeedScroll()) {
                    return;
                }
                this.bindScroll();
            }
        },
        'Tab::Active': function (e, $cur) {
            var self = this;
            this.bindScroll();
            setTimeout(function () {
                self.stickBar($cur);
            }, 100);
        },
        'Tab::Off' : function () {
            this.removeScroll();
        },
        'SCROLL::Reset': function () {
            this.resetSlide();
        }
    },
    init: function (config) {
        var self         = this;
        this.config      = config;
        this.maxMoveDist = 0;
        this.$el         = config.$el;
        
        this.total       = config.$el.find('[data-role="item"]').size();
        this.$wraper     = $('body').find('#pages');

        this.isScroll    = false;
        this.isBottom    = false;
        this.$el.css({'width': this.total *100 + '%'});
        
        $('[data-role="item"]').scroll(function(e) {
            var $cur = $(e.currentTarget);
            var scrollHeight = $cur[0].scrollHeight;
            var clientHeight = $cur.height();
            var offsetHeight = scrollHeight - clientHeight;
            var scrollTop    = $cur.scrollTop();
            if (offsetHeight - $cur.scrollTop() <= 0 ) {
                self.removeScroll();
                self.isBottom = true;
                return;
            }
            if (scrollTop === 0) {
                self.removeScroll();
            }
            self.isBottom = false;
        });
    },
    next: function ($slide) {
        var index = $slide.data('index') || 0;
        this.slideTo($slide, index + 1, 'next');
    },
    prev: function ($slide) {
        var index = $slide.data('index') || 0;
        this.slideTo($slide, index - 1, 'prev');
    },
    stickBar: function ($cur) {
        // var offsetHeight = $cur.offsetHeight;
        // var scrollHeight = $item[0].scrollHeight;
        var NO_MORE      = 210;
        var HAS_MORE     = 100;
        var $item        = $($cur).closest('[data-role="item"]');
        var isMore       = $item.hasClass('page-job-more');
        $item
            .scrollTop(isMore ? HAS_MORE : NO_MORE);
    },
    removeScroll : function () {
        var self = this;
        self.isScroll = false;
        self.$wraper.removeClass('page-scroll');
    },
    bindScroll : function () {
        var self = this;
        self.isScroll = true;
        self.$wraper.addClass('page-scroll');
    },
    isNeedScroll:function () {
        var self = this;
        return self.config.$el.find('[data-role="tab"]').hasClass('active');

    },
    resetSlide: function () {
        var $el = this.config.$el;
        $el.css($.fx.cssPrefix + 'transform', 'translate3d(0, 0, 0)');
        $el.find('[data-role="tab"]').removeClass('active');
    },
    slideTo: function ($slide, index, direction) {
        var self = this;
        var delt = index - ($slide.data('index') || 0);
        var $slideItem = $slide.find('[data-role="item"]');
        var total = $slideItem.size();
        var width = $slideItem.width();
        var translateX = $slide.data('translateX') || 0;
        if (direction === 'prev' && delt > 0) {
            delt = delt - total;
        }

        if (direction === 'next' && delt < 0) {
            delt = delt + total;
        }
        translateX += -1 * delt * width;
        $slide
            .data('translateX', translateX)
            .data('index', index)
            .animate({
                translate3d: translateX + 'px, 0, 0'
            }, 300 ,function () {
                if (self.index === 0 && index === total - 1 && direction === 'prev') {
                    self.translateX = -1 * (total - 1) * width;
                    $slide.css($.fx.cssPrefix + 'transform', 'translate3d(' + self.translateX + 'px, 0, 0)');
                } else if (self.index === total - 1 && index === 0 && direction === 'next') {
                    self.translateX = 0;
                    $slide.css($.fx.cssPrefix + 'transform', 'translate3d(' + self.translateX + 'px, 0, 0)');
                }
            });
        $slide.find('[data-role="tab"]').removeClass('active').trigger('Tab::Off');
    }
});

exports.tab = Widget.define({
    events : {
        'click [data-role="tab"]' : function (e) {
            e.preventDefault();
            this.changeTab(e);
        }
    },
    init : function (config) {
        this.config = config;
        this.$el    = config.$el;
    },
    changeTab: function (e) {
        var $cur  = $(e.currentTarget);
        if ($cur.hasClass('active')) {
            $cur.removeClass('active');
            if (this.config.triggerNode) {
                $(this.config.triggerNode).trigger('Tab::Off', $cur);
            }
        }else{
            this.reset();
            $cur.addClass('active');
            if (this.config.triggerNode) {
                $(this.config.triggerNode).trigger('Tab::Active',$cur);
            }
        }
    },
    reset: function () {
        this.$el.find('[data-role="tab"]').removeClass('active');
    }
});
exports.forbidden = function (config) {
    var $el = config.$el;
    $el.on('touchmove', function () {
        return false;
    });
};