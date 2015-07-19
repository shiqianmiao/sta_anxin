/**
 * @desc 身份验证页面js
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var Hmap = require('com/mobile/widget/Hmap/js/Hmaphp.js');
var BaseInfo = exports;

BaseInfo.start = function(config) {
    var addressChange = false;

    //点击选择男女
    $('.sex .radio-sec').on('tap', function(){
        $('.sex .radio-sec').removeClass('active');
        $(this).addClass('active');
        $('#sex').val($(this).data('value'));
    });

    //点击选择城市
    $('.city .radio-sec').on('tap', function(){
        $('.city .radio-sec').removeClass('active');
        $(this).addClass('active');
        $('#city').val($(this).data('value'));
    });

    // 点击叉号按钮，清空input值
    $('.clear-txt').on('tap', function(){
        $(this).parent().find('input').val('');
        $(this).hide();
    });
    $('.value-input').on('keyup', function(){
        if($.trim($(this).val()) != ''){
            $(this).parent().find('.clear-txt').show();
        }
    });

    //表单是否已经提交
    var isSubmit = false;
    $('#js_finish').on('touchend', function() {
        if (!checkForm() || isSubmit) {
            return false;
        }
        isSubmit = true;
        var data= getFormData();
        $.ajax({
            type : 'post',
            url  : '/myInfo/ajaxBase/',
            data : data,
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    window.plugins.toast.showShortCenter('信息提交成功！', function(){}, function(){});
                    if (data.url) {
                        window.location.href = data.url;
                    }
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
                }
                isSubmit = false;
            },
            error : function() {
                isSubmit = false;
            }
        });
    });

    function checkForm() {
        var $realName = $('#real_name');
        var $sex = $('#sex');
        var $city = $('#city');
        var $address = $('#address');
        var $otherContactName = $('#other_contact_name');
        var $otherContactMobile = $('#other_contact_mobile');
        var $description = $('#description');
        if ($realName.length != 0) {
            if ($.trim($realName.val()) == "") {
                window.plugins.toast.showShortCenter('请输入您的真实姓名！', function () {}, function () {});
                return false;
            }
        }
        if ($sex.length != 0) {
            if ($.trim($sex.val()) == "") {
                window.plugins.toast.showShortCenter('请选择性别！', function(){}, function(){});
                return false;
            }
        }
        if ($.trim($city.val()) == "") {
            window.plugins.toast.showShortCenter('请选择所在城市！', function(){}, function(){});
            return false;
        }
        if ($.trim($address.val()) == "") {
            window.plugins.toast.showShortCenter('请输入您的家庭地址！', function(){}, function(){});
            return false;
        }
        if ($.trim($otherContactName.val()) == "") {
            window.plugins.toast.showShortCenter('请输入紧急联系人！', function(){}, function(){});
            return false;
        }
        if ($.trim($otherContactMobile.val()) == "") {
            window.plugins.toast.showShortCenter('请输入紧急联系人电话！', function(){}, function(){});
            return false;
        }
        return true;
    }

    function getFormData() {
        var data = {};
        var $realName = $('#real_name');
        var $sex = $('#sex');
        var $city = $('#city');
        var $address = $('#address');
        var $otherContactName = $('#other_contact_name');
        var $otherContactMobile = $('#other_contact_mobile');
        var $description = $('#description');

        if ($realName.length != 0) {
            if ($.trim($realName.val()) != $realName.data('origin')) {
                data.real_name = $.trim($realName.val());
                data.sex = $.trim($sex.val());
            }
        }
        if ($sex.length != 0) {
            if ($.trim($sex.val()) != $sex.data('origin')) {
                data.real_name = $.trim($realName.val());
                data.sex = $.trim($sex.val());
            }
        }
        if ($.trim($city.val()) != $city.data('origin')) {
            data.city = $.trim($city.val());
        }
        if ($.trim($address.val()) != $address.data('origin')) {
            data.address = $.trim($address.val());
        }
        if ($.trim($otherContactName.val()) != $otherContactName.data('origin')) {
            data.other_contact_name = $.trim($otherContactName.val());
        }
        if ($.trim($otherContactMobile.val()) != $otherContactMobile.data('origin')) {
            data.other_contact_mobile = $.trim($otherContactMobile.val());
        }
        if ($.trim($description.val()) != $description.data('origin')) {
            data.description = $.trim($description.val());
        }
        if (addressChange) {
            if ($('.js_address').length > 0) {
                var address = [];
                $('.js_address').each(function(index) {
                    var item = {};
                    item.lat = $(this).data('lat');
                    item.lon = $(this).data('lon');
                    item.city = $(this).data('city');
                    item.address = $(this).val();
                    address.push(item);
                });
            }
            data.permanent_addr = JSON.stringify(address);
        }
        return data;
    }

    $('.js_address').tap(function(){
        addressChange = true;
        $('#info').hide();
        $('#search').show();
    });

    var $curInput = null;
    var hmap = new Hmap({
        perAddrOnclick: function(liObj, latitude, longitude, business, results){
            var city = '';
            var district = '';
            if (results.city) {
                city = results.city;
            }
            if (results.district) {
                district = results.district;
            }
            detailAddress = city + district + business;
            $curInput.data('lat', latitude);
            $curInput.data('lon', longitude);
            $curInput.data('city', results.city);
            $curInput.val(detailAddress);
            hmap.hide();
        }
    });
    $('.js_address').on('click', function(){
        $curInput = $(this);
        hmap.show($curInput.val());
    });
};