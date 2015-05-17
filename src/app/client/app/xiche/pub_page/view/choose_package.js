var $ = require('$');
var template = require('../template/choose_package.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var async = require('com/mobile/lib/async/async.js');
var XicheAPI = require('../lib/xiche_api.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    var businessCode = BasePage.getSearch().businessCode || '';

    async.waterfall([
        function(next) {
            XicheAPI.getPackagesList({
                pageIndex: 0,
                pageSize: 100,
                carNumber: config.carNumber ? config.province + config.carNumber : '',
                productCode: config.productCode || '',
                businessCode: businessCode
            })
                .done(function(data) {
                    next(null, data);
                })
                .fail(function(err) {
                    next(err);
                });
        }
    ], function(err, data) {
        $('body')
            .removeClass('loading')
            .append(template({
                list: data.list,
                params: config
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};

exports.selectList = Widget.define({
    events: {
        'click [data-role="item"]': 'selectPackage'
    },
    init: function(config) {
        this.config = config;
    },
    selectPackage: function(e) {
        var $cur = $(e.currentTarget);

        this.config.$item.removeClass('active');
        $cur.addClass('active');
    }
});
