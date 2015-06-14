G.use(['zepto'], function(){
	
	//点击选择男女
	$('.sex .radio-sec').on('tap', function(){
		$('.sex .radio-sec').removeClass('active');
		$(this).addClass('active');
	});

	// 点击叉号按钮，清空input值
	$('.clear-txt').on('tap', function(){
		$(this).parent().find('input').val('');
		$(this).hide();
	});
	$('.value-input').on('keyup', function(){
		if($.trim($(this).val()) != ''){
			$(this).parent().find('.clear-txt').show();
		}
	});


});