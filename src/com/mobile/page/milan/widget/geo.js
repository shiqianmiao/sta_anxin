var Widget  = require('com/mobile/lib/widget/widget.js');
var _       = require('com/mobile/lib/underscore/underscore.js');
var $       = require('$');
var Storage = require('com/mobile/lib/storage/storage.js');
var Cookie  = require('com/mobile/lib/cookie/cookie.js');
var Toast   = require('com/mobile/widget/toast.js');
var getURIParams = function(searchStr) {
    if(!searchStr) {
        searchStr = window.location.search;
    }
    var params = {}, URIArr;
    searchStr = searchStr.replace('?', '');

    URIArr = searchStr.split('&');
    $.each(URIArr, function(i, v) {
        var keyArr = v.split('=');
        if(keyArr.length === 2) {
            params[keyArr[0]] = decodeURIComponent(keyArr[1]);
        }
    });
    return params;

};

exports.nearby = Widget.define({
    events : {
        'click [data-role="check"]':'check',
        'click [data-role="refresh"]':'refresh'
    },
    init : function (config) {
        this.posStorage = new Storage('nearbyPos');
        this.config = config;
        this.paramsObj = {};
        this.cityDomain = Cookie.get('cityDomain');
        var arr , url = config.url;
        if(url) {
            url = url.replace(/#./, '');
            arr = url.split('?');
        }

        if(arr && arr.length > 1) {
            var searchStr = arr[1];
            this.paramsObj  = getURIParams(searchStr);
        }
        if(config.lat && config.lng) {
            var latlng = config.lat + ',' + config.lng;
            this.fetchLocationData(latlng,function(err, data) {
                if(!err){
                    var addressName = data.currentLocation;
                    config.$el.find('.tip1').hide();
                    config.$addressName.text(addressName);
                    config.$agree.show();
                }
            });
        }
    },
    fetchLocationData : function (param, callback) {
        $.getJSON('/latlng/?latlng='+ param, function(data) {
            if (data && data.data && data.data.cityCode) {
                callback(null, data.data);
            }else{
                callback('error: data is not found!');
            }
        });
    },
    requestGeo : function () {
        var self = this;
        var geoDefer = $.Deferred();

        geoDefer
                .done(function (curPos) {
                    self.config.$el.find('.tip1').hide();
                    self.config.$checking.show();

                    _.extend(self.paramsObj, getURIParams());

                    self.paramsObj.lat = curPos.latitude;
                    self.paramsObj.lng = curPos.longitude;

                    self.fetchLocationData(curPos.latitude + ',' + curPos.longitude,
                        function (err, data) {
                            var urlPath = window.location.pathname;
                            var _timout = 3;
                            if (err) {
                                window.location.href = urlPath + '?' + $.param(self.paramsObj);
                                self.showCheckTip(_timout);
                            }else{
                                if (self.cityDomain === data.cityDomain) {
                                    window.location.href = urlPath + '?' + $.param(self.paramsObj);
                                    self.showCheckTip(_timout);
                                }else{
                                    var urlParam = urlPath.replace(/[a-zA-Z]+_/, data.cityDomain+'_');
                                    Toast.show('将切换到定位所在城市：' + data.shortName, 3000);
                                    setTimeout(function () {
                                        window.location.href =  urlParam + '?' + $.param(self.paramsObj);
                                    }, 3000);
                                    self.showCheckTip(_timout * 2);
                                }
                            }
                        });
                })
                .fail(function (err) {
                    var text = '';
                    if(err.code === err.PERMISSION_DENIED) {
                        text = '浏览器定位授权未打开';
                    } else if(err.code === err.POSITION_UNAVAILABLE) {
                        text = '定位失败';
                    } else if (err.code === 6001) {
                        text = err.message;
                    } else {
                        text = '定位超时';
                    }
                    self.config.$el.find('.tip1').hide();
                    self.config.$tip.text(text);
                    self.config.$reject.show();
                });

        self.config.$el.find('.tip1').hide();
        self.config.$checking.show();

        var curPos = self.posStorage.get('curPos');
        var now = new Date().getTime();

        if(!curPos || (curPos && now - curPos.curTime > 1000 * 3600 * 5) ) {
            self.posStorage.remove('curPos');
            geoDefer = self.geo(geoDefer);
        } else {
            geoDefer.resolve(curPos);
        }
    },
    check : function (e) {
        e.preventDefault();
        this.requestGeo();
    },
    refresh : function () {
        this.posStorage.remove('curPos');
        this.requestGeo();
    },
    showCheckTip : function (timeout) {
        var self = this;
        setTimeout(function () {
            self.config.$el.find('.tip1').hide();
            self.config.$check.show();
        }, timeout * 1000);
    },
    geo: function (geoDefer) {
        var self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                var curPos = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    curTime: new Date().getTime()
                };

                self.posStorage.set('curPos', curPos);
                geoDefer.resolve(curPos);
            }, function (err) {
                geoDefer.reject(err);
            }, {
                timeout : self.config.timeout || 30000,
                maximumAge : 600000,
                enableHighAccuracy : true
            });
        } else {
            // 手机不支持定位
            geoDefer.reject({code: 6001, message:'不支持定位'});
        }
        return geoDefer;
    }
});
exports.nearbyForDHB = exports.nearby.extend({
    geo: function (geoDefer) {
        var self = this;
        if (window.YulorePage) {
            var api = window.YulorePage;
            // {"status":0,"latitude":"","longitude":""}
            window._dhb_callback_fn = function (pos) {
                window._dhb_callback_fn = null;
                var pos = JSON.parse(pos);
                if (pos.status) {
                    geoDefer.reject({code: 6001, message: pos.message});
                    return ;
                }
                var curPos = {
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                    coords:{
                        latitude: pos.latitude,
                        longitude: pos.longitude
                    },
                    curTime: new Date().getTime()
                };

                self.posStorage.set('curPos', curPos);
                geoDefer.resolve(curPos);
            };
            api.getGeo('_dhb_callback_fn');
        } else {
            // 手机不支持定位
            geoDefer.reject({code: 6001, message:'不支持定位'});
        }
        return geoDefer;
    }
});
