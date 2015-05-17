var Storage = require('com/mobile/lib/storage/storage.js');
var _ = require('underscore');

var storage = new Storage('Xiche');

var recordHistory = (function() {
    var histoy = function(namespace, key) {
        var getAll = function() {
            var all = storage.get(namespace);
            _.uniq(all, false, function(item) {
                return item[key];
            });
            return (storage.get(namespace) || []).slice(0, 10);
        };

        var add = function(record) {
            var all = getAll();
            all = all.filter(function(item) {
                return item[key] !== record[key];
            });
            all.unshift(record);
            storage.set(namespace, all);
        };

        var getDisplayList = function(filterList, filterKey) {
            var all = getAll();
            all = all.filter(function(item) {
                return !filterList.some(function(filterItem) {
                    return filterItem[filterKey] === item[key];
                });
            });
            return all.slice(0, 5);
        };

        return {
            getAll: getAll,
            getDisplayList: getDisplayList,
            add: add
        };
    };

    var carHistory = function() {
        var namespace = 'carHistory';
        var key = 'carNumber';

        return histoy(namespace, key);
    };

    var addressHistory = function() {
        var namespace = 'addressHistory';
        var key = 'latlng';

        return histoy(namespace, key);
    };

    return {
        carHistory: carHistory,
        addressHistory: addressHistory
    };
})();

var latestAddress = function(){
    var KEY = 'address';

    return {
        get: function(){
            return storage.get(KEY);
        },
        set: function(val){
            return storage.set(KEY, val);
        }
    };
};

module.exports = {
    carHistory: recordHistory.carHistory,
    addressHistory: recordHistory.addressHistory,
    latestAddress: latestAddress
};