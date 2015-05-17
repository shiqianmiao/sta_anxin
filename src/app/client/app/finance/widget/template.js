var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var BaseForm = require('com/mobile/widget/form2/form.js');
var BaseField = require('com/mobile/widget/form2/BaseField.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Util = require('app/client/common/lib/util/util.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.close = function(config) {
    config.$el.on('click', function(e) {
        e.preventDefault();
        config.$el.parent().removeClass('active');
    });
};

exports.myTemplate = Widget.define({
    events: {
        'click [data-role="add"]': 'addTemplate',
        'click [data-role="item"]': 'editTemplate',
        'click [data-role="toggleActive"]': 'toggleActive',
        'click [data-role="mask"]': 'hideMask',
        'click [data-role="cancel"]': 'hideMask',
        'click [data-role="confirmActive"]': 'confirmActive'
    },
    init: function(config) {
        this.config = config;
    },
    addTemplate: function(e) {
        e.preventDefault();

        this.config.$addWindow.addClass('active');
        this.config.$mask.addClass('active');
    },
    editTemplate: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var id = $target.data('id');
        var $orginTarget = $(e.target);
        if ($orginTarget.is('[data-role="toggleActive"]')) {
            return false;
        }
        Util.redirect('app/client/app/finance/controller/add_template.js?id=' + id);
    },
    confirmActive: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $target = this.curTarget;
        if ($target) {
            var curActive = $target.data('active');

            var text = '取消应用',
                newActive = 5,
                id = $target.parent().data('id'),
                statusText = '工作中，正在疯狂筛选客户',
                className = 'no-active';

            if (curActive - 0 === 5) {
                text = '应用';
                newActive = 3;
                statusText = '休息中，随时待命';
                className = '';
            }
            httpApi.request('GET', {}, '/template/setlistingstatus', {
                    user_id: this.config.userId,
                    id: id,
                    listing_status: newActive
                })
                .done(function(data) {
                    if (data.status - 0 === 403) {
                        Util.toast('请重新登录', 2000);
                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    if (!data.status) {
                        $target
                            .data('active', newActive)
                            .text(text);

                        if (newActive === 5) {
                            $target.addClass('no-active');
                        } else {
                            $target.removeClass('no-active');
                        }

                        $target.parent().find('.status').text(statusText);
                    }
                })
                .fail(function() {
                    Util.toast(text + '模版失败');
                });

            this.hideMask();
        }
    },
    toggleActive: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.curTarget = $(e.currentTarget);
        var active = this.curTarget.data('active');

        if (active - 0 === 3) {
            this.config.$useWindow.find('.js-text').text('应用');
        } else {
            this.config.$useWindow.find('.js-text').text('取消应用');
        }

        this.config.$useWindow.addClass('active');
        this.config.$mask.addClass('active');
    },
    hideMask: function(e) {
        if (e) {
            e.preventDefault();
        }

        this.config.$addWindow.removeClass('active');
        this.config.$useWindow.removeClass('active');
        this.config.$mask.removeClass('active');
    }
});

var animationing = 0;
exports.showSelect = function(config) {

    config.$el
        .on('click', function(e) {
            e.preventDefault();
            $(this).addClass('active');
            config.$el.trigger('openSelect');
            $('body').addClass('js-open-select');
        })
        .on('animationstart webkitAnimationStart MSAnimationStart', function() {
            animationing = 1;
        })
        .on('animationend webkitAnimationEnd MSAnimationEnd', function() {
            animationing = 0;
        });
};

exports.checkSelect = Widget.define({
    events: {
        'tap [data-value]': 'select',
        'touchend [data-value]': function(e) {
            e.preventDefault();
        },
        'tap [data-role="confirm"]': 'hideSelect',
        'touchend [data-role="confirm"]': function(e) {
            e.preventDefault();
        },
        'tap [data-role="cancel"]': 'closeSelect',
        'touchend [data-role="cancel"]': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        this.config = config;
        this.$select = config.$el.find('[data-value]');
        this.$firstSelect = config.$el.find('[data-value]:eq(0)');
        this.initValue();
    },
    initValue: function() {
        var val = this.config.$input.val();
        var varArr = val.split(',');
        var self = this;

        self.$select.each(function() {
            var value = $(this).data('value') + '';
            if ($.inArray(value, varArr) > -1) {
                $(this).addClass('active');
                $(this).find('input').prop('checked', true);
            } else {
                $(this).removeClass('active');
                $(this).find('input').prop('checked', false);
            }
        });

        this.updateValue();
    },
    select: function(e) {
        if (animationing) {
            return;
        }
        var $target = $(e.currentTarget);
        var val = $target.data('value');

        var isChecked = $target.hasClass('active');

        if (val + '' === '-1') {
            this.$select.removeClass('active');
            this.$select.find('input').prop('checked', false);
        } else {
            this.$firstSelect.removeClass('active');
            this.$firstSelect.find('input').prop('checked', false);
        }

        if (isChecked) {
            $target.removeClass('active');
        } else {
            $target.addClass('active');
        }

        $target.find('input').prop('checked', !isChecked);
    },
    closeSelect: function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (animationing) {
            return;
        }

        this.initValue();
        this.config.$el.parents('[data-role="childSelect"]').removeClass('active');

        $('body').removeClass('js-open-select');
    },
    hideSelect: function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (animationing) {
            return;
        }

        this.updateValue();
        this.config.$el.parents('[data-role="childSelect"]').removeClass('active');

        $('body').removeClass('js-open-select');
    },
    updateValue: function() {
        var valArr = [];
        var textArr = [];
        this.$select.filter('.active').each(function() {
            textArr.push($(this).text());
            valArr.push($(this).data('value'));
        });

        var text = textArr.join(',') || '请选择';

        if (valArr.length) {
            this.config.$text
                .addClass('active')
                .text(text);

        } else {
            this.config.$text
                .removeClass('active')
                .text(text);
        }

        this.config.$input.val(valArr.join(','));

        this.config.$input.trigger('reValid');
    }
});


