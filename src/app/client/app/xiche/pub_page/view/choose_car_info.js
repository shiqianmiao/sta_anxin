var $ = require('$');
var _ = require('underscore');
var template = require('../template/choose_car_info.tpl');
var async = require('com/mobile/lib/async/async.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var XicheAPI = require('app/client/app/xiche/pub_page/lib/xiche_api.js');
var Form = require('com/mobile/lib/form/form.js');
var BRANDS = require('../data/models.jjson');
var COLORS = require('../data/colors.jjson');
var BasePage = require('./base_page.js');
var carHistoryStorage = require('../lib/xiche_storage.js').carHistory();

require('../style/style.jcss');

exports.init = function(config) {
    BasePage.init();

    var $body = $('body');

    async.auto({
        carList: function(next) {
            if (config.fromUrl) {
                next(null, {});
            } else {
                XicheAPI.updateCarInfo({})
                    .done(function(data) {
                        next(null, data);
                    })
                    .fail(function(err) {
                        next(err, {});
                    });
            }
        }
    }, function(err, result) {
        $body.removeClass('loading');

        if (err) {
            if (err.code === -32001) {
                result.carList.list = [];
            } else {
                $body.addClass('offline');
                $('.js-offline-tip').text(err.message);
                return;
            }
        }

        var cityInfo = {
            city_id: config.cityId || '12',
            city_name: config.cityName || '北京',
            province: config.province || '京'
        };

        var series = {};

        if (config.brand && config.seriesId && BRANDS[config.brand]) {
            series = BRANDS[config.brand].seriesList[config.seriesId] || {};
        } else {
            series.series_name = config.seriesName;
        }

        var carHistoryList = [];
        if (!config.fromUrl) {
            var carHistoryList = carHistoryStorage.getDisplayList(result.carList.list, 'car_number').map(function(carInfo) {
                carInfo.seriesName = BRANDS[carInfo.brandId].seriesList[carInfo.seriesId].series_name;

                carInfo.colorName = COLORS[carInfo.colorId].name;
                return carInfo;
            });
        }

        $body
            .removeClass('loading')
            .append(template({
                cityInfo: cityInfo,
                brand: config.brand,
                carNumber: config.carNumber || '',
                series: series,
                colorId: config.colorId || '',
                colorName: COLORS[config.colorId] ? COLORS[config.colorId].name : '',
                params: config,
                carList: result.carList.list || [],
                carHistoryList: carHistoryList || []
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};

exports.form = Widget.define({
    events: {
        'tap [data-role="item"]': function(e) {
            var $item = $(e.currentTarget);

            var carInfo = $item.data();
            this.selectCar(carInfo);
        },
        'click [data-role="back"]': 'back',
        'click [data-role="select"]': function(e) {
            var url = $(e.currentTarget).data('url');

            this.redirect(url);
        },
        'input input[name="carNumber"]': function(e) {
            var $carNumber = $(e.currentTarget);

            this.form.fields.carNumber.validate($carNumber.val(), function() {});
        },
        'click [data-role="submit"]': 'submit'
    },
    init: function(config) {
        this.config = config;
        this.form = new Form({
            fields: {
                carNumber: [
                    ['required', true, '请输入车牌号'],
                    ['maxLength', 6, '请输入正确的车牌号'],
                    ['minLength', 6, '请输入正确的车牌号']
                ],
                carModelName: [
                    ['required', true, '请选择车系']
                ],
                carColorId: [
                    ['required', true, '请选择车身颜色']
                ]
            }
        });

        this.form.getValues = function() {
            return config.$el.serializeObject();
        };
    },
    back: function() {
        this.redirect(this.config.backUrl || 'app/client/app/xiche/pub_page/view/index.js');
    },
    redirect: function(url) {
        var config = this.config;
        config.params.carNumber = config.$el.find('[name=carNumber]').val();
        Util.redirect(url +
            (url.indexOf('?') === -1 ? '?' : '&') + $.param(this.config.params));
    },
    selectCar: function(carInfo) {
        var config = this.config;
        var params = this.config.params;

        config.$province.text(carInfo.carNumber[0]);
        config.$carNumber.val(carInfo.carNumber.slice(1));
        config.$carModelName.val(carInfo.seriesName);
        config.$colorName.val(carInfo.colorName);

        if (carInfo.brandId) {
            params.brand = carInfo.brandId;
        } else {
            params.brand = _.filter(BRANDS, function(item) {
                return !!item.seriesList[carInfo.seriesId];
            })[0].brand_id;
        }
        params.province = carInfo.carNumber[0];
        params.colorId = carInfo.colorId;
        params.seriesId = carInfo.seriesId;
        params.seriesName = carInfo.seriesName;
    },
    submit: function(e) {
        var self = this;
        var $cur = $(e.currentTarget);
        var config = this.config;

        async.waterfall([
            function(callback) {
                var formData = self.form.getValues();

                self.form.validate(formData, function(errs) {
                    if (errs) {
                        Util.toast(errs[Object.keys(errs)[0]].message, 1500);
                        return;
                    }

                    callback(null);
                });
            }
        ], function() {
            var province = config.params.province || '京';

            if (!config.backUrl) {
                self.redirect($cur.data('url'));

                var carInfo = {
                    carNumber: province + config.params.carNumber,
                    brandId: config.params.brand,
                    seriesId: config.params.seriesId,
                    colorId: config.params.colorId
                };

                carHistoryStorage.add(carInfo);
            } else if (/car_main/.test(config.backUrl)) {
                XicheAPI.updateCarInfo({
                        car_id: config.params.carId,
                        car_number: province + config.$el.find('[name=carNumber]').val(),
                        car_model_id: config.params.seriesId,
                        car_color_id: config.params.colorId
                    })
                    .done(function() {
                        self.back();
                    })
                    .fail(function(err) {
                        Util.toast(err.message, 1500);
                    });
            }
        });

    }
});