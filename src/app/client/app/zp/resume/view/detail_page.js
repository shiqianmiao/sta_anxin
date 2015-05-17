var Widget    = require('com/mobile/lib/widget/widget.js');
var $         = require('$');
var API       = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var PostList  = require('app/client/app/zp/resume/widget/view/post_list.js');

var template  = require('../template/detail/detail_page.tpl');

require('app/client/app/zp/resume/style/resume.jcss');
var getData   = function (param, callback) {
    API.getData(param, function (err, data) {
        $('body').removeClass('loading');
        if (err) {
            $('body').addClass('offline');
            return;
        }

        if (!data || !data.post) {
            $('body').addClass('nothing');
            return;
        }
        if (callback) {
            callback(data);
        }
    });
};
exports.init = function (config) {
    NativeAPI.invoke(
        'getUserInfo',
        null,
        function (err, userInfo) {
            var query = {
                'controller': 'Resume',
                'action': 'getResumeInfo',
                'puid': config.puid
            };
            if (!err) {
                query.user_id = userInfo.user_id;
            }
            getData(
                query,
                function (data) {
                    data.job_type = config.job_type || 'findjob';
                    $('body')
                        .append(template(data));
                    Widget.initWidgets();

                    Widget.ready([
                        '[data-widget="app/client/app/zp/resume/view/detail_page.js#showContact"]',
                        '[data-widget="app/client/app/zp/resume/view/detail_page.js#showInvitation"]',
                        '#showReport'
                    ], function (widgets, invitation, report) {
                        widgets.forEach(function (widget) {
                            widget.config.$el
                                .one('active', function (e, phone) {
                                    widgets.forEach(function (widget) {
                                        widget.active(phone);
                                    });
                                    invitation.config.$el.show();
                                })
                                .on('download-success', function () {
                                    report.config.isMy = true;
                                });
                        });
                    });
                }
            );
        }
    );
};
exports.showContact = Widget.define({
    events: {
        'tap [data-role="show"]': function () {
            var puid = this.config.puid;
            var self = this;
            var userInfoDefer = $.Deferred();

            if (this.config.$el.hasClass('loading')) {
                return;
            }

            NativeAPI.invoke('log', {
                code: 3121,
                value: [puid, 'detail/', this.config.pos].join(',')
            });

            this.config.$el.addClass('loading');
            this.config.$show.text('下载中...');
            userInfoDefer
                .done(function (userInfo) {
                    return self.downloadResume(puid, userInfo.user_id, function (err, phone) {
                        self.config.$el.removeClass('loading');
                        self.config.$show.text('查看联系方式');
                        if (!err) {
                            self.config.$el.trigger('active', phone);
                        }
                    });
                })
                .fail(function () {
                    NativeAPI.invoke(
                        'alert',
                        {
                            title: '提示',
                            message: '请先登录后再试!',
                            btn_text: '确认'
                        }, function () {
                            self.config.$el.removeClass('loading');
                            self.config.$show.text('查看联系方式');
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
        },
        'tap [data-role="call"]': function (e) {
            var phone = $(e.currentTarget).data('phone');
            NativeAPI.invoke('log', {
                code: 3126,
                value: [this.config.puid, 'detail/' + this.config.type].join(',')
            });

            NativeAPI.invoke(
                'makePhoneCall',
                {
                    number: phone
                });
        }
    },
    init: function (config) {
        this.config = config;
    },
    active: function (phone) {
        this.config.$el.addClass('active');
        this.config.$phone.text(phone);
        this.config.$call.data('phone', phone);
    },
    downloadResume: function (puid, userID, callback) {
        var self = this;

        API.getData({
            controller: 'Resume',
            action: 'downloadResume',
            puid: puid,
            user_id: userID
        }, function (err, data) {
            var orderID;
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
            self.config.$show.text('查看联系方式');
            orderID = data.order_id;

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
                        callback(null, data.phone);
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
                        callback(new Error(data.Msg));
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
                        callback(new Error('余额不足'));
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
                        NativeAPI.invoke('log', {
                            code: 3111,
                            value: confirm.value.toString()
                        });

                        if (confirm.value === confirm.YES) {
                            API.getData({
                                controller: 'Resume',
                                action: 'insertResume',
                                puid: puid,
                                user_id: userID,
                                order_id: orderID
                            }, function (err, data) {
                                if (err) {
                                    if (err.code === 1004) {
                                        callback(err);
                                        self.goPrepaidPage(userID);
                                    } else {
                                        NativeAPI.invoke('alert', {
                                            title: '提示',
                                            message: '下载失败',
                                            btn_text: '确定'
                                        }, function () {
                                            callback(err);
                                        });
                                    }
                                    return;
                                }
                                self.config.$el.trigger('download-success');
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
                                        callback(null, data.phone);
                                    });
                                    return;
                                }
                            });
                        } else {
                            callback(new Error('no phone'));
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
exports.showRecommendList = Widget.define({
    events:{},
    init: function (config) {
        this.config = config;
        this.puid   = config.puid;
        this.$el    = config.$el;
        this.render(this.puid);
    },
    getRecommendData: function (puid, callback) {
        if (!puid) {
            return false;
        }
        NativeAPI.invoke('getCityInfo', null, function (err, cityInfo) {
            if (err) {return;}
            API.getData({
                'controller': 'Resume',
                'action'    : 'recommendResume',
                'city_id'   : cityInfo.city_id,
                'puid'      : puid
            },function (err, data) {
                if (callback) {
                    callback(err, data);
                }
            });
        });
    },
    render: function (puid) {
        var postList = new PostList(this.config);
        var self     = this;
        var $closest  = self.$el.closest('.detail-group');
        this.getRecommendData(puid, function (err, data) {
            if (err || !data || data.length <= 0) {
                return;
            }
            $closest.show();
            postList.load({
                resumes: data
            });
        });
    }
});
exports.showInvitation = Widget.define({
    events: {
        'tap': function () {
            var puid = this.config.puid;
            NativeAPI.invoke('createWebView', {
                url: window.location.pathname + '#app/client/app/zp/resume/view/invitation_page.js?puid=' + puid
            });
        }
    },
    init: function (config) {
        this.config = config;
    }
});
exports.showReport = Widget.define({
    events: {
        'tap [data-role="report"]': 'report'
    },
    init: function (config){
        this.config = config;

    },
    report: function () {
        var puid = this.config.puid;
        NativeAPI.invoke('createWebView', {
            url: window.location.pathname + '#app/client/app/zp/resume/view/report_page.js?' +
                $.param({
                    puid: puid,
                    is_my: this.config.isMy ? true : false
                })
            });
    }
});
