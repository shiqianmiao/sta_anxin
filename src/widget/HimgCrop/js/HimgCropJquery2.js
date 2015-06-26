/**
 * @desc 移动端图片裁剪 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-06-08
 */

var $ = require('jquery');
var cropper = require('widget/HimgCrop/js/cropper.js');

var HimgCropJquery = function(opations){
	// 配置参数
	this.settings = {
		srcDom: '',
		rotateIngEvent : 'touchend',
		callback : function(){},
		cropperSetting : {
			aspectRatio: 2 / 2,
			autoCropArea: 0.65,
			strict: false,
			guides: false,
			highlight: false,
			dragCrop: false,
			cropBoxMovable: true,
			background: true, // 是否显示网格背景 true 是 false 不显示
			cropBoxResizable: false,
			guides: true
		}
	};

	$.extend(this.settings, opations);

	this.HimgCropWrap = $('#HimgCropWrap');
	this.picccc = $('#picccc');
	this.active = $('#picccc').data('active');
	this.cropperWrap = $('.cropper-wrap');
	this.HimgFooter = $('.Himg-footer');
	this.rotateIng = $('.rotate-ing');
	this.srcImg = $('.cropper-wrap > img');
	this.HimgCancel = $('.Himg-cancel');
	this.HimgSelect = $('.Himg-select');
	// 设备窗口宽高
	this.windowHeight = $(window).height();
	this.windowWidth = $(window).width();
	this.HimgFooterHeight = this.HimgFooter.height();

	this.inputId = '';

	this.init();
	
};

var proto = HimgCropJquery.prototype;

$.extend(proto, {

	constructor : HimgCropJquery,

	init : function(){
		this.HimgCropWrap.show();
		this.bind();

		this.setSize();

		this.picccc.attr('src', $(this.settings.srcDom).val());


		if(this.active){

			this.srcImg.cropper('replace', this.picccc.attr('src'));

		}else{
			this.srcImg.cropper(this.settings.cropperSetting);
			this.picccc.data('active', true);

		}
	},

	bind : function(){
		var self = this;


		self.rotateIng.off(this.settings.rotateIngEvent);
		// 点击旋转按钮
		self.rotateIng.on(this.settings.rotateIngEvent, function(){
			self.srcImg.cropper("rotate", 90);
		});

		// 点击选取按钮
		self.HimgSelect.on('click', function(){
			var canvasDom = self.srcImg.cropper('getCroppedCanvas'); // canvas DOM 元素
   //      	var newImg = $('<img/>');
   //      	newImg.attr('src', canvasDom.toDataURL("image/png"));

   //      	$('body').append($(newImg));
   			var data = {
   				canvasData : self.srcImg.cropper('getCanvasData'),
   				CropBoxData : self.srcImg.cropper('getCropBoxData'),
   				ContainerData : self.srcImg.cropper('getContainerData'),
   				imageData : self.srcImg.cropper('getImageData')
   			}

   			self.settings.callback(canvasDom, data, self.inputId);

        	self.HimgCropWrap.hide();
		});

		// 点击取消按钮
		self.HimgCancel.on('click', function(){
			self.HimgCropWrap.hide();
		});

	},

	setSize : function(){
		this.HimgCropWrap.css({height: this.windowHeight + 'px', width: this.windowWidth + 'px'});
		this.cropperWrap.css({height: this.windowHeight - this.HimgFooterHeight + 'px', width: this.windowWidth + 'px'});
	}

});
// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HimgCropJquery;
} else {
    window.HimgCropJquery = HimgCropJquery;
}