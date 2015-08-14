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
var Question = exports;

var ajaxDataUrl = '';

var questionIds = '';
var minTime = 0;
var maxTime = 0;

Question.bindTopEvent = function(config) {
    var $el = config.$el;
    // 点击头部的全部按钮，展开隐藏导航
    $el.find('.show-all').on('click', function(event){
        $(this).find('img').toggleClass('rotate180');
        $('.top-nav').toggleClass('slide-show');
    });
};

Question.bindQuestionEvent = function(config) {
    var $el = config.$el;
    //现在页面是不是公开问题页面，是的话，取消公开后，问题要从当前页面移除
    var isopen = $el.data('isopen');
    //数据载入中div
    var $loading  = $('#js_loadind');
    var $dataArea = $el.find('.ques-list');
    var $noData   = $el.find('#js_no_data');
    var $platform = $el.data('platform');
    //从localstorage载入数据
    if (localStorage.question) {
        var data = JSON.parse(localStorage.question);
        var html = QuestionTpl(data);
        $dataArea.html(html);
        $loading.hide();
    }
    $el.css({height: $(window).height() - $('.header').height() - 60 + 'px'});
    // 只实例化对象不传配置参数的时候，指示做了一个模拟滚动，可以用来修复移动端fixed定位bug
    var hscroll = new Hscroll({
        refreshCallback : function(self){
            // 执行下拉刷新的操作
            getQuestion({question_ids : questionIds, min_time : minTime}, function(data){
                if (data.errorCode == 0) {
                    if (data.data.question_list.length > 0) {
                        questionIds = data.data.question_ids;
                        minTime = data.data.min_time;
                        var html = QuestionTpl(data.data);
                        $dataArea.prepend(html);
                        $noData.hide();
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
                        $dataArea.append(html);
                    }
                    if (data.data.question_list.length < data.data.limit) {
                        //没有
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

    //载入初始问题数据
    getQuestion({question_ids : questionIds}, function(data) {
        if (data.errorCode == 0) {
            if (data.data.question_list.length > 0) {
                questionIds  = data.data.question_ids;
                minTime = data.data.min_time;
                maxTime = data.data.max_time;
                var html = QuestionTpl(data.data);
                $('.ques-list').html(html);
                localStorage.question = JSON.stringify(data.data);
                if (data.data.question_list.length < data.data.limit) {
                    hscroll.changeTypeTo('onlyTop');
                }
            } else {
                $('#js_no_data').show();
                $('.ques-list').html('');
                hscroll.changeTypeTo('onlyTop');
                localStorage.removeItem('question');
            }
            hscroll.refreshEnd();
        } else if(data.errorMessage) {
            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
        }
        $loading.hide();
    }, function(){
        $loading.hide();
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
        navigator.fixedInput.hide();
    });

    //设置公开
    var sendPublic = false;
    $el.delegate('.to-public', 'touchend', function(event){
        event.stopPropagation();
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
                    //当前页面是公开问题页面，且当前操作是取消公开
                    if (isopen && open == 2) {
                        $this.parents('li').remove();
                    } else {
                        $this.data('open', data.data.open);
                        $this.html(data.data.open_text);
                        $this.parents('.alert-opa').hide();
                        $this.parents('.alert-opa').data('show', false);
                    }
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
        event.preventDefault();
    });

    //删除
    var sendDelete = false;
    $el.delegate('.to-delete', 'touchend', function(event){
        event.stopPropagation();
        var $this = $(this);
        navigator.notification.confirm(
            '确定删除当前问题吗？', // message
            onConfirm,           // callback to invoke with index of button pressed
            '删除问题',           // title
            ['确定','取消']       // buttonLabels
        );
        event.preventDefault();
        function onConfirm(index) {
            //选择了确定
            if (index == 1) {
                if (sendDelete) {
                    return false;
                }
                var id     = $this.parents('li').data('id');
                sendDelete = true;
                $.ajax({
                    type : 'post',
                    url  : '/index/ajaxDelete/',
                    data : {id : id},
                    dataType : 'json',
                    success : function (data) {
                        if (data.errorCode == 0) {
                            $this.parents('li').remove();
                            $this.parents('.alert-opa').hide();
                            $this.parents('.alert-opa').data('show', false);
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
            } else {
                $('.alert-opa').hide();
                if($alertDom){
                    $alertDom.data('show', false);
                }
            }
        }
    });

    // 点击回复按钮
    var questionId = 0;
    var $replyBox = $('.reply-box');
    var $replyInput = $replyBox.find('.reply-input');
    $el.delegate('.reply-num-btn','click', function(event){
        var $this = $(this);
        var newQuestionId = $this.parents('li').data('id');
        if ($platform == 'ios') {
            if (questionId != newQuestionId) {
                questionId = newQuestionId;
            }
            navigator.fixedInput.showAndFocus(function(content){
                navigator.fixedInput.hide();
                ajaxSendReply(questionId, content, function(data){
                    var $li = $el.find('li[data-id="' + questionId + '"]');
                    if ($li) {
                        $li.find('.answer-label').remove();
                        $li.find('.reply-num-btn').html('回复 ' + data.data.answer_count);
                    }
                });
            }, "");
        } else {
            //与上次点的回复按钮不一样时，清空数据
            if (questionId != newQuestionId) {
                questionId = newQuestionId;
                $replyInput.val('');
            }
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
        }
    });

    $replyBox.find('.reply-btn').on('touchend', function(event){
        event.stopPropagation();
        var content = $.trim($replyInput.val());
        ajaxSendReply(questionId, content, function(data){
            var $li = $el.find('li[data-id="' + questionId + '"]');
            if ($li) {
                $li.find('.answer-label').remove();
                $li.find('.reply-num-btn').html('回复 ' + data.data.answer_count);
            }
            $replyInput.val('');
            $replyInput.blur();
        });
        event.preventDefault();
    });

    var sendComment = false;
    function ajaxSendReply(questionId, content, success) {
        if (sendComment) {
            return false;
        }
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
                    success(data);
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
    }
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

//页面初始化函数
Question.start = function(param) {
    ajaxDataUrl = param.ajaxDataUrl;
    //从localstorage 读取数据，实现页面快速展示
    Base.init(param);
};
