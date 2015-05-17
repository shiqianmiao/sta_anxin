var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var RemoteAPI = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var template = require('../template/icenter/page.tpl');
var listTpl = require('../template/icenter/list.tpl');

require('app/client/app/zp/resume/style/resume.jcss');
exports.init = function (config) {
    this.config = config;
    var getUserInfoDefer = $.Deferred();
    $('body')
        .removeClass('loading')
        .append(template());

    Widget.initWidgets();

    NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
        if (err) {
            NativeAPI.invoke('login', null, function (err, userInfo) {
                if (err) {
                    getUserInfoDefer.reject(err);
                } else {
                    getUserInfoDefer.resolve(userInfo);
                }
            });
            return;
        }

        getUserInfoDefer.resolve(userInfo);
    });

    getUserInfoDefer
        .fail(function () {
            NativeAPI.invoke('back', null);
        })
        .done(function (userInfo) {
            var changeToType;
            if (config.tab === 'receive' || !config.tab) {
                config.tab = config.tab ? config.tab : 'receive';
                changeToType = 'download';
            } else {
                changeToType = 'receive';
            }
            Widget.ready(['#tab', '#' + config.tab + 'List'], function (tab, recieveList) {
                var activeList =  '#' + config.tab + 'List';
                tab.config.$el.data('active', activeList);
                tab.config.$tabTitle.filter('[data-for="' + activeList +'"]').addClass('active');
                recieveList.load({
                    'controller': 'Resume',
                    'action': 'myReceive',
                    'type': config.tab,//'receive',
                    'user_id': userInfo.user_id,
                    'limit': 10,
                    'page': 1
                });
            });

            Widget.ready(['#tab', '#' + changeToType + 'List'], function (tab, downloadList) {
                tab.config.$el.one('change-to', function () {
                    downloadList.load({
                        'controller': 'Resume',
                        'action': 'myReceive',
                        'type': changeToType,//'download',
                        'user_id': userInfo.user_id,
                        'limit': 10,
                        'page': 1
                    });
                });

                tab.config.$el.on('change-to', function (e, tabName) {
                    var code;
                    if (tabName === '#downloadList') {
                        code = 3125;
                    } else {
                        code = 3124;
                    }

                    NativeAPI.invoke('log', {
                        code: code
                    });
                });
            });
        });
};

exports.list = Widget.define({
    events: {
        'tap [data-role="phone"]': function (e) {
            var phone = $(e.currentTarget).data('phone');
            var $post = $(e.currentTarget).closest('[data-role="post"]');
            var puid = $post.data('puid');

            NativeAPI.invoke('makePhoneCall', {
                number: phone
            });

            NativeAPI.invoke('log', {
                code: 3126,
                value: [puid, 'list/' + this.config.type].join(',')
            });
        },
        'click [data-role="invitation"]': function (e) {
            var $post = $(e.currentTarget).closest('[data-role="post"]');
            var param = $.param({
                puid: $post.data('puid'),
                wanted_puid: $post.data('wanted-puid'),
                findjob_puid: $post.data('findjob-puid')
            });

            NativeAPI.invoke('createWebView', {
                url: window.location.pathname + '#app/client/app/zp/resume/view/invitation_page.js?' + param
            });
        },
        'click [data-role="link"]': function (e) {
            var $link = $(e.currentTarget);
            var $post = $link.closest('[data-role="post"]');
            var puid = $post.data('puid');
            var jobType = $post.data('type');
            var findjobPuid = $post.data('findjob-puid');
            var wantedPuid = $post.data('wanted-puid');

            $link.addClass('read');
            if (this.config.type === 'recieve' ) {
                NativeAPI.invoke(
                    'getUserInfo',
                    null,
                    function (err, userInfo) {
                        if (!err) {
                            RemoteAPI.getData({
                                'controller': 'Resume',
                                'action': 'setRead',
                                'user_id': userInfo.user_id,
                                'findjob_puid': findjobPuid,
                                'wanted_puid': wantedPuid
                            });
                        }
                    }
                );
            }

            NativeAPI.invoke(
                'createWebView',
                {
                    url: window.location.pathname + '#app/client/app/zp/resume/view/detail_page.js?puid=' + puid + '&job_type=' + jobType,
                    control: {
                        type: 'title',
                        text: '信息详情'
                    }
                }
            );
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;

        var requesting = false;
        function onScroll () {
            var top;
            if (requesting) {
                return;
            }

            top = $(window).scrollTop();

            if (document.body.scrollHeight - $('body').height() - top < 50) {
                requesting = true;
                self.config.$more.show();
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
    render: function (data) {
        this.config.$list.append(listTpl({
            list: data.list,
            type: this.config.type
        }));
    },
    load: function (query) {
        var self = this;
        this.query = query;
        this.config.$el
            .removeClass('nothing')
            .removeClass('offline')
            .addClass('loading');
        RemoteAPI.getData(this.query, function (err, data) {
            self.config.$el.removeClass('loading');
            if (err) {
                self.config.$el.addClass('offline');
                return;
            }

            if (!data || !data.list || !data.list.length) {
                self.config.$el.addClass('nothing');
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
    loadMore: function (callback) {
        var self = this;
        this.query.page ++;
        this.stopListeningOnScroll();
        self.config.$more.text('加载中...').show();
        RemoteAPI.getData(this.query, function (err, data) {
            if (data && data.list && data.list.length) {
                self.render(data);
            }
            self.config.$more.hide();
            self.query.page = data.page_info.page;

            if (data.page_info.page !== data.page_info.max_page) {
                self.config.$more.show();
                self.listenOnScroll();
            }
            callback();
        });
    }
});

exports.tab = Widget.define({
    events: {
        'tap [data-role="tabTitle"]': function (e) {
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
