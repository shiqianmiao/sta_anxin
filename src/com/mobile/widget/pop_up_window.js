var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.service = {
    getData: function (param, callback) {
        $.ajax($.extend({
            type:'GET',
            dataType:'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        }).fail(function () {
            callback('提示：网络错误！');
        });
    },
    postData: function (param, callback) {
        $.ajax($.extend({
            type: 'POST',
            dataType: 'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        })
        .fail(function () {
            callback('提示：网络错误！');
        });
    }
};
exports.confirmPop = Widget.define({
    events: {
        'Events::confirmPop': function (event, config) {
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
            this.$refer.trigger('Events::confirm');
            this._hide();
        },
        'click [data-role="cancel"],[data-role="close"]': function (e) {
            e.preventDefault();
            this.$refer.trigger('Events::cancel');
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$refer = $(config.refer);
        this.$el    = config.$el;
        this.$mask  = $(config.maskRefer || '#mask');
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    renderPanel: function (data) {
        if (data.title) {
            this.config.$content.html(data.title);
        }
        if (data.content) {
            this.config.$title.html(data.content);
        }
    }
});

//绑定手机号
exports.popWithForm = Widget.define({
    events: {
        'Events::popWithForm': function (event, data) {
            this.referData = data;
            this._show();
        },
        'Form::Valid': function (e) {
            e.preventDefault();
            var self = this;
            this.formAction(function (data) {
                self.$refer.trigger('Events::formSuccess', data);
                self._hide();
            });
        },
        'click [data-role="close"]': function (e) {
            e.preventDefault();
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$el    = config.$el;
        this.$refer = $(config.refer);
        this.$mask  = $(config.maskRefer || '#mask');
        this.url    = config.ajaxUrl;
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    formAction: function (callback) {
        var self  = this;
        var formData = self.config.$form.serializeArray();

        exports.service.postData({
            url: self.config.submitUrl,
            data: formData
        },function (err, data) {
            if (err) {
                window.alert(err);
                return;
            }
            if (callback) {
                callback(data);
            }
        });
    }
});


exports.alertPop = Widget.define({
    events: {
        'Events::alertPop': function (event, config) {
            if (config) {
                if (config.$el) {
                    this.$refer = config.$el;
                }
                this.renderPanel(config);
            }
            this._show();
        },
        'click [data-role="confirm"],[data-role="close"]': function (e) {
            e.preventDefault();
            if (this.$refer) {
                this.$refer.trigger('Events::tipOff');
            }
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$refer = $(config.refer);
        this.$el    = config.$el;
        this.$mask  = $(config.maskRefer || '#mask');
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    renderPanel: function (data) {
        if (data.title) {
            this.config.$content.html(data.title);
        }
        if (data.content) {
            this.config.$title.html(data.content);
        }
    }
});