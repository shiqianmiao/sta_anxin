var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
require('com/mobile/lib/iscroll/iscroll.js');
var API = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var template = require('../template/list/list_page.tpl');
var pageConfig;
require('app/client/app/fw/service/style/service.css');
exports.init = function (config) {
    this.config = config;
    pageConfig = config;
    API.getData(
        {
            'controller': 'Ask',
            'action': 'choose'
        },
        function (err, data) {
            if (err) {
                $('body').removeClass('loading').addClass('offline');
                return;
            }

            if (!data) {
                $('body').removeClass('loading').addClass('nothing');
                return;
            }
            API.getData(
                {
                    'controller': 'Ask',
                    'action': 'listData',
                    'category': config.category
                },
                function(err, askdata){
                    $('body').removeClass('loading').append(template({
                        data : data,
                        list : askdata.list,
                        page_info : askdata.page_info,
                        category : config.category
                    }));
                    Widget.initWidgets();
                }
            );
        }
    );
};
exports.filter = Widget.define({
    events : {
        'click [data-role="tab"]': function(e){
            $('body').addClass('overflow-hide');
            var $target = $(e.currentTarget);
            if ($target.hasClass('active')) {
                this.hideMask();
                $target.removeClass('active');
                $($target.data('for')).removeClass('active');
                return;
            }
            var $currentTab = $target.siblings('[data-role="tab"]');
            //this.config.$tab.removeClass('active');
            $currentTab.removeClass('active');
            $($currentTab.data('for')).removeClass('active');
            $target.addClass('active');
            $($target.data('for')).addClass('active');
            this.showMask();
        },
        'click [data-role="menuitem"]': function(e){//一级分类
            var self = this;
            var $el = this.config.$el;
            var $target = $(e.currentTarget);
            var v = $target.data('v');
            if (this.config.$submenulist) {
                this.config.$submenulist.removeClass('active');
                this.config.$submenuitem.removeClass('active');
            }
            $target.siblings('.active').removeClass('active');
            $target.addClass('active');
            if (v) {
                if ($target.data('type') === 'order') {//排序
                    if (v === $el.data('order')) {//当前排序
                        this.hideMask();
                        return this.config.$filterwrap.removeClass('active');
                    }
                    var params = {
                        'controller': 'Ask',
                        'action': 'listData',
                        'order': v
                    };
                    if ($el.data('cate')) {
                        params.category = $el.data('cate');
                    }
                    self.config.$tab.filter('[data-tabname="' + $target.data('tab') + '"]').find('b').text($target.text());

                    this.renderPage(
                        params,
                        function(){
                            $el.data('order', v);
                            self.config.$filterwrap.removeClass('active');
                            self.hideMask();
                        }
                    );
                } else {
                    var $submenu = this.config.$el.find('[data-menu="'+ v +'"]');
                    $submenu.addClass('active');
                    $submenu.trigger('refreshIscroll');
                }
            } else {//全部
                self.config.$tab.filter('[data-tabname="' + $target.data('tab') + '"]').find('b').text($target.text());
                if ($el.data('cate') === '') {
                    //$target.parents('[data-role="filterwrap"]').removeClass('active');
                    this.config.$filterwrap.removeClass('active');
                    this.hideMask();
                } else {
                    this.renderPage({
                        'controller': 'Ask',
                        'action': 'listData',
                        'order': $el.data('order')
                        //'category': $el.data('cate')
                    }, function(){
                        $el.data('cate', '');
                        self.config.$filterwrap.removeClass('active');
                        self.hideMask();
                    });
                }
            }
        },
        'click [data-role="submenuitem"]': function(e){//二级分类
            var self = this;
            var $el = this.config.$el;
            var $target = $(e.currentTarget);
            this.config.$submenuitem.removeClass('active');
            $target.addClass('active');
            var v = $target.data('v');
            var text = '';
            if ($target.data('all')) {
                //全部
                text = this.config.$menuitem.filter('[data-v="' + $target.data('v') + '"]').text();
            } else {
                text = $target.text();
            }
            self.config.$tab.filter('[data-tabname="' + $target.data('tab') + '"]').find('b').text(text);
            this.renderPage({
                'controller': 'Ask',
                'action': 'listData',
                'order': $el.data('order'),
                'category': v
            }, function(){
                $el.data('cate', v);
                self.config.$filterwrap.removeClass('active');
                self.hideMask();
            });
        },
        'touchmove  [data-role="menuitem"]': function(e){
            e.preventDefault();
        }
    },
    init : function(config){
        var self = this;
        this.config = config;
        //初始化 iscroll
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
        //更新iscroll
        config.$submenulist.on('refreshIscroll', function(){
            $(this).data('iscroll').refresh();
        });
        if (pageConfig.category) {
            var cateText = self.config.$menuitem.filter('[data-v="' + pageConfig.category + '"]').text();
            this.config.$tab.filter('[data-tabname="category"]').find('b').text(cateText);
        }
        $('body .mask').on('click', function(){
            self.config.$filterwrap.removeClass('active');
            self.config.$tab.removeClass('active');
            self.hideMask();
        }).on('touchmove', function(e){
            e.preventDefault();
        });
        $(window).on('scroll', onScroll);
        function onScroll() {
            var top = $(window).scrollTop();
            //$('html').height() - ( $(window).height() + $(window).scrollTop())
            if (document.body.scrollHeight - $('body').height() - top < 50) {
                var $wrap = $(self.config.$el.data('list'));
                if (parseInt($wrap.data('maxpage'), 10) === parseInt($wrap.data('page'), 10)) {
                    return;
                } else {
                    loadMore($wrap);
                }
            }
        }
        function loadMore($wrap) {
            if ($wrap.data('loadMore')) {
                return;
            }
            var $more = $wrap.siblings('[data-role="more"]');
            $wrap.data('loadMore', true);
            var nextPage = parseInt($wrap.data('page'), 10) + 1;
            var params = {
                'controller': 'Ask',
                'action': 'listData',
                'order': self.config.$el.data('order'),
                'pageIndex': nextPage
            };
            if (self.config.$el.data('cate')) {
                params.category = self.config.$el.data('cate');
            }
            $more.removeClass('hide');
            API.getData(
                params,
                function (err, data) {
                    if (err) {
                        return;
                    }
                    $wrap.data('loadMore', false);
                    $wrap.data('page', data.page_info.page);
                    var pageTemplate = require('../template/list/list_item.tpl');
                    $more.addClass('hide');
                    $wrap.append(pageTemplate(data));
                }
            );
        }
    },
    renderPage : function(params, callback){
        var self = this;
        var tpl = require('../template/list/list_item.tpl');
        API.getData(
            params,
            function(err, data){
                var $listwrap = $(self.config.$el.data('list'));
                $listwrap.empty().append(tpl({
                    list : data.list
                }));
                $listwrap.data('maxpage', data.page_info.max_page);
                $listwrap.data('page', data.page_info.page);
                window.scrollTo(0, 0);
                if (callback) {
                    callback();
                }
            }
        );
    },
    showMask : function(){
        $('body .mask').show();
    },
    hideMask : function(){
        $('body .mask').hide();
        this.config.$tab.removeClass('active');
        $('body').removeClass('overflow-hide');
    }
});
exports.list = Widget.define({
    events : {
        'click [data-role="itemlink"]' : function(e){
            var $target = $(e.currentTarget);
            NativeAPI.invoke(
                'createWebView',
                {
                    url: $target.data('href'),
                    control: {
                        type : 'title',
                        text : $target.data('title')
                    }
                }
            );
        }
    }
});