var Widget      = require('com/mobile/lib/widget/widget.js');
var BasePage    = require('com/mobile/page/milan/base_page.js');
var Log         = require('com/mobile/lib/log/tracker.js');

var listMoreTpl = require('com/mobile/page/misc/weiba/template/list_more.tpl');
var dzMoreTpl   = require('com/mobile/page/misc/weiba/template/dz_more.tpl');

var $           = require('$');
$.extend(exports, BasePage);

exports.loadMore = Widget.define({
    events: {
        'tap [data-role="loadMore"]': function() {
            this.loadMore();
        },
        'touchend [data-role="loadMore"]': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        var self = this;
        var windowHeight = window.screen.height;
        this.loadingText = config.loadingText || config.$el.html();
        this.loadTpl     = config.$el.html();
        this.config      = config;
        this.$el         = config.$el;
        this.offset      = 0;
        this.scrollAble  = config.scrollAble || false;
        this.listening   = false;
        function onScroll() {
            var top = $(window).scrollTop();
            if ($('#feedList').height() - windowHeight - top < -50) {
                self.loadMore();
            }
        }

        this.listenScroll = function() {
            if (self.listening) {
                return;
            }
            self.listening = true;
            $(window).on('scroll', onScroll);
        };

        this.removeScrollListener = function() {
            $(window).off('scroll', onScroll);
            self.listening = false;
        };
        if (config.scrollAble) {
            self.listenScroll();
        }
    },
    loadMore: function() {
        var self = this;
        if (self.loading) {
            return;
        }
        self.removeScrollListener();
        self.config.$el.show();
        self.loading = true;
        self.getData(++self.offset, function(err, data) {
            self.config.$el
                    .html(self.loadTpl)
                    .hide();
            if (!err) {
                if (data && data.length !== 0) {
                    $(self.config.refer).append(
                        self.render(data)
                    );
                    self.loading = false;
                    if (self.config.scrollAble) {
                        self.listenScroll();
                    }
                } else {
                    $('footer').show();
                }
            } else {
                $('footer').show();
                BasePage.tip(err, 1500);
            }
        });
    },
    render: function (data) {
        return listMoreTpl({data: data.data});
    },
    getData: function(query, callback) {
        var self = this;
        $.ajax({
            url: self.config.ajaxUrl,
            data: {
                offset: query,
                page: query + 1
            },
            beforeSend: function() {
                self.$el.html(self.loadingText);
            },
            dataType: 'json'
        }).done(function(data) {
            if (data.ret <= 0) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        }).fail(function() {
            callback('网络异常，请稍后再试!');
        });
    }
});

exports.loadMoreForIndex = exports.loadMore.extend({
    render: function (data) {
        var theData = data.data;
        var duanzi  = [],zixun = [];
        Log.send('weiba_index_load_more');
        if (theData.duanzi) {
            duanzi = theData.duanzi.map(function (item) {
                item.type = 'duanzi';
                return item;
            });
        }
        if (theData.zixun) {
            zixun = theData.zixun.map(function (item) {
                item.type = 'news';
                return item;
            });
        }
        var duanzi1 = duanzi.slice(0, 3);
        duanzi1.forEach(function (item, index) {
            zixun.splice(5 + index, 0, duanzi1[index]);
        });
        var tpl = listMoreTpl({data: zixun.concat(duanzi.slice(3, 5)), isIndex: true});
        var $fragment = $(tpl);
        $fragment.find('[data-widget]').each(function () {
            Widget.initWidget($(this));
        });
        return $fragment;
    }
});

exports.loadMoreForList = exports.loadMore.extend({
    render: function (data) {
        var type = this.config.listType || 'news';
        Log.send('weiba_list_load_more_' + type);
        if (data.data) {
            var theData = data.data;
            theData.forEach(function (item, index) {
                theData[index].type = type;
            });
            return listMoreTpl({data: theData, isIndex: false});
        }
    }
});

exports.loadMoreForDZ = exports.loadMore.extend({
    render: function (data) {
        if (data.data) {
            var $fragment = $(dzMoreTpl({data: data.data, isIndex: false}));
            $fragment.find('[data-widget]').each(function () {
                Widget.initWidget($(this));
            });
            return $fragment;
        }
    }
});

exports.fixToTop = Widget.define({
    init: function(config) {
        var self = this;
        this.config = config;
        self.gap    = 15;
        self.offset = $('body > header').height() + $('body > nav').height();
        this.$el    = config.$el;
        var flag = 0, startY = 0;
        var timer= 0;
        $('body')
            .on('touchstart', function(e) {
                startY = e.touches[0].clientY;
                if ($('body').scrollTop() < (self.offset + self.gap)) {
                    self.shouldFixed(false);
                }
                flag = 0;
            })
            .on('touchmove', function(e) {
                if ($('body').scrollTop() < (self.offset + self.gap)) {
                    self.shouldFixed(false);
                }else{
                    if(!flag) {
                        clearInterval(timer);
                        var curClientY = e.touches[0].clientY;
                        if(curClientY - startY < -self.gap) {
                            self.shouldFixed(false);
                            flag = 1;
                        } else if(curClientY - startY > self.gap) {
                            self.shouldFixed(true);
                            flag = 1;
                        }
                    }
                }
            }).on('touchend', function () {
                timer = setInterval(function () {
                    if ($('body').scrollTop() < (self.offset + self.gap)) {
                        self.shouldFixed(false);
                        clearInterval(timer);
                    }
                }, 100);
            });
    },
    shouldFixed: function(isFixed) {
        if(isFixed) {
            this.$el.addClass('active');
        } else  {
            this.$el.removeClass('active');
        }
    }
});
