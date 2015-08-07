/**
 * @desc 移动端模拟浏览器滚动/下拉刷新/上拉加载更多 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-22
 */

var $ = require('zepto');

var nullFn = null;

var Hscroll = function(opations){
	// 配置参数
	this.settings = {
		// 下拉刷新的回调函数
		refreshCallback : nullFn,
		// 上拉加载更多的回调函数
		loadMoreCallback : nullFn,
		// 选项【只要下拉刷新 - onlyTop】【只要上拉加载更多 - onlyBottom】【两个都要 - double】【都不要 - none】
		opationType : 'double'
	};

	$.extend(this.settings, opations);


	// 包裹层
	this.Hwrap = document.getElementById('Hwrap');
	// 滚动层
	this.Hscroll = document.getElementById('Hscroll');
	if(!this.Hscroll){
		throw new Error('未定义Hscroll元素');
	}

	this.Hsheader = this.Hscroll.getElementsByClassName('Hs-header')[0];
	this.Hsfooter = this.Hscroll.getElementsByClassName('Hs-footer')[0];
	if(!this.Hsheader || !this.Hsfooter){
		throw new Error('未定义Hs-header 或 Hs-footer 元素');
	}

	
	
	this.loadDom();
	

	// 计算时间变量定义
	this.startTime = 0;
	this.endTime = 0;
	this.timeconsuming = 0;
	// 计算距离变量定义
	this.startlocation = 0;
	this.endlocation = 0;
	this.distance = 0;
	// 速度
	this.speed = 0;
	// touchstart时记录pageY
	this.prevY = 0;
	// disY为初始滑动时手指相对Hscroll的位置
	this.disY = 0;

	// 当前Hscroll的Top值
	this.curTop = 0;
	this.setTranslateY(this.Hscroll, 0);

	// Hscroll最大可滚动的高度
	this.maxScrollHeight = Math.abs(this.Hscroll.offsetHeight - this.Hwrap.offsetHeight);
	// 向上拉还是向下拉的标志【大于0下拉】【小于0上拉】
	this.upOrDown = 0;


	this._init();

};

var proto = Hscroll.prototype;

