/**
 * @desc 登陆模块
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var Util = require('com/common/util.js');
var Login = exports;

Login.loginForm = function(config) {
    var $elem = config.$el;
    var $telInput = $elem.find('#tel');
    var $pwdInput = $elem.find('#password');
    var $autoAudio = $elem.find('.keep-pwd');
    $autoAudio.on('tap', function() {
        if(Boolean($(this).data('keep'))) {
            $(this).find('.radio-span').removeClass('active');
            $(this).data('keep', false);
        } else {
            $(this).find('.radio-span').addClass('active');
            $(this).data('keep', true);
        }
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
    function confirmPwd() {
        var pwdValue = $.trim($pwdInput.val());
        if (!pwdValue) {
            window.plugins.toast.showShortCenter('请输入登陆密码！', function(){}, function(){});
            return false;
        }
        if (!(/^[a-z|A-Z|0-9]{6,12}$/.test(pwdValue))) {
            window.plugins.toast.showShortCenter('请输入6-12位数字或英文字母的密码！', function(){}, function(){});
            return false;
        }
        return true;
    }
    var isSubmit = false;
    $elem.find('#loginSubmit').on('tap', function(){
        var telValue  = $.trim($telInput.val());
        var pwdValue  = $.trim($pwdInput.val());
        var autoLogin = $autoAudio.data('keep');
        if (isSubmit || !confirmTel() || !confirmPwd()){
            return false;
        }
        isSubmit = true;
        $.ajax({
            type : 'POST',
            url  : '/user/ajaxLogin/',
            data : {telephone : telValue, password : pwdValue, auto_login : autoLogin},
            dataType : 'json',
            success:function(data){
                if (data.error == 0) {
                    window.location.href = data.url;
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('提交出错，请重试', function(){}, function(){});
                }
                isSubmit = false;
            },
            error:function(data){
                isSubmit = false;
            }
        });
    });
};

Login.forgetFirst = function(config) {
    var $elem = config.$el;
    var $telInput = $elem.find('#tel');
    var $code = $elem.find('#code');
    var $getCode = $elem.find('#get_code');
    var $btnNext = $('#btn_next');
    var telephone = '';
    var code = '';
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
            data : {telephone : $telInput.val(), code_type : 'forget'},
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
                    isSend = false;
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                    isSend = false;
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

    function confirmCode() {
        var code = $code.val();
        if (!code) {
            window.plugins.toast.showShortCenter('验证码不能为空！' , function(){}, function(){});
            return false;
        }
        return true;
    }

    var startNext = false;
    $btnNext.on('tap', function(){
        if (!confirmTel()  || !confirmCode() || startNext) {
            return false;
        }
        telephone = $telInput.val();
        code = $code.val();
        startNext = true;
        $.ajax({
            type : 'post',
            url  : '/user/forgetFirst/',
            data : {telephone : $telInput.val(), code : $code.val()},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    $('#forget_first').hide();
                    $('#forget_second').show();
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                }
                startNext = false;
            },
            error : function() {
                startNext = false;
            }
        });
    });

    var $btnFinish = $('#btn_finish');
    var $pwdInput  = $('#password');
    var $rePwdInput = $('#re_password');
    var startFinish = false;
    $btnFinish.on('tap', function(){
        if (!confirmPassword() || startFinish) {
            return false;
        }
        startFinish = true;
        $.ajax({
            type : 'post',
            url  : '/user/resetPwd/',
            data : {telephone : telephone, code : code, password : $pwdInput.val()},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    window.plugins.toast.showShortCenter('密码设置成功！', function(){}, function(){});
                    if (data.url) {
                        window.location.href = data.url;
                    }
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('密码设置失败，请重试！', function(){}, function(){});
                }
                startNext = false;
            },
            error : function() {
                startNext = false;
            }
        });

    });

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
};

Login.forgetSecond = function(config) {
    var $elem = $('.loginMain');
    var $form = $elem.find('form');
    var $errorTip = $elem.find('.errorTip');
    var $tel = $elem.find('input[name="telephone"]');
    var $code = $elem.find('input[name="code"]');
    function confirmTel() {
        var tel = $tel.val();
        if (!tel || !Util.isTel(tel)) {
            $errorTip.show();
            $errorTip.html('获取手机号码出错，请返回上一步重试！');
            return false;
        }
        return true;
    }

    $code.on('focus', function () {
        $errorTip.hide();
    });
    $code.on('blur', function(){
        confirmCode();
    });

    function confirmCode() {
        var code = $code.val();
        if (!code || !(/^\d{6}$/.test(code))) {
            $errorTip.show();
            $errorTip.html('请输入6位数字的验证码');
            return false;
        }
        return true;
    }

    var isConfirm = false;
    $elem.find('#nextTel').on('tap', function() {
        if(isConfirm || !confirmCode() || !confirmTel()) {
            return false;
        }
        var tel  = $tel.val();
        var code = $code.val();
        isConfirm = true;
        $.ajax({
            type : 'post',
            url  : '/user/checkCode/',
            data : {telephone : tel, code : code},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    $form.submit();
                } else {
                    $errorTip.html(data.msg);
                    $errorTip.show();
                }
                isConfirm = false;
            },
            error : function() {
                isConfirm = false;
            }
        });
    });

    //获取验证码
    var isSend = false;
    if($('.getCode').length != 0){
        $('.getCode').on('tap', function(){
            var $this = $(this);
            var oTime = null;
            var oNum  = 60;
            if (!confirmTel() || isSend) {
                return false;
            }
            isSend = true;
            $.ajax({
                type : 'post',
                url  : '/user/getCode/',
                data : {telephone : $tel.val()},
                dataType : 'json',
                success : function(data) {
                    if (data.error == 0) {
                        if($this.attr('class') == 'getCode'){
                            $this.addClass('waitCode').html('60秒');
                            oTime = setInterval(function(){
                                oNum--;
                                if(oNum > 0 && oTime){
                                    $this.html(oNum + '秒');
                                }else{
                                    $this.removeClass('waitCode').html('重获验证码');
                                    clearInterval(oTime);
                                    isSend = false;
                                }
                            },1000);
                        }
                    }
                },
                error : function() {
                    isSend = false;
                }
            });
        });
    }
};

Login.forgetThird = function(config) {
    var $elem = config.$el;
    var $form = $elem.find('form');
    var $errorTip = $elem.find('.errorTip');
    var $password = $elem.find('input[name="password"]');
    var $rePassword = $elem.find('input[name="rePassword"]');
    $password.on('focus', function () {
        $errorTip.hide();
    });
    $rePassword.on('focus', function () {
        $errorTip.hide();
    });

    function confirmPassword() {
        var password = $password.val();
        if (!password || !(/^[a-z|A-Z|0-9]{6,12}$/.test(password))) {
            $errorTip.show();
            $errorTip.html('请输入6－12位数字或字母的密码');
            return false;
        }
        return true;
    }

    function confirmRePassword() {
        var password = $password.val();
        var rePassword = $rePassword.val();
        if (!rePassword) {
            $errorTip.html('请输入确认密码');
            $errorTip.show();
            return false;
        }
        if (password == rePassword) {
            $errorTip.hide();
            return true;
        } else {
            $errorTip.html('两次输入的密码不一致，请重新输入');
            $errorTip.show();
            return false;
        }
    }

    var isConfirm = false;
    $elem.find('#nextTel').on('tap', function() {
        if(isConfirm || !confirmPassword() || !confirmRePassword()) {
            return false;
        }
        isConfirm = true;
        $form.submit();
    });
};

Login.start = function(param) {
    Base.init(param);
}
