/**
 * @fileoverview 地域选择事件
 * @author chenhan <chenhan@273.cn>
 */
'use strict';
var $ = require('jquery');
var DataCache = require('util/data_cache.js');
var dataCache = new DataCache();

var DATA_PATH = 'data/location/location2.js';
/**
 * 目前取数据途径
 * * 从js文件中取
 */
module.exports = (function() {
    return {
        /**
         * 取得location data
         * * 在有最近一周内的版本号时,优先取最近一周的数据
         * * 没有时,取上周的版本号
         * * 在storage里取到数据直接保存
         * * 没有取到则去异步加载
         * * 只有特定更新版本的缓存会存留下来,no zuo no die
         */
        getLocationData: function() {
            dataCache.getData(DATA_PATH, 'location_v2');
        },
        /**
         * 取得所有省份
         * @returns {Object} defer
         */
        getProvince: function(fn) {
            return dataCache.getAsync('province');
//            return $.ajax(DATA_PER + '&_act=getprovince', {dataType: 'jsonp'});
        },
        /**
         * 根据省份id取得城市
         * @returns {Object} defer
         */
        getCityListById: function(provinceId) {
            return dataCache.getAsync('city', provinceId);
//            return $.ajax(DATA_PER + '&_act=getCityListByProvinceId', {
//                data: {'province_id': provinceId},
//                dataType: 'jsonp'
//            });
        },

        getDsitrictByCityId: function (cityId) {
            return dataCache.getAsync('district', cityId);
        },

        getStreetByDsitrictId: function (DistrictId) {
            return dataCache.getAsync('street', DistrictId);
        }
    };
} ());
