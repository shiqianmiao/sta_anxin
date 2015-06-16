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
		fileInput : [],
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

	this.active = false;

	this.HimgCropWrap = $('#HimgCropWrap');
	this.picccc = $('#picccc');
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
		this.bind();

		this.setSize();
	},

	bind : function(){
		var self = this;

		// 表单的change事件
		for(var i = 0; i < self.settings.fileInput.length; i++){
			$(self.settings.fileInput[i]).on('change', function(){
				self.inputChangeFn(this);
			});
		}

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

   			self.settings.callback(canvasDom, self.inputId);

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
	},

	inputChangeFn : function(_this){
		var self = this;
		self.inputId = _this.id;
		self.HimgCropWrap.show();

		var fs = _this.files; // fs.length(文件个数)  fs[i].type(文件格式)
		// 读取文件的对象
		var fd = new FileReader();

		if(fs.length == 1){

			if(/image/.test(fs[0].type)){

				fd.readAsDataURL(fs[0]); // 读文件，将文件对象传入

				fd.onload = function(){ // 读文件成功的时候触发

					self.picccc.attr('src', this.result);


					if(self.active){

						self.srcImg.cropper('replace', self.picccc.attr('src'));

					}else{
						self.srcImg.cropper(self.settings.cropperSetting);
						self.active = true;

					}

					// self.fileInput.val('');
					for(var i = 0; i < self.settings.fileInput.length; i++){
						$(self.settings.fileInput[i]).val('');
					}

				}
				
			}else{
				alert('您选择的不是一张图片');
			}
		}

	}

});
// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HimgCropJquery;
} else {
    window.HimgCropJquery = HimgCropJquery;
}