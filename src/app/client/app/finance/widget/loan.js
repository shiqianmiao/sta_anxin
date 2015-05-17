var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Util = require('app/client/common/lib/util/util.js');
var AccountAPI = require('app/client/common/view/account/lib/api.js');
var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.authenticate = function(config) {
    require.async('com/mobile/widget/form2/form.js', function(BaseForm) {
        var initForm = BaseForm.extend({
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

                    httpApi.request('POST', {}, '/zizhi/save', datas)
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
                                Util.redirect('app/client/app/finance/controller/authenticate_detail.js');
                            } else {
                                Util.toast(data.message);
                            }
                        })
                        .fail(function() {
                            Util.toast('提交认证失败');
                        });
                }
            },
            init: function(config) {
                this.super_.init.call(this, config);
            }
        });

        initForm(config);
    });
};

exports.goUrl = function(config) {
    $(config.$toUrl).on('click', function(e) {
        e.preventDefault();
        var url = $(this).data('url');
        Util.redirect(url);
    });
};

exports.inputField = function(config) {
    require.async('com/mobile/widget/form2/BaseField.js', function(BaseField) {
        var initField = BaseField.extend({
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
                    this.$input.focus();
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

        initField(config);
    });
};

exports.showSelect = function(config) {
    config.$el.on('click', function(e) {
        e.preventDefault();
        $(this).addClass('active');

        if ($(this).data('name') === 'jigou_id') {
            $('body').addClass('prevent-scroll');
        }

        config.$el.trigger('openSelect');
    });
};

exports.select = function(config) {
    var $items = config.$el.find('[data-value]');

    config.$el.on('click', '[data-value]', function(e) {
        e.stopPropagation();
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
    });

    config.$cancel.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#form [data-role="childSelect"]').removeClass('active');
    });
};


exports.searchCity = Widget.define({
    events: {
        'touchstart touchmove touchend .filter-index': function(e) {
            e.stopPropagation();
        },
        'touchstart .filter-index [data-index]': 'startFn',
        'touchmove .filter-index [data-index]': 'moveFn',
        'touchend .filter-index [data-index]': 'endFn',
        'click [data-value]': 'select',
        'input .js-input': 'search',
        'click [data-role="cancel"]': 'hide'
    },
    init: function(config) {
        var self = this;
        this.config = config;
        this.$filterBody = config.$el.find('.js-filter');
        var height = $(window).height() * 0.9 - 54;
        this.iScrollObj = null;

        this.$filterBody.css('height', height);
        config.$el.find('.filter-index').css('height', height);
        this.start = {};
        this.$dictArray = this.$filterBody.find('[data-dict]');
        this.$indexShow = config.$el.find('.js-index-show');

        config.$el.parent().on('openSelect', function() {
            var that = this;
            if ($(that).data('hasScroll')) {
                return false;
            }

            setTimeout(function() {
                G.use('com/mobile/lib/iscroll/iscroll.js', function() {
                    self.iScrollObj = new window.IScroll(self.$filterBody[0], {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    });
                });

                $(that).data('hasScroll', true);
            }, 500);
        });


        this.searchIndex = [];
        this.$filterBody.find('[data-value]').each(function() {
            self.searchIndex.push({
                $el: $(this),
                data: $(this).data('value') + $(this).text()
            });
        });
    },
    startFn: function(e) {
        var point = e.touches[0];
        var $cur = $(e.currentTarget);

        this.start = {
            x: point.pageX,
            y: point.pageY
        };

        var index = $cur.data('index');

        if (index === 0) {
            this.iScrollObj.scrollTo(0, 0);
        } else {
            var toEl = this.$dictArray[index];
            if (toEl) {
                this.iScrollObj.scrollToElement(toEl, 0);
                this.$indexShow
                    .addClass('active')
                    .text($cur.text());
            }
        }
    },
    moveFn: function(e) {
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        var deltaY = e.touches[0].pageY - this.start.y;
        var absY = Math.abs(deltaY);
        var letterY = this.letterY || 14;

        // touchmove 不满一个字母高度不处理
        if (absY <= letterY || (absY % letterY) > 5) {
            return;
        }

        var fixedValue = 0;

        if (deltaY > 0) {
            fixedValue = Math.min(letterY / 50, 5);
        } else if (deltaY < 0) {
            fixedValue = -Math.min(letterY / 50, 5);
        }

        var index = parseInt($cur.data('index'), 10) + Math.round((deltaY + fixedValue) / letterY);

        if (index === 0) {
            this.iScrollObj.scrollTo(0, 0);
        } else {
            var toEl = this.$dictArray[index];
            if (toEl) {
                this.iScrollObj.scrollToElement(toEl, 0);
                this.$indexShow
                    .text($(toEl).text());
            }
        }
    },
    endFn: function() {
        this.$indexShow.removeClass('active');
    },
    select: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $target = $(e.currentTarget);
        var value = $target.data('value');
        var text = $target.text();
        value = value.split(',');

        this.config.$input.val(value[0]);
        this.config.$input.trigger('reValid');

        this.config.$text
            .addClass('active')
            .text(text);

        $('#form [data-role="childSelect"]').removeClass('active');
        $('body').removeClass('js-open-select');
    },
    hide: function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#form [data-role="childSelect"]').removeClass('active');
        $('body').removeClass('js-open-select');
    },
    search: function(e) {
        var $target = $(e.currentTarget);
        var val = $.trim($target.val());

        if (val) {
            this.$filterBody.addClass('searching');

            var count = 0;
            this.searchIndex.forEach(function(item) {
                if (count > 10) {
                    return;
                }
                if (item.data.indexOf(val) > -1) {
                    item.$el.addClass('js-searched');
                    count++;
                } else {
                    item.$el.removeClass('js-searched');
                }
            });
            this.iScrollObj.scrollTo(0, 0);
        } else {
            this.$filterBody.removeClass('searching');
        }
        this.iScrollObj._resize();
    }
});



