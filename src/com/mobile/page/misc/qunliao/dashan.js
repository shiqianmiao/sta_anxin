var NativeAPI = require('app/client/common/lib/native/native.js');

exports.toDiscovery = function (config) {
    config.$el.on('click', function () {
        if (NativeAPI.isSupport()) {
            NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
                if (!err) {
                    if (deviceInfo && deviceInfo.versionId >= '6.0.0') {
                        NativeAPI.invoke('createNativeView', {
                            name: 'immain',
                            data:{
                                pagetype:'discovery'
                            }
                        });
                        return;
                    }
                }
            });
        }
    });
};
