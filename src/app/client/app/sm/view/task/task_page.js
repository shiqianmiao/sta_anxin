var $          = require('$');
var Widget     = require('com/mobile/lib/widget/widget.js');
var template   = require('app/client/app/sm/template/task/task_page.tpl');
var HybridAPI  = require('app/client/common/lib/api/index.js');
var SMAPI      = require('app/client/app/sm/service/sm_api.js');
var NativeAPI  = require('app/client/common/lib/native/native.js');
var Storage    = require('app/client/app/sm/util/storage.js');

/*style*/
require('../../style/style.css');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '赚积分'
        }
    );
    var $body = $('body');
    HybridAPI.invoke('getUserInfo', null)
    .done(function (userInfo) {
        SMAPI.getUserTaskList(userInfo.user_id, function (err, data) {

            if (err) {
                $body.addClass('offline');
                return;
            }
            if (!data) {
                $body.addClass('nothing');
                return;
            }
            $body.removeClass('loading');
            $body.append(template({data: data}));
            Widget.initWidgets();
            NativeAPI.invoke('updateHeaderRightBtn',{
                action:'show',
                text: '积分明细'
            });
            NativeAPI.registerHandler('headerRightBtnClick',
                    function () {
                        NativeAPI.invoke('createWebView',
                            {url: window.location.pathname + '#' + 'app/client/app/sm/view/points/points_log_page.js?page_index=0'}
                            );
                    });
        });
    }).fail(function () {
        SMAPI.getTaskList(function (err, data) {
            if (err) {
                $body.addClass('offline');
                return;
            }
            if (!data) {
                $body.addClass('nothing');
                return;
            }
            $body.removeClass('loading');
            $body.append(template({data: data}));
            Widget.initWidgets();
        });
    });
};

exports.redirect = function (config) {
    var jumpUrl = window.location.pathname + '#' + config.jumpUrl + '?task_id=' + config.taskId;

    config.$el.on('click', function (e) {
        e.preventDefault();
        NativeAPI.invoke(
            'createWebView',
            {url: jumpUrl}
        );
    });
};

exports.subscribe = Widget.define({
    events: {
        'Events::confirm': function () {
            this.tab(this.config.$tab);
        },
        'click [data-role="tab"]' : function (e) {
            e.preventDefault();
            this.tab($(e.currentTarget));
        }
    },
    init: function (config) {
        this.config     = config;
        this.$el        = config.$el;
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