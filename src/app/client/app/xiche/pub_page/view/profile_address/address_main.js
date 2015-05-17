var $ = require('$');
var _ = require('underscore');
var template = require('app/client/app/xiche/pub_page/template/profile_address/address_main.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var XicheAPI = require('app/client/app/xiche/pub_page/lib/xiche_api.js');
var async = require('com/mobile/lib/async/async.js');
var XicheStorage = require('app/client/app/xiche/pub_page/lib/xiche_storage.js');
var BasePage = require('../base_page.js');

require('app/client/app/xiche/pub_page/style/style.jcss');

var addressHistoryStorage = XicheStorage.addressHistory();

exports.init = function() {
    BasePage.init();

    var $body = $('body');

    async.auto({
        addressList: function(callback) {
            XicheAPI.updateUserAddress({
                    act: 'get'
                })
                .done(function(data) {
                    callback(null, data);
                })
                .fail(function(err) {
                    callback(err);
                });
        }
    }, function(err, result) {
        $body.removeClass('loading');

        if (err) {
            $body.addClass('offline');
            $('.js-offline-tip').text(err.message);
            return;
        }

        var list = result.addressList;

        var homeAddress = _.find(list, function(item) {
            if (String(item.address_type) === '1') {
                return item;
            }
        });

        var officeAddress = _.find(list, function(item) {
            if (String(item.address_type) === '2') {
                return item;
            }
        });

        var addressHistoryList = addressHistoryStorage.getDisplayList(result.addressList, 'latlng');

        $body
            .append(template({
                homeAddress: homeAddress || {
                    address: '家'
                },
                officeAddress: officeAddress || {
                    address: '公司'
                },
                addressList: result.addressList || [],
                addressHistoryList: addressHistoryList
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};