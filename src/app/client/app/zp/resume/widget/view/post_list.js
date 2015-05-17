var $             = require('$');

var NativeAPI     = require('app/client/common/lib/native/native.js');
var RemoteAPI     = require('app/client/app/zp/lib/remoteAPI.js');
var listItemTpl   = require('app/client/app/zp/resume/widget/template/job_list_item.tpl');

var INDEX_PAGE    = window.location.pathname;
var PAGE_JS       = 'app/client/app/zp/resume/view/detail_page.js';

function postList(config) {
    var self = this;
    this.config = config;
    this.url    = config.url;
    this.$el    = config.$el;
    this.$el
        .on('tap','[data-role="link"]', function (e) {
            self.link(e);
        })
        .on('tap','[data-role="download"]', function (e) {
            self.download(e);
        });
    this.init(config.listData);
}

postList.prototype.init = function (listData) {
    if (!listData) {
        return;
    }
    this.load(listData);
};

postList.prototype.download = function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var puid = $target.closest('[data-role="post"]').data('puid');
    var userInfoDefer = $.Deferred();

    if (this.$el.hasClass('loading')) {
        return;
    }

    NativeAPI.invoke('log', {
        code: 3121,
        value: puid + ',list'
    });

    this.$el.addClass('loading');

    $target
        .addClass('loading')
        .text('下载中...');

    userInfoDefer
        .done(function (userInfo) {
            return self.downloadResume(puid, userInfo.user_id, function () {
                $target.removeClass('loading').text('下载');
                self.$el.removeClass('loading');
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
                    self.$el.removeClass('loading');
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
};
postList.prototype.link = function (e) {
    var puid = $(e.currentTarget).closest('[data-role="post"]').data('puid');
    var url  = this.url || INDEX_PAGE + '#' + PAGE_JS +'?puid='+ puid + '&job_type=' + this.config.job_type;
    NativeAPI.invoke(
        'createWebView',
        {
            url: url,
            control: {
                type: 'title',
                text: '信息详情'
            }
        }
    );

    NativeAPI.invoke('log', {code: 3122});
};
postList.prototype.load = function (data) {
    var self   = this;
    this.clear();
    self.render(data);
};
postList.prototype.render = function (data) {
    var self = this;
    var obj  = $.extend({
            is_need_top: false,
            job_type: self.config.job_type || 'findjob'
        },data);
    this.config.$list.append(
        listItemTpl(obj)
    );
};
postList.prototype.clear = function () {
    this.config.$list.html('');
};
postList.prototype.downloadResume = function (puid, userID, callback) {
    var self = this;

    RemoteAPI.getData({
        controller: 'Resume',
        action: 'downloadResume',
        puid: puid,
        user_id: userID
    }, function (err, data) {
        self.$el.find('[data-role="download"]').filter('.loading').removeClass('loading').text('下载');
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
                        RemoteAPI.getData({
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
};
postList.prototype.goPrepaidPage = function (userID) {
    NativeAPI.invoke(
        'createWebView',
        {
            url: window.location.pathname + '#app/client/app/zp/resume/view/prepaid_page.js?user_id=' + userID
        });
};

module.exports = postList;