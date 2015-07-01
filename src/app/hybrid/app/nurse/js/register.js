/**
 * @desc 页面基类
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var Util = require('com/common/util.js');
var Register = exports;

Register.registerForm = function(config) {
    var $elem = config.$el;
    var $telInput = $elem.find('#tel');
    var $code = $elem.find('#code');
    var $getCode = $elem.find('#get_code');
    var $pwdInput = $elem.find('#password');
    var $rePwdInput = $elem.find('#re_password');
    var $btnRegister = $('#btn_register');

    //获取验证码
    var isSend = false;
    $getCode.on('tap', function() {
        var $this = $(this);
        var timer = null;
        var sec  = 60;
        if (!confirmTel() || isSend) {
            return false;
        }
        isSend = true;
        $.ajax({
            type : 'post',
            url  : '/user/getCode/',
            data : {telephone : $telInput.val(), code_type : 'register'},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    $this.addClass('getCodeing');
                    $this.html(sec + '秒');
                    timer = setInterval(function(){
                        if(sec != 0){
                            sec--;
                            $this.html(sec + '秒');
                        }else{
                            clearInterval(timer);
                            $this.removeClass('getCodeing');
                            $this.html('重新获取');
                            isSend = false;
                        }
                    }, 1000);
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                }
            },
            error : function() {
                isSend = false;
            }
        });
    });
    function confirmTel() {
        var telValue = $.trim($telInput.val());
        if (!telValue) {
            window.plugins.toast.showShortCenter('手机号不能为空！', function(){}, function(){});
            return false;
        }
        if (!Util.isTel(telValue)) {
            window.plugins.toast.showShortCenter('手机号不正确！', function(){}, function(){});
            return false;
        }
        return true;
    }
    function confirmPassword() {
        var password = $pwdInput.val();
        if (!password || !(/^[a-z|A-Z|0-9]{6,12}$/.test(password))) {
            window.plugins.toast.showShortCenter('请输入6－12位数字或字母的密码！', function(){}, function(){});
            return false;
        }
        var rePassword = $rePwdInput.val();
        if (rePassword != password) {
            window.plugins.toast.showShortCenter('两次输入的密码不一致！', function(){}, function(){});
            return false;
        }
        return true;
    }
    function confirmCode() {
        var code = $code.val();
        if (!code) {
            window.plugins.toast.showShortCenter('验证码不能为空！' , function(){}, function(){});
            return false;
        }
        return true;
    }

    //注册
    var isRegister = false;
    $btnRegister.on('tap', function() {
        if (!confirmTel() || !confirmCode() || !confirmPassword() || isRegister) {
            return false;
        }
        isRegister = true;
        $.ajax({
            type : 'post',
            url  : '/user/ajaxRegister/',
            data : {telephone : $telInput.val(), code : $code.val(), password : $pwdInput.val()},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    window.plugins.toast.showShortCenter('注册成功！', function(){}, function(){});
                    if (data.url) {
                        window.location.href = data.url;
                    }
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                }
                isRegister = false;
            },
            error : function() {
                isRegister = false;
            }
        });
    });
};

Register.start = function(param) {
    Base.init(param);
};
