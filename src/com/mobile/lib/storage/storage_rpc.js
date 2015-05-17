var Storage = require('./storage.js');
var RPC = require('com/mobile/lib/rpc/rpc.js');
var storageCache = {};
var rpc = new RPC();

function getStorage(namespace) {
    return storageCache[namespace] || new Storage(namespace);
}

rpc.registerHandler('get', function (params, callback) {
    callback(null, getStorage(params.namespace).get(params.key));
});

rpc.registerHandler('set', function (params, callback) {
    callback(null, getStorage(params.namespace).set(params.key, params.value));
});

rpc.registerHandler('remove', function (params, callback) {
    callback(null, getStorage(params.namespace).remove(params.key));
});

rpc.registerHandler('clear', function (params, callback) {
    callback(null, getStorage(params.namespace).clear());
});

rpc.registerHandler('dump', function (params, callback) {
    callback(null, getStorage(params.namespace).dump());
});

rpc.registerHandler('save', function (params, callback) {
    callback(null, getStorage(params.namespace).save(params.data));
});

module.exports = rpc;