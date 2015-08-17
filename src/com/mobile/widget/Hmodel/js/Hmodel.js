/**
 * @desc 提醒模态框 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-06-12
 */

var $ = require('$');

var Hmodel = function(opations){

	this.obj = null; // 模态框div标签 id=Hmodel
	this.objp = null; // 模态框P标签 
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
		this.obj = $('<div id="Hmodel" class="modelhide"></div>');
		this.pwrap = $('<div></div>');
		this.objp = $('<p></p>');
		$(this.pwrap).append(this.objp);
		$(this.obj).append(this.pwrap);
		$('body').append(this.obj);
	},

	/**
	 * @desc 显示
	 * @param (String) str ： 提醒语句
	 *
	 */
	show : function(str){
		var self = this;

		this.objp.html(str);
		this.obj.addClass('show');
		this.obj.removeClass('hide');
		this.obj.removeClass('modelhide');

		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			self.hide();

			clearTimeout(self.timer);
			self.timer = setTimeout(function(){
				self.obj.addClass('modelhide');
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
