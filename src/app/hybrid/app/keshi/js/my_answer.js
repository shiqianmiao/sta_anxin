/**
 * @desc 问答页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-23
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var MyAnswerTpl = require('app/hybrid/app/keshi/tpl/my_answer.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var MyAnswer = exports;

//内部取问题函数
var getQuestion = function(params, success, error) {
    $.ajax({
        type : 'post',
        url  : '/my/ajaxMyAnswer/',
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

MyAnswer.getAnswerRecord = function(config) {
    Base.jsLinks(config);
    var $el = config.$el;
    var workerId  = $el.data('worker_id');
    var $loadMore = $('#js_load_more');
    var $noData   = $('#js_no_data');
    var $loading  = $('#js_loadind');
    //从localstorage 读取数据，实现页面快速展示
    if (localStorage.my_answer) {
        var data = JSON.parse(localStorage.my_answer);
        var html = MyAnswerTpl(data);
        $el.html(html);
        $loading.hide();
    }
    getQuestion({page : 1, worker_id : workerId}, function(data) {
        if (data.errorCode == 0) {
            if (data.data.question_list.length > 0) {
                var html = MyAnswerTpl(data.data);
                $el.html(html);
            } else {
                $noData.removeClass('hide');
            }
            if (data.data.has_more) {
                $loadMore.removeClass('hide');
            }
            $loadMore.data('page', data.data.page);
        } else if(data.errorMessage) {
            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
        }
        $loading.hide();
    }, function(){
        $loading.hide();
    });

    $loadMore.click(function(){
        $(this).find('img').show();
        $(this).find('span').html('加载中...');
        getQuestion({page : $loadMore.data('page'), worker_id : workerId}, function(data) {
            if (data.errorCode == 0) {
                if (data.data.question_list.length > 0) {
                    var html = MyAnswerTpl(data.data);
                    $el.append(html);
                }
                if (data.data.has_more) {
                    $loadMore.removeClass('hide');
                } else {
                    $loadMore.addClass('hide');
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
MyAnswer.start = function(param) {
    Base.init(param);
};
