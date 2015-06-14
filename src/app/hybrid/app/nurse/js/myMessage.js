G.use(['zepto'], function(){
	// 加载更多
	$('.load-more').on('touchend', function () {
		$(this).find('img').show();
		$(this).find('span').html('加载中...');
		// 发送ajax请求
		
	});
	
});