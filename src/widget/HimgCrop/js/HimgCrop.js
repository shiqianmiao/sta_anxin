/**
 * @desc 移动端图片裁剪 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-06-08
 */

var Hammer = require('widget/HimgCrop/js/hammer.js');
var $ = require('zepto');

var HimgCrop = function(opations){
	// 配置参数
	this.settings = {
		fileInput : ''
	};

	$.extend(this.settings, opations);

	// 组件元素
	this.wrapObj = $('#HimgCropWrap');
	this.wrapObj.hide();
	this.imgCanvas = $('.Himg-canvas').get(0);
	this.cxt = this.imgCanvas.getContext('2d');
	this.cropBox = $('.crop-box');
	this.HimgCancelBtn = $('.Himg-cancel'); // 取消按钮
	this.HimgSelectBtn = $('.Himg-select'); // 选取按钮
	this.fileInput = $(this.settings.fileInput);
	this.rotateBtn = $('.rotate-ing'); // 旋转按钮

	this.markTop = $('<section class="mark-top"></section>');
	this.markLeft = $('<section class="mark-left"></section>');
	this.markRight = $('<section class="mark-right"></section>');
	this.markBottom = $('<section class="mark-bottom"></section>');

	this.reset();

	this.img = new Image();
	this.imgLoadLabel = false;

	this.rotateStatus = 'up';

	// 是否允许拖动的标志，用来防止事件之间的重叠
	this.dragLabel = true;

	// 绑定触控事件
	this.bind();
	
};

var proto = HimgCrop.prototype;