exports.searchFormAjax = Widget.define({
    events: {
        'click [data-role="suggestion"] li': function(e) {
            e.stopPropagation();
            var $target = $(e.currentTarget);
            var text = $target.text();
            var id = $target.data('id');
            this.config.$text
                .addClass('active')
                .text(text);

            this.config.$input
                .val(id)
                .blur()
                .trigger('reValid');

            $('#form [data-role="childSelect"]').removeClass('active');
            $('body').removeClass('prevent-scroll');
        },
        'focus [data-role="input"]': function() {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        },
        'blur [data-role="input"]': function() {
            this.config.$close.hide();
        },
        'input [data-role="input"]': function() {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        },
        'click [data-role="cancel"]': function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#form [data-role="childSelect"]').removeClass('active');
            $('body').removeClass('prevent-scroll');
        }
    },
    init: function(config) {
        var self = this;
        this.config = config;
        this.$input = config.$el.find('.js-input');
        var user_id = $('#user_id').val();

        require.async('com/mobile/lib/autocomplete/autocomplete.js', function(AutoComplete) {
            self.autocomplete = new AutoComplete({
                $input: self.$input,
                getData: function(query, callback) {
                    if (query) {
                        httpApi.request('GET', {}, '/jigou/jigou', {
                            keyword: query,
                            user_id: user_id,
                            time: new Date().getTime(),
                            city_domain: $('#city_domain').val() || ''
                        }).done(function(data) {
                            if (data.status - 0 === 403) {
                                Util.toast('请重新登录！', 2000);
                                setTimeout(function() {
                                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent('app/client/app/finance/controller/authenticate.js');
                                    Util.redirect(url);
                                }, 1000);

                                return false;
                            }

                            if (!data.status && data.data.length) {
                                callback(data.data);
                            } else {
                                callback(null);
                            }
                        }).fail(function() {
                            Util.toast('数据返回错误');
                            callback(null);
                        });
                    } else {
                        callback(null);
                    }
                }
            });

            self.autocomplete
                .on('data', function(data) {
                    self.showSuggestion(data);
                })
                .on('empty', function() {
                    self.hideSuggestion();
                });
        });

        this.config.$input
            .on('blur', function() {
                self.hideSuggestion();
            });
    },
    showSuggestion: function(data) {
        var html = data.map(function(row) {
            return '<li data-id="{{nameid}}" class="js-touch-state">{{keyword}}</li>'
                .replace(/\{\{keyword\}\}/g, row.name)
                .replace(/\{\{nameid\}\}/g, row.id);
        }).join('');

        if (!html) {
            this.hideSuggestion();
        } else {
            this.config.$suggestion.html(html);
            this.config.$el.addClass('show');
        }
    },
    hideSuggestion: function() {
        this.config.$el.removeClass('show');
    }
});

exports.initUpload = function(config) {
    require.async('com/mobile/page/milan/widget/upload.js', function(Uploader) {
        var initFn = Uploader.extend({
            events: {
                'Upload::start': function() {
                    this.config.$images.addClass('active');
                },
                'Upload::success': function(e, fileInfo) {
                    this.success(fileInfo);
                    this.reloadAddBtn(e);

                    this.config.$input.trigger('reValid');
                },
                'Upload::delete': function() {
                    this.config.$images.removeClass('active');
                }
            }
        });

        initFn(config);
    });
};


exports.validImage = function(value, args, callback) {
    var imageObj = null,
        err = null;
    var maxNum = 1;
    if (args && args[0] && args[0].maxNum) {
        maxNum = args[0].maxNum;
    }

    try {
        imageObj = JSON.parse(value);
    } catch (er) {
        err = new Error('图片上传数据格式错误');
        return callback(err);
    }
    if (imageObj[0].length < maxNum) {
        err = new Error('需上传' + maxNum + '张图片');
    }
    callback(err);
};

exports.getLocationCity = function(config) {
    var callback = function(data) {
        var cityName = data.cityName || '未知';
        var cityDomain = data.cityDomain || null;
        var cityPinyin = data.cityPinyin || null;

        config.$city
            .text(cityName);

        if (cityDomain) {
            config.$city.attr('data-value', cityDomain + ',' + cityPinyin);
        }
    };

    var geoHttpApi = new HTTPApi({
        path: '/webapp/common/?'
    });

    geoHttpApi.request('GET', {}, $.param({
        controller: 'CommonGeoLocation',
        action: 'getCityByIp'
    }), {}, function(err, data) {
        if (data.cityDomain) {
            callback(data);
        }
    });
};

