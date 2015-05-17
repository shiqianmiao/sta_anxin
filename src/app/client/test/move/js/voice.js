var Widget = require('com/mobile/lib/widget/widget.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var storage = new Storage('VOICE');
var $ = require('$');

function handleError (err) {
    window.alert('出错了！[code:'+err.code+']: ' + err.message);
}

exports.voice = Widget.define({
    events: {
        'click [data-role="test"]': 'test',
        'click [data-role="record"]': 'record',
        'click [data-role="cancelRecord"]': 'cancelRecord',
        'click [data-role="upload"]': 'upload',
        'click [data-role="play"]': 'play',
        'click [data-role="getLength"]': 'getLength'
    },
    init: function(config) {
        this.config = config;

        this.recordFlag = 'startRecord';
        this.playFlag = 'startPlay';
        this.testFlag = false;

        $('button[data-role]').each(function(index) {
            var $button = $(this);

            $button
                .css({
                    opacity: 1,
                    transform: 'translatey(' + (index * ($button.height() + 10)) + 'px)'
                });
        });
    },
    test: function() {
        var config = this.config;

        if (this.testFlag) {
            config.$recording.hide();
            this.testFlag = false;
        } else {
            config.$recording.show();
            this.testFlag = true;
        }
    },
    handleError: function(err) {
        this.config.$recording.hide();
        handleError(err);
    },
    record: function() {
        var self = this;
        var config = this.config;
        var action = this.recordFlag;

        // 设置按钮外观
        var toggleButton = function() {
            if (self.recordFlag === 'startRecord') {
                self.recordFlag = 'stopRecord';
                config.$record.text(self.recordFlag);

                config.$recording.show();
            } else {
                self.recordFlag = 'startRecord';
                config.$record.text(self.recordFlag);

                config.$recording.hide();
            }
        };

        if (action === 'startRecord') {
            NativeAPI.invoke('voice', {
                action: 'startRecord'
            }, function(err, data) {
                if (err) {
                    return self.handleError(err);
                }

                toggleButton();
                storage.set('record_id', data.record_id);
            });
        } else {
            NativeAPI.invoke('voice', {
                action: 'stopRecord',
                record_id: storage.get('record_id')
            }, function(err) {
                if (err) {
                    return self.handleError(err);
                }

                toggleButton();
            });
        }
    },
    cancelRecord: function() {
        var self = this;

        NativeAPI.invoke('voice', {
            action: 'cancelRecord',
            record_id: storage.get('record_id')
        }, function(err) {
            if (err) {
                return self.handleError(err);
            }
        });
    },
    upload: function() {
        var self = this;

        NativeAPI.invoke('voice', {
            action: 'upload',
            record_id: storage.get('record_id')
        }, function(err, data) {
            if (err) {
                return self.handleError(err);
            }

            storage.set('url', data.url);
        });
    },
    play: function(e) {
        var self = this;
        var $cur = $(e.currentTarget);
        var action = this.playFlag;
        var config = this.config;

        // 设置按钮外观
        var toggleButton = function() {
            if (self.playFlag === 'startPlay') {
                self.playFlag = 'stopPlay';
                $cur.text(self.playFlag);

                config.$recording.show();
            } else {
                self.playFlag = 'startPlay';
                $cur.text($cur.data('playText'));

                config.$recording.hide();
            }
        };

        if (action === 'startPlay') {
            var type = $cur.data('type');

            if (type === 'record_id') {
                NativeAPI.invoke('voice', {
                    action: 'startPlay',
                    record_id: storage.get('record_id')
                }, function(err, data) {
                    if (err) {
                        return self.handleError(err);
                    }

                    toggleButton();
                    storage.set('play_id', data.play_id);
                });
            } else {
                NativeAPI.invoke('voice', {
                    action: 'startPlay',
                    url: storage.get('url')
                }, function(err, data) {
                    if (err) {
                        return self.handleError(err);
                    }

                    toggleButton();
                    storage.set('play_id', data.play_id);
                });
            }
        } else {
            NativeAPI.invoke('voice', {
                action: 'stopPlay',
                record_id: storage.get('play_id')
            }, function(err) {
                if (err) {
                    return self.handleError(err);
                }

                toggleButton();
            });
        }
    },
    getLength: function(e) {
        var self = this;
        var $cur = $(e.currentTarget);
        var type = $cur.data('type');

        if (type === 'record_id') {
            NativeAPI.invoke('voice', {
                action: 'getLength',
                record_id: storage.get('record_id')
            }, function(err, data) {
                if (err) {
                    return self.handleError(err);
                }

                window.alert(data.length);
            });
        } else {
            NativeAPI.invoke('voice', {
                action: 'getLength',
                url: storage.get('url')
            }, function(err, data) {
                if (err) {
                    return self.handleError(err);
                }

                window.alert(data.length);
            });
        }
    }
});

exports.init = function () {
    Widget.initWidgets();
};