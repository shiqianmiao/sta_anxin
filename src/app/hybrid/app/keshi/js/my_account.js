/**
 * @desc 我的账户页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-30
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('com/common/util.js');
var DetailTpl = require('app/hybrid/app/keshi/tpl/account_detail_list.tpl');
var MyAccount = exports;

//绑定银行卡
MyAccount.bindBankCard = function(config) {
    var $el      = config.$el;
    var $cardNum = $el.find('#card_num');
    var $bank    = $el.find('#bank');
    var $binId   = $el.find('#bin_id');
    var $btnSubmit = $('#btn_sub');
    var isSend = false;
    $cardNum.blur(function(){
        if (isSend || !checkForm(false)) {
            return false;
        }
        var cardValue = $.trim($cardNum.val());
        isSend = true;
        $.ajax({
            type : 'post',
            url  : '/account/ajaxGetBank/',
            data : {card_num : cardValue},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    $bank.html(data.data.card_info.bank_name);
                    $binId.val(data.data.card_info.id);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                isSend = false;
            },
            error : function() {
                isSend = false;
            }
        });
    });

    $cardNum.on('input', function () {
        $bank.html('');
        $bank.val('');
    });

    var isSubmit = false;
    $btnSubmit.click(function() {
        if (isSubmit || !checkForm(true)) {
            return false;
        }
        var cardValue = $.trim($cardNum.val());
        isSubmit = true;
        $.ajax({
            type : 'post',
            url  : '/account/ajaxAddBank/',
            data : {card_num : cardValue},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    window.plugins.toast.showShortCenter('添加成功！', function(){}, function(){});
                    window.history.go(-1);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                isSubmit = false;
            },
            error : function() {
                isSubmit = false;
            }
        });
    });
    //表单检测
    function checkForm(checkId) {
        var cardValue = $.trim($cardNum.val());
        if (!cardValue) {
            window.plugins.toast.showShortCenter('卡号不能为空！', function(){}, function(){});
            return false;
        } else if (cardValue.length > 19 || cardValue.length < 15) {
            window.plugins.toast.showShortCenter('卡号位数不正确，请认真核对！', function(){}, function(){});
            return false;
        }
        if (checkId) {
            var binId = $.trim($('#bin_id').val());
            if (!(binId > 0)) {
                window.plugins.toast.showShortCenter('暂不支持的银行卡！', function(){}, function(){});
                return false;
            }
        }
        return true;
    }
};

//更新密码
MyAccount.updatePassword = function(config) {
    var $el = config.$el;
    var $curPwd = $el.find('#cur_pwd');
    var $newPwd = $el.find('#new_pwd');
    var $rePwd  = $el.find('#re_pwd');
    var $btnSubmit = $('#btn_submit');

    var isSubmit = false;
    $btnSubmit.tap(function(){
        if (isSubmit || !confirmPassword()) {
            return false;
        }
        var curPwd = $curPwd.val();
        var newPwd = $newPwd.val();
        isSubmit = true;
        $.ajax({
            type : 'post',
            url : '/account/ajaxUpdatePwd/',
            data : {cur_pwd : curPwd,new_pwd : newPwd},
            dataType : 'json',
            success: function(data){
                if (data.errorCode == 0) {
                    window.plugins.toast.showShortCenter('修改密码成功！', function(){}, function(){});
                    window.history.go(-1);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('修改密码失败，请重试！', function(){}, function(){});
                }
                isSubmit = false;
            },
            error : function(){
                isSubmit = false;
            }

        });
    });
    function confirmPassword() {
        var curPwd = $curPwd.val();
        if (!curPwd || !(/^[a-z|A-Z|0-9]{6,12}$/.test(curPwd))) {
            window.plugins.toast.showShortCenter('请输入6－12位数字或字母的当前密码！', function(){}, function(){});
            return false;
        }
        var password = $newPwd.val();
        if (!password || !(/^[a-z|A-Z|0-9]{6,12}$/.test(password))) {
            window.plugins.toast.showShortCenter('请输入6－12位数字或字母的新密码！', function(){}, function(){});
            return false;
        }
        var rePassword = $rePwd.val();
        if (rePassword != password) {
            window.plugins.toast.showShortCenter('两次输入的密码不一致！', function(){}, function(){});
            return false;
        }
        return true;
    }
};

//更换手机号，获取旧手机验证码
MyAccount.changeMobileFirst = function(config) {
    var $el       = config.$el;
    var oldMobile = $el.find('#mobile').val();
    var $btnNext  = $el.find('#btn_next');
    var $codeOld  = $el.find('#code_old');
    //发送验证码
    $el.find('.getCode').on('tap', function(){
        sendCode($(this), oldMobile, 'old_mobile');
    });

    //验证验证码，进入下一步
    var startNext = false;
    $btnNext.on('tap', function(){
        var code = $.trim($codeOld.val());
        if (!confirmCode(code) || startNext) {
            return false;
        }
        startNext = true;
        $.ajax({
            type : 'post',
            url  : '/account/verifyCode/',
            data : {code : code, code_type : 'old_mobile'},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    $('#page_one').hide();
                    $('#page_two').show();
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                }
                startNext = false;
                isSend = false;
            },
            error : function() {
                startNext = false;
            }
        });
    });
};

//填写新手机，完成
MyAccount.changeMobileFinish = function(config) {
    var $el        = config.$el;
    var $btnFinish = $el.find('#btn_finish');
    var $codeNew   = $el.find('#code_new');
    var $newMobile = $el.find('#new_mobile');
    //发送验证码
    $el.find('.getCode').on('tap', function(){
        sendCode($(this), $.trim($newMobile.val()), 'new_mobile');
    });
    //点击完成按钮
    var startFinish = false;
    $btnFinish.on('tap', function(){
        var code = $.trim($codeNew.val());
        var newMobile = $.trim($newMobile.val());
        if (!confirmCode(code) || startFinish) {
            return false;
        }
        startFinish = true;
        $.ajax({
            type : 'post',
            url  : '/account/ajaxChangeMobile/',
            data : {code : code, telephone : newMobile},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    window.plugins.toast.showShortCenter('更换手机号成功！', function(){}, function(){});
                    window.history.go(-1);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
                }
                startFinish = false;
            },
            error : function() {
                startFinish = false;
            }
        });
    });
};

//发送验证码
var isSend = false;
var sendCode = function($this, mobile, code_type) {
    // 点击获取验证码
    var timer = null;
    var sec  = 60;
    if (isSend) {
        return false;
    }
    if (!mobile || !Util.isTel(mobile)) {
        window.plugins.toast.showShortCenter('请输入正确的手机号！', function(){}, function(){});
        return false;
    }
    isSend = true;
    $.ajax({
        type : 'post',
        url  : '/account/getCode/',
        data : {telephone : mobile, code_type : code_type},
        dataType : 'json',
        success : function(data) {
            if (data.errorCode == 0) {
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
            } else if (data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
            } else {
                window.plugins.toast.showShortCenter('验证码发送失败，请重试！', function(){}, function(){});
            }
        },
        error : function() {
            isSend = false;
        }
    });
};

var confirmCode = function (code) {
    if (!code) {
        window.plugins.toast.showShortCenter('验证码不能为空！' , function(){}, function(){});
        return false;
    }
    return true;
};

MyAccount.getDetail = function(config) {
    var $el = config.$el;
    var $noData = $('#js_no_data');
    var $loadMore = $('#js_load_more');
    var $loading = $('#js_loading');
    //取交易明细
    var getDetailList = function(params, success, error) {
        $.ajax({
            type : 'post',
            url  : '/account/ajaxDetail/',
            data : params,
            dataType : 'json',
            success : function(data) {
                success(data);
            },
            error : function(data) {
                error(data);
            }
        });
    };
    getDetailList({page : 1}, function(data) {
        $loading.hide();
        if (data.errorCode == 0) {
            if (data.data.detail_list.length > 0) {
                var html = DetailTpl(data.data);
                $el.html(html);
            } else {
                $noData.show();
            }
            if (data.data.has_more) {
                $loadMore.show();
            }
            $loadMore.data('page', data.data.page);
        } else if(data.errorMessage) {
            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
        }
    }, function(){
    });
    $loadMore.tap(function(){
        $(this).find('img').show();
        $(this).find('span').html('加载中...');
        getDetailList({page : $loadMore.data('page')}, function(data) {
            if (data.errorCode == 0) {
                if (data.data.detail_list.length > 0) {
                    var html = DetailTpl(data.data);
                    $el.append(html);
                }
                if (data.data.has_more) {
                    $loadMore.show();
                } else {
                    $loadMore.hide();
                }
                $loadMore.data('page', data.data.page);
            } else if(data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
            }
        }, function(){
        });
    });
};

//页面初始化函数
MyAccount.start = function(param) {
    Base.init(param);
};