exports.unbind = function(config) {
    require.async('com/mobile/lib/cookie/cookie.js', function(Cookie) {
        var user_id = config.userId;
        var open_id = Cookie.get('gj-weixin-openid');

        config.$el.on('click', function(e) {
            e.preventDefault();

            httpApi.request('GET', {}, '/user/unbindopenid', {
                user_id: user_id,
                open_id: open_id,
                time: new Date().getTime()
            }, function() {
                AccountAPI.logout();

                var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');
                if (open_id) {
                    url += '&open_id=' + open_id;
                }

                Util.redirect(url);
            });
        });
    });
};

exports.pullRefresh = function(config) {
    var height = $(window).height() - 45;
    var itemsHeight = config.$items.height();

    if (itemsHeight - 45 < height) {
        itemsHeight = height + 46;
    }

    config.$items.height(itemsHeight);

    config.$el.css({
        'height': height,
        'overflow': 'hidden'
    });

    var scrollObj = null;
    var status = 0;
    G.use('com/mobile/lib/iscroll/iscroll.js', function() {
        scrollObj = new window.IScroll(config.$el[0], {
            bounceEasing: 'easing',
            bounceTime: 600,
            click: true,
            scrollbars: false,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale'
        });

        var $loadingText = config.$loading.find('span');

        scrollObj.on('beforeScrollStart', function() {
            config.$loading.addClass('active');
            $loadingText.text('下拉即可刷新...');
        });

        config.$el
            .on('touchmove', function() {
                if (scrollObj.directionY < 0 && scrollObj.y > 45) {
                    status = 1;
                    $loadingText.text('释放即可刷新...');
                } else if (scrollObj.directionY > 0 && scrollObj.y < -45) {
                    status = 2;
                } else {
                    status = 0;
                }
            })
            .on('touchend', function() {
                if (!status) {
                    config.$el.removeClass('js-top-loading js-bottom-loading');
                    return true;
                }
                if (status === 1) {
                    config.$el.addClass('js-top-loading');
                } else if (status === 2) {
                    config.$el.addClass('js-bottom-loading');
                }
            });

        scrollObj.on('scrollEnd', function() {
            var text = '加载数据中...';
            if (status === 3) {
                return false;
            }

            if (status === 2 || status === 0) {
                scrollObj.resetPosition(100);
            }

            if (status) {
                refresh();
            }

            $loadingText.text(text);
        });
    });

    var hideLoading = function() {
        // scrollObj.enable();
        config.$el.removeClass('js-top-loading js-bottom-loading');
        status = 0;
    };

    var curPage = 1;
    var refresh = function() {
        var tmpStatus = status;
        status = 3;

        var timestamp = 0,
            page = 1;
        if (tmpStatus === 1) {
            timestamp = Math.floor(new Date().getTime() / 1000);
            page = 1;
        } else if (tmpStatus === 2) {
            timestamp = config.timestamp;
            curPage += 1;
            page = curPage;
            if (page < 2) {
                page = 2;
            }
        }

        httpApi.request('GET', {}, '/case/list', {
                user_id: config.userId,
                timestamp: timestamp,
                category: tmpStatus,
                page: page
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

                var listData = data.data;

                var btnTextMap = {
                    '1': '立即购买',
                    '2': '已购买',
                    '3': '例子被抢',
                    '4': '已过期'
                };

                $.each(listData, function(index) {
                    var item = listData[index];
                    item.btn_text = btnTextMap[item.case_status + ''];
                    item.template_name = item.template_name || [];
                    if (item.count_time) {
                        item.time_str = Math.floor(item.count_time / 3600) + '小时' + Math.floor(item.count_time % 3600 / 60) + '分';
                    }
                });

                config.$items.height('auto');
                var curItemsHeight = config.$items.height();

                var newItemHeight = curItemsHeight + 145 * listData.length;
                if (newItemHeight - 45 < height) {
                    newItemHeight = height + 46;
                }
                config.$items.height(newItemHeight);
                scrollObj._resize();

                if (listData.length === 0) {
                    curPage -= 1;
                }

                require.async('app/client/app/finance/template/case_item.tpl', function(tpl) {
                    var html = '';
                    if(listData.length) {
                        $.each(listData, function(i, v) {
                            if(v.active_price && v.active_price - 0 > -1) {
                                v.isActive = 1;
                            }
                            html += tpl({
                                item: v
                            });
                        });
                        if (tmpStatus === 1) {
                            config.$before.prepend(html);
                        } else if (tmpStatus === 2) {
                            config.$after.append(html);
                        }
                        config.$nothing.hide();
                    }

                    hideLoading();
                    if (listData.length && tmpStatus !== 2) {
                        Util.toast('成功更新' + listData.length + '条数数据', 1000);
                    }
                });
            });
    };
};

