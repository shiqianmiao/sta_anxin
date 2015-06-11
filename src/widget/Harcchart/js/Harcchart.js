/**
 * @desc 图表 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-05-19
 */

var $ = require('zepto');

var Harcchart = function(target, opations){

	// canvas DOM 对象
	this.canObj = $(target).get(0);
	// canvas的宽高
	this.width = $(target).width();
	this.height = $(target).height();
	// 统计项目的数量
	this.count = 0;
	// 当前绘制的角度
	this.deg = 0;
	this.toDeg = 0;

	// 配置参数
	this.settings = {
		data : [],
		centerTexct : ''
	};

	$.extend(this.settings, opations);

	this.init();
};

var proto = Harcchart.prototype;

$.extend(proto, {

	constructor : Harcchart,
	/**
	 * @desc 初始化
	 *
	 */
	init : function () {
		var config = this.settings;
		this.calcDeg(config.data);

		this.draw();
		this.createLegend();

	},
	/**
	 * @desc 计算每个统计项目要绘制的角度
	 * @param (array) dataArr : 数据----> this.settings.data
	 */
	calcDeg : function (dataArr) {
		var allNum = 0, self = this;
		$.each(dataArr, function (i, obj) {
			allNum += obj.number;
		});
		$.each(dataArr, function (i, obj) {
			obj.deg = Math.round(obj.number * 360 / allNum);
		});
	},
	/**
	 * @desc 根据度计算弧度
	 * @param (number) degree : 度数
	 */
	degToRadian : function (degree) {
		return degree * Math.PI / 180;
	},
	/**
	 * @desc 绘制
	 *
	 */
	draw : function () {
		var config = this.settings,
			dataArr = config.data,
			ctx = this.canObj.getContext('2d'),
			self = this;

		$.each(dataArr, function(i, obj){
			self.toDeg = self.deg + obj.deg;
			ctx.beginPath();
			ctx.moveTo(self.width / 2, self.height / 2);
			ctx.arc(self.width / 2, self.height / 2, self.width / 2, self.degToRadian(self.deg), self.degToRadian(self.toDeg), false);
			ctx.lineTo(self.width / 2, self.height / 2);
			ctx.closePath();
			ctx.fillStyle = obj.color;
			ctx.fill();
			self.deg = self.toDeg;
		});

		ctx.beginPath();
		ctx.moveTo(self.width / 2, self.height / 2);
		ctx.arc(self.width / 2, self.height / 2, self.width / 3.5, 0, Math.PI * 2, false);
		ctx.lineTo(self.width / 2, self.height / 2);
		ctx.closePath();
		ctx.fillStyle = '#fff';
		ctx.fill();

		ctx.fillStyle = '#ffad0f';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = 'normal 14px Microsoft YaHei';
		ctx.fillText('主要工作', self.width / 2, self.height / 2);
	},
	/**
	 * @desc 创建图例
	 *
	 */
	createLegend : function () {
		var config = this.settings,
			dataArr = config.data,
			$em,
			$li,
			$ul1 = $('<ul class="legend">'),
			$ul2 = $('<ul class="legend">');

		$.each(dataArr, function(i, obj){
			if(i % 2 == 0){
				var $em = $('<em></em>').css('background', obj.color);
				var $li = $('<li>' + obj.title + '：' + obj.number + '次</li>');
				$li.append($em);
				$ul2.append($li);
			}else{
				var $em = $('<em></em>').css('background', obj.color);
				var $li = $('<li>' + obj.title + '：' + obj.number + '次</li>');
				$li.append($em);
				$ul1.append($li);
			}
		});

		$(this.canObj).after($ul2);
		$(this.canObj).after($ul1);

	}

	

});

// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Harcchart;
} else {
    window.Harcchart = Harcchart;
}
