var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var HybridAPI = require('app/client/common/lib/api/index.js');

var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var httpApi = new HTTPApi({
    path: '/webapp/jr'
});

exports.goUrl = function(config) {
    $(config.$toUrl).on('click', function(e) {
        e.preventDefault();
        var url = $(this).data('url');
        Util.redirect(url);
    });
};

exports.detailBuy = Widget.define({
    events: {
        'click [data-role="month"]': 'changeMonth',
        'click [data-role="confirm"]': 'confirm'
    },
    init: function(config) {
        this.config = config;

        this.totalPrice = config.totalPrice - 0;
        this.totalMonth = config.$month.filter('.active').data('value') - 0;
        this.downPay = config.$downPay.filter('.active').data('value') - 0 || 0;

        this.calPayment();
    },
    changeMonth: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        this.config.$month.removeClass('active');
        $target.addClass('active');

        this.totalMonth = $target.data('value') - 0;
        this.calPayment();
    },
    confirm: function(e) {
        e.preventDefault();
        var url = 'app/client/app/finance/fenqi/controller/apply.js';
        url += '?total_month=' + this.totalMonth;
        url += '&down_pay=' + this.downPay;
        url += '&product_id=' + this.config.productId;

        HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
            if (!userInfo) {
                url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(url);
            }
            Util.redirect(url);
        });
    },
    calPayment: function() {
        var monthPayment = ((this.totalPrice - this.downPay) * 1.01 / this.totalMonth).toFixed(2);

        this.config.$monthPayment.text(monthPayment);
        this.config.$totalMonth.text(this.totalMonth);
    }
});

var allDatas = {};
exports.validForm = function(config) {
    require.async('com/mobile/widget/form2/form.js', function(BaseForm) {
        var initForm = BaseForm.extend({
            events: {
                'change [data-role="field"]': function(e) {
                    var trigger = $(e.currentTarget).data('trigger');
                    if (trigger === 'change') {
                        var name = $(e.currentTarget).data('name');
                        this.validateField(name);
                    }
                },
                // 离开某个字段
                'blur [data-role="field"]': function(e) {
                    if ($(e.target).hasClass('input-file')) {
                        return;
                    }

                    var trigger = $(e.currentTarget).data('trigger');

                    if (trigger !== 'change') {
                        var name = $(e.currentTarget).data('name');
                        this.validateField(name);
                    }
                },
                'click [data-role="prev"]': function(e) {
                    e.preventDefault();
                    var curStep = this.config.step;
                    var prevStep = this.config.step - 1;
                    if ($('#validatorConfig' + prevStep).length) {
                        $('#validatorConfig' + curStep).hide();
                        $('#validatorConfig' + prevStep).show();
                    }
                },
                // 表单验证正确
                'form-valid': function() {
                    allDatas = $.extend(allDatas, this.getValues());

                    var curStep = this.config.step;
                    var nextStep = this.config.step - 0 + 1;

                    if (curStep - 0 === 1) {
                        if (!$('#argeements').prop('checked')) {
                            Util.toast('请先阅读并勾选同意注册协议', 2000);
                            return false;
                        }
                    }

                    if ($('#validatorConfig' + nextStep).length) {
                        $('#validatorConfig' + curStep).hide();
                        $('#validatorConfig' + nextStep).show();
                    }

                    var targtAddress1, targtAddress2;
                    if (curStep - 0 === 4) {
                        targtAddress1 = '';
                        $('#personLocation select').each(function() {
                            var curVal = $(this).val();
                            if (curVal) {
                                targtAddress1 += $(this).find('option[value="' + curVal + '"]').text();
                            }
                        });

                        targtAddress1 += $('#person_address').val();

                        targtAddress2 = '';
                        $('#companyLocation select').each(function() {
                            var curVal = $(this).val();
                            if (curVal) {
                                targtAddress2 += $(this).find('option[value="' + curVal + '"]').text();
                            }
                        });

                        targtAddress2 += $('#company_address').val();

                        var targetOption = '<option value="' + targtAddress1 + '">' + targtAddress1 + '</option>';
                        targetOption += '<option value="' + targtAddress2 + '">' + targtAddress2 + '</option>';

                        $('#target_address').html(targetOption);

                        $('#target_name').val($('#person_name').val());
                        $('#target_phone').val($('#phone').val());
                    }

                    if (curStep - 0 === 5) {
                        if (this.hasSubmit) {
                            return false;
                        }

                        this.hasSubmit = true;

                        httpApi.request('POST', {
                                'interface': 'FenqiApplySubmit'
                            }, '/fenqi/apply/submit', allDatas)
                            .done(function(data) {

                                if (data.status === 463 || data.status === 403) {
                                    Util.toast('请重新登录', 2000);
                                    setTimeout(function() {
                                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(window.location.hash
                                            .slice(1));
                                        Util.redirect(url);
                                    }, 2000);

                                    return false;
                                }

                                if (!data.status) {
                                    Util.redirect('app/client/app/finance/fenqi/controller/apply_succ.js?product_id=' + allDatas.product_id + '&apply_no=' + allDatas.apply_no);
                                } else {
                                    Util.toast('申请提交出错', 2000);
                                }
                            });
                    }
                }
            },
            init: function(config) {
                this.super_.init.call(this, config);
            }
        });

        initForm(config);
    });
};

