var $ = require('$');
var date1 = new Date(2015, 1, 18);
var date2 = new Date(2015, 1, 22);
var now   = new Date();
if (now > date1 && now < date2) {
    window.alert('尊敬的用户：我们于2月19日-2月22日休假暂停服务，此期间申请将无法受理，感谢您对赶集金融的支持，我们2月22日见。预祝您及家人春节快乐，万事如意。 ');
}
exports.ajaxValid = function (value, config, callback) {
    var phone = $('#phone').find('input[name="phone"]').val();
    var url   = $('#phone').attr('data-check-url');
    $.ajax({
        url: url,
        data: {phone: phone, code: value},
        dataType: 'json',
        type: 'POST'
    }).done(function (data) {
        if (data.ret === 1) {

            callback(null);
            return;
        }
        callback(new Error(data.msg));
    }).fail(function (){
        callback(new Error('网络异常'));
    });
};
exports.ajaxValidPhone = function (value, config, callback) {
    var phone = $('#phone').find('input[name="mobile"]').val();
    var url   = $('#phone').attr('data-rules-url');
    $.ajax({
        url: url,
        data: {phone: phone},
        dataType: 'json',
        type: 'POST'
    }).done(function (data) {
        if (data.error === 1) {
            callback(null);
            return;
        }
        callback(new Error(data.message));
    }).fail(function (){
        callback(new Error('网络异常'));
    });
};
exports.enableButton = function (config) {
    var $el = config.$el;
    $el.prop('disabled', false);
};
exports.bornYearFieldSet = function (value, config, callback) {
    var form   = this.form;
    var values = form.getValues();
    if(!values.born_year){
        callback(new Error('忘记填写年份了！'));
    }
};
exports.bornMonthFieldSet = function (value, config, callback) {
    var form   = this.form;
    var values = form.getValues();
    if(!values.born_month){
        callback(new Error('忘记填写月份了！'));
    }
};