exports.weixinBuy = Widget.define({
    events: {
        'tap [data-role="buy"]': 'buy',
        'click [data-role="detailBuy"]': 'detailBuy',
        'click [data-role="item"]': 'goDetail'
    },
    init: function(config) {
        this.config = config;
        this.user_id = config.userId;

        var self = this;
        $('#confirm')
            .on('confirm-chong', function() {
                $('#confirm').trigger('hideMask');
                self.goChongPage();
            })
            .on('confirm-pay', function() {
                $('#confirm').trigger('hideMask');
                // 确定购买
                self.payCallback();
            })
            .on('confirm-auth', function() {
                $('#confirm').trigger('hideMask');

                var url = 'app/client/app/finance/controller/authenticate.js';
                Util.redirect(url);
            });
    },
    goDetail: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var $orignTarget = $(e.target);
        if ($orignTarget.is('[data-role="buy"]') || $orignTarget.hasClass('js-phone')) {
            return false;
        }

        var case_id = $target.data('caseId');
        require.async('com/mobile/lib/storage/storage.js', function(Storage) {
            var storage = new Storage('weixinJR');

            var readlists = storage.get('readlists') || [];
            if ($.inArray(case_id, readlists) === -1) {
                readlists.push(case_id);
            }

            storage.set('readlists', readlists);
            Util.redirect('app/client/app/finance/controller/case_detail.js?case_id=' + case_id);
        });
    },
    requestBuy: function(paramObj) {
        var user_id = this.user_id;
        var self = this;

        httpApi.request('GET', {}, '/order/buyenable', {
            user_id: user_id,
            case_id: paramObj.case_id
        }).done(function(data) {
            if (data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            if (data.status - 0 === 405) {
                $('#confirm').trigger('showAuth');
                return false;
            } else if (data.status - 0 === 406) {
                Util.toast('请通过资质审核后再购买', 2000);
                return false;
            } else if(data.status - 0 === 7) {
                Util.toast('活动价当天最多只能购买2个例子', 2000);
                return false;
            }

            data.status -= 0;

            if (data.status === 0) {
                // 余额足够
                $('#confirm').trigger('showPay', {
                    name: paramObj.name,
                    price: paramObj.price
                });

            } else {
                var chongParams = data.data;
                chongParams.case_id = paramObj.case_id;
                chongParams.user_id = user_id;

                self.chongParams = chongParams;
                // 充值
                $('#confirm').trigger('showChong');
            }
        });
    },
    detailBuy: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var $target = $(e.currentTarget);

        if ($target.prop('disabled')) {
            return false;
        }

        if ($target.data('status') - 0 !== 1) {
            return false;
        }

        var case_id = $target.data('caseId');
        var name = $target.data('name');
        var price = $target.data('price');

        this.requestBuy({
            case_id: case_id,
            name: name,
            price: price
        });

        this.payCallback = function() {
            self.pay(case_id, function(phone) {
                $target.hide();
                self.config.$el.find('.js-phone').trigger('click');
                self.config.$el.find('.js-phone')
                    .attr('href', 'tel:' + phone)
                    .show();

                Util.toast('购买成功', 1000);
            });
        };

    },
    buy: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $target = $(e.currentTarget);

        if ($target.prop('disabled')) {
            return false;
        }

        var $parent = $target.parents('a');
        var case_id = $target.data('caseId');

        var name = $parent.find('.js-name').text();
        var price = $parent.data('price');

        var $curPhone = $target.parents('.case-item').find('.js-phone');

        this.requestBuy({
            case_id: case_id,
            name: name,
            price: price
        });

        var self = this;
        this.payCallback = function() {
            self.pay(case_id, function(phone) {
                $parent.addClass('disabled');

                $target
                    .prop('disabled', true)
                    .text('已购买');

                $curPhone
                    .addClass('active')
                    .attr('href', 'tel:' + phone)
                    .trigger('click');

                Util.toast('购买成功', 1000);
            });
        };

    },
    requestPhone: function(case_id, callback) {
        httpApi.request('GET', {}, '/case/getphone', {
            user_id: this.user_id,
            case_id: case_id,
            time: new Date().getTime()
        }, function(err, data) {
            data.status -= 0;
            if (data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            var phone = data.data.phone || '';
            callback(phone);
        });
    },
    goChongPage: function() {
        var chongParams = this.chongParams;
        var cityDomain = chongParams.city_domain;
        var url = '';

        if ($.inArray(cityDomain, ['bj', 'sh', 'sz', 'gz']) > -1) {
            url = 'app/client/app/finance/controller/re_charge.js';
        } else {
            var params = {
                category: 'weinxinJinRongPay',
                channel: chongParams.channel,
                callback_url: chongParams.callback_url,
                return_url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/finance/controller/pay_succ.js?next_url=' + encodeURIComponent('app/client/app/finance/controller/case_detail.js?case_id=' + chongParams.case_id),
                city_domain: cityDomain || 'bj',
                subject: chongParams.subject,
                title: chongParams.title,
                user_id: chongParams.user_id
            };

            url = 'app/pay/client/view/recharge.js?params=' + encodeURIComponent(JSON.stringify(params));
            url += '&back_url=' + encodeURIComponent(window.location.href);
        }

        Util.redirect(url);
    },
    pay: function(case_id, succCallback) {
        var self = this;
        httpApi.request('GET', {}, '/order/buy', {
            user_id: this.user_id,
            case_id: case_id,
            time: new Date().getTime()
        }, function(err, data) {
            data.status -= 0;
            if (data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                    Util.redirect(url);
                }, 2000);

                return false;
            } else if(data.status - 0 === 7) {
                Util.toast('活动价当天最多只能购买2个例子', 2000);
                return false;
            }

            if (data.status === 0) {
                // 购买成功
                self.requestPhone(case_id, succCallback);
            } else if (data.status === 1) {
                // 余额不足
                Util.toast('账户余额不足，请先充值', 1000);
                var chongParams = data.data;
                chongParams.case_id = case_id;
                chongParams.user_id = self.user_id;

                self.goChongPage(chongParams);
            } else if (data.status === 2) {
                // 已购买
                self.requestPhone(succCallback);
            } else if (data.status === 3) {
                // 例子已经被抢
                Util.toast('抱歉，例子已经被抢', 1000);
            } else if (data.status === 4) {
                // 例子已经失效
                Util.toast('抱歉，例子已经过期', 1000);
            } else if (data.status === 5) {
                // 扣款失败
                Util.toast('抱歉，捐款失败', 1000);
            } else {
                Util.toast(data.message, 1000);
            }
        });
    }
});


