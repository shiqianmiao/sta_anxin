G.use(['zepto'], function(){
	// 点击获取验证码
	$('.getCode').on('tap', getCodeFn);

	// 获取验证码的函数
	function getCodeFn(){
		var sec = 60,
			self = this,
			timer = null;
		$(this).addClass('getCodeing');
		$(this).off('tap');
		$(this).html(sec + '秒');

		timer = setInterval(function(){
			if(sec != 0){
				sec--;
				$(self).html(sec + '秒');
			}else{
				clearInterval(timer);
				$(self).removeClass('getCodeing');
				$(self).on('tap', getCodeFn);
				$(self).html('重新获取');
			}
			
		}, 1000);

		// 在这里发送ajax请求

	}


});