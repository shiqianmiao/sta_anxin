G.use(['zepto'], function(){
	
	// 点击接单模式按钮
	$('.on-off-btn').on('tap', function(){
		if($(this).data('default') == 'on'){
			$('.child-btn').addClass('btn-change');
			$('.on-off-btn').css({overflow:'hidden'});
			$(this).data('default', 'off');
		}else{
			$('.child-btn').removeClass('btn-change');
			$('.on-off-btn').css({overflow:'hidden'});
			$(this).data('default', 'on');
		}
		
	});


});