exports.confirmPay = Widget.define({
    events: {
        'hideMask': 'hideMask',
        'showChong': 'showChong',
        'showPay': 'showPay',
        'showAuth': 'showAuth',
        'click [data-role="cancel"]': 'hideMask',
        'click [data-role="confirm"]': 'confirm'
    },
    init: function(config) {
        this.config = config;
    },
    showChong: function() {
        this.showName = 1;
        this.config.$el.addClass('shown');
        this.config.$chong.show();
    },
    showPay: function(e, args) {
        this.showName = 2;
        this.config.$el.addClass('shown');
        this.config.$pay.find('.js-name').text(args.name);
        this.config.$pay.find('.js-price').text(args.price);
        this.config.$pay.show();
    },
    'showAuth': function() {
        this.showName = 3;
        this.config.$el.addClass('shown');
        this.config.$auth.show();
    },
    hideMask: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.showName === 1) {
            this.config.$chong.hide();
        } else if (this.showName === 2) {
            this.config.$pay.hide();
        } else if (this.showName === 3) {
            this.config.$auth.hide();
        }
        this.config.$el.removeClass('shown');
        this.showName = 0;
    },
    confirm: function(e) {
        e.preventDefault();
        var event = 'confirm-chong';
        if (this.showName === 2) {
            event = 'confirm-pay';
        } else if (this.showName === 3) {
            event = 'confirm-auth';
        }
        this.config.$el.trigger(event, this.callback);
    }
});

exports.filterCase = Widget.define({
    events: {
        'click [data-role="filter"]': 'toggleShow',
        'click [data-status]': 'filterStatus',
        'click [data-case-id]': 'detailCase'
    },
    init: function(config) {
        this.config = config;
        var filterStatus = config.filterStatus;

        config.$filter.find('[data-status]').each(function() {
            var status = $(this).data('status');
            if (status + '' === filterStatus + '') {
                $(this).addClass('active');
                return false;
            }
        });

        $('body').on('touchmove', function(e) {
            if ($('body').hasClass('js-open-select')) {
                e.preventDefault();
            }
        });
    },
    toggleShow: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        $target.toggleClass('active');
        $('body').toggleClass('js-open-select');

        if ($target.hasClass('active')) {
            this.config.$childSelect.trigger('openSelect');
        }
    },
    filterStatus: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $target = $(e.currentTarget);
        var status = $target.data('status');

        Util.redirect('app/client/app/finance/controller/manage_list.js?status=' + status);
    },
    detailCase: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $target = $(e.currentTarget);
        var case_id = $target.data('caseId');

        Util.redirect('app/client/app/finance/controller/manage_detail.js?case_id=' + case_id);
    }
});


exports.manageSaveLog = Widget.define({
    events: {
        'click [data-role="save"]': 'saveLog'
    },
    init: function(config) {
        this.config = config;
        this.orderStatus = config.orderStatus;
        if (config.$contents) {
            this.$select = config.$contents.find('input');
        }

        this.user_id = $('#userId').val();
        this.case_id = $('#caseId').val();

        this.$input = config.$input;
    },
    saveLog: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);

        if ($target.hasClass('js-disable')) {
            return false;
        }

        $target.addClass('js-disable');

        var remarks = [];

        if (this.$select) {
            this.$select.each(function() {
                if ($(this).prop('checked')) {
                    remarks.push($(this).val());
                }
            });
        }

        var inputVal = $.trim(this.$input.val());
        if (inputVal) {
            remarks.push(inputVal);
        }

        if (!remarks.length) {
            Util.toast('请至少选择或填写一项', 1000);
            setTimeout(function() {
                $target.removeClass('js-disable');
            }, 1500);
            return false;
        }

        var case_id = this.case_id;
        this.send(case_id, $target, remarks);
    },
    send: function(case_id, $target, remarks) {
        httpApi.request('GET', {}, '/usercase/setlistingstatus', {
            user_id: this.user_id,
            case_id: case_id,
            listing_status: this.orderStatus,
            remark: JSON.stringify(remarks)
        }, function(err, data) {
            data.status -= 0;
            if (data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            if (!data.status) {
                Util.toast('保存成功', 1000);
                setTimeout(function() {
                    Util.redirect('app/client/app/finance/controller/manage_detail.js?case_id=' + case_id + '&islog=1');
                }, 1000);
            } else {
                $target.removeClass('js-disable');
                Util.toast(data.message, 1000);
            }
        });
    }
});

