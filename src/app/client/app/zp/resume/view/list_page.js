var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
require('com/mobile/lib/iscroll/iscroll.js');
var QueryString = require('app/client/common/lib/url/querystring.js');

var API = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var template = require('../template/list/list_page.tpl');
var postListItemTemplate = require('../template/list/job_list_item.tpl');

require('app/client/app/zp/resume/style/resume.jcss');

var pageConfig = {};
var redirectPage = '/ng/app/client/common/redirect.html';
var basePage  = window.location.pathname;

exports.init = function (config) {
    NativeAPI.invoke('getCityInfo', null, function (err, cityInfo) {
        if (err) {
            NativeAPI.invoke('alert', {
                title: '出错了!',
                message: '无法获取城市信息',
                btn_text: '确定'
            }, function () {
                NativeAPI.invoke('back', null);
            });
            return;
        }

        config.city_id = cityInfo.city_id;
        pageConfig = $.extend({}, config);
        API.getData(
            {
                'controller': 'Resume',
                'action': 'getCondition',
                'category_type': config.category_type || '',
                'job_type': config.job_type || 'findjob'
            },
            function (err, data) {
                if (err) {
                    $('body')
                        .removeClass('loading')
                        .addClass('offline')
                        .find('.js-offline-tip')
                            .text(err.message);
                    return;
                }
                $('body')
                    .append(template({
                        filters: data,
                        query: config,
                        jobType: config.job_type || 'findjob',
                        showTab: config.show_tab ? true : false
                    }));
                Widget.initWidgets();
                Widget.ready(['#filter', '#postList'], function (filter) {
                    filter.config.$el.on('commit', function () {
                        var query = filter.getValue();
                        updateUrl(query);

                        NativeAPI.invoke('log', {
                            code: 3120,
                            value: $.param(query).replace(/&/g, ',')
                        });
                    });
                });

                Widget.ready(['#tab', '#postList'], function (tab, postList) {
                    var startY;
                    postList.config.$el.on('touchstart', function(e) {
                        startY = e.targetTouches[0].clientY;
                    }, false);
                    postList.config.$el.on('touchmove', function(e){
                        var delt = startY - e.targetTouches[0].clientY;
                        if (Math.abs(delt) < 10) {
                            return;
                        }

                        if (delt < 0) {
                            tab.config.$el.removeClass('hide');
                        } else {
                            tab.config.$el.addClass('hide');
                        }
                        startY = e.targetTouches[0].clientY;
                    });
                });
            }
        );
    });

    NativeAPI.registerHandler('search', function (params) {
        updateUrl(params);
        Widget.ready('#filter', function (filter) {
            filter.hide();
        });
    });
};

exports.update = function (config) {
    pageConfig = $.extend({}, config);
    Widget.ready(['#postList', '#filter'], function (postList, filter) {
        postList.load(config);
        filter.update(config);
    });
    Widget.ready('#tab', function(tab){
        tab.config.$el.removeClass('hide');
    });
};

