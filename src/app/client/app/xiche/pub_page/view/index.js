var $ = require('$');
var _ = require('underscore');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var async = require('com/mobile/lib/async/async.js');
var Form = require('com/mobile/lib/form/form.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var BRANDS = require('../data/models.jjson');
var COLORS = require('../data/colors.jjson');
var CITYS = require('../data/citys.jjson');
var template = require('../template/index.tpl');
var XicheAPI = require('../lib/xiche_api.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

var storage = new Storage('Xiche');
var cityInfo = {};
var STANDARD_CODE = '1030991000007';
var tplType = 1;
var searchs = BasePage.getSearch();

var bindOpenIdHelper = function(openId) {
    if (!openId) {
        return;
    }

    var userId;

    async.waterfall([
        function(next) {
            XicheAPI.getUserCenterInfo({})
                .done(function(userCenterInfo) {
                    var boundId = storage.get('boundUserId');

                    if (boundId === userCenterInfo.user_id) {
                        next(new Error('已绑定'));
                    } else {
                        userId = userCenterInfo.user_id;
                        next(null);
                    }
                })
                .fail(function(err) {
                    next(err);
                });
        },
        function(next) {
            XicheAPI.bindOpenId({
                    openId: openId
                })
                .done(function(data) {
                    next(null, data);
                })
                .fail(function(err) {
                    next(err);
                });
        }
    ], function(err, data) {
        if (err) {
            return;
        }

        if (data) {
            storage.set('boundUserId', userId);
        }
    });
};

exports.init = function(config) {
    BasePage.init();

    config.cityId = config.cityId || 12;
    cityInfo.city_id = config.cityId;
    cityInfo.province = config.province || '京';

    CITYS.some(function(group) {
        var found = false;
        group.groupList.some(function(city) {
            if (city.city_id.toString() === config.cityId.toString()) {
                found = true;
                cityInfo.city_name = city.city_name;
                return true;
            } else {
                return false;
            }
        });

        return found;
    });

    var series = {};

    if (config.brand && config.seriesId && BRANDS[config.brand]) {
        series = BRANDS[config.brand].seriesList[config.seriesId] || {};
    } else {
        series = {
            series_name: config.seriesName,
            series_id: config.seriesId
        };
    }

    var colorName = COLORS[config.colorId] ? COLORS[config.colorId].name : '';

    var carInfo = '';

    if (cityInfo.province && config.carNumber && series.series_name && colorName) {
        carInfo = [
            cityInfo.province + config.carNumber,
            colorName,
            series.series_name
        ].join('-');
    }

    config.productCode = config.productCode || STANDARD_CODE;

    var currentProductCode = String(config.productCode);
    var lastProductCode = storage.get('productCode');

    // 模板类型 1 标准洗 2 套餐洗
    if (currentProductCode !== STANDARD_CODE) {
        tplType = 2;
    }

    var packageChanged = currentProductCode !== lastProductCode;

    if (currentProductCode !== STANDARD_CODE && lastProductCode !== STANDARD_CODE) {
        packageChanged = false;
    }

    storage.set('productCode', String(config.productCode));

    var defaultWashInterior = false;

    if (currentProductCode !== STANDARD_CODE) {
        defaultWashInterior = true;
    }

    if (packageChanged) {
        config.isWashInterior = 0;
    }

    var businessCode = searchs.businessCode || '';
    var realCarNumber = config.carNumber ? cityInfo.province + config.carNumber : '';

    async.auto({
        userCenterInfo: function(next) {
            XicheAPI.getUserCenterInfo({})
                .done(function(data) {
                    next(null, data || {});
                })
                .fail(function(err) {
                    if (err.code === 'ERR_NEED_BIND_PHONE') {
                        next(null, {
                            state: err.code
                        });
                    } else {
                        next(null, {});
                    }
                });
        },
        promotion: function(next) {
            XicheAPI.getPromotionDetail({
                    productCode: config.productCode
                })
                .done(function(promotion) {
                    next(null, promotion);
                })
                .fail(function() {
                    next({
                        text: '获取服务失败，请刷新页面重试。'
                    });
                });
        },
        orderPrice: ['promotion', function(next, result) {
            if (String(config.productCode) === STANDARD_CODE) {
                XicheAPI.getPrice({
                        cityId: cityInfo.city_id,
                        carNumber: realCarNumber,
                        carCategory: series.auto_type || '',
                        productCode: config.productCode,
                        businessCode: businessCode
                    })
                    .done(function(priceInfo) {
                        next(null, {
                            price: priceInfo.payAmount,
                            title: result.promotion.title,
                            description: result.promotion.title + '：' + priceInfo.prompt + '，' + result.promotion.content
                        });
                    })
                    .fail(function() {
                        next(null, {
                            price: result.promotion.payAmount,
                            title: result.promotion.title,
                            description: result.promotion.title + '：' + result.promotion.content
                        });
                    });
            } else {
                next(null, {
                    price: result.promotion.payAmount,
                    title: result.promotion.title,
                    description: result.promotion.title + '：' + result.promotion.content
                });
            }
        }],
        tplInfo: function(next) {
            XicheAPI.getNeedsTemplate({
                    cityId: cityInfo.city_id,
                    carNumber: realCarNumber,
                    tplType: tplType,
                    productCode: config.productCode,
                    businessCode: businessCode
                })
                .done(function(template) {
                    if (businessCode) {
                        var addressInfo = template.modelList.filter(function(item) {
                            return item.fieldName === 'address';
                        })[0];

                        next(null, {
                            addressInfo: addressInfo
                        });
                    } else {
                        var showInviteCode = template.modelList.some(function(item) {
                            return item.fieldName === 'inviteCode';
                        });

                        next(null, {
                            showInviteCode: showInviteCode
                        });
                    }
                })
                .fail(function() {
                    next(null, {});
                });
        }
    }, function(err, result) {
        var $body = $('body');

        $body.removeClass('loading');

        if (err) {
            $body.addClass('offline');
            if (err.text) {
                $('.js-offline-tip').text(err.text);
            }
            return;
        }

        var date = [
            new Date(Date.now()),
            new Date(Date.now() + 86400000),
            new Date(Date.now() + 86400000 * 2),
            new Date(Date.now() + 86400000 * 3)
        ].map(function(date) {
            var day = date.getDate();

            if (day < 10) {
                day = '0' + day;
            }

            var month = date.getMonth() + 1;

            if (month < 10) {
                month = '0' + month;
            }

            return [date.getFullYear(), month, day];
        });

        // 商品名称
        config.title = result.orderPrice.title;

        // 金额
        config.price = result.orderPrice.price;

        var addressInfo = {};
        var resultAddress = result.tplInfo.addressInfo;

        if (resultAddress && !resultAddress.enable) {
            addressInfo = {
                address: resultAddress.default_value || '',
                latlng: resultAddress.extra.defaultData.latlng || '',
                addressName: resultAddress.default_value || '',
                addressComment: resultAddress.default_value || '',
                isConstant: !resultAddress.enable || '',
                tipText: resultAddress.tipText || ''
            };
        } else {
            addressInfo = {
                address: config.address || '',
                latlng: config.latlng || '',
                addressName: config.addressName || '',
                addressComment: config.addressComment || ''
            };
        }
        if (addressInfo.mapType) {
            config.mapType = addressInfo.mapType;
        }

        if (packageChanged) {
            delete config.jobDate;
            delete config.peroid;
            delete config.jobTimeText;
        }

        var showDownload = true;
        if (storage.get('hasClosedDownload') || searchs.ca_s) {
            showDownload = false;
        }

        $body
            .append(template({
                cityInfo: cityInfo,
                carNumber: config.carNumber,
                brand: config.brand,
                series: series,
                colorId: config.colorId || '',
                carInfo: carInfo,
                dates: date,
                addressInfo: addressInfo,
                peroid: config.peroid,
                jobDate: config.jobDate,
                jobTimeText: config.jobTimeText || '',
                promotion: result.orderPrice,
                userCenterInfo: result.userCenterInfo,
                isWashInterior: config.isWashInterior || '',
                defaultWashInterior: defaultWashInterior,
                showInviteCode: result.tplInfo.showInviteCode,
                params: config,
                isGanjiAPP: NativeAPI.isSupport(),
                showDownload: showDownload,
                loginType: result.userCenterInfo.state === 'ERR_NEED_BIND_PHONE' ? 'bindphone' : 'login'
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();

        if (/clouda.html/.test(window.location.pathname)) {
            $('.company-intro').show();
        }

        if (config.openId) {
            storage.set('openId', config.openId);
        }

        var openId = config.openId || storage.get('openId');

        if (openId) {
            bindOpenIdHelper(openId);
        }
    });
};

exports.download_banner = function(config) {
    config.$close.on('click', function() {
        config.$el.hide();
        storage.set('hasClosedDownload', true);
    });
};

exports.choose_time = Widget.define({
    events: {
        'touchmove': function(e) {
            e.preventDefault();
        },
        'click [data-role="item"]:not(.disable)': function(e) {
            var $item = $(e.currentTarget);
            var peroid = $item.data('peroid');

            this.config.$input.filter('[name="peroid"]').val(peroid);
            this.config.$el.find('[data-role="item"]').removeClass('active');
            $item.addClass('active');

            this.config.$text.val(
                this.config.$date.filter('.active').data('text') + ' ' +
                peroid
            );
            this.hidePanel();
        },
        'click [data-role="cancel"]': 'hidePanel',
        'click': function(e) {
            if (e.target === this.config.$panel[0]) {
                this.hidePanel();
            }
        },
        'click [data-role="label"]': function(e) {
            e.preventDefault();
            this.showPanel();
        },
        'click [data-role="date"]': function(e) {
            var $date = $(e.currentTarget);
            this.showDate($date);
        }
    },
    init: function(config) {
        this.config = config;
        this.timelineTemplate = _.template(this.config.$timelineTemplate.html());

        if (!config.latlng) {
            config.$el.on('tap', '[data-role="text"]', function() {
                Util.toast('请选选择您的停车位置', 1500);
            });
            return;
        }
        var selectedDate = this.config.$input.filter('[name=jobDate]').val();
        var $date = config.$date.filter('[data-date="' + selectedDate + '"]');

        if ($date.length === 0) {
            $date = $(this.config.$date.eq(0));
        }

        this.showDate($date);
    },
    showDate: function($date) {
        var date = $date.data('date');
        var data = $date.data('data');
        var $input = this.config.$input.filter('[name=jobDate]');
        var self = this;

        this.config.$date.removeClass('active');
        $date.addClass('active');

        $input.val(date);

        if (data) {
            this.renderPanel(data);
        } else {
            this.config.$timeline.addClass('loading');
            this.getData(date, function(err, data) {
                self.config.$timeline.removeClass('loading');
                if (err) {
                    Util.toast('网络异常，请稍后再试');
                    return;
                }

                $date.data('data', data);

                self.renderPanel(data);
            });
        }
    },
    showPanel: function() {
        if (!this.config.latlng) {
            Util.toast('请先选择车辆位置', 1500);
            return;
        }

        this.config.$panel.show();
    },
    hidePanel: function() {
        this.config.$panel.hide();
    },
    renderPanel: function(data) {
        var tmpl = this.timelineTemplate({
            timeline: data
        });

        this.config.$timeline.html(tmpl);
    },
    getData: function(date, callback) {
        var config = this.config;

        XicheAPI.getCalendar({
            latlng: config.latlng,
            tplType: tplType
        }, function(err, data) {
            if (err) {
                return callback(err);
            }

            callback(err, _.find(data, function(item) {
                return item.realDate === date;
            }).peroidData.reduce(function(ret, item, index) {
                ret[index % 4].push(item);
                return ret;
            }, [
                [],
                [],
                [],
                []
            ]));
        });
    }
});

exports.form = Widget.define({
    events: {
        'click [data-role="invitationHint"]': 'showInvitationHint',
        'click [data-role="select"]': 'gotoPage',
        'click [data-role="submit"]': 'submit'
    },
    init: function(config) {
        this.config = config;

        this.config.params.province = cityInfo.province;

        this.form = new Form({
            fields: {
                phone: [
                    ['required', true, '请输入手机号码'],
                    ['format', 'phone', '请输入格式正确的手机号']
                ],
                carNumber: [
                    ['required', true, '请输入车牌号'],
                    ['maxLength', 6, '请输入正确的车牌号'],
                    ['minLength', 6, '请输入正确的车牌号']
                ],
                latlng: [
                    ['required', true, '请选择车辆停放位置']
                ],
                address: [
                    ['required', true, '请选择停车地点']
                ],
                carColorId: [
                    ['required', true, '请选择车身颜色']
                ],
                carModelId: [
                    ['required', true, '请选择车系']
                ],
                peroid: [
                    ['required', true, '请选择洗车时间']
                ],
                jobDate: [
                    ['required', true, '请选择你希望的服务时间']
                ]
            }
        });

        this.form.getValues = function() {
            return config.$el.serializeObject();
        };

        $('#choose-city').on('click', _.bind(this.gotoPage, this));
    },
    showInvitationHint: function() {
        Util.toast('邀请码是用于记录邀请信息的串码，可以填写邀请码或邀请人手机号，填写后会给邀请人相应的邀请奖励', 5000);
    },
    gotoPage: function(e) {
        var $target = $(e.currentTarget);

        if ($target.data('isConstant')) {
            return Util.toast($target.data('tipText') || '', 1500);
        }

        var url = $target.data('url');
        var params = this.config.params;

        this.setParams();

        Util.redirect(url +
            (url.indexOf('?') === -1 ? '?' : '&') + $.param(params));
    },
    setParams: function() {
        var params = this.config.params;
        var formData = this.form.getValues();

        // 服务预约时间，格式：开始时间,结束时间,时间类型(1 现在 2 全天 3 指定时段)
        var jobTime = [
            formData.jobDate + ' ' + formData.peroid.split('-')[0] + ':00',
            formData.jobDate + ' ' + formData.peroid.split('-')[1] + ':00',
            3
        ].join(',');

        params.jobTime = jobTime;
        params.peroid = formData.peroid;
        params.jobDate = formData.jobDate;
        params.jobTimeText = formData.jobTimeText;

        // 内饰
        params.isWashInterior = formData.isWashInterior ? 1 : 0;

        // 邀请码
        params.inviteCode = formData.inviteCode || '';
    },
    submit: function() {
        var params = this.config.params;
        var formData = this.form.getValues();

        this.setParams();

        this.form.validate(formData, function(errs) {
            if (errs) {
                Util.toast(errs[Object.keys(errs)[0]].message, 1500);
                return;
            }

            Util.redirect(
                'app/client/app/xiche/pub_page/view/payment.js?' +
                $.param(params));
        });
    }
});

exports.cityTip = function(config) {
    config.$el.on('tap', function() {
        Util.toast('洗车服务暂时只支持北京，其他城市正在开通中，敬请期待！', 3000);
    });
};