exports.initScroll = function(config) {
    config.$el.parents('[data-role="childSelect"]').on('openSelect', function() {
        if (config.$el.data('hasScroll')) {
            return false;
        }
        setTimeout(function() {
            G.use('com/mobile/lib/iscroll/iscroll.js', function() {
                config.$el.data('hasScroll', true);

                return new window.IScroll(config.$el[0], {
                    bounceEasing: 'easing',
                    bounceTime: 600,
                    click: true,
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale'
                });
            });
        }, 500);
    });
};

exports.select = function(config) {
    var $items = config.$el.find('[data-value]');

    var curValue = config.$input.val();
    var $curItem = config.$el.find('[data-value="' + curValue + '"]');
    var text = $curItem.text();

    $curItem.addClass('active');
    config.$text
        .addClass('active')
        .text(text);

    config.$el
        .on('tap', '[data-value]', function(e) {
            e.stopPropagation();
            if (animationing) {
                return;
            }

            $items.removeClass('active');
            $(this).addClass('active');
            var value = $(this).data('value');
            config.$input.val(value);
            config.$input.trigger('reValid');

            var text = $(this).text();
            config.$text
                .addClass('active')
                .text(text);

            $('#form [data-role="childSelect"]').removeClass('active');

            $('body').removeClass('js-open-select');
        })
        .on('touchend', '[data-value]', function(e) {
            e.preventDefault();
        });

    config.$cancel
        .on('tap', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (animationing) {
                return;
            }

            $('#form [data-role="childSelect"]').removeClass('active');

            $('body').removeClass('js-open-select');
        })
        .on('touchend', function(e) {
            e.preventDefault();
        });
};

exports.selectDisable = Widget.define({
    events: {
        'click [data-value]': 'select',
        'blur [data-role="text"]': 'validateField',
        'focus [data-role="text"]': function() {
            this.config.$input.trigger('focus');
        }
    },
    init: function(config) {
        this.config = config;
        var value = this.config.$input.val();
        this.initValue(value);
    },
    initValue: function(value) {
        if (value + '' === '-1') {
            this.disableInput(true, false);
        } else {
            this.config.$el.find('[data-value]').removeClass('active');
            this.config.$el.find('[data-value="1"]').addClass('active');

            this.disableInput(false, true);
            this.config.$input.val(value);
        }
    },
    select: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var val = $target.data('value');

        this.config.$el.find('[data-value]').removeClass('active');
        $target.addClass('active');

        if (val + '' === '-1') {
            this.config.$input.val(val);
            this.disableInput(true, true);
        } else {
            var text = this.config.$text.val() || '';
            this.config.$input.val(text);

            this.disableInput(false, true);
        }
    },
    disableInput: function(isDisable, isValid) {
        if (isDisable) {
            this.config.$el.addClass('disabled');
            this.config.$text.val('');
        } else {
            this.config.$el.removeClass('disabled');
        }
        this.config.$text.prop('disabled', isDisable);
        this.isDisable = isDisable;

        if (isValid) {
            this.validateField();
        }
    },
    validateField: function() {
        var val = '';
        if (this.isDisable) {
            val = -1;
            this.config.$text.val('');
        } else {
            val = this.config.$text.val();
        }

        this.config.$input.val(val);

        if (val) {
            this.config.$input.trigger('reValid');
        }
    }
});


exports.mulitField = Widget.define({
    events: {
        'focus [data-role="input"]': function(e) {
            clearTimeout(this.errTimer);
            if (this.$el.hasClass('has-warning')) {
                var err = $(e.currentTarget).parents('[data-role="field"]').data('error');
                if (err) {
                    this.showError(err);
                }
            }
        },
        'field-valid': function() {
            this.config.$field.each(function() {
                $(this).data('error', null);
            });

            this.updateTip();
        },
        'field-error': function(e, err) {
            var $target = $(e.target);
            $target.data('error', err);

            var self = this;
            this.errTimer = setTimeout(function() {
                self.updateTip('has-warning', '');
            }, 50);
        }
    },
    showError: function(error) {
        clearTimeout(this.timer);
        clearTimeout(this.errTimer);

        this.$tipSpan
            .addClass('active')
            .text(error.message);

        var self = this;
        this.timer = setTimeout(function() {
            self.errShowing = false;
            self.$tipSpan.removeClass('active');
        }, 3000);

        self.updateTip('has-warning', '');
    },
    init: function(config) {
        this.config = config;
        this.$el = config.$el;
        this.$tipSpan = $(config.$tipSpan);
        this.showErr = false;
    },
    updateTip: function(className) {
        this.$el.removeClass('has-warning valid-valid');
        if (className) {
            this.$el.addClass(className);
        }
    }
});

