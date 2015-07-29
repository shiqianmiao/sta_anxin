
var Halert = require('widget/Halert/js/Halert.js');
var DateSel = exports;
DateSel.$ = require('zepto');
var $ = DateSel.$;


// 点击加号的操作方法
/**
 * @param (Boolean) label : 是否计算减免费用（true计算、false不计算）
 *
 */
DateSel.addCart = function(obj, label){
	var firstOrder = $('#sel-true').data('first_order');

	var serverAllNum = parseFloat($('.all-num').html());	// 服务的总数量
	var serverAllTime = parseFloat($('.all-hour').html());	// 服务的总时间
	var serverAllMoney = parseFloat($('.all-money').html());	// 服务的总价钱

	var cartAllNum = parseFloat($('.num').html());		// 结算车的服务总数量
	var cartAllTime = 0;	// 结算车的服务总时间
	var cartAllMoney = parseFloat($('.money').html()).toFixed(2);	// 结算车的服务总价钱

	var breaksMoney = 0;	// 减免费用总额


	var type = $(obj).data('type');
	var _this = obj;
	// 获取用户操作的父级元素
	var parent = $(_this).parents('.per-server');
	
	// 获取用户点击服务的价钱
	var clickMoney = parseFloat($(parent).find('.per-money').html()).toFixed(2); 
	var clickMoneyNext = parseFloat($(parent).data('next_price')).toFixed(2); 
	// 获取用户点击服务用时
	var clickTime = parseFloat($(parent).find('.per-time').html()); 

	// 获取用户点击服务的当前所选数量
	var clickServNum = parseFloat($(parent).find('.per-num').html());
	// 第一次点击加号的初始数量，在业务中代表服务的起订数量
	var dataStart = parseFloat($(parent).data('start')); 

	if(type == 'remove' && clickServNum <= 0){
		return false;
	}

	var firstBool = clickServNum < dataStart;
	var secBool = clickServNum <= dataStart;

	type == 'add' ? (firstBool ? clickServNum += dataStart : clickServNum++) : (secBool ? clickServNum = 0 : clickServNum--);
	$(parent).find('.per-num').html(clickServNum);	// 数量加一
	// 服务总数量累加
	type == 'add' ? (firstBool ? serverAllNum += dataStart : serverAllNum++) : (secBool ? serverAllNum -= dataStart : serverAllNum--);
	$('.all-num').html(serverAllNum);	// 赋值
	
	//结算车总数量累加
	type == 'add' ? (firstBool ? cartAllNum += dataStart : cartAllNum++) : (secBool ? cartAllNum -= dataStart : cartAllNum--);
	$('.num').html(cartAllNum);	// 赋值

	// 服务总用时累加
	type == 'add' ? (firstBool ? serverAllTime += (clickTime * dataStart) : serverAllTime += clickTime) : (secBool ? serverAllTime -= (clickTime * dataStart) : serverAllTime -= clickTime);
	$('.all-hour').html(serverAllTime);	// 赋值

	// 服务总价钱累加
	type == 'add' ? (firstBool ? serverAllMoney = parseFloat(DateSel.accAdd(serverAllMoney,clickMoney * dataStart)).toFixed(2) 
							   : serverAllMoney = parseFloat(DateSel.accAdd(serverAllMoney,clickMoneyNext)).toFixed(2)) 
				  : (secBool ? serverAllMoney = parseFloat(DateSel.accSub(clickMoney * dataStart, serverAllMoney)).toFixed(2) 
				  			 : serverAllMoney = parseFloat(DateSel.accSub(clickMoneyNext, serverAllMoney)).toFixed(2));

	// 如果是首单，不修改价格
	if(!firstOrder){
		$('.all-money').html(serverAllMoney);
	}
	
	if(label){
		// 结算车的总价钱计算 = serverAllMoney - 减免费用
		// 获取减免费用总额
		$('.breaks-money').each(function(){
			breaksMoney += parseFloat($(this).html());
		});
		// 结算车总价钱计算
		cartAllMoney = serverAllMoney - breaksMoney;
	}else{
		cartAllMoney = serverAllMoney;
	}
	if(cartAllMoney < 0){
		cartAllMoney = 0;
	}

	// 如果是首单，不修改价格
	if(!firstOrder){
		$('.money').html(parseFloat(cartAllMoney).toFixed(2)); // 赋值
	}

	// 显示购物车
	if(parseFloat($('.all-money').html()) > 0){
		$('#sel-true').show();
		$('#sel-false').hide();
	}
	// 隐藏购物车
	if(parseFloat($('.all-money').html()) <= 0){
		$('#sel-true').hide();
		$('#sel-false').show();
	}

	breaksMoney = 0; // 减免清零,很重要，不清零的减免每次都会累加
	
	if(clickServNum <= 0){
		$(parent).find('.remove').css({color:'#999999'});
	}else{
		$(parent).find('.remove').css({color:'#ff4500'});
	}
}

DateSel.accAdd = function(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return parseFloat((arg1*m+arg2*m)/m);
}
//减法函数
DateSel.accSub = function(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return parseFloat(((arg2*m-arg1*m)/m).toFixed(n));
}
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
DateSel.accMul = function(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

// 阻止页面滚动
DateSel.noScroll = function(){
	// 弹出遮罩时，防止页面滚动
	$('#content').css({height:$(window).height() - 120 + 'px', overflow:"hidden"});
}
// 让页面滚动
DateSel.toScroll = function(){
	// 弹出遮罩时，防止页面滚动
	$('#content').css({height:'auto', overflow:"auto"});
}
