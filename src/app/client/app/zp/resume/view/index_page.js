var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var API = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Storage = require('com/mobile/lib/storage/storage.js');

var template = require('../template/index/index_page.tpl');
var parttimeJobTemplate = require('../template/index/parttime_job.tpl');
var findjobTemplate = require('../template/index/findjob.tpl');
var Storage = require('com/mobile/lib/storage/storage.js');
var listPageUrl = window.location.pathname + '#app/client/app/zp/resume/view/list_page.js?';
// 缓存数据
var pageConfig = {};
// 加载样式
require('app/client/app/zp/resume/style/resume.jcss');

exports.init = function (config) {
    var tabState = {};
    config.tab = config.tab || 'findjob';
    pageConfig = config;

    getData(config.tab, function (err, data) {
        NativeAPI.invoke('getDeviceInfo', null, function (deviceInfoError, deviceInfo) {
            if (err || deviceInfoError) {
                $('body')
                    .removeClass('loading')
                    .addClass('offline');

                tabState[config.tab] = 'offline';

                return;
            }

            $('body')
                .removeClass('loading')
                .append(template({
                    tab : pageConfig.tab || 'findjob'
                }));

            renderPage(pageConfig.tab || 'findjob', data);
            Widget.initWidgets();
            Widget.ready(['#tab'], function (tab) {
                tab.config.$el.one('change-to', function () {
                    $('body').addClass('loading');
                    var changeToTab = pageConfig.tab === 'findjob' || !pageConfig.tab ? 'parttime' : 'findjob';
                    var $tab = changeToTab === 'findjob' ? $('findjobTab') : $('parttimeTab');
                    API.getData(
                        {
                            'controller': 'Resume',
                            'action': 'getCategory',
                            'job_type': changeToTab
                        },
                        function (err, data) {
                            $('body').removeClass('loading');
                            if (err) {
                                $('body').addClass('offline');
                                tabState[changeToTab] = 'offline';
                                return;
                            }

                            renderPage(changeToTab, data);
                        }
                    );

                    $tab.find('[data-widget]').each(function () {
                        Widget.initWidget(this);
                    });
                });

                tab.config.$el.on('change-to', function (e, tabName) {
                    var code, tab;
                    if (tabName === '#findjobTab') {
                        tab = 'findjob';
                        code = 3115;
                    } else if (tabName === '#parttimeTab') {
                        tab = 'parttime';
                        code = 3114;
                    }

                    NativeAPI.invoke('log', {
                        code: code
                    });
                    $('body').removeClass('nothing offline');
                    if (tabState[tab]) {
                        $('body').addClass(tabState[tab]);
                    }
                });
            });

            Widget.ready(['#history'], function (historyWidget) {
                $('body').on('click', '[data-role="link"]', function (e) {
                    historyWidget.config.$close.show();
                    var query = $(e.currentTarget).data('query');
                    var name  = $(e.currentTarget).data('name');
                    var dontRemember = $(e.currentTarget).data('dontRemember');

                    NativeAPI.invoke('log', {
                        code: 3118,
                        value: query.category_type
                    });

                    if (!dontRemember) {
                        historyWidget.addItem({
                            query: query,
                            text: name
                        });
                    }

                    NativeAPI.invoke(
                        'createWebView',
                        {
                            url: listPageUrl + $.param(query),
                            control: {
                                type: 'searchBox',
                                text: '',
                                placeholder: '搜索' + (name || '')
                            }
                        }
                    );
                });
            });

            Widget.ready('[data-widget="app/client/app/zp/resume/view/index_page.js#allJobWidget"]', function (widgets) {
                widgets.forEach(function (widget, i) {
                    widget.config.$el.on('show', function () {
                        widgets.forEach(function (anotherWidget, j) {
                            if (i === j) {
                                return;
                            }
                            anotherWidget.hide();
                        });
                    });
                });
            });
            function renderPage(tab, data) {
                if (tab === 'findjob') {
                    $('#findjobTab')[0].innerHTML = findjobTemplate({
                        hotJobs: data.hot,
                        allJobs: data.all,
                        width: $('body').width(),
                        os: deviceInfo.os,
                        appVersion: deviceInfo.versionId.split('.'),
                        appId: deviceInfo.customerId
                    });
                } else if (tab === 'parttime') {
                    $('#parttimeTab')[0].innerHTML = parttimeJobTemplate({
                        parttimeJobs: data
                    });
                }
            }
        });
    });


    function getData (tab, callback) {
        var storage = new Storage('ZHAOPIN_RESUME_CATEGORY_CACHE');
        var cache = storage.get(tab);

        if (cache && Date.now() - cache.update <= 259200000) {
            callback(null, cache.data);
            callback = function () {};
        }

        API.getData(
            {
                'controller': 'Resume',
                'action': 'getCategory',
                'job_type': tab
            },
            function (err, data) {
                if (!err) {
                    storage.set(tab, {
                        data: data,
                        update: Date.now()
                    });
                }
                callback(err, data);
            }
        );
    }


    NativeAPI.registerHandler('search', function (param) {
        var query;
        if (param.keyword) {
            query = {
                keyword: param.keyword,
                show_tab: true,
                job_type: 'findjob'
            };
            NativeAPI.invoke('createWebView', {
                url: listPageUrl + $.param(query),
                control: {
                    type: 'searchBox',
                    text: param.keyword
                }
            });
        }
    });
};