function updateUrl (query) {
    var hash = window.location.hash.replace(/^#/, '');
    var view = hash.split('?')[0];

    query = $.extend({}, pageConfig, query);
    window.location.hash = view + '?' + $.param(query);
}


exports.singleFilter = Widget.define({
    events: {
        'show': function () {
            var iscroll = this.config.$panel.data('iscroll');
            if (iscroll) {
                iscroll.refresh();
            }
        },
        'tap [data-role="option"]': function (e) {
            var $option = $(e.currentTarget);
            var $select = $option.closest('[data-role="select"]');

            $option
                .addClass('active')
                    .siblings()
                    .removeClass('active');

            $select.trigger('change', $option.data('value'));
        },
        'change [data-role="select"]': function (e) {
            var $select = $(e.currentTarget);
            var value = $select.find('[data-role="option"].active').data('value');
            var ret = {};
            ret[$select.data('name')] = value;

            $select.closest('[data-role="filter"]').trigger('commit', ret);
        }
    },
    init: function (config) {
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
    }
});

exports.comboFilter = exports.singleFilter.extend({
    events: {
        'change [data-role="select"][data-for]': function (e) {
            var self = this;
            var $current = $(e.currentTarget);
            var $target = this.config.$select.filter('[data-name="' + $current.data('for') + '"]');
            var query = QueryString.parse($target.data('source'));
            var $panel = $target.closest('[data-role="panel"]');
            var $option = $current.find('[data-role="option"].active');
            query[$current.data('name')] = $option.data('value');

            API.getData(query, function (err, data) {
                if (err) {
                    NativeAPI.invoke(
                        'alert',
                        {
                            title: '出错啦!',
                            message: '当前的网络不好，请稍后再试',
                            btn_text: '确定'
                        });
                    return;
                }

                self.render($target, data);
                $panel.show();
                $panel.data('iscroll').refresh();
            });
        },
        'change [data-role="select"]': function (e) {
            var $select = $(e.currentTarget);
            var value = {};
            if ($select.is('[data-for]')) {
                return;
            }

            this.config.$select.each(function () {
                var $select = $(this);
                value[$select.data('name')] = $select.find('[data-role="option"].active').data('value');
            });
            $select.closest('[data-role="filter"]').trigger('commit', value);
        }
    },
    init: function (config) {
        var self = this;
        this.super_.init.call(this, config);
        this.config = config;

        config.$select.filter('[data-for][data-source]').each(function () {
            var $select = $(this);
            var query = QueryString.parse($select.data('source'));
            API.getData(query, function (err, data) {
                self.render($select, data);
            });
        });
    },
    render: function ($select, data) {
        //var self = this;
        var config = this.config;
        var name = $select.data('name');
        $select.html(data.map(function (row) {
            var html = '<li data-role="option" data-value="' + row.id + '"';
            var id = row.id;

            if (parseInt(id, 10).toString = row.id) {
                id = parseInt(id, 10);
            }
            if (config.selected && name in config.selected && config.selected[name] === id ||
                (row.id === -1 && !(config.selected && name in config.selected))
            ) {
                html += ' class="js-touch-state active"';
            } else {
                html += ' class="js-touch-state"';
            }
            html += '><span>' + row.name + '</span></li>';
            return html;
        }).join(''));
    }
});

exports.postList = Widget.define({
    events: {
        'tap [data-role="link"]': function (e) {
            var puid = $(e.currentTarget).closest('[data-role="post"]').data('puid');
            NativeAPI.invoke(
                'createWebView',
                {
                    url: window.location.pathname + '#app/client/app/zp/resume/view/detail_page.js?puid=' + puid + '&job_type=' + pageConfig.job_type,
                    control: {
                        type: 'title',
                        text: '信息详情'
                    }
                }
            );

            NativeAPI.invoke('log', {code: 3122});
        },
        'tap [data-role="download"]': function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var puid = $target.closest('[data-role="post"]').data('puid');
            var userInfoDefer = $.Deferred();

            if (this.config.$el.hasClass('loading')) {
                return;
            }

            NativeAPI.invoke('log', {
                code: 3121,
                value: puid + ',list'
            });

            this.config.$el.addClass('loading');

            $target
                .addClass('loading')
                .text('下载中...');

            userInfoDefer
                .done(function (userInfo) {
                    return self.downloadResume(puid, userInfo.user_id, function () {
                        $target.removeClass('loading').text('下载');
                        self.config.$el.removeClass('loading');
                    });
                })
                .fail(function () {
                    NativeAPI.invoke(
                        'alert',
                        {
                            title: '',
                            message: '请先登录后再试!',
                            btn_text: '确定'
                        }, function () {
                            $target.removeClass('loading').text('下载');
                            self.config.$el.removeClass('loading');
                        });
                });


            NativeAPI.invoke(
                'getUserInfo',
                null,
                function (err, data) {
                    if (err) {
                        NativeAPI.invoke(
                            'login',
                            null,
                            function (err, data) {
                                if (err) {
                                    userInfoDefer.reject(err);
                                } else {
                                    userInfoDefer.resolve(data);
                                }
                            }
                        );
                        return;
                    }

                    userInfoDefer.resolve(data);
                }
            );
        }
    },
    init: function (config) {
        var self = this;
        var requesting = false;
        this.config = config;
        this.page = 1;
        this.pageSize = 10;
        this.query = config.query;
        this.load(config.query);

        function onScroll () {
            var top;
            if (requesting) {
                return;
            }

            top = $(window).scrollTop();

            if (document.body.scrollHeight - $('body').height() - top < 50) {
                requesting = true;
                self.loadMore(function () {
                    requesting = false;
                });
            }
        }
        this.listenOnScroll = function () {
            $(window).on('scroll', onScroll);
        };

        this.stopListeningOnScroll = function () {
            $(window).off('scroll', onScroll);
        };
    },
    load: function (query) {
        var self = this;
        query.page = 1;
        this.clear();
        this.config.$more.hide();
        $('body')
            .removeClass('offline')
            .removeClass('nothing')
            .addClass('loading');

        if (query.keyword && query.job_type === 'parttime') {
            delete query.category_type;
        }

        this.getData(query, function (err, data) {
            $('body').removeClass('loading');
            if (err) {
                $('body').addClass('offline');
                return;
            }

            if (!data || !data.list || !data.list.length) {
                $('body').addClass('nothing');
                return;
            }

            self.render(data);

            self.query.page = data.page_info.page;

            if (data.page_info.page !== data.page_info.max_page) {
                self.config.$more.show();
                self.listenOnScroll();
            }
        });
    },
    render: function (data) {
        this.config.$list.append(postListItemTemplate({
            resumes: data.list,
            job_type: pageConfig.job_type
        }));
    },
    clear: function () {
        this.config.$list.html('');
    },
    getData: function (query, callback) {
        query = $.extend({}, this.config.query, query);

        this.query = Object.keys(query)
            .filter(function (key) {
                return query[key] !== -1 && query[key] !== '';
            })
            .reduce(function (ret, key) {
                ret[key] = query[key];
                return ret;
            }, {});

        API.getData(
            this.query,
            function (err, data) {
                callback(err, data);
            }
        );
    },
    loadMore: function (callback) {
        var self = this;
        this.query.page ++;
        this.stopListeningOnScroll();
        this.getData(this.query, function (err, data) {
            if (err) {
                return callback(err);
            }
            self.query.page = data.page_info.page;
            if (data && data.list && data.list.length) {
                self.render(data);
            }
            if (data.page_info.page === data.page_info.max_page) {
                self.config.$more.text('加载完毕');
                return callback(new Error('no more page'));
            }

            self.listenOnScroll();
            return callback(null);
        });
    },
    downloadResume: function (puid, userID, callback) {
        var self = this;

        API.getData({
            controller: 'Resume',
            action: 'downloadResume',
            puid: puid,
            user_id: userID
        }, function (err, data) {
            self.config.$el.find('[data-role="download"]').filter('.loading').removeClass('loading').text('下载');
            if (err) {
                NativeAPI.invoke(
                    'alert',
                    {
                        title: '出错了',
                        message: err.message,
                        btn_text: '确定'
                    });

                callback(err);
                return;
            }

            if (data.status && data.phone) {
                NativeAPI.invoke(
                    'confirm',
                    {
                        title: '提示',
                        message: data.Msg,
                        yes_btn_text: '拨打电话',
                        no_btn_text: '取消'
                    },
                    function (err, confirm) {
                        var code;
                        switch (data.status) {
                            case 2:
                                code = 3109;
                                break;
                            case 3:
                                code = 3108;
                                break;
                            default:
                                code = 3110;
                        }

                        NativeAPI.invoke('log', {
                            code: code,
                            value: confirm.value.toString()
                        });

                        if (confirm.value === confirm.YES) {
                            NativeAPI.invoke(
                                'makePhoneCall',
                                {
                                    number: data.phone
                                }
                            );
                        }
                        callback(null);
                    });
                return;
            }

            if (data.status) {
                NativeAPI.invoke(
                    'alert',
                    {
                        title: '提示',
                        message: data.Msg,
                        btn_text: '确定'
                    }, function () {
                        callback(null);
                    }
                );
                return;
            }

            if (data.PayStatus) {
                NativeAPI.invoke(
                    'confirm',
                    {
                        title: '提示',
                        message: '您的 简历点数/招聘币 不足',
                        yes_btn_text: '去购买',
                        no_btn_text: '取消'
                    },
                    function (err, data) {
                        callback(null);

                        NativeAPI.invoke('log', {
                            code: 3113,
                            value: data.value.toString()
                        });

                        if (data.value === data.YES) {
                            self.goPrepaidPage(userID);
                        }
                    }
                );

                return;
            } else {
                NativeAPI.invoke(
                    'confirm',
                    {
                        title: '查看联系方式',
                        message: data.Msg,
                        yes_btn_text: '确定查看',
                        no_btn_text: '取消'
                    },
                    function (err, confirm) {
                        if (!err) {
                            NativeAPI.invoke('log', {
                                code: 3111,
                                value: confirm.value.toString()
                            });
                        }

                        if (confirm.value === confirm.YES) {
                            API.getData({
                                controller: 'Resume',
                                action: 'insertResume',
                                puid: puid,
                                user_id: userID,
                                order_id: data.order_id
                            }, function (err, data) {
                                if (err) {
                                    if (err.code === 1004) {
                                        callback(null);
                                        self.goPrepaidPage(userID);
                                    } else {
                                        NativeAPI.invoke('alert', {
                                            title: '提示',
                                            message: '下载失败',
                                            btn_text: '确定'
                                        }, function () {
                                            callback(null);
                                        });
                                    }
                                    return;
                                }


                                if (data.phone) {
                                    NativeAPI.invoke('confirm', {
                                        title: '提示',
                                        message: '下载成功, 电话: ' + data.phone,
                                        yes_btn_text: '拨打电话',
                                        no_btn_text: '取消'
                                    }, function (err, confirm) {
                                        NativeAPI.invoke('log', {
                                            code: 3112,
                                            value: confirm.value.toString()
                                        });

                                        if (confirm.value === confirm.YES) {
                                            NativeAPI.invoke('makePhoneCall', {
                                                number: data.phone
                                            });
                                        }
                                        callback(null);
                                    });
                                    return;
                                }
                            });
                        } else {
                            callback(null);
                        }
                    }
                );
            }
        });
    },
    goPrepaidPage: function (userID) {
        NativeAPI.invoke(
            'createWebView',
            {
                url: window.location.pathname + '#app/client/app/zp/resume/view/prepaid_page.js?user_id=' + userID
            });
    }
});

