var $ = require('$');
var EventEmiter = require('com/mobile/lib/event/event.js');

/**
 * 获取地理位置
 *
 * 可以是一个或两个参数
 *
 * @param {Object} config 可选。
 * @param {Function} callback 必选。回调函数。
 *
 * ```JavaScript
 * config = {
 *   ipFirst: true, // 是否优先使用 IP 定位
 *   timeout: 10000 // 超时时间，默认10秒
 * }
 * ```
 *
 * 回调函数：
 *
 * callback(err, obj)
 * @param {Object|String} err // 错误信息
 * @param {Object} obj        // 定位信息
 *
 * ```JavaScript
 * obj = {
 *     cityName: "北京市",
 *     cityDomain: "bj",
 *     currentLocation: "北京市海淀区马连洼北路",
 *     latlng: "40.0404366,116.29307770000001"
 * }
 * ```
 */
exports.getLocation = function (config, callback) {
    var geoDefer = $.Deferred();
    var geoToCityURL = '/latlng/?format=eval';
    var ipToCityURL = '/latlng/?ac=getCityInfoByIp&rnd=' + Math.random();
    var emiter = new EventEmiter();

    if (typeof config === 'function') {
        callback = config;
        config = {};
    }

    var getGeoCity = function(pos) {
        emiter.emit('getCityInfo');
        $.ajax({
            url: geoToCityURL,
            data: {
                latlng: pos.coords.latitude + ',' + pos.coords.longitude
            },
            dataType: 'json'
        })
        .done(function (data) {
            if (!data || !data.data || !data.data.cityName || !data.data.cityDomain) {
                return callback('geoToCity server error');
            }

            callback(null, {
                cityName: data.data.cityName,
                cityDomain: data.data.cityDomain,
                currentLocation: data.data.currentLocation,
                latlng: data.data.latlng
            });
        })
        .fail(function (err) {
            callback(err);
        });
    };

    var getGeoLocation = function() {
        if (config.thirdGeo) {
            require.async(config.thirdGeo, function (thirdGeo) {
                var geofn = thirdGeo[config.geofn](config);
                geoDefer = geofn.geo(geoDefer);
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                geoDefer.resolve(pos);
            }, function (err) {
                geoDefer.reject(err);
            }, {
                timeout : config.timeout || 10000,
                maximumAge : 60000,
                enableHighAccuracy : true
            });
        } else {
            geoDefer.reject(new Error('api not supported'));
        }
    };

    var getIpLocation = function(error) {
        var errMsg = 'IP position unavailable';

        emiter.emit('getCityInfo');
        $.ajax({
            url: ipToCityURL,
            timeout: config.timeout,
            dataType: 'json'
        })
        .done(function (data) {
            if (!data || !data.data || !data.data.cityName || !data.data.cityDomain) {
                if (config.ipFirst) {
                    getGeoLocation();
                } else {
                    callback(error || errMsg);
                }
            } else {
                callback(null, {
                    cityName: data.data.cityName,
                    cityDomain: data.data.cityDomain,
                    currentLocation: data.data.currentLocation,
                    latlng: data.data.latlng
                });
            }
        })
        .fail(function () {
            if (config.ipFirst) {
                getGeoLocation();
            } else {
                callback(error || errMsg);
            }
        });
    };

    geoDefer
        .done(function (pos) {
            getGeoCity(pos);
        })
        .fail(function (error) {
            if (!config.ipFirst) {
                if (error && error.code === error.PERMISSION_DENIED) {
                    callback(error);
                }else{
                    getIpLocation(error);
                }
            }else{
                callback(error);
            }
        });

    if (config.ipFirst) {
        getIpLocation();
    } else {
        getGeoLocation();
    }

    return emiter;
};