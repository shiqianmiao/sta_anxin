var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var groupChatApi = require('app/client/app/group_chat/lib/group_chat_api.js');
var template = require('../template/campaign.tpl');
var nativeAlert = require('app/client/app/group_chat/lib/util.js').alert;

require('app/client/app/group_chat/chat/style/group.css');

var groupId;
var electionTimeout;

// 0表示选举结束，1表示可以选举
// 其实还应该有一个「未开始选举」的状态
var electionStatus;

exports.init = function(config) {
    NativeAPI.invoke('updateTitle', {
        text: '百人群招募群主啦'
    });

    groupId = config.group_id;

    groupChatApi.ImGetGroupElectionInfo({
        groupId : groupId
    }, function(err, data) {
        if (err && err.message === '网络异常') {
            $('body')
                .removeClass('loading')
                .addClass('offline');

            return;
        }

        if (config.debug === 'browser') {
            data = {
                startTime: new Date('2016-01-02').getTime(),
                currentTime: new Date().getTime(),
                status: 1
            };
        }

        electionTimeout = data.startTime - data.currentTime;
        electionStatus = data.status;

        $('body').removeClass('loading').append(template({
            data : data,
            groupName: config.group_name
        }));

        Widget.initWidgets();
    });
};

exports.main = Widget.define({
    events: {
        'input [data-role="textarea"]': 'inputText',
        'click [data-role="submit"]': 'submit'
    },
    init: function(config) {
        this.config = config;
        this.setCountdown();
        this.textContent = '';
    },
    inputText: function() {
        var config = this.config;

        config.$textBlock.removeClass('has-warning');

        if (config.$textarea.val().length > 100) {
            config.$textarea.val(this.textContent);
        } else {
            this.textContent = config.$textarea.val();
        }
    },
    submit: function() {
        var config = this.config;
        var text = config.$textarea.val();

        if ($.trim(text) === '') {
            config.$textBlock.addClass('has-warning');
            return;
        }

        groupChatApi.ImRobGroupOwner({
            groupId: groupId,
            content: text
        }, function(err, data) {
            if (data.status === 1) {
                nativeAlert('抢成功');
            } else  {
                nativeAlert('抢失败');
            }
        });
    },
    setCountdown: function() {
        var config = this.config;

        var formatZero = function(n) {
            n = parseInt(n, 10);

            if (n > 0) {
                if (n <= 9) {
                    n = '0' + n;
                }

                return String(n);
            } else {
                return '00';
            }
        };

        if (String(electionTimeout).length === 13) {
            electionTimeout = electionTimeout / 1000;
        }

        var timer;

        var showTime = function() {
            if (electionTimeout > 0) {
                config.$second[0].innerHTML = formatZero(electionTimeout % 60);
                config.$minute[0].innerHTML = Math.floor((electionTimeout / 60)) > 0 ? formatZero(Math.floor((electionTimeout / 60)) % 60) : '00';
                config.$hour[0].innerHTML   = Math.floor((electionTimeout / 3600)) > 0 ? formatZero(Math.floor((electionTimeout / 3600)) % 24) : '00';
                // config.$day = Math.floor((electionTimeout / 86400)) > 0? formatZero(Math.floor((electionTimeout / 86400)) % 30) : '00';

                electionTimeout -= 1;
            } else {
                clearInterval(timer);

                config.$second[0].innerHTML = '00';
                config.$minute[0].innerHTML = '00';
                config.$hour[0].innerHTML   = '00';

                if (electionStatus !== 0) {
                    config.$submit.prop('disabled', false);
                }
            }
        };

        showTime();
        timer = setInterval(showTime, 1000);
    }
});