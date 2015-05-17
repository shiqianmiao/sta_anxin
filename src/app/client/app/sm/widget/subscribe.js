var $ = require('$');
var Storage = require('app/client/app/sm/util/storage.js');
var Widget  = require('com/mobile/lib/widget/widget.js');
var getInstallId = require('app/client/common/lib/mobds/api/get_install_id.js');
var NativeServiseAPI = require('app/client/common/lib/mobds/http_api.js');
var Util = require('app/client/common/lib/util/util.js');

exports.subscribe = Widget.define({
    events: {
        'popwindow::confirm': function () {
            this.tab(this.config.$tab);
        },
        'click [data-role="tabWrap"]' : function (e) {
            e.preventDefault();
            this.tab($(e.currentTarget).find('[data-role=tab]'));
        }
    },
    init: function (config) {
        this.config = config;
        this.$el    = config.$el;
        this.initTab();
    },
    tab: function ($tab) {
        var self = this;
        var $tab = $tab || self.$tab;
        Storage.set('subscribe_checked', $tab[0].checked ? 1 : 0, function () {
                if (!$tab[0].checked){
                    self.tabOn();
                } else {
                    self.tabOff();
                }
            });
    },
    initTab: function () {
        var self = this;
        Storage.get('subscribe_checked', function (data) {
            if (data === 0) {
                self.tabOff();
            }else if (data === 1) {
                self.tabOn();
            }else{
                Storage.set('subscribe_checked', 1, function () {
                    self.tabOn();
                });
            }
        });
    },
    tabOff: function () {
        var self = this;
        var $tab  = self.config.$tab;
        if (!$tab[0].checked) {
            return;
        }
        self.config.$tab[0].checked = false;
    },
    tabOn: function () {
        var self = this;
        var $tab  = self.config.$tab;
        if ($tab[0].checked) {
            return;
        }
        self.config.$tab[0].checked = true;

    }
});
exports.forPush = exports.subscribe.extend({
    initTab: function () {
        var self = this;
        var config = this.config;
        this.expiresDay  = config.expiresDay || 60 * 60 * 24 * 3;

        this.tipsText    = config.tipsText || ['您已关闭每日赚积分提醒，可能会失去积分兑好礼的机会哦','您已打开每日赚积分提醒，小驴会每天中午12点提醒您，请保证App消息推送正常打开哦'];
        this.tipsTimeout = config.tipsTimeout || 3;
        this.userType   = config.userType || 1002;
        this.installId  = 0;
        this.deleteId   = 0;
        this.tabCode    = 0;

        this.baseAPI = new NativeServiseAPI({
            path: config.uri || '/api/common/default/subscription/'
        });

        getInstallId(function (err, installId) {
            if (err) {
                return;
            }
            self.installId = installId;
            self.service({
                type:'GET',
                data:{
                    install_id: installId,
                    user_type: self.userType
                }
            }, function (err, data) {
                if (err) {
                    return;
                }
                self.tabCode  = data.set;
                self.deleteId = data.id || installId +'_'+ self.userType;
                if (self.deleteId) {
                    self.showWrap();
                }
                if (self.tabCode === 1) {
                    self.tabOn();
                }else{
                    self.tabOff();
                }
            });
        });
    },
    tab: function ($tab) {
        var self = this;
        if (self.isPending) {
            return;
        }
        self.pending();
        if (!$tab[0].checked) {
            self.service({
                type: 'POST',
                data: {
                    install_id: self.installId,
                    user_type: self.userType
                }
            }, function (err) {
                if (err) {
                    window.alert(err);
                    return ;
                }
                self.tabOn();
                self.pendingOff();
                Util.toast(self.tipsText[1]);
            });
        }else{
            self.service({
                type: 'DELETE',
                query:'?id='+ self._deleteId(),
                data: {
                    id: self._deleteId()
                }
            }, function (err) {
                if (err) {
                    window.alert(err);
                    return;
                }
                self.tabOff();
                self.pendingOff();
                Util.toast(self.tipsText[0]);
            });
        }
    },
    pending: function () {
        this.isPending = true;
    },
    pendingOff: function () {
        this.isPending = false;
    },
    service: function (param, callback) {
        var request = this.baseAPI.request(param.type,
            {
                'X-Ganji-Agent' : 'H5'
            },
            param.query || '',
            param.data);

        request.done(function (data) {
            callback(null, data.data);
        })
        .fail(function (err) {
            callback(err.message);
        });
    },
    _deleteId: function () {
        return this.deleteId;
    },
    showWrap: function () {
        var self = this;
        self.$el.show();
    }
});