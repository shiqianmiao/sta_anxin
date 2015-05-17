var RemoteAPI = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');

require('app/client/app/zp/resume/style/resume.jcss');

exports.init = function (config) {
    NativeAPI.invoke(
        'getUserInfo',
        null,
        function (err, userInfo) {
            userInfo = userInfo || {};
            function getData(callback) {
                RemoteAPI.getData({
                    'controller': 'Resume',
                    'action': 'payResult',
                    'order_sn': config.order_sn,
                    'user_id': userInfo.user_id
                }, callback);
            }

            function alertError(msg) {
                NativeAPI.invoke('alert', {
                    title: '出错啦!',
                    message: msg,
                    btn_text: '确定'
                });
            }

            function blockBack() {
                NativeAPI.registerHandler('back', function (params, callback) {
                    var url = '/ng/app/client/common/redirect.html#';
                    callback(null, {preventDefault: 1});
                    window.location.href = url + encodeURIComponent(window.location.pathname + '#app/client/app/zp/resume/view/prepaid_page.js?user_id=' + userInfo.user_id);
                });
            }

            getData(function (err, data) {
                if (err) {
                    return alertError(err.message);
                }

                if (data.resultCode === 1) {
                    require.async('../template/pay/callback_success.tpl', function (tpl) {
                        $('body').html(tpl({}));
                    });
                    return;
                }

                if (data.resultCode === 2) {
                    require.async('../template/pay/callback_loading.tpl', function (tpl) {
                        $('body').html(tpl({}));
                    });

                    setTimeout(function () {
                        getData(function (err, data) {
                            if (err) {
                                return alertError(err.message);
                            }

                            if (data.resultCode === 1) {
                                require.async('../template/pay/callback_success.tpl', function (tpl) {
                                    $('body').html(tpl({}));
                                });

                                return;
                            }

                            if (data.resultCode === 2) {
                                setTimeout(function (err, data) {
                                    if (err || !data || data.resultCode !== 1) {
                                        require.async('../template/pay/callback_fail.tpl', function (tpl) {
                                            $('body').html(tpl({}));
                                        });
                                        blockBack();
                                        return;
                                    }
                                    require.async('../template/pay/callback_success.tpl', function (tpl) {
                                        $('body').html(tpl({}));
                                    });
                                }, 2000);
                            }
                        });
                    }, 2000);
                    return;
                }

                require.async('../template/pay/callback_fail.tpl', function (tpl) {
                    $('body').html(tpl({}));
                });
                blockBack();
                return;
            });
        }
    );
};

