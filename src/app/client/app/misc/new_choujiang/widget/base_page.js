var $           = require('$');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var HybridAPI   = require('app/client/common/lib/api/index.js');
var Widget      = require('com/mobile/lib/widget/widget.js');

exports.user = {
    login: function () {
        var userDefer = $.Deferred();
        NativeAPI.invoke('login', null, function (err, userInfo) {
            if (err) {
                userDefer.reject(err);
            } else {
                userDefer.resolve(userInfo);
            }
        });
        return userDefer;
    },
    getUserInfo: function (callback) {
        var getUserInfoDefer = $.Deferred();
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                callback && callback(err);
                getUserInfoDefer.reject(err);
                return;
            }
            callback && callback(userInfo);
            getUserInfoDefer.resolve(userInfo);
        });
        return getUserInfoDefer;
    },
    tryLogin: function () {
        var defer = $.Deferred();
        var self  = this;
        this.getUserInfo()
            .done(function (userInfo) {
                defer.resolve(userInfo);
            }).fail(function () {
                self.login()
                .done(function (userInfo) {
                    defer.resolve(userInfo);
                })
                .fail(function (err) {
                    defer.reject(err);
                });
            });
        return defer;
    }
};


exports.alertPop = Widget.define({
    events: {
        'alert::pop': function (event, config) {
            if (config) {
                if (config.$el) {
                    this.$refer = config.$el;
                }
                this.renderPanel(config);
            }
            this._show();
        },
        'click [data-role="confirm"]': function (e) {
            e.preventDefault();
            if (this.$refer) {
                this.$refer.trigger('alert::confirm', this.$el.data());
            }
            this._hide();
        },
        'click [data-role="close"]': function (e) {
            e.preventDefault();
            if (this.$refer) {
                this.$refer.trigger('alert::close', this.$el.data());
            }
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$refer = $(config.refer);
        this.$el    = config.$el;
    },
    _show: function () {
        this.$el.addClass('active');
        this.$el.on('touchmove', function (e) {
            e.preventDefault();
        });
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$el.off('touchmove');
    },
    renderPanel: function (data) {
        if (data.content) {
            this.config.$content.html(data.content);
        }
        if (data.title) {
            this.config.$title.html(data.title);
        }
    }
});
