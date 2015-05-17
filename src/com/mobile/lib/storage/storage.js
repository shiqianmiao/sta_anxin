/**
 * @class Storage
 *
 * 该模块对浏览器的`localStorage`功能进行了简单的封装, 并且支持赶集生活客户端的的GJLocalStorage接口
 *
 * @example
 *     var Storage = require('lib/storage.js');
 *     var storage = new Storage('FooNamespace');
 *     storage.set('key1', 'value1');
 *
 *     console.log(storage.get('key1'));
 *     // ==> value1
 *
 * @param {String} namespace 存储的命名空间, 会作为localStorage的key
 */
function Storage (namespace) {
    this.namespace = namespace;
}

var LocalStorage = window.GJLocalStorage || window.localStorage;

/**
 * @param {String} key 存储键名
 * @return {Boolean} 是否存储成功
 */
Storage.prototype.set = function (key, value) {
    var data = this.dump();

    data[key] = {
        value: value
    };

    data = JSON.stringify(data);

    try {
        LocalStorage.setItem(this.namespace, data);
    } catch (ex) {
        return false;
    }

    return LocalStorage.getItem(this.namespace) === data;
};

/**
 *
 * @param {String} key 键名
 * @return {String} 值
 */
Storage.prototype.get = function (key) {
    var data = this.dump();

    if (data[key]) {
        return data[key].value;
    }

    // else return undefined;
};

Storage.prototype.remove = function (key) {
    this.set(key, undefined);
};

Storage.prototype.clear = function () {
    LocalStorage.removeItem(this.namespace);
};

Storage.prototype.dump = function () {
    var data = LocalStorage.getItem(this.namespace) || '{}';

    try {
        data = JSON.parse(data);
    } catch (ex) {
        data = {};
    }
    return data;
};

Storage.prototype.save = function (data) {
    data = JSON.stringify(data);

    try {
        LocalStorage.setItem(this.namespace, data);
    } catch (ex) {
        return false;
    }
    return true;
};

module.exports = Storage;