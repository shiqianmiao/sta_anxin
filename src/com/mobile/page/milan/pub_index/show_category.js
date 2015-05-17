var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

exports.show_category = Widget.define({
    events: {
        'click [data-role="levelOne"] .pub-cont': 'showCategory'
    },
    init: function(config) {
        var that = this;
        this.config = config;
        this.headerHeight = $('#header').height();
        this.config.$levelOne.filter('.active').each(function() {
            that.initWidget($(this));
        });
    },
    showCategory: function(e) {
        var $target = $(e.currentTarget).parent();
        if(!$target.hasClass('active')) {
            this.config.$levelOne.filter('.active').removeClass('active');
        }

        $target.toggleClass('active');
        this.initWidget($target);
    },
    initWidget: function($target) {
        var $current = $target.find('.js-child-category');
        if($target.hasClass) {
            var offsetTop = $target.offset().top;
            $('body').scrollTop(offsetTop - this.headerHeight);

            var screenWidth = $(window).width();
            var len = $current.find('[data-role="item"]').length;
            $current.find('[data-role="item"]').css('width', screenWidth);
            $current.find('[data-role="list"]').css('width', screenWidth * len);
        }

        if (typeof $current.data('widget') === 'undefined') {
            $current.data('widget', 'com/mobile/page/milan/pub_index/show_category.js#slideCategory');
            Widget.initWidget($current);
        }
    }
});

exports.slideCategory = Widget.define({
    events: {
        'click a': function(e) {
            if(this.touchFrom === 2) {
                e.preventDefault();
            }
        },
        'touchstart [data-role="list"]': function (e) {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.touchFrom = 1;

        },
        'touchend [data-role="list"]': function (e) {
            var $slide = $(e.currentTarget);
            if (this.touchFrom === 2 && this.maxMoveDist > 15) {
                this.maxMoveDist = 0;
                this[this.direction]($slide);
                e.preventDefault();
            }
        },
        'touchmove [data-role="list"]': function (e) {
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
        }
    },
    init: function () {
        this.maxMoveDist = 0;
    },
    next: function ($slide) {
        var index = $slide.data('index') || 0;
        this.slideTo($slide, index + 1, 'next');
    },
    prev: function ($slide) {
        var index = $slide.data('index') || 0;
        this.slideTo($slide, index - 1, 'prev');
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

        $slide.closest('.js-child-category')
            .find('[data-index]')
                .removeClass('active')
                .filter('[data-index="' + index + '"]')
                    .addClass('active');
    }
});