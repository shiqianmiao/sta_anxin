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
var Hscroll = require('widget/Hscroll/js/Hscroll2.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var Answer = exports;

//回答注意事项，展开收起，关闭
Answer.attention = function(config) {
    var $el = config.$el;
    // 点击第一个p标签的时候
    $el.find('.first-p').on('tap', function(){
        var $this = $(this);
        if($this.data('active')){
            $('.attention-p').css({height: '30px'});
        }else{
            $('.attention-p').css({height: $('.ap-wrap').height() + 'px'});
        }
        $this.data('active', !$this.data('active'));
        // 箭头方向
        $('.next-more').toggleClass('rotate180');
    });

    $('.attention-p').css({top: $('.header').height() + 'px'});
    // 当回复框获取焦点的时候
    $('.reply-input').on('focus', function(){
        // 显示提示
        $('.attention-p').css({opacity: '1', display: 'block'});
        // 设置高度
        $('#Hwrap').css({top: $('.header').height() + 30 + 'px'});
    });
    // 点击关闭注意事项叉叉时
    $el.find('.p-close').on('tap', function(event){
        var count = Cookie.get('attention_close_count');
        count = count ? parseInt(count) : 0;
        count = count + 1;
        Cookie.set('attention_close_count', count, {expires:3600 * 24 * 365, path: '/'});
        // 设置高度
        $('#Hwrap').css({top: $('.header').height() + 'px'});

        $('.attention-p').css({opacity: '0', height: '30px'});
        $('.first-p').data('active', false);
        // 箭头方向
        $('.next-more').removeClass('rotate180');
        setTimeout(function(){
            $('.attention-p').css({display: 'none'});
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

Answer.delegateDelete = function(config) {
    var $el = config.$el;
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
            if (index == 1) {
                sendDelete = true;
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

//安卓回复绑定函数
Answer.ardReply = function(config) {
    var $el = config.$el;
    var questionId = $el.data('id');
    //问题回复
    var $replyBox = $('.reply-box');
    var $replyInput = $replyBox.find('.reply-input');
    var $replyNum = $('.reply-title-num');
    $replyBox.find('.reply-btn').on('tap', function(){
        var content = $.trim($replyInput.val());
        ajaxSendReply(questionId, content, function(data){
            $replyNum.html('回复（' + data.data.answer_count + '）');
            $replyInput.val('');
            $replyInput.blur();
            //将回复内容添加到顶部
            var html = AnswerTpl(data.data);
            $('.reply-list').prepend(html);
            $('#js_no_reply').addClass('hide');
        });
    });
};
//ios回复绑定函数
Answer.iosReply = function(config) {
    var $el = config.$el;
    var questionId = $el.data('id');
    //问题回复
    var $replyNum = $('.reply-title-num');

    cordova.exec(function(content){
        ajaxSendReply(questionId, content, function(data){
            $replyNum.html('回复（' + data.data.answer_count + '）');
            //将回复内容添加到顶部
            var html = AnswerTpl(data.data);
            $('.reply-list').prepend(html);
            $('#js_no_reply').addClass('hide');
        });
    }, function(){}, "FixedInput", 'show');
};

var sendComment = false;
function ajaxSendReply (questionId, content, success) {
    if (sendComment) {
        return false;
    }
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

Answer.getAnswer = function(config) {
    var $el = config.$el;
    var questionId = $el.data('id');
    var page = 1;
    //从localstorage 读取数据，实现页面快速展示
    if (localStorage.answer) {
        var data = JSON.parse(localStorage.answer);
        var html = AnswerTpl(data);
        $el.html(html);
    }

    //内部取回答函数
    var isSend = false;
    var getAnswer = function(params, success, error) {
        if (isSend) {
            return false;
        }
        isSend = true;
        $.ajax({
            type : 'post',
            url  : '/index/ajaxGetAnswer/',
            data : params,
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    success(data);
                } else if(data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                }
                isSend = false;
            },
            error : function(data) {
                error(data);
                isSend = false;
            }
        });
    };

    // 只实例化对象不传配置参数的时候，指示做了一个模拟滚动，可以用来修复移动端fixed定位bug
    var hscroll = new Hscroll({
        loadMoreCallback : function(self){
            // 执行上拉加载更多的操作
            getAnswer({question_id : questionId, page : page}, function(data){
                if (data.data.answer_list.length > 0) {
                    var html = AnswerTpl(data.data);
                    $el.append(html);
                    Base.bindDomWidget($el);
                }
                page = data.data.page;
                if (!data.data.has_more) {
                    hscroll.changeTypeTo('none');
                }
                self.loadMoreEnd();
            }, function(data){
                self.loadMoreEnd();
            });

        },
        // 选择您需要的加载类型【只要下拉刷新 - onlyTop 】【只要上拉加载更多 - onlyBottom 】【两个都要 - double 】【都不要 - none 】
        opationType : 'onlyBottom'

    });

    getAnswer({question_id : questionId, page : page}, function(data){
        //更新页码
        page = data.data.page;
        //有数据
        if (data.data.answer_list.length > 0) {
            var html = AnswerTpl(data.data);
            $el.html(html);
            Base.bindDomWidget($el);
        } else {
            //显示无数据样式
            $('#js_no_reply').removeClass('hide');
        }
        //没有更多回答时，禁用上拉加载
        if (!data.data.has_more) {
            hscroll.changeTypeTo('none');
        }
        $('#js_loadind').hide();
        hscroll.refreshEnd();
    }, function(data){
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

//页面初始化函数
Answer.start = function(param) {
    $('#Hwrap').css({top: $('.header').height() + 'px'});
    Base.init(param);
};
