/**
 * @desc alert 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-26
 */

var $ = require('zepto');

var Halert = function(opations){

	this.mask = null;
	this.alert = null;
	// 配置参数
	this.settings = {
		width: '274px',
		title : '提示',
		content : '这是一个弹窗组件',
		confirmBtnContent : '确定',
		cancelBtnContent : '取消',
		skin : '#fff',
		contentAlign : 'left',
		titleAlign : 'left',
		fontColor : '#333',
		showYesBtn : true,
		showNoBtn : true,
		confirmBtnCallback : function(self){
			self.hide();
		},
		cancelBtnCallback : function(self){
			self.hide();
		}
	};

	$.extend(this.settings, opations);


};

var proto = Halert.prototype;

$.extend(proto, {

	constructor : Halert,
	/**
	 * @desc 显示
	 *
	 */
	show : function(opations){

		$.extend(this.settings, opations);
		this._createDom();

	},

	/**
	 * @desc 移除
	 *
	 */
	hide : function(){

		$(this.mask).detach();

	},

	
	/**
	 * @desc 创建DOM
	 *
	 */
	_createDom : function(){
		var self = this;
		// 创建遮罩
		this.mask = $('<section></section>').css({
			position : 'fixed',
			width : '100%',
			height : $(document).height() + 'px',
			background : 'rgba(0,0,0,0.5)',
			zIndex : 20000,
			top : '0',
			left : '0',
			display : 'block'
		});

		// 创建弹窗包裹层
		this.alert = $('<div id="Halert"></div>').css({
			position : 'fixed',
			width : this.settings.width,
			background : '#fff',
			zIndex : 20000,
			top : '50%',
			overflow : 'hidden',
			borderRadius : '3px',
			color : this.settings.fontColor
		});

		// 创建title
		var title = $('<h2></h2>').css({
			height : '40px',
			padding : '0 5%',
			background : this.settings.skin,
			borderBottom : '1px solid #eeeeee',
			lineHeight : '40px',
			textAlign : this.settings.titleAlign,
			fontSize : '15px',
			margin : '0'
		}).html(this.settings.title);

		// 创建内容
		var content = $('<div></div>').css({
			padding : '20px 6.5%',
			lineHeight : '24px',
			textAlign : this.settings.contentAlign,
			fontSize : '16px'
		}).html(this.settings.content);

		// 创建脚部
		var footer = $('<footer></footer>').css({
			height : '61px',
			borderTop : '1px solid #dddddd',
			textAlign : 'center'
		});
		// 创建按钮
		var yesBtn = $('<a></a>').css({display:'inline-block',width: '111px',height : '38px',lineHeight:'38px',background : '#ff8900',textAlign : 'center',color : '#fff',marginTop:'11px', borderRadius:"3px", fontSize: '18px'})
								 .html(this.settings.confirmBtnContent)
		  						 .on('click', function(){
		  						 	if(self.settings.confirmBtnCallback){
		  						 		self.settings.confirmBtnCallback(self);
		  						 	}
		  						 });
		var noBtn = $('<a></a>').css({display:'inline-block',width: '111px',height : '38px',lineHeight:'38px',background : '#b0b0b0',textAlign : 'center',color : '#fff',marginTop:'11px',marginRight:'14px', borderRadius:"3px", fontSize: '18px'})
								.html(this.settings.cancelBtnContent)
								.on('click', function(){
									if(self.settings.cancelBtnCallback){
										self.settings.cancelBtnCallback(self);
									}
								});

		if(this.settings.showNoBtn){
			footer.append(noBtn);
		}
		if(this.settings.showYesBtn){
			footer.append(yesBtn);
		}
		
		// this.alert.append(title);
		this.alert.append(content);
		this.alert.append(footer);

		this.mask.append(this.alert);
		
		$('body').append(this.mask);

		// 修正位置
		this.alert.css({'marginTop': -$(this.alert).height() / 2 + 'px', 'left' : ($(document).width() - $(this.alert).width()) / 2 + 'px'});
	}

});


// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Halert;
} else {
    window.Halert = Halert;
}
