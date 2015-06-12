/**
 * @desc 提醒模态框 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-06-12
 */

var $ = require('$');

var Hmodel = function(opations){

	this.obj = null; // 模态框P标签 id=Hmodel
	this.showStatus = false; // 是否显示的状态
	this.timer = null;

	// 配置参数
	this.settings = {
		showTime : 2000
	};

	$.extend(this.settings, opations);

	this.init();

};

var proto = Hmodel.prototype;

$.extend(proto, {

	constructor : Hmodel,
	/**
	 * @desc 初始化
	 *
	 */
	init : function(opations){
		var self = this;
		
		this.createDom();
		
	},
	/**
	 * @desc 创建DOM
	 *
	 */
	createDom : function(){
		this.obj = $('<p id="Hmodel"></p>');
		$('body').append(this.obj);
	},
	/**
	 * @desc 设置位置
	 *
	 */
	setXY : function(){
		var W = $(this.obj).width();
		var H = $(this.obj).height();

		this.obj.css({
			marginTop : -H / 2 + 'px',
			marginLeft : -W / 2 + 'px'
		});
	},
	/**
	 * @desc 显示
	 * @param (String) str ： 提醒语句
	 *
	 */
	show : function(str){
		var self = this;

		this.obj.html(str);
		this.obj.addClass('show');
		this.obj.removeClass('hide');
		this.obj.show();
		
		this.setXY();

		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			self.hide();

			clearTimeout(self.timer);
			self.timer = setTimeout(function(){
				self.obj.hide();
			}, 700);

		}, this.settings.showTime);

	},
	/**
	 * @desc 隐藏
	 *
	 */
	hide : function(){
		this.obj.removeClass('show');
		this.obj.addClass('hide');
	}

});

// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hmodel;
} else {
    window.Hmodel = Hmodel;
}