exports.baseField = BaseField.extend({
    init: function(config) {
        this.super_.init.call(this, config);
    }
});

exports.inputField = BaseField.extend({
    events: {
        'focus [data-role="input"]': function() {
            var self = this;
            if (this.error) {
                this.$tipSpan
                    .addClass('active')
                    .text(this.error.message);

                this.timer = setTimeout(function() {
                    self.$tipSpan.removeClass('active');
                }, 3000);
            }
        },
        'blur [data-role="input"]': function() {
            clearTimeout(this.timer);
            this.$tipSpan.removeClass('active');
        },
        'field-valid': function() {
            this.error = null;
            // 选择性校验
            if (this.config.condition) {
                if (!this.$input.val()) {
                    this.updateTip(null, '');
                    return false;
                }
            } else {
                this.updateTip(null, '');
            }
        },
        'field-error': function(e, err) {
            this.error = err;
            this.updateTip('has-warning', '');
        },
        'field-focus': function() {
            var top = this.$input.offset().top;
            $('body').scrollTop(top - 10);
            // this.$input.focus();
        }
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.$tipSpan = $(config.$tipSpan);
    },
    updateTip: function(className) {
        this.$el.removeClass('has-warning valid-valid');
        if (className) {
            this.$el.addClass(className);
        }
    }
});

exports.submitForm = BaseForm.extend({
    events: {
        'change [data-role="field"]': function(e) {
            var trigger = $(e.currentTarget).data('trigger');
            if (trigger === 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        // 离开某个字段
        'blur [data-role="field"]': function(e) {
            if ($(e.target).hasClass('input-file')) {
                return;
            }

            var trigger = $(e.currentTarget).data('trigger');

            if (trigger !== 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        // 表单验证正确
        'form-valid': function() {
            var values = this.config.$el.serializeArray();
            var datas = {};
            values.forEach(function(item) {
                if (item.name) {
                    datas[item.name] = item.value;
                }
            });

            this.postDatas = datas;
            // window.onbeforeunload = null;
            $('#confirm').addClass('shown');
        }
    },
    init: function(config) {
        var self = this;
        this.super_.init.call(this, config);

        // window.onbeforeunload = function() {
        //     return '模版未提交将不会被保存，确定放弃提交？';
        // };

        $('#confirm')
            .on('save', function() {
                self.postDatas.listing_status = '3';
                self.postRequest();
            })
            .on('use', function() {
                self.postDatas.listing_status = '5';
                self.postRequest();
            });

        $('body').on('touchmove', function(e) {
            if ($(this).hasClass('js-open-select')) {
                e.preventDefault();
            }
        });
    },
    postRequest: function() {
        var postDatas = this.postDatas;

        httpApi.request('POST', {}, '/template/save', postDatas)
            .done(function(data) {
                if (data.status - 0 === 403) {
                    Util.toast('请重新登录', 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                        Util.redirect(url);
                    }, 2000);

                    return false;
                }


                if (!data.status) {
                    Util.redirect('app/client/app/finance/controller/my_template.js');
                } else {
                    Util.toast(data.message);
                }
            })
            .fail(function() {
                Util.toast('保存模版失败');
            });
    }
});

exports.deleteTemplate = function(config) {
    config.$el.on('click', function(e) {
        e.preventDefault();
        $('#delTpl').addClass('shown');
    });

    $('#delTpl')
        .on('click', '[data-role="cancel"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#delTpl').removeClass('shown');
        })
        .on('click', '[data-role="confirm"]', function(e) {
            e.preventDefault();
            e.stopPropagation();

            httpApi.request('GET', {}, '/template/setlistingstatus', {
                user_id: config.userId,
                id: config.id,
                listing_status: 1
            })
            .done(function(data) {
                if (data.status - 0 === 403) {
                    Util.toast('请重新登录', 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                        Util.redirect(url);
                    }, 2000);

                    return false;
                }

                if (!data.status) {
                    Util.toast('删除模版成功');
                    setTimeout(function() {
                        Util.redirect('app/client/app/finance/controller/my_template.js');
                    }, 2000);
                } else {
                    Util.toast(data.message);
                }
            })
            .fail(function() {
                Util.toast('删除模版失败');
            });
        });
};

exports.confirmSubmit = function(config) {
    config.$el
        .on('click', '[data-role="save"]', function(e) {
            e.preventDefault();
            config.$el.trigger('save');
        })
        .on('click', '[data-role="use"]', function(e) {
            e.preventDefault();
            config.$el.trigger('use');
        });
};