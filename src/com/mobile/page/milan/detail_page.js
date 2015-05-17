var Widget = require('com/mobile/lib/widget/widget.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var $ = require('$');
var BasePage = require('./base_page.js');
var storage = new Storage('favPost');
var _ = require('underscore');
var Log    = require('com/mobile/lib/log/tracker.js');
$.extend(exports, BasePage);

exports.showMore = function (config) {
    if (config.$toggle) {
        config.$toggle.on('click', function (e) {
            e.preventDefault();
            config.$el.toggleClass('active');
            config.$text.text(config.$el.hasClass('active') ? '收起' : '查看更多');
        });
    }
};

exports.loadMore = Widget.define({
    events: {
        'click [data-role="loadMore"]': 'loadMore'
    },
    init: function (config) {
        this.config = config;
        this.page =  config.page || 1;
        this.pageSize = config.pageSize || 10;
        this.render = _.template($(this.config.template).text());
    },
    loadMore: function () {
        var self = this;
        var $container = this.config.$container;

        this.page ++;
        this.getData(function (err, data) {
            if (!err && (!data || data.length < self.pageSize)) {
                self.config.$loadMore.hide();
            } else {
                $container.append(self.render({
                    err: err,
                    data: data
                }));
            }
        });
    },
    getData: function (callback) {
        $.ajax({
            url: this.config.url,
            data: {
                page: this.page,
                pageSize: this.pageSize
            },
            dataType: this.config.dataType || 'json'
        })
            .done(function (data) {
                callback(null, data);
            })
            .fail(function () {
                callback(new Error('网络错误'));
            });
    }
});

exports.activeWidget = Widget.define({
    events: {
        'click [data-role="toggle"]': function () {
            this.config.$el.toggleClass('active');
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.savePost = Widget.define({
    events: {
        'tap': 'toggleSave'
    },
    init: function (config) {
        var postInfo = config.postInfo || {};
        var puid = postInfo.puid || '';
        var savedPosts = storage.get('post') || {};
        this.config = config;
        this.config.doText = this.config.doText || '收藏该帖';
        this.config.undoText = this.config.undoText || '取消收藏';

        postInfo.href = window.location.href;

        if (!puid) {
            return;
        }

        this.puid = puid;

        if (config.$el.hasClass('active')) {
            this.saveToLocalStorage();
            savedPosts[puid] = postInfo;
            storage.set('post', savedPosts);
        } else {
            if (savedPosts[puid]) {
                config.$el.addClass('active');
                config.$text.text(this.config.undoText);
            }
        }
        this.saveToHistory();
    },
    toggleSave: function () {
        var $el = this.config.$el;
        var $text = this.config.$text;

        if ($el.hasClass('active')) {
            $text.text(this.config.doText);
            this.unfavPost();
            $el.toggleClass('active');
        } else {
            if (this.favPost()) {
                $text.text(this.config.undoText);
                $el.toggleClass('active');
            }
        }
    },
    unfavPost: function () {
        if (Cookie.get('ssid')) { // login
            this.deleteFromServer();
        }
        try{
            var chanel = this.config.postInfo.category;
            if (chanel) {
                Log.send('detail_uncollect_'+chanel+'@atype=click');
            }
        }catch(ex){}

        this.deleteFromLocalStorage();
        BasePage.tip('已取消收藏', 1500);
    },
    favPost: function () {
        var success = this.saveToLocalStorage();
        try{
            var chanel = this.config.postInfo.category;
            if (chanel) {
                Log.send('detail_uncollect_'+chanel+'@atype=click');
            }
        }catch(ex){}

        if (Cookie.get('ssid')) {
            this.saveToServer();
        } else {
            try {
                window.localStorage.setItem('ganji_sync', false);
            } catch (ex) {

            }
        }

        if (!success) {
            BasePage.tip('浏览器当前处于无痕/隐身模式，收藏功能无法正常使用', 1500);
        } else {
            BasePage.tip('收藏成功，可进入"个人中心-我的收藏"进行查看。', 1500);
        }

        return success;
    },
    saveToLocalStorage: function () {
        var savedPosts = storage.get('post') || {};

        if (!this.puid) {
            return;
        }

        savedPosts[this.puid] = this.config.postInfo;
        return storage.set('post', savedPosts);
    },
    deleteFromLocalStorage: function () {
        var savedPosts = storage.get('post') || {};

        if (!this.puid) {
            return;
        }

        delete savedPosts[this.puid];
        storage.set('post', savedPosts);
    },
    saveToServer: function () {
        if (this.puid) {
            $.get('/bj_user/favorite_add/?puid=' + this.puid);
        }
    },
    deleteFromServer: function () {
        if (this.puid) {
            $.get('/bj_user/favorite_del/?puid=' + this.puid);
        }
    },
    saveToHistory: function () {
        var savedPosts = storage.get('hist_post') || {puids:[], postList: {}};
        var histLength = 50;
        var puids      = savedPosts.puids;
        if (savedPosts.postList[this.puid]) {
            return;
        }
        if (puids.length > histLength - 1) {
            delete savedPosts.postList[puids.shift()];
        }
        if (!this.puid) {
            return;
        }
        savedPosts.puids.push(this.puid);
        savedPosts.postList[this.puid] = this.config.postInfo;
        return storage.set('hist_post', savedPosts);
    }
});

exports.activeListItem = Widget.define({
    events: {
        'click [data-role="item"]': function (e) {
            var $this = $(e.currentTarget);

            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                $this
                    .addClass('active')
                    .siblings()
                        .removeClass('active');
            }
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.getImOnlineStatus = function (config) {
    /*jshint -W016 */
    var dataDefer = $.Deferred();

    dataDefer
        .done(function (data) {
            $.ajax({
                url: 'http://webim.ganji.com/index.php?op=getuserstatuss&clientType=wap&callback=?',
                data: data,
                dataType: 'jsonp'
            })
                .done(function (data) {
                    if (data && data.data && data.data[config.userId].status) {
                        config.$el.addClass('active');
                        $(config.$text).text('在线沟通');
                    }
                });
        });

    if (config.from && config.puid) {
        require.async(['com/mobile/lib/crypto/md5.js', 'com/mobile/lib/cookie/cookie.js'], function (MD5, Cookie) {
            var uuid = MD5(Cookie.get('__utmganji_v20110909') || '');
            var arr = [0, 0, 0, 0];
            var userID, userInfo;

            try {
                userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
            } catch (ex) {
                userInfo = {};
            }

            userID = userInfo.user_id;

            if (!userID) {
                uuid.split('').forEach(function (ch, i) {
                    var hex = (ch >= '0' && ch <= '9') ? ch - '0' : 10 + ch.charCodeAt(0) - 97;
                    var n = i % 8;
                    arr[Math.floor(i/8)] |= hex << ((n % 2 ===0  ? n + 1 : n - 1) * 4);
                });

                arr.forEach(function (v, i) {
                    arr[i] = arr[i] >>> 0;
                });

                userID = 2147483648 + Math.floor((arr[0] + arr[1] + arr[2] + arr[3]) / 8);
            }

            dataDefer.resolve({
                userIds: config.userId,
                _from: config.from,
                data: JSON.stringify({
                    fromUser: {
                        id: userID
                    },
                    toUser: {
                        id: config.userId
                    },
                    post: {
                        puid: config.puid || '-'
                    }
                })
            });
        });
    } else {
        dataDefer.resolve({
            userIds: config.userId
        });
    }
    /*jshint +W016 */
};

exports.init = function () {
    BasePage.init();
};

exports.scrollLog = function (config) {
    var clientHeight = window.innerHeight;
    var top = config.$el.offset().top;
    var hasSend = false;
    $(window).on('scroll', function () {
        if (top && clientHeight > (top - $(window).scrollTop()) && !hasSend) {
            Log.send(config.code || '100000000000000100000001');
            hasSend = true;
        }
    });
};