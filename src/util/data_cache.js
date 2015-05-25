/**
 * @fileoverview
 * @author chenhan <chenhan@273.cn>
 */
'use strict';

var $ = require('jquery');
var Storage = require('util/storage.js');
var VesionFile = require('version');

var DataCache = function() {
    this.cachedData = {};
    this.dataStatus = false;
    this.cacheDefers = {};
};
var prop = DataCache.prototype = {};
$.extend(prop, {
    /**
     * 取得data
     * * 在有最近一周内的版本号时,优先取最近一周的数据
     * * 没有时,取上周的版本号
     * * 在storage里取到数据直接保存
     * * 没有取到则去异步加载
     * * 只有最新版本会被保留下来
     * @param {!string} cachedPath 缓存文件所在路径
     * @param {!string} cachedName 保存键名
     */
    getData: function(cachedPath, cachedName) {
        var self = this;
        var id = cachedPath;
        var version = G.config('version')[id];
        var savedKey;
        var data;
        if (version) {
            data = Storage.get(cachedName + '_' + version);
        } else {
            version = Math.round(Date.now() / 1000);
            version -= version % 64800;
            data = Storage.get(cachedName + '_' + version);
        }

        if (data) {
            self.cachedData = $.parseJSON(data);
            self.dataStatus = true;
        } else {
            self.asyncData(id, cachedName + '_' + version);
            //清除可能存在的旧缓存
            savedKey = JSON.parse(Storage.get('__SAVED_K__'));
            if (savedKey) {
                $.each(savedKey, function(storageKey, value) {
                    if (storageKey.match(cachedName + '_')) {
                        Storage.remove(storageKey);
                    }
                });
            }
        }
    },
    /**
     * 取得取数据的defer对象
     * @param {string} type 数据类型
     * @param {number} id
     * @returns {defer}
     */
    getAsync: function(type, id) {
        var self = this;
        var timer = null;
        var deferId = type + '_' + id;
        var defer;
        if (self.dataStatus) {
            defer = self._getDefer(deferId);
            if (defer) {
                return defer;
            }
        }
        defer = $.Deferred();
        timer = setInterval(function() {
            if (self.dataStatus) {
                var data = self.cachedData[type];
                if (id) {
                    data = data[id];
                }
                defer.resolve(data);
                clearInterval(timer);
            }
        }, 20);
        if (!defer) {
            self._saveDefer(deferId, defer);
        }
        return defer;
    },
    /**
     * 延迟取得数据
     * @param {!number} id
     * @param {!string} name 保存在localStorage中的key
     */
    asyncData: function(id, name) {
        var self = this;
        require.async([id], function(data) {
            self.cachedData = data;
            //ie6下data会过长无法存在userdata中，默认不使用
            try {
                Storage.set(name, JSON.stringify(data));
            } catch (e) {
            }
            self.dataStatus = true;
        });
    },
    /**
     * 保存数据的defer缓存
     * @param {string} id 唯一标识符
     * @param {defer} defer
     */
    _saveDefer: function(id, defer) {
        var self = this;
        if (!self.cacheDefers[id]) {
            self.cacheDefers[id] = defer;
        }
    },
    /**
     * 取得数据的defer缓存
     * @param {string} id 唯一标识符
     */
    _getDefer: function(id) {
        var self = this;
        return self.cacheDefers[id] ? self.cacheDefers[id] : null;
    }
});

module.exports = DataCache;