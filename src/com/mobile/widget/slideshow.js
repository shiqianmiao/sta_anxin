var $ = require('$');
var BannerWidget = require('com/mobile/widget/banner.js');

/**
 * ### 图片轮播组件·大图部分
 *
 * 扩展自 com/mobile/widget/banner.js
 * BannerWidget.extend({ ...... })
 *
 * 图片停留时间
 * 示例：停留3秒
 * data-interval="3000"
 *
 * 从第几张图片开始播放大图
 * data-init-index="1"
 *
 * 滚动元素的容器
 * data-role="list"
 *
 * 滚动元素
 * data-role="item"
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
 * 关闭按钮
 * data-role="close"
 *
 * HTML 示例：
 * ```HTML
 * <div class="big-images-slider" data-init-index="1" data-widget="com/mobile/widget/slideshow.js">
 *     <div class="caption">
 *         <span class="big-index" data-role="index">1</span>/24张<i class="close" data-role="close"></i>
 *     </div>
 *     <div class="big-img-body">
 *         <ul class="slide-area clear" data-role="list">
 *             <li data-role="item">
 *                 <img src="xxx.png">
 *             </li>
 *         </ul>
 *     </div>
 * </div>
 * ```
 */
module.exports = BannerWidget.extend({
    events: {
        'click [data-role="close"]': function(e) {
            this.disableAnimate = false;
            var self = this;
            e.preventDefault();
            self.config.$el.hide();
            this.showBottom();
        },
        'click [data-role="item"]': function() {}
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.config = config;
        this.super_.stop();
        if (config.initIndex) {
            this.disableAnimate = true;
            this.slideTo(parseInt(config.initIndex, 10));
        }
        this.config.$bottomPanel = $('.fixed-conn');
        this.hideBottom();
    },
    reopen: function(index) {
        this.disableAnimate = true;
        this.slideTo(index);
        this.hideBottom();
        this.config.$el.show();
    },
    showBottom: function() {
        this.config.$bottomPanel.show();
    },
    hideBottom: function() {
        this.config.$bottomPanel.hide();
    },
    loop: function () {
    }
});