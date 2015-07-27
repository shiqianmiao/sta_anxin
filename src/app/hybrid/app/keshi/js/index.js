/**
 * @desc 问答页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-23
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var QuestionTpl = require('app/hybrid/app/keshi/tpl/question_list.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Hscroll = require('widget/Hscroll/js/Hscroll2.js');
var WaitLoading = require('widget/waitLoading/js/waitLoading.js');
var Question = exports;

var ajaxDataUrl = '';

var questionIds = '';
var minTime = 0;
var maxTime = 0;

Question.bindTopEvent = function(config) {
    var $el = config.$el;
    // 点击头部的全部按钮，展开隐藏导航
    $el.find('.show-all').on('tap', function(){
        $(this).find('img').toggleClass('rotate180');
        $('.top-nav').toggleClass('slide-show');
    });

    // 点击头部二维码btn，弹出二维码弹窗
    $el.find('.er-btn').on('tap', function(){
        alertWin('#er-window', '.er-close-mark');
    });

    $('.erpic').on('tap', function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    });
    // 弹窗
    function alertWin(winSelector, closeSelector){
        $(winSelector).removeClass('window-hide');
        $(closeSelector).on('tap', function(){
            $(winSelector).addClass('window-hide');
            $(closeSelector).off('tap');
        });
    }
};

Question.bindQuestionEvent = function(config) {
    var $el = config.$el;
    $el.css({height: $(window).height() - $('.header').height() - 60 + 'px'});
    // 只实例化对象不传配置参数的时候，指示做了一个模拟滚动，可以用来修复移动端fixed定位bug
    var hscroll = new Hscroll({
        refreshCallback : function(self){
            // 执行下拉刷新的操作
            getQuestion({question_ids : questionIds, min_time : minTime}, function(data){
                if (data.errorCode == 0) {
                    if (data.data.question_list.length > 0) {
                        questionIds  = data.data.question_ids;
                        minTime = data.data.min_time;
                        var html = QuestionTpl(data.data);
                        $('.ques-list').prepend(html);
                        $('#js_no_data').hide();
                    }
                } else if(data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                self.refreshEnd();
            }, function(){
                self.refreshEnd();
            });
        },
        loadMoreCallback : function(self){
            // 执行上拉加载更多的操作
            getQuestion({question_ids : questionIds, max_time : maxTime}, function(data){
                if (data.errorCode == 0) {
                    if (data.data.question_list.length > 0) {
                        questionIds  = data.data.question_ids;
                        maxTime = data.data.max_time;
                        var html = QuestionTpl(data.data);
                        $('.ques-list').append(html);
                    }
                    if (data.data.question_list.length < data.data.limit) {
                        self.changeTypeTo('onlyTop');
                    }
                } else if(data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                self.loadMoreEnd();
            }, function(){
                self.loadMoreEnd();
            });
        },
        // 选择您需要的加载类型【只要下拉刷新 - onlyTop 】【只要上拉加载更多 - onlyBottom 】【两个都要 - double 】【都不要 - none 】
        opationType : 'double'
    });

    var $alertDom = null;
    // 点击操作按钮时候
    $el.delegate('.opation-wrap','tap', function(event){
        // 先show所有
        $('.alert-opa').hide();
        $alertDom = $(this).find('.alert-opa');
        if($alertDom.data('show') == false){
            $alertDom.show();
            $alertDom.data('show', true);
        }else{
            $alertDom.hide();
            $alertDom.data('show', false);
        }

        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }

    });

    $(document).on('tap', function(){
        $('.alert-opa').hide();
        if($alertDom){
            $alertDom.data('show', false);
        }
    });

    //设置公开
    var sendPublic = false;
    $el.delegate('.to-public', 'tap', function(){
        if (sendPublic) {
            return false;
        }
        var $this = $(this);
        var open  = $this.data('open');
        var id    = $this.parents('li').data('id');
        sendPublic = true;
        $.ajax({
            type : 'post',
            url  : '/index/ajaxSetPublic/',
            data : {id : id, open : open},
            dataType : 'json',
            success : function (data) {
                if (data.errorCode == 0) {
                    $this.data('open', data.data.open);
                    $this.html(data.data.open_text);
                    window.plugins.toast.showShortCenter('设置成功', function(){}, function(){});
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                sendPublic = false;
            },
            error : function () {
                sendPublic = false;
            }
        });
    });

    //删除
    var sendDelete = false;
    $el.delegate('.to-delete', 'tap', function(){
        if (sendDelete) {
            return false;
        }
        var $this = $(this);
        var id    = $this.parents('li').data('id');
        sendDelete = true;
        $.ajax({
            type : 'post',
            url  : '/index/ajaxDelete/',
            data : {id : id},
            dataType : 'json',
            success : function (data) {
                if (data.errorCode == 0) {
                    $this.parents('li').remove();
                    window.plugins.toast.showShortCenter('删除成功', function(){}, function(){});
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                sendDelete = false;
            },
            error : function () {
                sendDelete = false;
            }
        });
    });

    // 点击回复按钮
    var questionId = 0;
    var $replyBox = $('.reply-box');
    var $replyInput = $replyBox.find('.reply-input');
    $el.delegate('.reply-num-btn','click', function(event){
        var $this = $(this);
        questionId = $this.parents('li').data('id');
        $replyBox.show();
        $replyInput.focus();
        // 失去焦点
        $replyInput.on('blur', function(){
            $replyBox.hide();
            $replyInput.off('blur');
        });
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    });

    var sendComment = false;
    $replyBox.find('.reply-btn').on('tap', function(){
        if (sendComment) {
            return false;
        }
        var content = $.trim($replyInput.val());
        if (!(questionId > 0) || !content) {
            window.plugins.toast.showShortCenter('参数错误', function(){}, function(){});
            return false;
        }
        sendComment = true;
        $.ajax({
            type : 'post',
            url  : '/index/ajaxAnswer/',
            data : {question_id : questionId, content : content},
            dataType : 'json',
            success : function (data) {
                if (data.errorCode == 0) {
                    $li = $el.find('li[data-id="' + questionId + '"]');
                    if ($li) {
                        $li.find('.answer-label').remove();
                        $li.find('.reply-num-btn').html('回复 ' + data.data.answer_count);
                    }
                    $replyInput.val('');
                    $replyInput.blur();
                    window.plugins.toast.showShortCenter('回复成功', function(){}, function(){});
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                sendComment = false;
            },
            error : function () {
                sendComment = false;
            }
        });
    });
};

//内部取问题函数
var getQuestion = function(params, success, error) {
    $.ajax({
        type : 'post',
        url  : ajaxDataUrl,
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


//js实现url跳转
Question.jsLinks = function (config) {
    var $elem = config.$el;
    $elem.delegate('[data-jslink]', 'click', function(e){
        //flag标记为1的元素不触发js链接跳转
        var $this = $(this);
        var $target = $(e.target);
        var flag = $target.data('flag');
        if (!flag) {
            var target = $this.data('target');
            var url = $this.data('jslink');
            if (url) {
                if (target == '_blank') {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            }
            return false;
        }
    });
};

//页面初始化函数
Question.start = function(param) {
    var WL = new WaitLoading();
    function showWaitLoad(){
        WL.init({
            color  : "#fff",
            width  : "100px",
            height : "100px",
            // type -> ['circle', 'chasingDots', 'cubeGrid', 'doubleBounce', 'fadingCircle'
            //          'pulse', 'rotatingPlane', 'threeBounce', 'wanderingCubes', 'wave'
            //          'wordpress']
            type : "circle",
            loadEnd : function(){
                WL.show();
            }
        });
    }
    showWaitLoad();
    ajaxDataUrl = param.ajaxDataUrl;
    //从localstorage 读取数据，实现页面快速展示
    if (localStorage.question) {
        var data = JSON.parse(localStorage.question);
        var html = QuestionTpl(data);
        $('#js_order_list').html(html);
        WL.hide();
    }
    getQuestion({question_ids : questionIds}, function(data) {
        if (data.errorCode == 0) {
            if (data.data.question_list.length > 0) {
                questionIds  = data.data.question_ids;
                minTime = data.data.min_time;
                maxTime = data.data.max_time;
                var html = QuestionTpl(data.data);
                $('.ques-list').html(html);
            } else {
                $('#js_no_data').show();
            }
        } else if(data.errorMessage) {
            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
        }
        WL.hide();
    }, function(){
        WL.hide();
    });
    Base.init(param);
};