exports.refund = function(config) {
    var $select = config.$contents.find('input');
    var user_id = $('#userId').val();
    var case_id = $('#caseId').val();
    var refund_reason = '', refund_remark = '';

    config.$save.on('click', function(e) {
        e.preventDefault();
        refund_reason = '';
        refund_remark = config.$input.val();

        if ($select) {
            $select.each(function() {
                if ($(this).prop('checked')) {
                    refund_reason = $(this).val();
                }
            });
        }

        if(!refund_reason) {
            Util.toast('请选择一项退款理由', 1000);
            return false;
        }

        $('#confirm').addClass('shown');
    });

    $('#confirm')
        .on('click', '[data-role="cancel"]', function(e) {
            e.preventDefault();
            $('#confirm').removeClass('shown');
        })
        .on('click', '[data-role="confirm"]', function(e) {
            e.preventDefault();
            httpApi.request('POST', {}, '/order/refund', {
                user_id: user_id,
                case_id: case_id,
                refund_reason: refund_reason,
                refund_remark: refund_remark
            }, function(err, data) {
                data.status -= 0;
                if (data.status - 0 === 403) {
                    Util.toast('请重新登录', 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                        Util.redirect(url);
                    }, 2000);

                    return false;
                }

                if (!data.status) {
                    Util.toast('提交成功', 1000);
                    setTimeout(function() {
                        Util.redirect('app/client/app/finance/controller/manage_detail.js?case_id=' + case_id + '&islog=1');
                    }, 1000);
                } else {
                    Util.toast(data.message, 1000);
                }

                $('#confirm').removeClass('shown');
            });
        });
};

exports.vipIndex = Widget.define({
    events: {
        'tap [data-role="changePwd"]': 'changePwd',
        'tap [data-role="logout"]': 'logout'
    },
    init: function(config) {
        this.config = config;
        var user_id = config.userId;


        $('#confirm')
            .on('confirm-logout', function() {
                require.async('com/mobile/lib/cookie/cookie.js', function(Cookie) {
                    var open_id = Cookie.get('gj-weixin-openid') || '';
                    httpApi.request('GET', {}, '/user/unbindopenid', {
                        user_id: user_id,
                        open_id: open_id,
                        time: new Date().getTime()
                    }, function() {
                        AccountAPI.logout();

                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');

                        if (open_id) {
                            url += '&open_id=' + open_id;
                        }

                        Util.redirect(url);
                    });
                });
            })
            .on('confirm-changePwd', function() {
                var url = 'app/client/common/view/account/forget_password.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');
                Util.redirect(url);
            });

    },
    changePwd: function(e) {
        e.preventDefault();
        $('#confirm').trigger('showChangePwd');
    },
    logout: function(e) {
        e.preventDefault();
        $('#confirm').trigger('showLogout');
    }
});

exports.vipConfirm = Widget.define({
    events: {
        'hideMask': 'hideMask',
        'showLogout': 'showLogout',
        'showChangePwd': 'showChangePwd',
        'click [data-role="cancel"]': 'hideMask',
        'click [data-role="confirm"]': 'confirm'
    },
    init: function(config) {
        this.config = config;
    },
    showLogout: function() {
        this.showName = 1;
        this.config.$el.addClass('shown');
        this.config.$logout.show();
    },
    showChangePwd: function() {
        this.showName = 2;
        this.config.$el.addClass('shown');
        this.config.$changePwd.show();
    },
    hideMask: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.showName === 1) {
            this.config.$logout.hide();
        } else if (this.showName === 2) {
            this.config.$changePwd.hide();
        }
        this.config.$el.removeClass('shown');
        this.showName = 0;
    },
    confirm: function(e) {
        e.preventDefault();
        var event = 'confirm-logout';
        if (this.showName === 2) {
            event = 'confirm-changePwd';
        }
        this.config.$el.trigger(event, this.callback);
    }
});

exports.feedBack = function(config) {
    var user_id = config.userId;

    config.$save.on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('js-disable')) {
            return false;
        }

        var val = $.trim(config.$input.val());
        if (!val) {
            Util.toast('内容不能为空', 1000);
            return false;
        }

        $(this).addClass('js-disable');

        httpApi.request('GET', {}, '/user/feedback', {
            user_id: user_id,
            content: val
        }, function(err, data) {
            if (data.status - 0 === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            Util.toast('谢谢您的反馈！', 2000);
            setTimeout(function() {
                Util.redirect('app/client/app/finance/controller/vip.js');
            }, 2000);
        });
    });
};

