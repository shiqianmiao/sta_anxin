var $ = require('$');
var _ = require('underscore');
var template = require('app/client/app/xiche/pub_page/template/profile_address/add_address.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var XicheAPI = require('app/client/app/xiche/pub_page/lib/xiche_api.js');
var AutoComplete = require('com/mobile/lib/autocomplete/autocomplete.js');
var async = require('com/mobile/lib/async/async.js');
var BasePage = require('../base_page.js');

require('app/client/app/xiche/pub_page/style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    async.waterfall([
        function (callback) {
            if (config.id) {
                XicheAPI.updateUserAddress({
                    act: 'get',
                    id: config.id
                })
                    .done(function(data) {
                        callback(null, data);
                    })
                    .fail(function(err) {
                        callback(err);
                    });
            } else {
                callback(null, [{
                    id: '0',
                    address: '',
                    address_type: '3'
                }]);
            }
        }
    ], function (err, results) {
        var $body = $('body');

        $body.removeClass('loading');

        if (err) {
            $body.addClass('offline');
            $('.js-offline-tip').text(err.message);
            return;
        }

        var item = results[0] || {};

        $body
            .append(template({
                id            : config.id    || item.id,
                title         : config.title || item.address,
                type          : config.type  || item.address_type,
                addressInfo   : item,
                address_name  : config.name,
                address_remark: config.address,
                latlng        : config.latlng,
                cityInfo      : {
                    cityName: '北京'
                }
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};

exports.form = Widget.define({
    events: {
        'click [data-role="submit"]': 'saveAddress',
        'addressEmpty': 'showSubmitEl',
        'addressSelected': 'showSubmitEl',
        'addressChanged': 'hideSubmitEl'
    },
    init: function(config) {
        this.config = config;
    },
    showSubmitEl: function(){
        this.config.$submit.show();
    },
    hideSubmitEl: function(){
        this.config.$submit.hide();
    },
    saveAddress: function() {
        var config = this.config;

        var address= config.$address.val();
        var addressName= config.$addressName.val();
        var addressRemark= config.$addressRemark.val();

        if (!address) {
            Util.toast(config.$address.prop('placeholder'), 1500);
            return;
        }
        if (!addressName) {
            Util.toast(config.$addressName.prop('placeholder'), 1500);
            return;
        }
        if (!addressRemark) {
            Util.toast(config.$addressRemark.prop('placeholder'), 1500);
            return;
        }

        XicheAPI.updateUserAddress({
            id: config.id || 0,
            address: address,
            addressName: addressName,
            addressRemark: addressRemark,
            addressType: config.type,
            latlng: config.$addressRemark.data('latlng'),
            act: 'set'
        })
            .done(function() {
                Util.redirect('app/client/app/xiche/pub_page/view/profile_address/address_main.js');
            })
            .fail(function(err) {
                Util.toast(err.message, 1500);
            });
    }
});

exports.address = Widget.define({
    events: {
        'tap [data-role="item"]': function (e) {
            var $item = $(e.currentTarget);

            this.selectPosition(
                $item.data('latlng'),
                $item.data('address'),
                $item.data('name')
            );
        },
        'input [data-role="addressName"]': function () {
            this.config.$addressRemark.val('');
            this.config.$addressRemark.data('latlng', '');

            if (!this.config.$addressName.val()) {
                this.hideAddressList();
                this.config.$el.trigger('addressEmpty');
            }
        }
    },
    init: function (config) {
        var self = this;

        this.config = config;
        this.config.params = config.params || {};

        this.autocomplete = new AutoComplete({
            $input: config.$addressName,
            getData: function (keyword, callback) {
                if (!keyword) {
                    return callback(null);
                }

                XicheAPI.getAddressSuggesstion({
                    cityName: config.cityName,
                    userId: config.userId,
                    keyword: keyword
                }, function (err, data) {
                    if (err) {
                        callback(null);
                    } else {
                        callback(data ? data.slice(0, 10) : null);
                    }
                });
            }
        });

        this.autocomplete
            .on('data', function (data) {
                self.renderAddressList(data);
                self.config.$el.trigger('addressChanged');
            })
            .on('empty', function () {
                self.hideAddressList();
            });

        this.listTemplate = _.template(this.config.$listTemplate.html());
    },
    renderAddressList: function (data) {
        this.config.$list
            .html(this.listTemplate({
                list: data
            }))
            .show();
    },
    hideAddressList: function () {
        this.config.$list.hide();
    },
    selectPosition: function (latlng, address, addressName) {
        var self = this;

        XicheAPI.checkIsLatlngAvaliable({
            latlng: latlng
        })
            .done(function (data) {
                if (!data.isServiceArea) {
                    Util.toast('你选择的地点暂时无法提供服务，敬请期待', 1500);
                    return;
                }

                self.config.$addressName.val(addressName);
                self.config.$addressRemark.val(address);
                self.config.$addressRemark.data('latlng', latlng);

                self.hideAddressList();

                self.config.$el.trigger('addressSelected');
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试');
            });
    }
});