var $ = require('$');
var _ = require('underscore');
var Widget = require('com/mobile/lib/widget/widget.js');
var AutoComplete = require('com/mobile/lib/autocomplete/autocomplete.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var async = require('com/mobile/lib/async/async.js');

var template = require('../template/choose_position.tpl');
var XicheAPI = require('../lib/xiche_api.js');
var BasePage = require('./base_page.js');
var XicheStorage = require('../lib/xiche_storage.js');
var addressHistoryStorage = XicheStorage.addressHistory();
var latestAddressStorage = XicheStorage.latestAddress();

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    var $body = $('body');

    async.auto({
        latlng: function (next) {
            if (config.latlng) {
                XicheAPI.checkIsLatlngAvaliable({
                    latlng: config.latlng
                })
                    .done(function (data) {
                        next(null, !!data.isServiceArea);
                    })
                    .fail(next);
            } else {
                next(null, false);
            }
        },
        userAddress: function (next) {
            HybridAPI.invoke('getUserInfo')
                .done(function (userInfo) {
                    XicheAPI.getUserAddress({
                        userId: userInfo.user_id
                    })
                        .done(function (data) {
                            next(null, data);
                        })
                        .fail(next);
                })
                .fail(function () {
                    next(null, []);
                });
        },
        serviceArea: function (next) {
            XicheAPI.getAvaliableServiceArea(null)
                .done(function (data) {
                    next(null, data);
                })
                .fail(next);
        }
    }, function (err, result) {
        $body.removeClass('loading');

        if (err) {
            $body.addClass('offline');
            return;
        }

        var addressHistoryList = addressHistoryStorage.getDisplayList(result.userAddress, 'latlng');

        $body
            .append(template({
                params: config,
                serviceArea: result.serviceArea,
                isLatlngAvaliable: result.latlng,
                userAddress: result.userAddress || [],
                addressHistoryList: addressHistoryList,
                cityInfo: {
                    cityName: '北京'
                }
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};

exports.form = Widget.define({
    events: {
        'tap [data-role="item"]': function (e) {
            var $item = $(e.currentTarget);

            this.selectPosition(
                $item.data('latlng'),
                $item.data('address'),
                $item.data('name')
            );
        },
        'click [data-role="back"]': function () {
            this.back();
        },
        'click [data-role="confirm"]:not(.disable)': function () {
            this.submitAddress();
            this.back();
        },
        'click [data-role="confirm"].disable': function () {
            Util.toast('请选择车辆位置');
        },
        'input [data-role="input"]': function () {
            this.config.$confirm.addClass('disable');

            this.latlng = undefined;
            this.address = undefined;
            this.addressName = undefined;

            this.config.$commentText.val('');

            if (!this.config.$input.val()) {
                this.hideAddressList();
                this.config.$comment.show();
                this.config.$userAddressList.show();
            }
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.autocomplete = new AutoComplete({
            $input: config.$input,
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
                self.config.$userAddressList.hide();
                self.config.$comment.hide();
            })
            .on('empty', function () {
                self.hideAddressList();
            });

        if (config.isLatlngAvaliable) {
            this.latlng = config.params.latlng;
            this.address = config.params.address;
            this.addressName = config.params.addressName;

            this.config.$confirm.removeClass('disable');
            this.config.$commentText.val(config.params.addressComment);
            this.config.$input.val(config.params.addressName);
        } else {
            delete config.params.latlng;
            delete config.params.address;
            delete config.params.address_name;
        }

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
    submitAddress: function () {
        var params = this.config.params;

        params.address = this.address;
        params.latlng = this.latlng;
        params.addressName = this.addressName;
        params.addressComment = this.config.$commentText.val();

        if(latestAddressStorage.get() !== this.latlng){
            latestAddressStorage.set(this.latlng);

            delete params.jobDate;
            delete params.peroid;
            delete params.jobTimeText;
        }

        addressHistoryStorage.add({
            address: params.address,
            latlng: params.latlng,
            addressName: params.addressName,
            addressComment: params.addressComment
        });
    },
    back: function () {
        Util.redirect('app/client/app/xiche/pub_page/view/index.js?'+
            $.param(this.config.params));
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

                self.address = address;
                self.latlng = latlng;
                self.addressName = addressName;

                self.config.$comment.show();
                self.config.$userAddressList.show();
                self.config.$commentText.val(address);
                self.config.$input.val(addressName);

                self.hideAddressList();
                self.config.$confirm.removeClass('disable');
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试');
            });
    }
});
