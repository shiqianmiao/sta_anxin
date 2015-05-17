var $           = require('$');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var BasePage    = require('app/client/app/misc/greeting_card/view/base_page.js');
var Storage = require('app/client/app/misc/greeting_card/util/storage.js');

/*style*/
require('../style/style.css');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '新春贺卡'
        }
    );
    var $body = $('body');

    $body.removeClass('loading');
    var path = 'app/client/app/misc/greeting_card/template/';
    if(NativeAPI.isSupport()){
        require.async( path + 'app_index.tpl', function (template) {
            $body.append(template());
            BasePage.bindNativeA();
        });
    }else{
        require.async( path + 'index.tpl', function (template) {
            $body.append(template());
            BasePage.bindJsA();
        });
    }
    Storage.clear();
};