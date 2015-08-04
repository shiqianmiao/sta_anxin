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
var Widget = require('com/mobile/lib/widget/widget.js');
var MyTeam = exports;

MyTeam.getCustomer = function(config) {
    var $el = config.$el;
    var getCustomer = function(params, success, error) {
        $.ajax({
            type : 'post',
            url  : '/keshi/ajaxGetCustomer/',
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
    getCustomer({page : 1}, function(data){
        if (data.data.customer_list.length > 0) {
            var html = CustomerTpl(data.data);
            $el.html(html);
        } else {
            //$noData.removeClass('hide');
        }
        if (data.data.has_more) {
            //$loadMore.removeClass('hide');
        }
        //$loadMore.data('page', data.data.page);
    }, function(data){

    });
};

MyTeam.getMember = function(config) {
    var $el = config.$el;
    var getMember = function(params, success, error) {
        $.ajax({
            type : 'post',
            url  : '/keshi/ajaxGetMember/',
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

    getMember({page : 1}, function(data){
        if (data.data.worker_list.length > 0) {
            var html = MemberTpl(data.data);
            $el.html(html);
        } else {
            //$noData.removeClass('hide');
        }
        if (data.data.has_more) {
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
}

//页面初始化函数
MyTeam.start = function(param) {
    Base.init(param);
};