exports.history = Widget.define({
    events: {
        'click [data-role="close"]': function (e) {
            $(e.currentTarget).hide();
            this.storage.set('list', []);
            this.render();
            NativeAPI.invoke('log', {code: 3117});
        },
        'tap [data-role="a"]': function (e) {
            var query = $(e.currentTarget).data('query');
            this.addItem({
                query: query,
                text: $(e.currentTarget).text()
            });
            NativeAPI.invoke(
                'createWebView',
                {
                    url: listPageUrl + $.param(query),
                    control: {
                        type: 'searchBox',
                        text: '',
                        placeholder: $(e.currentTarget).text()
                    }
                }
            );
            NativeAPI.invoke(
                'log',
                {
                    code: 3116
                }
            );
        }
    },
    init: function (config) {
        this.config = config;
        this.storage = new Storage('zhaopinResumeHistory');
        this.render();
        if (!this.storage.get('list') || !this.storage.get('list').length) {
            this.config.$close.hide();
        }
    },
    addItem: function (data) {
        var list = this.storage.get('list') || [];
        list = list.filter(function (item) {
            return item.text !== data.text;
        });
        list.unshift(data);
        list = list.slice(0, 3);

        this.storage.set('list', list);
        this.render();
        this.config.$el.addClass('active');
    },
    render: function () {
        var list = this.storage.get('list') || [];
        if (list.length) {
            this.config.$el.addClass('active');
        } else {
            this.config.$el.removeClass('active');
        }
        this.config.$list.html(list.map(function (item) {
            return '<a href="javascript: void(0);" data-query=\''+JSON.stringify(item.query)+'\' data-role="a" >'+item.text+'</a>';
        }).join(''));
    }
});

exports.pubBtn = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke('log', {
            code: 3119
        });

        NativeAPI.invoke(
            'createNativeView',
            {
                name: 'zhaopinPubView'
            });
    });
};

exports.tab = Widget.define({
    events: {
        'click [data-role="tabTitle"]': function (e) {
            this.changeTab($(e.currentTarget).data('for'));
        }
    },
    init: function (config) {
        this.config = config;

        this.$tabContents = this.config.$tabTitle.map(function () {
            return $($(this).data('for'));
        });
    },
    changeTab: function (to) {
        this.config.$el.trigger('change-to', to);
        this.$tabContents
            .hide()
            .filter(to)
                .show();

        this.config.$tabTitle
            .removeClass('active')
            .filter('[data-for="' + to + '"]')
                .addClass('active');
    }
});

exports.allJobWidget = Widget.define({
    events: {
        'click [data-role="title"]': function (e) {
            var $this = $(e.currentTarget);
            var hasActive = $this.hasClass('active');
            this.config.$list.removeClass('active');
            this.config.$title.removeClass('active');

            if (!hasActive) {
                $this.addClass('active');
                this.config.$list
                    .filter('[data-name="'+ $this.data('for') +'"]')
                        .addClass('active');

                this.config.$el.trigger('show');
            }
        },
        'touchstart [data-role="slide"]': function (e) {
            this.startX = e.touches[0].clientX;
        },
        'touchend [data-role="slide"]': function (e) {
            var $slide = $(e.currentTarget);
            if (this.maxMoveDist > 10) {
                this.maxMoveDist = 0;
                this[this.direction]($slide);
                e.preventDefault();
            }
        },
        'touchmove [data-role="slide"]': function (e) {
            var touch = e.touches[0];
            var $slide = $(e.currentTarget);
            var dist = touch.clientX - this.startX;
            var $slideItem = $slide.find('[data-role="slideItem"]');
            var total = $slideItem.size();
            var width = $slideItem.width();
            var translateX = $slide.data('translateX') || 0;

            if (Math.abs(dist) < 10) {
                return;
            }

            e.preventDefault();

            // 边缘
            if (translateX + dist > 0 || Math.abs(translateX + dist) > width * (total - 1)) {
                return;
            }

            if (this.maxMoveDist < Math.abs(dist)) {
                this.maxMoveDist = Math.abs(dist);
            }

            $slide.css($.fx.cssPrefix + 'transform', 'translate3d('+(translateX + dist)+'px, 0, 0)');

            this.direction = dist < 0 ? 'next' : 'prev';
        }
    },
    init: function (config) {
        this.config = config;
        this.maxMoveDist = 0;
        var $el = this.config.$el,
        roles = {},
        config = this.config;
        $el.find('[data-role]').each(function () {
            var role = $(this).data('role');

            if (!roles[role]) {
                roles[role] = [];
            }
            roles[role].push(this);
        });

        $.each(roles, function (key, role) {
            config['$'+key] = $(role);
        });
    },
    hide: function () {
        this.config.$list.removeClass('active');
        this.config.$title.removeClass('active');
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
        var $slideItem = $slide.find('[data-role="slideItem"]');
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

        $slide.closest('[data-role="list"]')
            .find('[data-index]')
                .removeClass('active')
                .filter('[data-index="' + index + '"]')
                    .addClass('active');
    }
});