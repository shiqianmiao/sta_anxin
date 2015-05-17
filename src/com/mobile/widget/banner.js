var $ = require('$');
var _ = require('com/mobile/lib/underscore/underscore.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var SlideWidget = require('./slide.js');
var swipeImagesRender = require('com/mobile/widget/template/full_screen_swipe.tpl');

/**
 * ### 图片轮播组件
 *
 * 支持左右滑动
 * 支持序号显示
 * 支持查看大图
 *
 * 图片停留时间
 * 示例：停留3秒
 * data-interval="3000"
 *
 * 滚动元素的容器
 * data-role="list"
 *
 * 滚动元素
 * data-role="item"
 *
 * 小图的 src，加在 img 标签中
 * data-src="xxx.jpg"
 *
 * 大图的 src，加在 img 标签中
 * data-big-image="xxxxx.jpg"
 *
 * 上一页
 * data-role="prev"
 *
 * 下一页
 * data-role="next"
 *
 * 当前页数
 * data-role="index"
 *
 * HTML 示例：
 * ```HTML
 * <div class="thumb-houseimg-box" data-interval="3000" data-widget="com/mobile/widget/banner.js">
 *     <ul class="slide-area" data-role="list">
 *         <li data-role="item">
 *             <img src="" data-src="xxx" data-big-image="xxxxx">
 *         </li>
 *         <!-- ...... -->
 *     </ul>
 *
 *     <a class="thumb-img-left" href="javascript:;" data-role="prev"></a>
 *     <a class="thumb-img-right" href="javascript:;" data-role="next"></a>
 *
 *     <!--图片序号-->
 *     <span class="thumb-img-num">
 *         <i data-role="index">3</i>/<i>24</i>
 *     </span>
 * </div>
 * ```
 */
module.exports = SlideWidget.extend({
    events: {
        'click [data-role="item"]': function() {
            if (this.config.$box) {
                this.reopenSliceShow();
            } else {
                this.appendSlideShow();
            }
        },
        'touchstart [data-role="item"]': function (e) {
            this.stop();
            this.startX = e.touches[0].clientX;
        },
        'touchend [data-role="item"]': function () {
            if (this.maxMoveDist > 10) {
                this.maxMoveDist = 0;
                this[this.direction]();
            }

            this.loop();
        },
        'touchmove [data-role="item"]': function (e) {
            var touch = e.touches[0];
            var $list = this.config.$list;
            var dist = touch.clientX - this.startX;

            if (this.maxMoveDist < Math.abs(dist)) {
                this.maxMoveDist = Math.abs(dist);
            }

            if (Math.abs(dist) > this.width || this.maxMoveDist < 10) {
                return;
            } else {
                e.preventDefault();
            }

            $list.css($.fx.cssPrefix + 'transform', 'translate3d('+(this.translateX + dist)+'px, 0, 0)');
            this.direction = dist < 0 ? 'next' : 'prev';
        }
    },
    init: function (config) {
        var $item = config.$item;
        config.interval = config.interval || 1000;
        this.config = config;
        this.index = 0;
        this.total = $(config.$item).length;
        this.loop();
        this.width = this.config.$item.width();
        this.config.$list.width((this.total + 2)*this.width);
        this.translateX = 0;
        this.direction = 'next';
        this.maxMoveDist = 0;

        var $lastClone = $item.eq(this.total - 1).clone();
        var $firstClone = $item.eq(0).clone();

        $lastClone.css({
            'position': 'relative',
            'left': -1 * (this.total + 2) * this.width
        });


        $([
            $item.eq(0).find('img[data-src]'),
            $firstClone.find('img[data-src]'),
            $lastClone.find('img[data-src]')
        ]).each(function () {
            var $this = $(this);
            $this.attr('src', $this.data('src'));
        });

        this.config.$list.append($firstClone).append($lastClone);
    },
    reopenSliceShow: function() {
        var index = parseInt(this.index, 10);

        Widget.ready(this.config.$box, function(widget) {
            widget.reopen(index);
        });
    },
    appendSlideShow: function() {
        var config = this.config;
        var $body = $('body');

        config.$box = $(swipeImagesRender({
            fixWidth: window.innerWidth,
            fixHeight: window.innerHeight,
            index: this.index,
            srcList: (function() {
                var list = [];

                _.each(config.$item, function(item) {
                    list.push( $(item).find('img').data('bigImage') );
                });

                return list;
            }())
        }));

        $body.append(config.$box);
        Widget.initWidget(config.$box);
    },
    slideFn: function (index, direction) {
        var self = this;
        var defer = $.Deferred();
        var delt = index - this.index;
        var $list = this.config.$list;
        var total = this.total;
        var width = this.width;
        // lazy load
        $([
            this.config.$item.eq(index).find('img[data-src]'),
            this.config.$item.eq(index + 1).find('img[data-src]')
        ]).each(function () {
            var $this = $(this);
            if ($this.data('src') && $this.attr('src') !== $this.data('src')) {
                $this.attr('src', $this.data('src'));
            }
        });

        if (direction === 'prev' && delt > 0) {
            delt = delt - total;
        }

        if (direction === 'next' && delt < 0) {
            delt = delt + total;
        }

        var animateTime = 300;
        if(this.disableAnimate) {
            animateTime = 0;
        }

        this.translateX += -1 * delt * width;
        $list.animate({
            translate3d: this.translateX + 'px, 0, 0'
        }, animateTime ,function () {
            if (self.index === 0 && index === total - 1 && direction === 'prev') {
                self.translateX = -1 * (total - 1) * width;
                $list.css($.fx.cssPrefix + 'transform', 'translate3d(' + self.translateX + 'px, 0, 0)');
            } else if (self.index === total - 1 && index === 0 && direction === 'next') {
                self.translateX = 0;
                $list.css($.fx.cssPrefix + 'transform', 'translate3d(' + self.translateX + 'px, 0, 0)');
            }
            defer.resolve();
        });

        this.config.$el.find('[data-slide-to]')
            .removeClass('active')
            .filter('[data-slide-to="' + index + '"]')
                .addClass('active');

        this.config.$el.find('[data-role="index"]').text(index + 1);
        this.config.$el.trigger('Events::bannerSlide', index + 1);
        return defer.promise();
    }
});