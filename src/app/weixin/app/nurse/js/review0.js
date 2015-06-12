var $ = require('$');
var Comment = exports;
var module = '';

Comment.init = function() {
	var baseUrl = 'http://s1.anxinsta.com';
	// 当点击星号的时候
	$('.per-stars').on('touchend', function(){
		// 让当前的星星和前面的所有星星变亮
		var allStar = $(".per-stars");
		var curIndex = $(this).data("num");
		for(var i=0;i<allStar.length;i++) {
			if(i < curIndex) {
				$(allStar[i]).find('img').attr('src', 'http://s1.anxinsta.com/app/weixin/app/nurse/imgs/stars_ing.png').addClass('t');
			} else {
				$(allStar[i]).find('img').attr('src','http://s1.anxinsta.com/app/weixin/app/nurse/imgs/stars.png').removeClass('t');
			}
		}
		// 让后面的星星熄灭
		$(this).next().find('img').attr('src','http://s1.anxinsta.com/app/weixin/app/nurse/imgs/stars.png').removeClass('t');

		var score = Comment.checkStars(),
			contentLength = $("#content").val().length;
		if(score && contentLength <= 100) {
			// 如果有星星变点亮，且评论内容不为空,提交按钮释放，变为可用
			$('.commit').addClass('commit-true');
			$('.commit').attr('disabled', false);
		} else {
			$('.commit').attr('disabled', true);
            $('.commit').removeClass('commit-true');
		}

	});

	$("#content").on('keyup', function() {
		var score = Comment.checkStars(),
			contentLength = $("#content").val().length;

		if(score && contentLength <= 100) {
			// 如果有星星变点亮，且评论内容不为空,提交按钮释放，变为可用
			$('.commit').addClass('commit-true');
			$('.commit').attr('disabled', false);
		} else {
			$('.commit').attr('disabled', true);
            $('.commit').removeClass('commit-true');
		}
	});
	// 点击提交按钮获取选择星星数量
	$('.commit').on('touchend', function(){
		console.log('abc');
		var score = Comment.checkStars(),
			content = $("#content").val(),
			orderId= $("#order_id").val();
		$.ajax({
            type : 'POST',
            url  : '/comment/add',
            data : {score : score, content : content, order_id : orderId, yl_weixin_id: YL.ylWeixinId},
            dataType : 'json',
            success:function(data){
                if (data.status > 0) {
                    Comment.alertWin('mark', 'success-win');
                    $('.commit').attr('disabled', true);
                    $('.commit').removeClass('commit-true');
                    setTimeout(function() {
            			window.location.href = '/order/my';
        			}, 1000);
                } else {
                	alert(data.msg);
                }
            },
            error:function(data){
                alert('服务器繁忙稍后重试!');
            }
        });
	});
};

// 获取点击了几个星星的方法
Comment.checkStars = function(){
	return $('.t').length;
}

// 显示弹窗的方法
/**
* @desc 显示弹窗的方法
* @param markClass	遮罩的class
* @param winId	弹窗ID
*/
Comment.alertWin = function(markClass, winId){
	// 显示遮罩和弹窗
	$('.' + markClass).show().on('click',close);
	$('#' + winId).show().on('click',close);
	// 关闭弹窗的方法
	function close(){
		$('.' + markClass).hide().off('click',close);
		$('#' + winId).hide().off('click',close);
	}
}
