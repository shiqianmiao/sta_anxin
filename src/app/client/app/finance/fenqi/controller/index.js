require('../style/style.jcss');
var template = require('../template/list.tpl');
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');

var httpApi = new HTTPApi({
    path: '/webapp/jr'
});

exports.init = function() {
    httpApi.request('GET', {
        'interface': 'FenqiProductList'
    }, '/fenqi/product/list')
        .done(function(data) {
            if(!data.status) {
                var productList = data.data;

                $.each(productList, function(i, item) {
                    productList[i].monthPayment = (item.market_price * 1.01 / 24).toFixed(0);
                });

                $('body')
                    .removeClass('loading')
                    .append(template({
                        productList: productList
                    }));
                Widget.initWidgets();
            }
        });
};