exports.submitManagerLog = function(config) {
    require.async('com/mobile/widget/form2/form.js', function(BaseForm) {
        var initForm = BaseForm.extend({
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
                    var remarks = [];
                    var perMapText = {
                        'send_loan_time': '放款时间',
                        'send_loan_oney': '放款金额',
                        'send_loan_count': '放款期数',
                        'allow_loan_time': '通过时间',
                        'allow_loan_money': '通过金额',
                        'allow_loan_count': '通过期数'
                    };
                    var lastMapText = {
                        'send_loan_money': '万元',
                        'send_loan_count': '期',
                        'allow_loan_money': '万元',
                        'allow_loan_count': '期'
                    };

                    values.forEach(function(item) {
                        var text = '';
                        if (item.value) {
                            if (perMapText[item.name]) {
                                text = perMapText[item.name] + ': ';
                            }

                            text += item.value;
                            if (lastMapText[item.name]) {
                                text += lastMapText[item.name];
                            }

                            remarks.push(text);
                        }
                    });
                    this.send(remarks);
                }
            },
            send: function(remarks) {
                var case_id = this.case_id;

                httpApi.request('GET', {}, '/usercase/setlistingstatus', {
                    user_id: this.user_id,
                    case_id: this.case_id,
                    listing_status: this.orderStatus,
                    remark: JSON.stringify(remarks)
                }, function(err, data) {
                    data.status -= 0;
                    if (data.status - 0 === 403) {
                        Util.toast('请重新登录', 2000);
                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    if (!data.status) {
                        Util.toast('保存成功', 1000);
                        setTimeout(function() {
                            Util.redirect('app/client/app/finance/controller/manage_detail.js?case_id=' + case_id + '&islog=1');
                        }, 1000);
                    } else {
                        Util.toast(data.message, 1000);
                    }
                });
            },
            init: function(config) {
                this.super_.init.call(this, config);
                this.user_id = $('#userId').val();
                this.case_id = $('#caseId').val();
                this.orderStatus = config.orderStatus;
            }
        });

        initForm(config);
    });
};

exports.datePicker = Widget.define({
    events: {
        'tap [data-year]': 'updateYear',
        'tap [data-month]': 'updateMonth',
        'tap [data-day]': 'updateDay',
        'click [data-role="cancel"]': 'cancel',
        'click [data-role="confirm"]': 'confirm'
    },
    init: function(config) {
        this.config = config;
        this.initCal();

        var self = this;
        config.$el.parent().on('openSelect', function() {
            self.initScroll();
        });
    },
    initScroll: function() {
        var config = this.config;

        G.use('com/mobile/lib/iscroll/iscroll.js', function() {
            config.$el.find('.filter-wrap').each(function() {
                var scrollObj, el = this;
                if ($(this).data('hasScroll')) {
                    scrollObj = $(this).data('hasScroll');
                    scrollObj._resize();
                } else {
                    scrollObj = new window.IScroll(el, {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    });
                    $(this).data('hasScroll', scrollObj);
                    var activeEl = $(this).find('.active');
                    if (activeEl.length) {
                        scrollObj.scrollToElement(activeEl[0], 0);
                    }
                }
            });
        });
    },
    createDays: function() {
        var year = this.curYear;
        var month = this.curMonth;

        var daysNum = new Date(year, month, 0).getDate();
        var html = '',
            className = '';

        if (this.curDay > daysNum) {
            this.curDay = '01';
        }

        for (var i = 1; i <= daysNum; i++) {
            if (i === this.curDay - 0) {
                className = 'active';
            } else {
                className = '';
            }
            if (i < 10) {
                i = '0' + i;
            }

            html += '<li class="js-touch-state ' + className + '" data-day="' + i + '"> ' + i + '日</li>';
        }
        this.config.$days.find('ul').html(html);
    },
    initCal: function() {
        var now = new Date();
        this.curYear = now.getFullYear();
        this.curMonth = now.getMonth() + 1;
        this.curDay = now.getDate();
        if (this.curDay < 10) {
            this.curDay = '0' + this.curDay;
        }

        this.config.$years.find('[data-year="' + this.curYear + '"]').addClass('active');
        this.config.$months.find('[data-month="' + this.curMonth + '"]').addClass('active');

        this.createDays();
    },
    updateYear: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.config.$years.find('li').removeClass('active');
        var $target = $(e.currentTarget);
        $target.addClass('active');

        this.curYear = $target.data('year');

        this.createDays();
        this.initScroll();
    },
    updateMonth: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.config.$months.find('li').removeClass('active');
        var $target = $(e.currentTarget);
        $target.addClass('active');

        this.curMonth = $target.data('month');

        this.createDays();
        this.initScroll();
    },
    updateDay: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.config.$days.find('li').removeClass('active');
        var $target = $(e.currentTarget);
        $target.addClass('active');

        this.curDay = $target.data('day');
    },
    cancel: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.config.$el.parent().removeClass('active');
    },
    confirm: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var text = this.curYear + '-' + this.curMonth + '-' + this.curDay;

        this.config.$text
            .text(text)
            .addClass('active');

        this.config.$input.val(text);

        this.config.$el.parent().removeClass('active');
    }
});