exports.validCardId = function(value, args, callback) {
    value = (value + '').split('');
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
    var sum = 0,
        err = null,
        validCode = value[17]; // 声明加权求和变量
    if (value[17].toLowerCase() === 'x') {
        validCode = 10; // 将最后位为x的验证码替换为10方便后续操作
    }

    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * value[i]; // 加权求和
    }
    var valCodePosition = sum % 11; // 得到验证码所位置
    if (validCode - 0 !== ValideCode[valCodePosition] - 0) {
        err = new Error('身份证号格式不正确');
    }
    callback(err);
};

exports.selectCity = function(config) {
    var $citySelect = config.$el.find('.js-city');
    var $distirctSelect = config.$el.find('.js-distirct');

    config.$el.find('.js-province').on('change', function() {
        var id = $(this).val();
        var cityHtml = '<option value="">请选择城市</option>';
        var districtHtml = '<option value="">请选择城区</option>';

        httpApi.request('GET', {
            'interface': 'FenqiGetCityByProvince'
        }, '/fenqi/geo/getCityByProvince', {
            id: id
        }).done(function(data) {
            if (data.status === 463 || data.status === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(window.location.hash.slice(
                        1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }
            if (!data.status) {
                var citys = data.data;

                var curCity = $citySelect.data('select');
                $citySelect.data('select', 0);

                citys.forEach(function(item) {
                    if (curCity && curCity + '' === item.id) {
                        cityHtml += '<option selected="selected" value="' + item.id + '">' + item.name + '</option>';
                    } else {
                        cityHtml += '<option value="' + item.id + '">' + item.name + '</option>';
                    }
                });
                $citySelect.html(cityHtml);

                var curDist = $distirctSelect.data('select');
                if (curDist) {
                    $citySelect.trigger('change');
                } else {
                    $distirctSelect.html(districtHtml);
                }
            }
        });
    });

    $citySelect.on('change', function() {
        var id = $(this).val();
        var districtHtml = '<option value="">请选择城区</option>';

        httpApi.request('GET', {
            'interface': 'FenqiGetDistrictByCity'
        }, '/fenqi/geo/getDistrictByCity', {
            id: id
        }).done(function(data) {
            if (!data.status) {
                var citys = data.data;

                var curDist = $distirctSelect.data('select');
                $distirctSelect.data('select', 0);

                citys.forEach(function(item) {
                    if (curDist && curDist + '' === item.id) {
                        districtHtml += '<option selected="selected" value="' + item.id + '">' + item.name + '</option>';
                    } else {
                        districtHtml += '<option value="' + item.id + '">' + item.name + '</option>';
                    }

                });

                $distirctSelect.html(districtHtml);
            }
        });
    });

    if (config.$el.find('.js-province').val()) {
        config.$el.find('.js-province').trigger('change');
    }
};

exports.bindPhone = function(config) {
    var timer = null;

    var start = function() {
        var totalTime = 60;
        timer = setInterval(function() {
            var text = '重新获取验证码';
            if (totalTime < 1) {
                clearInterval(timer);
                config.$send.removeClass('disabled');
            } else {
                totalTime -= 1;
                text = totalTime + '秒';
            }

            config.$send.text(text);
        }, 1000);
    };

    var sendCode = function() {
        var params = {
            card_id: $('#card_id').val(),
            apply_no: $('#apply_no').val(),
            phone: $('#phone').val(),
            time: new Date().getTime(),
            user_id: $('#user_id').val()
        };

        httpApi.request('GET', {
                'interface': 'FenqiApplyPhoneCode'
            }, '/fenqi/apply/phoneCode', params)
            .done(function(data) {
                if (data.status === 463 || data.status === 403) {
                    Util.toast('请重新登录', 2000);
                    setTimeout(function() {
                        var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(window.location.hash.slice(
                            1));
                        Util.redirect(url);
                    }, 2000);

                    return false;
                }

                if (!data.status) {
                    $('#phone').trigger('field-valid');
                    config.$send.addClass('disabled');
                    start();
                } else {
                    config.$send.removeClass('disabled');
                    var err = new Error(data.message);
                    Util.toast(data.message, 2000);
                    $('#phone').trigger('field-error', err);
                }
            });
    };

    var $field = config.$send.parents('[data-role="field"]');
    var clickTimer = null;
    config.$send.on('click', function(e) {
        e.preventDefault();
        var that = this;
        if ($(this).hasClass('disabled')) {
            return false;
        }
        $(this).addClass('disabled');

        clearTimeout(clickTimer);

        clickTimer = setTimeout(function() {
            if ($field.hasClass('has-warning')) {
                $(that).removeClass('disabled');
            } else {
                sendCode();
            }
        }, 100);
    });
};

exports.validAuthCode = function(value, args, callback) {
    var err = null;
    var params = {
        card_id: $('#card_id').val(),
        phone: $('#phone').val(),
        time: new Date().getTime(),
        phone_code: value,
        apply_no: $('#apply_no').val(),
        user_id: $('#user_id').val()
    };

    httpApi.request('GET', {
            'interface': 'FenqiApplyPhoneCodeValidate'
        }, '/fenqi/apply/phoneCodeValidate', params)
        .done(function(data) {
            if (data.status === 463 || data.status === 403) {
                Util.toast('请重新登录', 2000);
                setTimeout(function() {
                    var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent(window.location.hash.slice(
                        1));
                    Util.redirect(url);
                }, 2000);

                return false;
            }

            if (data.status) {
                err = new Error(data.message);
            } else {
                $('#phone_code').prop('readonly', true);
            }
            callback(err);
        });
};

exports.initSelect = function(config) {
    config.$el.find('[data-select]').each(function() {
        var val = $(this).data('select') + '';
        if (val) {
            $(this).find('option').each(function() {
                if ($(this).attr('value') === val) {
                    $(this).prop('selected', true);
                    return false;
                }
            });
        }
    });
};

exports.validPhoneCompare = function(value, args, callback) {
    var allPhone = {
        phone: $('#phone').val(),
        other_phone: $('#other_phone').val(),
        direct_phone: $('#direct_phone').val()
    };

    var count = 0,
        err = null;

    $.each(allPhone, function(key, v) {
        if (v && v + '' === value + '') {
            count += 1;
        }
    });

    $('#other_phone').on('change', function() {
        if ($('#direct_phone').val()) {
            $('#direct_phone').trigger('reValid');
        }
    });

    $('#direct_phone').on('change', function() {
        if ($('#other_phone').val()) {
            $('#other_phone').trigger('reValid');
        }
    });


    if (count > 1) {
        err = new Error('本人、直系及其它亲属手机号不能相同');
    }

    callback(err);
};

exports.hideAgreement = function(config) {
    config.$btn.on('click', function() {
        config.$el.hide();
        $('#formWarpper').show();

        var now = new Date().getTime();
        $('#agree_time').val(now);
    });
};
