var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var template = require('../template/filter-advanced/list-page.tpl');
var RemoteAPI = require('app/client/app/zp/lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var listPageUrl = window.location.pathname + '#app/client/app/zp/resume/view/list_page.js?';
require('com/mobile/lib/iscroll/iscroll.js');
var _ = require('com/mobile/lib/underscore/underscore.js');

require('app/client/app/zp/resume/style/resume.jcss');

exports.init = function (config) {
    RemoteAPI.getData(
        {
            'controller': 'Resume',
            'action': 'getScreen',
            'category_type': config.category_type,
            'job_type': config.job_type || 'findjob'
        },
        function (err, data) {
            $('body')
                .removeClass('loading')
                .append(template({
                    groups: _.groupBy(data, function (field) { return field.type; }),
                    currentFilter: config
                }));
            Widget.initWidgets();
        }
    );
};

exports.form = Widget.define({
    events: {
        'tap [data-role="submit"]': 'submit'
    },
    init: function (config) {
        this.config = config;
    },
    submit: function () {
        var filter = this.config.$el.serializeObject();

        filter = Object.keys(filter)
            .filter(function (key) {
                var val = filter[key];
                return typeof val !== 'undefined' && val !== '';
            })
            .reduce(function (ret, key) {
                ret[key] = filter[key];
                return ret;
            }, {});
        filter = $.extend({}, this.config.filter, filter);
        NativeAPI.invoke(
            'webViewCallback',
            {
                url: listPageUrl + $.param(filter)
            }
        );
    }
});

exports.select = Widget.define({
    events: {
        'click': 'show',
        'click [data-role="cancel"]' : function (e) {
            e.preventDefault();
            this.hide();
        },
        'click [data-role="option"]': function(e){
            e.preventDefault();
            var $target = $(e.currentTarget);
            var self    = this;
            $target.siblings('[data-role="option"]').removeClass('active');
            $target.addClass('active');
            this.config.$select.text($target.text());
            this.config.$input.val($target.data('value'));
            if ($.os.android) {
                setTimeout(function(){
                    self.hide();
                }, 300);
            }else{
                self.hide();
            }
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        config.$el.one('show', function () {
            config.$el.find('.js-need-iscroll')
                .each(function () {
                    var iscroll = new window.IScroll(this, {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    });
                    $(this)
                        .data('iscroll', iscroll)
                        .removeClass('js-need-iscroll');
                });
        });
        this.isShown = false;

        $('body .mask').on('click', function () {
            if (self.isShown) {
                self.hide();
            }
        });
    },
    showMask: function(){
        $('body .mask').addClass('active');
    },
    hideMask: function(){
        $('body .mask').removeClass('active');
    },
    hide: function (){
        this.config.$el.removeClass('active');
        this.config.$options.css('-webkit-transform', 'translateY(100%)');
        this.hideMask();
        this.isShown = false;
    },
    show: function () {
        this.config.$el
            .addClass('active')
            .trigger('show');
        this.config.$options.animate({
            'translateY': '0'
        }, 200);

        this.showMask();
        this.isShown = true;
    }
});
exports.radio = Widget.define({
    events: {
        'click [data-role="option"]': function(e){
            var $this = $(e.currentTarget);
            if ($this.hasClass('active')) {
                return;
            }
            this.config.$option.removeClass('active');
            $this.addClass('active');
            this.config.$input.val($this.data('value'));
        }
    },
    init: function(config) {
        this.config = config;
    }
});