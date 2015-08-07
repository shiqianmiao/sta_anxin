/**
 * @desc 我的团队页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-23
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var CustomerTpl = require('app/hybrid/app/keshi/tpl/customer_list.tpl');
var MemberTpl = require('app/hybrid/app/keshi/tpl/member_list.tpl');
var DetailTpl = require('app/hybrid/app/keshi/tpl/keshi_account_detail_list.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var MyTeam = exports;

MyTeam.getCustomer = function(config) {
    var $el = config.$el;
    var $dataArea = $el.find('ul');
    var $noData = $el.find('.js_no_data');
    var $loadMore = $el.find('#js_load_more');
    var $loading = $el.find('.js_loadind');
    var page = 1;

    //请求是否已发送
    var send = false;
    var getCustomer = function(params, success, error) {
        if (send) {
            return false;
        }
        send = true;
        $.ajax({
            type : 'post',
            url  : '/keshi/ajaxGetCustomer/',
            data : params,
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    success(data.data);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试', function(){}, function(){});
                }
                send = false;
            },
            error : function(data) {
                error(data);
                send = false;
            }
        });
    };
    getCustomer({page : page}, function(data){
        $loading.hide();
        if (data.customer_list.length > 0) {
            var html = CustomerTpl(data);
            $dataArea.html(html);
        } else {
            $noData.removeClass('hide');
        }
        if (data.has_more) {
            $loadMore.removeClass('hide');
        }
        page = data.page;
    }, function(data){
    });

    $loadMore.tap(function(){
        $loadMore.find('img').show();
        $loadMore.find('span').html('加载中...');
        getCustomer({page : page}, function(data){
            $loadMore.find('img').hide();
            $loadMore.find('span').html('加载更多');
            if (data.customer_list.length > 0) {
                var html = CustomerTpl(data);
                $dataArea.append(html);
            }
            if (!data.has_more) {
                $loadMore.addClass('hide');
            }
            page = data.page;
        }, function(data){
        });
    });
};

MyTeam.getMember = function(config) {
    var $el = config.$el;
    var $dataArea = $el.find('ul');
    var $noData = $el.find('.js_no_data');
    var getMember = function(params, success, error) {
        $.ajax({
            type : 'post',
            url  : '/keshi/ajaxGetMember/',
            data : params,
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    success(data.data);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试', function(){}, function(){});
                }
            },
            error : function(data) {
                error(data);
            }
        });
    };

    getMember({page : 1}, function(data){
        if (data.worker_list.length > 0) {
            var html = MemberTpl(data);
            $dataArea.html(html);
        } else {
            $noData.removeClass('hide');
        }
        if (data.has_more) {
            //$loadMore.removeClass('hide');
        }
        //$loadMore.data('page', data.data.page);
    }, function(data){

    });
};

MyTeam.tab = function(config) {
    var $el = config.$el;
    $tabBtn = $el.find('.tab-btn');
    // 点击切换团队与患者
    $tabBtn.on('tap', function(){
        $tabBtn.removeClass('active');
        $(this).addClass('active');

        var selector = '.' + $(this).data('type') + '-list';

        $('.tablist').hide();
        $(selector).show();
    });
};

MyTeam.getAccountDetail = function(config) {
    var $el = config.$el;
    var $noData = $('#js_no_data');
    var $loadMore = $('#js_load_more');
    var $loading  = $('#js_loadind');
    //取交易明细
    var getDetailList = function(params, success, error) {
        $.ajax({
            type : 'post',
            url  : '/keshi/ajaxAccountDetail/',
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
            $loading.hide();
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
MyTeam.start = function(param) {
    Base.init(param);
};