exports.filter = Widget.define({
    events: {
        'commit [data-role="filter"]': function (e, options) {
            var self = this;
            var $filter = $(e.currentTarget);
            var text = Object.keys(options).reduce(function (text, key) {
                text += self.config.$el.find('[data-name="'+key+'"]:not([data-for]) [data-role="option"][data-value="'+options[key]+'"]').text() || '';
                return text;
            }, '');

            if (text === '不限') {
                text = $filter.data('title');
            }
            if ($filter.data('name') === 'area') {
                pageConfig.area = text;
            }
            this.config.$title.filter('[data-for="'+$filter.data('name')+'"]').text(text);
            this.hide();
        },
        'touchmove [data-role="mask"]': function (e) {
            e.preventDefault();
        },
        'click [data-role="mask"]': 'hide',
        'tap [data-role="title"]': function (e) {
            var $title = $(e.currentTarget);
            var hasActive = $title.hasClass('active');
            var self = this;
            this.config.$filter.removeClass('active');
            this.config.$title.removeClass('active');

            if (!hasActive) {
                this.config.$el.addClass('active');
                $title.addClass('active');
                // 防止Android点击穿透
                this.animating = true;
                this.config.$filter
                    .filter('[data-name="' + $title.data('for') + '"]')
                        .addClass('active')
                        .trigger('show');
                setTimeout(function () {
                    self.animating = false;
                }, 500);
            } else {
                this.config.$el.removeClass('active');
            }
        },
        'tap [data-role="advance"]': function () {
            var advancePageUrl = window.location.pathname + '#app/client/app/zp/resume/view/advance_filter.js?';
            var url = advancePageUrl + $.param($.extend({}, pageConfig, this.getValue()));
            this.animating = false;
            this.hide();

            NativeAPI.invoke(
                'createWebView',
                {
                    url: url,
                    control: {
                        type: 'title',
                        text: '高级筛选'
                    }
                }
            );
        }
    },
    init: function (config) {
        this.config = config;
    },
    hide: function () {
        // 防止Android点击穿透
        if (this.animating) {
            return;
        }
        this.config.$el.removeClass('active');
        this.config.$filter.removeClass('active');
        this.config.$title.removeClass('active');
    },
    update: function (config) {
        var $filters = this.config.$filter;
        var $title   = this.config.$title;
        Object.keys(config).forEach(function (name) {
            if (name === 'area') {
                return;
            }
            var val = config[name];
            var $filter = $filters.filter('[data-name="' + name + '"]');
            var text;
            if ($filter.size()) {
                text = $filter
                    .find('[data-role="option"]')
                        .removeClass('active')
                        .filter('[data-value="'+val+'"]')
                            .addClass('active')
                            .text();

                if (text === '不限') {
                    text = $filter.data('title');
                }
                $title.filter('[data-for="'+name+'"]').text(text);
            }
        });
    },
    getValue: function () {
        var ret = {};
        this.config.$filter.find('[data-role="select"]').each(function () {
            var $select = $(this);
            var name = $select.data('name');
            var val = $select.find('[data-role="option"].active').data('value');

            if (typeof val !== 'undefined') {
                ret[name] = val;
            }
        });

        return ret;
    }
});
exports.tab = Widget.define({
    events : {
        'tap [data-role="tab"]' : function(e){
            var $target = $(e.currentTarget);
            var query;
            e.preventDefault();

            if (!$target.hasClass('active')) {
                pageConfig.job_type = $target.data('jobType');
                query = $.extend({}, pageConfig, {job_type: $target.data('jobType')});

                $target
                    .addClass('active')
                    .siblings()
                        .removeClass('active');

                window.location.href = redirectPage + '#' +
                                       encodeURIComponent(basePage +
                                       '#app/client/app/zp/resume/view/list_page.js?' +
                                       $.param(query));
            }
        }
    },
    init : function(config) {
        this.config = config;
        this.config.$tab.filter('[data-for="' + config.job_type +'"]').addClass('active');
    }
});