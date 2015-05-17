var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/choujiang/template/prize_list_page.tpl');
var listTpl     = require('app/client/app/misc/choujiang/template/widget/prize_list.tpl');

var CJAPI       = require('app/client/app/misc/choujiang/service/api.js');
var BasePage    = require('app/client/app/misc/choujiang/widget/base_page.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Util        = require('app/client/common/lib/util/util.js');
var DateParser  = require('app/client/app/sm/util/date_parse.js');

/*style*/
require('../style/style.css');

var User = BasePage.user;
var parseDate = function (time) {
        var date = new Date(parseInt(time, 10) * 1000);
        return DateParser.getMonth(date) + ' 月' + DateParser.getDate(date) + ' 日';
    };
var parseList = function (list){
        list.forEach(function (item) {
            item.bought_date = parseDate(item.bought_time);
        });
        return list;
    };
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '我的奖品'
        }
    );
    User.tryLogin()
        .done(function (userInfo) {
            var userId = userInfo && userInfo.user_id;
            CJAPI.getPrizeList({user_id: userId}, function (err, data) {
                var $body = $('body');
                $body.removeClass('loading');
                if (err) {
                    $body.addClass('offline');
                    return;
                }
                if (!data) {
                    $body.addClass('nothing');
                    return;
                }
                data.userInfo = userInfo;
                if (data.list.length > 0) {
                    data.list = parseList(data.list);
                }else {
                    data.list = null;
                }
                $body.append(template({data: data}));
                if (config.isRules) {
                    $body.scrollTop($body.height / 3);
                }
                Widget.initWidgets();
            });
        }).fail(function () {
            Util.toast('网络繁忙，请稍候再试！');
        });
};
exports.list = Widget.define({
    events:{
        'page::jump': function (event, page) {
            var self = this;
            CJAPI.getPrizeList({
                user_id: this.userId,
                page: page
            }, function (err, data) {
                if (data.list && data.list.length > 0) {
                    self.renderList(data.list);
                }
            });
        }
    },
    init: function (config) {
        this.config = config;
        this.userId = config.userId;
    },
    renderList: function (list) {
        list = parseList(list);
        this.config.$listWrap.html(listTpl({data: list}));
    }
});

exports.page = Widget.define({
    events : {
        'click [data-role="page"]'  : 'changePage'
    },
    init : function (config) {
        this.config     = config;
        this.pageNumber = config.pageNumber || 1;
        this.pageCount  = config.pageCount || 1;
        this.renderPage(this.pageNumber, this.pageCount);
    },
    changePage : function (e) {
        var $cur = $(e.currentTarget);
        var page = $cur.data('page');
        this.renderPage(page, this.pageCount);
        if (!$cur.hasClass('active')) {
            this.config.$el.trigger('page::jump', page);
        }
    },
    renderPage : function (pagenumber, pageCount) {
        var self       = this;
        var startPoint = 1;
        var endPoint   = 5;
        var thpoint    = '<span class="thpoint">···</span>';
        var firstPage  = '';
        var lastPage   = '<a href="javascript: void(0)" data-page="'+ pageCount +'" data-role="page" >'+pageCount+'</a>';
        var pre        = '<a href="javascript: void(0)" class="prev" data-page="'+ (pagenumber-1) +'" data-role="page" >上一页</a>';
        var next       = '<a href="javascript: void(0)" class="next" data-page="'+ (+pagenumber+1) +'"data-role="page" >下一页</a>';
        self.pageCount = pageCount;
        if (pageCount <= 1) {
            self.config.$el.hide();
            return;
        }
        self.config.$el.html('');

        if(pagenumber === 1){
            pre = '';
        }
        if (pagenumber === pageCount) {
            next ='';
        }

        if (pagenumber > 2) {
            startPoint = pagenumber - 2;
            endPoint   = pagenumber + 2;
        }
        if (endPoint  >= pageCount-2) {
            startPoint = pageCount - 6;
            endPoint   = pageCount;
            thpoint    = '';
            lastPage   = '';
        }

        if (startPoint < 1) {
            startPoint = 1;
        }
        if (startPoint > 1) {
            firstPage = '<a href="javascript: void(0)" data-page="1" data-role="page" >1</a>';
        }
        self.config.$el.append(pre).append(firstPage);
        for (var page = startPoint; page <= endPoint; page++) {
            var currentButton = $('<a href="javascript: void(0)" data-role="page" data-page="'+page+'">' + page + '</a>');
            if (pagenumber) {
                currentButton.addClass('active');
            } else {
                currentButton.removeClass('active');
            }
            currentButton.appendTo(self.config.$el);
        }
        self.config.$el.append(thpoint).append(lastPage).append(next);
    }
});

exports.modAddress = Widget.define({
    events:{
        'tap [data-role="modAddress"]' : function (e) {
            e.preventDefault();
            exports.toAddress({isMod: 1, isFirst : this.isFirst});
        }
    },
    init: function (config) {
        this.config = config;
        this.renderAddress();
        this.isFirst = 1;
    },
    renderAddress: function () {
        var self = this;
        User.getUserInfo(function (userInfo) {
            var userId = userInfo && userInfo.user_id;
            CJAPI.getAddress({user_id: userId}, function (err, data) {
                var $status = self.config.$el.find('em');

                if (data && data.express_consignee && data.express_phone) {
                    $status.text('已填写');
                    self.config.$modAddress.text('去修改');
                    self.isFirst = 0;
                }
            });
        });
    }
});

exports.toAddress = function (config) {
    var url = '#app/client/app/misc/choujiang/view/address.js?refer=' + (config && encodeURIComponent(JSON.stringify(config)));
    NativeAPI.invoke('createWebView', {
        url: window.location.pathname + url
    });
};