exports.newListNum = function(config) {
    var user_id = config.userId;

    httpApi.request('GET', {}, '/case/getnewcasenum', {
            user_id: user_id,
            timestamp: Math.floor(new Date().getTime() / 1000)
        })
        .done(function(data) {
            if (!data.status) {
                var num = data.data.num || 0;
                if (num - 0) {
                    config.$el.text(num).show();
                }
            }
        });
};

exports.countdown = function(config) {
    require.async('com/mobile/lib/countdown/countdown.js', function(Countdown) {
        var sixMonths = new Date(new Date().getTime() + config.count * 1000);
        var cd = new Countdown(config.$el, sixMonths, function() {}, 1000 * 50);

        config.$el
            .on('updateCountdown', function(event) {
                var hours = 24 * event.offset.days + event.offset.hours;
                var html = '<span>'+ hours +'</span>小时<span>'+ event.offset.minutes +'</span>分';
                $(this).html(html);
            }).on('finishCountdown', function() {
                $(this).html('<span>00</span>小时<span>00</span>分');
            });

        cd.update();
    });
};

exports.vipCharge = function(config) {
    var user_id = config.userId;
    var cityDomain = config.cityDomain;
    config.$el.on('click', function(e) {
        e.preventDefault();
        var url = '';
        if ($.inArray(cityDomain, ['bj', 'sh', 'sz', 'gz']) > -1) {
            url = 'app/client/app/finance/controller/re_charge.js';
        } else {
            var params = {
                category: 'weinxinJinRongPay',
                channel: '70',
                callback_url: config.callbackUrl,
                return_url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/finance/controller/pay_succ.js?next_url=' + encodeURIComponent('app/client/app/finance/controller/vip.js'),
                city_domain: cityDomain,
                subject: config.subject,
                title: config.title,
                user_id: user_id
            };
            url = 'app/pay/client/view/recharge.js?params=' + encodeURIComponent(JSON.stringify(params));
            url += '&back_url=' + encodeURIComponent(window.location.href);
        }

        Util.redirect(url);
    });
};

exports.initUploadAvatar = function(config) {
    require.async('com/mobile/page/milan/widget/upload.js', function(Uploader) {
        var initFn = Uploader.extend({
            events: {
                'Upload::success': function(e, fileInfo) {
                    var url = 'http://image.ganji.com/' + fileInfo.thumbUrl;
                    config.$avatar.attr('src', url);

                    httpApi.request('POST', {}, '/user/profilesave', {
                            user_id: config.userId,
                            img_profile: url
                        })
                        .done(function(data) {
                            if (!data.status) {
                                Util.toast('头像已经更新', 2000);
                            }
                        });
                }
            }
        });

        initFn(config);
    });
};

exports.loadChargeLog = function(config) {
    var curPage = 2;
    var user_id = config.userId;
    var winHeight = $(window).height();
    var bodyHeight = $('body').height();
    var loading = false;

    var loadData = function() {
        httpApi.request('GET', {}, '/user/moneylog', {
                user_id: user_id,
                page: curPage
            })
            .done(function(data) {
                var globalMsgMap = {
                    '403': '请重新登录',
                    '407': '手机号未绑定'
                };

                if (data.status - 0 === 403 || data.status - 0 === 407) {
                    Util.toast(globalMsgMap[data.status+''], 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=';

                        if(data.status - 0 === 407) {
                            url = 'app/client/common/view/account/bind_phone.js?back_url=';
                        }

                        url += encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));

                        Util.redirect(url);
                    }, 2000);

                    return false;
                }
                if(!data.data.length) {
                    return false;
                }

                var moneyLog = data.data;
                var html = '';
                $.each(moneyLog, function(i) {
                    var item = moneyLog[i];
                    if(!item.isCharge) {
                        item.className = 'add';
                    } else {
                        item.className = 'lose';
                        item.money = '-' + item.money;
                    }

                    html += '<div class="history-item"><h3 class="history-title">'+ item.category +'</h3>' +
                        '<div class="history-value"><b class="'+ item.className +'">'+ item.money +'</b>元</div>' +
                        '<div class="history-info">'+ item.create_time +'</div>' +
                        '</div>';
                });

                config.$el.append(html);
                curPage += 1;
                bodyHeight = $('body').height();
                loading = false;
            });
    };

    config.$el.on('touchmove', function() {
        if(!loading && window.scrollY + winHeight * 1.5 > bodyHeight) {
            loading = true;
            loadData();
        }
    });
};

exports.setUserCity = function(config) {
    var user_id = config.userId;

    config.$input.on('reValid', function() {
        var val = $(this).val();
        if(val) {
            httpApi.request('GET', {}, '/user/setusercity', {
                    user_id: user_id,
                    city_domain: val
                })
                .done(function() {

                });
        }
    });
};