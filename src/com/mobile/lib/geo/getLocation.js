var $ = require('$');

exports.getLocationByIP = function(callback) {
    var ip2cityUrl = '/latlng/?ac=getCityInfoByIp&rnd=' + Math.random();
    var errMsg = 'IP position unavailable';

    $.ajax({
        url: ip2cityUrl,
        timeout: 10000,
        dataType: 'json'
    }).done(function(data) {
        if (!data || !data.data || !data.data.cityName || !data.data.cityDomain) {
            callback(errMsg);
        } else {
            callback(null, {
                cityName: data.data.cityName,
                cityDomain: data.data.cityDomain
            });
        }
    }).fail(function() {
        callback(errMsg);
    });
};

exports.getLocationByGPS = function(callback) {
    var gps2cityUrl = '/latlng/?format=eval';
    var geoDefer = $.Deferred();

    var gps2city = function(pos) {
        var errMsg = 'geoToCity server error';
        $.ajax({
            url: gps2cityUrl,
            data: {
                latlng: pos.coords.latitude + ',' + pos.coords.longitude
            },
            dataType: 'json'
        }).done(function (data) {
            if (!data || !data.data || !data.data.cityName || !data.data.cityDomain) {
                callback(errMsg);
            } else {
                callback(null, {
                    cityName: data.data.cityName,
                    cityDomain: data.data.cityDomain,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
            }
        })
        .fail(function () {
            callback(errMsg);
        });
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            geoDefer.resolve(pos);
        }, function(err) {
            geoDefer.reject(err);
        }, {
            timeout: 10000,
            maximumAge: 6000,
            enableHighAccuracy: true
        });
    } else {
        callback('api not supported');
    }

    geoDefer
        .done(function (pos) {
            gps2city(pos);
        })
        .fail(function (error) {
            callback(error);
        });
};