$.extend(proto, {

	constructor : HimgCrop,

	init : function(){
		this.wrapObj.show();
		// 初始化组件元素宽高
		this.wrapObj.css({height: this.windowHeight + 'px', width: this.windowWidth + 'px'});

		this.imgCanvas.width = this.windowWidth;
		this.imgCanvas.height = this.windowHeight;

		this.cropBox.css({top: this.paddingT + 'px', left: this.paddingLR + 'px', width: this.cropWidth + 'px', height: this.cropWidth + 'px'});

		// 设置遮罩
		this.setMark();

		// 画图
		this.draw(true);

	},

	setMark : function(){
		this.markBottom.css({height: this.windowHeight - this.paddingT - this.cropWidth + 'px'});
		this.wrapObj.append(this.markTop);
		this.wrapObj.append(this.markLeft);
		this.wrapObj.append(this.markRight);
		this.wrapObj.append(this.markBottom);
	},

	draw : function(rotatetag){
		var cxt = this.cxt,
			img = this.img,
			self = this;

		cxt.clearRect(0, 0, self.windowWidth, self.windowHeight);
		if(!rotatetag){
			cxt.save();
			cxt.translate(self.XXX, self.YYY);
			if(self.rotateStatus == 'right'){
				cxt.rotate(90 * Math.PI / 180);
				
			}else if(self.rotateStatus == 'down'){
				cxt.rotate(180 * Math.PI / 180);

			}else if(self.rotateStatus == 'left'){
				cxt.rotate(270 * Math.PI / 180);

			}
		}
		
		img.onload = function(){
			self.imgSrcHeight = img.height / img.width * self.imgSrcWidth;
			self.imgLoadLabel = true;
			cxt.drawImage(img, self.imgSrcLeft, self.imgSrcTop,self.imgSrcWidth, self.imgSrcHeight);

		};

		if(self.imgLoadLabel){
			self.imgSrcHeight = img.height / img.width * self.imgSrcWidth;
			cxt.drawImage(img, self.imgSrcLeft, self.imgSrcTop,self.imgSrcWidth, self.imgSrcHeight);
		}
		cxt.restore();
		
		
	},
	rotateDraw : function(){
		var cxt = this.cxt,
			img = this.img,
			self = this;

		self.reset();
        self.draw();
		self.cxt.clearRect(0, 0, self.windowWidth, self.windowHeight);

		cxt.save();
		if(self.imgLoadLabel){
			self.imgSrcHeight = img.height / img.width * self.imgSrcWidth;
			//cxt.save();
			if(self.rotateStatus == 'up'){
				self.XXX = self.imgSrcHeight + self.imgSrcTop;
				self.YYY = self.imgSrcTop - self.imgSrcLeft;
				self.rotateStatus = 'right';
				cxt.translate(self.XXX, self.YYY);
				cxt.rotate(90 * Math.PI / 180);
				
			}else if(self.rotateStatus == 'right'){
				self.XXX = self.imgSrcWidth + self.imgSrcLeft;
				self.YYY = self.imgSrcTop * 2 + self.imgSrcHeight;
				self.rotateStatus = 'down';
				cxt.translate(self.XXX, self.YYY);
				cxt.rotate(180 * Math.PI / 180);

			}else if(self.rotateStatus == 'down'){
				self.XXX = -self.imgSrcTop + self.imgSrcLeft;
				self.YYY = self.imgSrcTop + self.imgSrcWidth + self.imgSrcLeft;
				self.rotateStatus = 'left';
				cxt.translate(self.XXX, self.YYY);
				cxt.rotate(270 * Math.PI / 180);

			}else if(self.rotateStatus == 'left'){
				self.reset();
        		self.draw();
				self.rotateStatus = 'up';

			}
			

			cxt.drawImage(img, self.imgSrcLeft, self.imgSrcTop,self.imgSrcWidth, self.imgSrcHeight);
			
		}

		cxt.restore();
	},

	bind : function(){
		var self = this,
			w = self.imgSrcWidth,
			h = self.imgSrcHeight,
			linshiScale = 0;
		// 创建一个新的hammer对象并且在初始化时指定要处理的dom元素
		var hammertime = new Hammer(document.getElementById("HimgCropWrap"));
		// 为该dom元素指定触屏移动事件
		var oPinch = new Hammer.Pinch();
		var oPan = new Hammer.Pan({
			threshold : 0
		});
		var oRotate = new Hammer.Rotate();
		oPinch.recognizeWith(oRotate);

		hammertime.add([oPinch, oPan, oRotate]);

		// 旋转事件
		// hammertime.on('rotate', function(e){
		// 	alert(e.angle);
		// });

		// 多点触控开始事件
		hammertime.on('pinchstart', function(){
			self.dragLabel = false;
		});
		// 放大事件
		hammertime.on("pinchout", function (e) {
			self.toScale(e, w, h);

			self.draw();

		});

		
		// 缩小事件
		hammertime.on("pinchin", function (e) {
			self.toScale(e, w, h);

			self.draw();

		});

		// 绑定双击事件,双击放大缩小
		hammertime.on('doubletap', function(e){
			if(self.scaleNum < 4){
				self.scaleNum = 4;
			}else{
				self.scaleNum = 1;
			}

			self.imgSrcWidth = w * self.scaleNum;
			self.imgSrcHeight = h * self.scaleNum;

			self.draw();
			self.setScaleDis();
		});

		// 拖动开始
		hammertime.on('panstart', function(){
			self.dragLabel = true;
		})
		// 绑定拖动事件
		hammertime.on("pan", function (e) {
			var	curX, curY;
			if(e.type == 'pan' && self.dragLabel){
					
				// if(curX >= 5){
				// 	curX = 5;
				// }else if(curX <= -(self.imgSrcWidth - self.cropWidth -5)){
				// 	curX = -(self.imgSrcWidth - self.cropWidth -5);
				// }

				// if(curY >= 50){
				// 	curY = 50;
				// }else if(curY <= -(self.imgSrcHeight - self.paddingT - self.cropWidth) && -(self.imgSrcHeight - self.paddingT - self.cropWidth) < 0){
				// 	curY = -(self.imgSrcHeight - self.paddingT - self.cropWidth);
				// }else if(-(self.imgSrcHeight - self.paddingT - self.cropWidth) > 0){
				// 	curY = 50;
				// }

				if(self.rotateStatus == 'up'){
					curX = self.oldX + e.deltaX,
					curY = self.oldY + e.deltaY;
				}else if(self.rotateStatus == 'right'){
					curX = self.oldX + e.deltaY,
					curY = self.oldY - e.deltaX;
				}else if(self.rotateStatus == 'down'){
					curX = self.oldX - e.deltaX,
					curY = self.oldY - e.deltaY;
				}else if(self.rotateStatus == 'left'){
					curX = self.oldX - e.deltaY,
					curY = self.oldY + e.deltaX;
				}

				self.imgSrcLeft = curX;
				self.imgSrcTop = curY;

				self.draw();
			}
			
        });

		// 拖放结束事件
        hammertime.on('panend', function(e){
        	self.oldX = self.imgSrcLeft;
        	self.oldY = self.imgSrcTop;
        });
        // 缩放结束事件
        hammertime.on('pinchend', function(e){
        	// 缩放容易出界，给用户一种消失了的感觉，这里重置一下位置
        	self.setScaleDis();

        });

        // 选取按钮绑定事件，进行图片裁剪
        self.HimgSelectBtn.on('tap', function(){
        	var cropHeight = 0;
        	var srcImg = new Image();
        	var newImg = $('<img/>');
        	if(self.cropWidth > self.imgSrcHeight){
        		cropHeight = self.imgSrcHeight;
        	}else{
        		cropHeight = self.cropWidth;
        	}

        	srcImg.src = self.imgCanvas.toDataURL("image/png");
        	srcImg.onload = function(){
        		var newCanvas = document.createElement('canvas');
	        	newCanvas.width = self.cropWidth;
	        	newCanvas.height = cropHeight;

	        	newCanvas.getContext('2d').drawImage(srcImg, self.paddingLR, self.paddingT, self.cropWidth, cropHeight, 0, 0, self.cropWidth, cropHeight); 
	        	newImg.attr('src', newCanvas.toDataURL("image/png"));

	        	$('#img-wrap').empty();
	        	$('#img-wrap').append($(newImg));
	        	$(self.fileInput).val('');

	        	self.wrapObj.hide();
        	};

        	self.reset();

        	self.rotateStatus = 'up';

        });

        self.HimgCancelBtn.on('tap', function(){
        	self.wrapObj.hide();
        	$('#img-wrap').empty();
        	$(self.fileInput).val('');
        });

        // 文件表单的change事件
        self.fileInput.on('change', function(event){
        	//alert(4);
			var fs = this.files; // fs.length(文件个数)  fs[i].type(文件格式)
			// 读取文件的对象
			//alert(fs);
			var fd = new FileReader();
			if(fs.length = 1){
				if(/image/.test(fs[0].type)){
					fd.readAsDataURL(fs[0]); // 读文件，将文件对象传入

					fd.onload = function(){ // 读文件成功的时候触发
						self.img.src = this.result;

						self.init();
					}
				}else{
					alert('您选择的不是一张图片');
				}
			}
		});

		// 旋转
		self.rotateBtn.on('tap', function(){
			self.rotateDraw();
		});

	},
	// 重置缩放后的位置
	setScaleDis : function(){
		var judgeLeftNo = this.imgSrcLeft + this.imgSrcWidth;
    	var judgeTopNo = this.imgSrcTop + this.imgSrcHeight;
    	if(judgeLeftNo < 0){
    		// 说明隐藏到了左边
    		this.imgSrcLeft = 5;
    		this.oldX = this.imgSrcLeft;
    	}
    	if(judgeTopNo < 0){
    		// 说明隐藏到了上边
    		this.imgSrcTop = 50;
    		this.oldY = this.imgSrcTop;
    	}

    	this.draw();
	},
	// 缩放函数
	toScale : function(e, w, h){
		// if(e.type == 'pinchout'){
		// 	this.scaleNum = this.oldScale + (e.scale - 1);
		// }else if(e.type == 'pinchin'){
		// 	this.scaleNum = this.oldScale - (1 - e.scale);
		// }
		if(e.scale.toFixed(2) * 100 > this.oldScale){
			this.scaleNum = this.scaleNum + 0.1;
			this.oldScale = e.scale.toFixed(2) * 100;
		}else if(e.scale.toFixed(1) * 10 < this.oldScale){
			this.scaleNum = this.scaleNum - 0.1;
			this.oldScale = e.scale.toFixed(2) * 100;
		}
		
		if(this.scaleNum >= 4){
			this.scaleNum = 4;
		}else if(this.scaleNum <= 1){
			this.scaleNum = 1;
		}
		this.imgSrcWidth = w * this.scaleNum;
		this.imgSrcHeight = h * this.scaleNum;

		this.draw();
	},
	// 参数重置
	reset : function(){
		// 设备窗口宽高
		this.windowHeight = $(window).height();
		this.windowWidth = $(window).width();
		// 基本参数设置
		this.paddingLR = 5; // 裁剪窗口的左右距离
		this.paddingT= 50; // 裁剪窗口的上距离
		this.cropWidth = this.windowWidth - this.paddingLR * 2;

		this.imgSrcWidth = this.cropWidth;
		this.imgSrcHeight = 0;
		this.imgSrcLeft = this.paddingLR;
		this.imgSrcTop = this.paddingT;
		this.oldX = this.paddingLR,
		this.oldY = this.paddingT,
		this.oldScale = 1,
		this.scaleNum = 1;

		// 原点
		this.XXX = 0;
		this.YYY = 0;

		this.panendSrcWidth = this.imgSrcWidth;
	}


});
// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HimgCrop;
} else {
    window.HimgCrop = HimgCrop;
}