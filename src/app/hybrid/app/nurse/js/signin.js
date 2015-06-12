G.use(['zepto'], function(){
	// 点击记住密码
	$('.keep-pwd').on('tap', function(){
		if(Boolean($(this).data('keep'))){
			$(this).find('.radio-span').removeClass('active');
			$(this).data('keep', false);
		}else{
			$(this).find('.radio-span').addClass('active');
			$(this).data('keep', true);
		}
		
	});
});