$.extend(proto, {

	constructor : Hscroll,

	// 是否刷新的标志
	refreshMark : false,
	// 是否加载更多的标志
	loadMark : false,
	/**
	 * @desc 初始化方法
	 *
	 */
	_init : function(){
		this.toBind();
	},
	/**
	 * @desc 选择加载头部脚部
	 *
	 */
	loadDom : function(){
		if(this.settings.opationType == 'onlyTop'){
			this.Hsfooter.style.display = 'none';
		}else if(this.settings.opationType == 'onlyBottom'){
			this.Hsheader.style.display = 'none';
		}else if(this.settings.opationType == 'none'){
			this.Hsfooter.style.display = 'none';
			this.Hsheader.style.display = 'none';
		}
	},
	/**
	 * @desc 绑定事件的方法
	 *
	 */
	toBind : function(){
		var self = this;
		this._addHandler(this.Hwrap, 'touchstart', function(ev){
			var ev = ev || window.event;

			self._touchstartFn(ev);
		});
		this._addHandler(this.Hwrap, 'touchmove', function(ev){
			var ev = ev || window.event;
			self._preventDefault(ev);

			self._touchmoveFn(ev);
		});

		this._addHandler(this.Hwrap, 'touchend', function(ev){
			var ev = ev || window.event;

			self._touchendFn(ev);
		});
	},
	/**
	 * @desc touchstart事件函数
	 *
	 */
	_touchstartFn : function(ev){
		this.addTransionStyle(this.Hscroll, '0s');
		// 记录初始位置和时间
		this.startlocation = ev.touches[0].pageY;
		this.startTime = new Date().getTime();
		// 计算初始时手指相对Hscroll的位置
		this.prevY =	ev.touches[0].pageY;
		this.disY = this.prevY - this.getTranslateY(this.Hscroll);

		// console.log(this.getTranslateY(this.Hscroll));
		
	},
	/**
	 * @desc touchmove事件函数
	 *
	 */
	_touchmoveFn : function(ev){
		// move的时候更新当前的top值
		this.curTop = ev.touches[0].pageY - this.disY;
		// console.log(this.curTop);
		this.upOrDown = ev.touches[0].pageY - this.prevY;
		var config = this.settings;
		
		if(this.curTop > 0){
			// 拖动使top大于0的时候，要减缓运动，（摩擦感）----------------> 下拉
			this.curTop = this.curTop * 0.3;

			if(this.curTop >= 50){
				// 放开刷新
				$('.pullDownIcon').addClass('flip');
				this.Hsheader.getElementsByTagName('em')[0].innerHTML = '放开刷新';
				if(config.opationType == 'onlyTop' || config.opationType == 'double'){
					this.refreshMark = true;
				}
				
			}else{
				$('.pullDownIcon').removeClass('flip');
			}
			
		}else if(Math.abs(this.curTop) > this.maxScrollHeight){
			// 拖动使top大于最大可拖动的距离的时候，要减缓运动，（摩擦感）-------------------> 上拉
			this.curTop = this.curTop + (this.prevY - ev.touches[0].pageY) * 0.7;

			// 如果只要下拉刷新
			if(Math.abs(this.curTop) - this.maxScrollHeight >= 50){
				// 放开加载更多
				$('.pullUpIcon').addClass('flip');
				this.Hsfooter.getElementsByTagName('em')[0].innerHTML = '放开加载更多';

				if(config.opationType == 'onlyBottom' || config.opationType == 'double'){
					this.loadMark = true;
				}

			}else{
				$('.pullUpIcon').removeClass('flip');
			}
			
		}


		//this.Hscroll.style.top = this.curTop + 'px';
		this.setTranslateY(this.Hscroll, this.curTop);

		


	},
	/**
	 * @desc touchend事件函数
	 *
	 */
	_touchendFn : function(ev){

		var self = this;

		// 获取结束位置及时间
		this.endlocation = ev.changedTouches[0].pageY;
		this.endTime = new Date().getTime();

		// 如果 Hscroll的top值在0~50之间 ,刷新并return
		if(this.curTop > 0 && this.curTop < 50){
			this.refreshEnd();
			return false;
		}
		// 如果  Hscroll的top值在 最大值~最大值+50 之间 ,加载更多并return
		if(Math.abs(this.curTop) > this.maxScrollHeight && (Math.abs(this.curTop) < this.maxScrollHeight + 50)){
			this.loadMoreEnd();
			return false;
		}

		if(this.refreshMark){
			this.refresh();
			return false;
		}
		if(this.loadMark){
			this.loadMore();
			return false;
		}

		// 禁用下拉条件
		if(this.upOrDown > 0 && this.curTop > 0 && (this.settings.opationType == 'onlyBottom' || this.settings.opationType == 'none')){
			this.refreshEnd();
			return false;
		}
		// 禁用上拉条件
		if(this.upOrDown < 0 && (Math.abs(this.curTop) > this.maxScrollHeight) && (this.settings.opationType == 'onlyTop' || this.settings.opationType == 'none')){
			this.loadMoreEnd();
			return false;
		}

		// 计算速度
		this.speed = parseInt( (this.endlocation - this.startlocation) / (this.endTime - this.startTime) * 180 );
		if(Math.abs(this.speed) < 100){
			this.speed = 0;
		}
		
		// end的时候更新当前的top值
		this.curTop = this.getTranslateY(this.Hscroll) + this.speed;

		// 下拉后滚动过界
		if(this.curTop > 0){
			this.curTop = this.curTop * 0.2;
			// this.Hscroll.style.top = this.curTop + 'px';
			this.setTranslateY(this.Hscroll, this.curTop);
			this.addTransionStyle(this.Hscroll, '0.6s');
			setTimeout(function(){
				self.refreshEnd();
			}, 600);

			// 速度清0 ，必须
			this.speed = 0;
			return false;
		}else if(Math.abs(this.curTop) > this.maxScrollHeight){
			// 上拉后滚动过界
			this.curTop = -this.maxScrollHeight - (Math.abs(this.curTop) - this.maxScrollHeight) * 0.2;
			// this.Hscroll.style.top = this.curTop + 'px'
			this.setTranslateY(this.Hscroll, this.curTop);
			this.addTransionStyle(this.Hscroll, '0.6s');
			setTimeout(function(){
				self.loadMoreEnd();
			}, 600);

			// 速度清0 ，必须
			this.speed = 0;
			return false;
		}

		// this.Hscroll.style.top = this.curTop + 'px';
		this.setTranslateY(this.Hscroll, this.curTop);
		this.addTransionStyle(this.Hscroll, '0.6s');
		// 速度清0 ，必须
		this.speed = 0;
	},
	/**
	 * @desc 放开刷新
	 *
	 */
	refresh : function(){
		$('.pullDownIcon').addClass('loading');
		// this.Hscroll.style.top = '50px';
		this.setTranslateY(this.Hscroll, 50);
		this.addTransionStyle(this.Hscroll, '0.2s');
		if(this.settings.refreshCallback){
			this.settings.refreshCallback(this);
		}
	},
	/**
	 * @desc 加载更多
	 *
	 */
	loadMore : function(){
		$('.pullUpIcon').addClass('loading');
		// this.Hscroll.style.top = -(this.maxScrollHeight + 50) + 'px';
		this.setTranslateY(this.Hscroll, -(this.maxScrollHeight + 50));
		this.addTransionStyle(this.Hscroll, '0.2s');
		if(this.settings.loadMoreCallback){
			this.settings.loadMoreCallback(this);
		}
	},
	/**
	 * @desc 刷新完毕，归位
	 *
	 */
	refreshEnd : function(){
		$('.pullDownIcon').removeClass('flip');
		$('.pullDownIcon').removeClass('loading');
		// this.Hscroll.style.top = 0;
		this.setTranslateY(this.Hscroll, 0);
		this.addTransionStyle(this.Hscroll, '0.2s');
		this.refreshMark = false;

		// 更新Hscroll最大可滚动的高度
		this.maxScrollHeight = Math.abs(this.Hscroll.offsetHeight - this.Hwrap.offsetHeight);
	},
	/**
	 * @desc 加载更多完毕，归位
	 *
	 */
	loadMoreEnd : function(){
		$('.pullUpIcon').removeClass('flip');
		$('.pullUpIcon').removeClass('loading');
		// this.Hscroll.style.top = -this.maxScrollHeight + 'px';
		this.setTranslateY(this.Hscroll, -this.maxScrollHeight);
		this.addTransionStyle(this.Hscroll, '0.2s');
		this.loadMark = false;

		// 更新Hscroll最大可滚动的高度
		this.maxScrollHeight = Math.abs(this.Hscroll.offsetHeight - this.Hwrap.offsetHeight);
	},
	/**
	 * @desc 禁用下拉刷新、上拉加载更多、全部禁用、全部释放的方法
	 * @param (str) types ->【只要下拉刷新 - onlyTop 】【只要上拉加载更多 - onlyBottom 】【两个都要 - double 】【都不要 - none 】
	 */
	changeTypeTo : function(types){
		this.settings.opationType = types;

		this.loadDom();
	},
	/**
	 * @desc 添加transition样式
	 * @param (DOM OBJ) obj : dom元素
	 * @param (string) str : transition css 字符串
	 */
	addTransionStyle : function(obj, str){
		obj.style.transition = str;
		obj.style.WebkitTransition = str;
		obj.style.MozTransition = str;
		obj.style.OTransition = str;
		obj.style.msTransition = str;
	},
	/**
	 * @desc 给元素绑定事件
	 *
	 */
	_addHandler: function(element, type, handler){
		if(element.addEventListener){
			if(type == 'transitionend'){
				element.addEventListener('transitionend', handler, false);
				element.addEventListener('webkitTransitionEnd', handler, false);
			}else{
				element.addEventListener(type, handler, false);
			}
			
		}else if(element.attachEvent){
			element.attachEvent("on" + type, handler);
		}else{
			element["on" + type] = handler;
		}
	},
	/**
	 * @desc 给元素移除事件
	 *
	 */
	_removeHandler : function(element, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.detachEvent){
			element.detachEvent("on" + type, handler);
		}else{
			element["on" + type] = null;
		}
	},
	/**
	 * @desc 阻止默认事件
	 *
	 */
	_preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
		
	},
	setTranslateY: function (obj, diff) {
		obj.style.webkitTransform = "translateY(" + diff + "px)";
		obj.style.transform = "translateY(" + diff + "px)";
        // $(obj).css({
        //     "webkitTransform": "translateY(" + diff + "px)",
        //     "transform": "translateY(" + diff + "px)"
        // });
        $(obj).data('translateY', diff);
    },
    getTranslateY : function(obj){
    	return $(obj).data('translateY');
    }

});


// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hscroll;
} else {
    window.Hscroll = Hscroll;
}
