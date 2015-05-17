require('../style/style.jcss');
var template = require('../template/apply_succ.tpl');
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var httpApi = new HTTPApi({
    path: '/webapp/jr'
});

exports.init = function(config) {
    httpApi.request('GET', {
        'interface': 'FenqiProductDetail'
    }, '/fenqi/product/detail', {
            'product_id': config.product_id
        })
        .done(function(data) {
            if(!data.status) {
                var productDetail = data.data;

                $('body')
                    .removeClass('loading')
                    .append(template({
                        productDetail: productDetail,
                        apply_no: config.apply_no
                    }));

                Widget.initWidgets();
            }
        });
};