var $ = require('$');
var _ = require('com/mobile/lib/underscore/underscore.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var slideImagesRender = require('com/mobile/widget/template/slide_images.tpl');

/**
 * ### 点击展示大图（轮播）
 *
 * 需要点击后展示大图的 img 标签需要加上这个 css class：js-enlarge-image
 *
 * 大图的 src，加在 img 标签中；如果没有则使用 src
 * data-big-image="xxxxx.jpg"
 *
 * HTML 示例：
 * ```HTML
 * <section data-widget="com/mobile/widget/enlarge.js">
 *  <img class="js-enlarge-image" src="" data-big-image="xxxxx">
 * </section>
 * ```
 */
module.exports = Widget.define({
    events: {
        'click .js-enlarge-image': 'showBigImages'
    },
    init: function (config) {
        this.config = config;
        this.config.$images = $('.js-enlarge-image');
        this.index = 0;
    },
    showBigImages: function(e) {
        var config = this.config;
        var index = config.$images.index(e.currentTarget);

        if (config.$box) {
            this.reopenSliceShow(index);
        } else {
            this.appendSlideShow(index);
        }
    },
    reopenSliceShow: function(index) {
        var config = this.config;

        Widget.ready(config.$box, function(widget) {
            widget.reopen(index);
        });
    },
    appendSlideShow: function(index) {
        var config = this.config;
        var $body = $('body');

        config.$box = $(slideImagesRender({
            fixWidth: $body.width(),
            index: index,
            srcList: (function() {
                var list = [];

                _.each(config.$images, function(img) {
                    list.push( $(img).data('bigImage') || img.src );
                });

                return list;
            }())
        }));

        $body.append(config.$box);
        Widget.initWidget(config.$box);
    }
});