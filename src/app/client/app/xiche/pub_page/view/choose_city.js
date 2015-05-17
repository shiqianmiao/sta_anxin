var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var template = require('../template/choose_city.tpl');
var CityData = require('../data/citys.jjson');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    var currentCity = null;

    config.cityId = config.cityId || 12;

    CityData.some(function (group) {
        var found = false;
        group.groupList.some(function (city) {
            if (city.city_id.toString() === config.cityId.toString()) {
                found = true;
                currentCity = city;
                return true;
            } else {
                return false;
            }
        });

        return found;
    });

    $('body')
        .removeClass('loading')
        .append(template({
            params: config,
            currentCity: currentCity,
            citygroups: CityData
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};

exports.list = Widget.define({
    events: {
        'click [data-role="item"]': function (e) {
            this.config.params.cityId = $(e.currentTarget).data('id');
            this.back();
        },
        'click [data-role="back"]': function () {
            this.back();
        }
    },
    back: function () {
        Util.redirect(
            (this.config.backUrl || 'app/client/app/xiche/pub_page/view/index.js') +
            '?' + $.param(this.config.params)
        );
    }
});
