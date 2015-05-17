var $ = require('$');
var template = require('app/client/app/xiche/pub_page/template/profile_car/car_main.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var XicheAPI = require('app/client/app/xiche/pub_page/lib/xiche_api.js');
var async = require('com/mobile/lib/async/async.js');
var BRANDS = require('app/client/app/xiche/pub_page/data/models.jjson');
var COLORS = require('app/client/app/xiche/pub_page/data/colors.jjson');
var carHistoryStorage = require('app/client/app/xiche/pub_page/lib/xiche_storage.js').carHistory();
var BasePage = require('../base_page.js');

require('app/client/app/xiche/pub_page/style/style.jcss');

exports.init = function() {
    BasePage.init();

    var $body = $('body');

    async.auto({
        carList: function(next) {
            XicheAPI.updateCarInfo({})
                .done(function(data) {
                    next(null, data);
                })
                .fail(function(err) {
                    next(err);
                });
        }
    }, function(err, result) {
        $body.removeClass('loading');

        if (err) {
            $body.addClass('offline');
            $('.js-offline-tip').text(err.message);
            return;
        }

        var carHistoryList = carHistoryStorage.getDisplayList(result.carList.list, 'car_number').map(function(carInfo) {
            carInfo.seriesName = BRANDS[carInfo.brandId].seriesList[carInfo.seriesId].series_name;

            carInfo.colorName = COLORS[carInfo.colorId].name;
            return carInfo;
        });

        $body
            .append(template({
                carList: result.carList.list,
                carHistoryList: carHistoryList
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};