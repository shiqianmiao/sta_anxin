var $ = require('$');
var async = require('com/mobile/lib/async/async.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');

var template = require('./template.tpl');

var httpAPI = new HttpAPI({
    path: '/webapp/common/'
});
var datashareAPI = new HttpAPI({
    path: '/datashare/'
});

exports.init = function () {
    async.auto({
        page: function (next) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            httpAPI.request('GET', null, '?' + $.param({
                controller: 'CommonConfig',
                action: 'trainTicketCalendar',
                trainTicketDate: [year, month, day].join('')
            }), next);
        },
        posts: function (next) {
            datashareAPI.request('POST', {'interface' : 'CommonConsultList'}, '', {
                categoryId: 1000,
                pageSize: 4
            })
                .done(function (data) {
                    var err = null;
                    if (data.status) {
                        err = new Error(data.errDetail);
                    }

                    if (data) {
                        data = data.posts;
                    }

                    next(err, data);
                })
                .fail(next);
        },
        deviceInfo: function (next) {
            HybridAPI.invoke('getDeviceInfo', null, next);
        }
    }, function (err, results) {
        var $body = $('body');

        if (err) {
            $body
                .removeClass('loading')
                .addClass('offline');
        }
        require.async('./style.jcss', function () {
            var version = results.deviceInfo
                .versionId
                .split(/\./g)
                .map(function (i) {
                    return parseInt(i, 10);
                });

            $body
                .removeClass('loading')
                .append(template({
                    data: results.page,
                    posts: results.posts,
                    appVersion: version,
                    appId: results.deviceInfo.customerId,
                    appUrl: 'http://wap.ganji.com/wdnow.php?ignoreUA=0&pr=1&ca_name=cyrl',
                    dec: require('./dec.json'),
                    feb: require('./feb.json')
                }));

            Widget.initWidgets();

            Widget.ready(['#cal-popup', '#share-popup', '#success-popup'], function (calPopup, sharePopup, successPopup) {
                $('#notify-btn').on('click', function () {
                    calPopup.show();
                });

                calPopup.config.$el.on('success', function () {
                    calPopup.close();
                    successPopup.show();
                });
            });
        });
    });
};

exports.link = function (config) {
    config.$el.on('click', function () {
        if (config.type === 'nativeview') {
            NativeAPI.invoke('createNativeView', config.url);
        } else {
            if (NativeAPI.isSupport()) {
                NativeAPI.invoke('createWebView', {
                    url: config.url,
                    control: {
                        type: 'title',
                        text: config.title || ''
                    }
                });
            } else {
                window.location.href = config.url;
            }
        }
    });
};

exports.sharePopup = Widget.define({
    events: {
        'click': 'close'
    },
    show: function () {
        this.config.$el.show();
    },
    close: function () {
        this.config.$el.hide();
    }
});

exports.successPopup = Widget.define({
    events: {
        'click [data-role="close"]': 'close'
    },
    show: function () {
        this.config.$el.show();
    },
    close: function () {
        this.config.$el.hide();
    }
});

exports.calPopup = Widget.define({
    events: {
        'click [data-role="close"]': 'close',
        'click [data-role="date"]:not(.active):not(.disabled)': function (e) {
            var $date = $(e.currentTarget);
            this.setDate($date.data('date'));
        }
    },
    show: function () {
        this.config.$el.show();
    },
    close: function () {
        this.config.$el.hide();
    },
    setDate: function (date) {
        var self = this;
        httpAPI.request('POST', null, '?' + $.param({
            controller: 'CommonConfig',
            action: 'trainTicketRemind',
            ticketRemindDate: date.replace(/-/g, '')
        }), function (err) {
            if (err) {
                Util.toast(err.message, 1500);
                return;
            }
            self.config.$date.filter('[data-date="'+date+'"]').addClass('active');
            self.config.$el.trigger('success');
        });
    }
});

exports.share = Widget.define({
    events: {
        'click': function () {
            NativeAPI.invoke('showShareDialog', {
                title: '今过年回家没有票？应急方案我们有。',
                text: '你买票，我报销，手快包你不花钱',
                url: window.location.href
            });
        }
    }
});

exports.weixinShare = Widget.define({
    events: {
        'click': function () {
            $('#share-popup').show();
        }
    }
});