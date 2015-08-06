/**
 * @desc 问题详情页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-23
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var AnswerTpl = require('app/hybrid/app/keshi/tpl/answer_list.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Swiper = require('lib/swiper/swiper.min.js');
var Answer = exports;

//回答注意事项，展开收起，关闭
Answer.attention = function(config) {
    var $el = config.$el;
    // 点击第一个p标签的时候
    $el.find('.first-p').on('tap', function(){
        $el.toggleClass('show');
    });
    // 点击关闭注意事项叉叉时
    $el.find('.p-close').on('tap', function(event){
        $el.css({opacity: '0'});
        setTimeout(function(){
            $el.css({display: 'none'});
        }, 300);
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    });
};

Answer.bindQuestionEvent = function(config) {
    var $el = config.$el;
    var $alertDom = null;
    var id = $el.data('id');
    // 点击操作按钮时候
    $el.find('.opation-wrap').on('tap', function(event){
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

    //点击别处，操作选项收起
    $(document).on('tap', function(){
        $('.alert-opa').hide();
        if($alertDom){
            $alertDom.data('show', false);
        }
    });

    // 点击患者详情
    $el.find('.hz-info-title').on('tap', function(){
        $el.find('.info-txt').toggleClass('hide');
        $el.find('.jiao').toggleClass('rotate45');
    });

    //设置公开
    var sendPublic = false;
    $el.find('.to-public').on('tap', function(){
        if (sendPublic) {
            return false;
        }
        var $this = $(this);
        var open  = $this.data('open');
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
    $el.find('.to-delete').on('tap', function(){
        if (sendDelete) {
            return false;
        }
        var $this = $(this);
        navigator.notification.confirm(
            '确定删除当前问题吗？', // message
            onConfirm,           // callback to invoke with index of button pressed
            '删除问题',           // title
            ['确定','取消']       // buttonLabels
        );
        function onConfirm(index) {
            if (index == 1) {
                sendDelete = true;
                $.ajax({
                    type : 'post',
                    url  : '/index/ajaxDelete/',
                    data : {id : id},
                    dataType : 'json',
                    success : function (data) {
                        if (data.errorCode == 0) {
                            window.plugins.toast.showShortCenter('删除成功', function(){}, function(){});
                            window.history.go(-1);
                        } else if (data.errorMessage) {
                            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                        }
                        sendDelete = false;
                    },
                    error : function () {
                        sendDelete = false;
                    }
                });
            }
        }
    });
};

Answer.bindAnswerEvent = function(config) {
    var $el = config.$el;
    var questionId = $el.data('id');
    //问题回复
    var $replyBox = $('.reply-box');
    var $replyInput = $replyBox.find('.reply-input');
    var sendComment = false;
    $replyBox.find('.reply-btn').on('tap', function(){
        if (sendComment) {
            return false;
        }
        var content = $.trim($replyInput.val());
        if (!content) {
            window.plugins.toast.showShortCenter('回复内容不能为空！', function(){}, function(){});
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
                    $el.find('.reply-title-num').html('回复（' + data.data.answer_count + '）');
                    $replyInput.val('');
                    $replyInput.blur();
                    //将回复内容添加到顶部
                    var html = AnswerTpl(data.data);
                    $el.find('ul').prepend(html);
                    $('#js_no_reply').addClass('hide');
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

    //删除
    var sendDelete = false;
    $el.delegate('.delete-btn', 'tap', function(){
        if (sendDelete) {
            return false;
        }
        var $this = $(this);
        var answerId = $this.data('id');
        navigator.notification.confirm(
            '确定删除该回答吗？', // message
            onConfirm,           // callback to invoke with index of button pressed
            '删除回答',           // title
            ['确定','取消']       // buttonLabels
        );
        function onConfirm(index) {
            sendDelete = true;
            if (index == 1) {
                $.ajax({
                    type : 'post',
                    url  : '/index/ajaxDeleteAnswer/',
                    data : {answer_id : answerId},
                    dataType : 'json',
                    success : function (data) {
                        if (data.errorCode == 0) {
                            $this.parents('li').remove();
                            $el.find('.reply-title-num').html('回复（' + data.data.answer_count + '）');
                            if (data.data.answer_count == 0) {
                                $('#js_no_reply').removeClass('hide');
                            }
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
            }
        }
    });
};

Answer.getAnswer = function(config) {
    var $el = config.$el;
    var questionId = $el.data('id');
    //从localstorage 读取数据，实现页面快速展示
    if (localStorage.answer) {
        var data = JSON.parse(localStorage.answer);
        var html = AnswerTpl(data);
        $el.html(html);
    }
    getAnswer({question_id : questionId}, function(data){
        if (data.errorCode == 0) {
            if (data.data.answer_list.length > 0) {
                var html = AnswerTpl(data.data);
                $el.html(html);
                Base.bindDomWidget($el);
                if (data.data.has_more) {
                    $('#js_load_more').removeClass('hide');
                    $('#js_load_more').data('page', data.data.page);
                }
            } else {
                $('#js_no_reply').removeClass('hide');
            }
        } else if(data.errorMessage) {
            window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
        }
    }, function(data){
    });
    //加载更多
    var sendMore = false;
    var $loadMore = $('#js_load_more');
    $loadMore.on('tap', function(){
        if (sendMore) {
            return false;
        }
        var page = $(this).data('page');
        if (page > 0) {
            sendMore = true;
            $loadMore.find('img').show();
            $loadMore.find('span').html('加载中...');
            getAnswer({question_id : questionId, page : page}, function(data){
                if (data.errorCode == 0) {
                    $loadMore.find('img').hide();
                    $loadMore.find('span').html('加载更多');
                    if (data.data.answer_list.length > 0) {
                        var html = AnswerTpl(data.data);
                        $el.append(html);
                        Base.bindDomWidget($el);
                        $loadMore.data('page', data.data.page);
                    }
                    if (data.data.has_more) {
                        $loadMore.removeClass('hide');
                    } else {
                        $loadMore.addClass('hide');
                    }
                } else if(data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                sendMore = false;
            }, function(data){
                sendMore = false;
                $loadMore.find('img').hide();
                $loadMore.find('span').html('加载更多');
            });
        } else {
            window.plugins.toast.showShortCenter('参数错误！', function(){}, function(){});
        }
    });
};

Answer.swipeImg = function(config) {
    var $el = config.$el;
    // 处理图像
    $el.find('.change-bg-pic').each(function(i, o){
        var sourceUrl = 'url(' + $(this).data('url') + ') no-repeat center center';
        $(this).css({background: sourceUrl, backgroundSize: 'cover'});
    });

    var preArr = [];
    var nextArr = [];
    var $piclist = null;
    var thisSort = 0;
    // 当点击图片的时候
    $el.find('.per-pic').on('click', function(){
        // 初始化查看图片的滚动
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        });
        $('.swiper-container').show();
        // 收集该图片集的所有图片
        $piclist = $(this).parent().find('.per-pic');
        preArr = [];
        nextArr = [];
        thisSort = $(this).data('sort');
        $('.swiper-wrapper').append('<div class="swiper-slide flex-center"><img src="' + $(this).data('url') + '" /></div>');

        $piclist.each(function(i, o){
            if(i < thisSort){
                preArr.push('<div class="swiper-slide flex-center"><img src="' + $(o).data('url') + '" /></div>');
            }else if(i > thisSort){
                nextArr.push('<div class="swiper-slide flex-center"><img src="' + $(o).data('url') + '" /></div>');
            }
        });

        if(preArr.length != 0){
            swiper.prependSlide(preArr.reverse());
        }
        if(nextArr.length != 0){
            swiper.appendSlide(nextArr);
        }

        $('.swiper-container').on('click', function(){
            $(this).hide();
            $('.swiper-wrapper').empty();
            swiper.destroy();
            $('.swiper-container').off('click');
        });

    });
};

//内部取回答函数
var getAnswer = function(params, success, error) {
    $.ajax({
        type : 'post',
        url  : '/index/ajaxGetAnswer/',
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
Answer.start = function(param) {
    Base.init(param);
};
