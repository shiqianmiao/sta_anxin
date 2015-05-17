var $ = require('$');
var template = require('../template/choose_brand.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var MODELS = require('../data/models.jjson');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    $('body')
        .removeClass('loading')
        .append(template({
            models: MODELS,
            params: config
        }));

    Widget.initWidgets();

    var fixTop = 40;

    if (/boxcomputing.html/.test(window.location.pathname)) {
        fixTop = 0;
    }
    BasePage.afterInitWidget();

    Widget.ready(['#sider', '#list'], function (sider, list) {
        sider.config.$el.on('enter-letter', function (e, letter) {
            var $letter = list.config.$letter.filter('[data-letter="'+ letter +'"]');

            $(window).scrollTop($letter.position().top + fixTop);
        });
    });
};

exports.list = Widget.define({
    events: {
        'click [data-role="item"]': function (e) {
            this.selectItem($(e.currentTarget).data('id'));
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
    },
    selectItem: function (id) {
        if (id) {
            this.config.params[this.config.name] = id;

            Util.redirect(
                'app/client/app/xiche/pub_page/view/choose_series.js' +
                '?' + $.param(this.config.params)
            );
        }
    }
});
