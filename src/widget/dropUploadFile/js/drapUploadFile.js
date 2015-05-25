/**
 * @desc 拖拽上传组件(不兼容IE，IE浏览器可使用其他上传方式。)
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-15
 */

var $ = require('jquery');

var FILE_EXT_REGEXP = /\.([^\.]+)$/i;	// 获取文件扩展名的正则

// 构造函数
var drapUploadFile = function () {
	// 存储上传的文件对象
	if(typeof FormData === 'function'){	
		// 支持FormData的->function 不支持FormData的->undefined
		this.fd = new FormData();
	}else{
		this.fd = '';
	}

	// 上传文件的数量
	this.length = 0;
	// 默认参数
	this.settings = {
		perFileSize : 3145728, // 每个文件的最大字节 默认3M
		targetEle : null,
		type : [],	// type为空的话，支持所有类型数据上传
		url : '',
		successCallback : function(){},
		errorCallback : function(){},
		dragenterFn : function(){},
		dragoverFn : function(){},
		dragleaveFn : function(){}
	};
};
$.extend(drapUploadFile.prototype, {

	constructor : drapUploadFile,

	/**
	 * @desc 初始化方法
	 * @param	{obj}->JSON opations : 配置参数
	 */
	init : function (opations) {
		$.extend(this.settings, opations);
		
		this.bindDrops();

	},

	/**
	 * @desc 给目标元素添加事件
	 */
	bindDrops : function () {
		if(this.settings.targetEle){
			targetObj = this.settings.targetEle;
		}else{
			console.log("目标元素未定义");
			return false;
		}
		var _this = this;
		this.addHandler(targetObj, 'dragenter', function(event){

			_this.preventDefault(event);

			_this.readFile(event, _this);

		});
		this.addHandler(targetObj, 'dragover', function(event){

			_this.preventDefault(event);

			_this.readFile(event, _this);

		});
		this.addHandler(targetObj, 'drop', function(event){

			_this.preventDefault(event);

			_this.readFile(event, _this);

		});
		this.addHandler(targetObj, 'dragleave', function(event){

			_this.preventDefault(event);

			_this.readFile(event, _this);

		});
	},
	/**
	 * @desc 读取文件
	 */
	readFile : function (event, self) {
		var event = event || window.event;

		if(event.type == "dragenter" && self.settings.dragenterFn){
			self.settings.dragenterFn();
		}else if(event.type == "dragover" && self.settings.dragoverFn){
			self.settings.dragoverFn();
		}else if(event.type == "dragleave" && self.settings.dragleaveFn){
			self.settings.dragleaveFn();
		}

		if(event.type == "drop"){
			var	files = event.dataTransfer.files,
				i = 0,
				len = files.length;

			// 检测上传的文件是否符合扩展名要求
			var isTypePass = self.checkFileType(files);
			if(!isTypePass){
				console.log('上传的文件中有不符合要求的文件，请检查文件扩展名');
				return false;
			}
			// 检测上传的文件是否符合文件大小要求
			var isSizePass = self.checkFileSize(files);
			if(!isSizePass){
				console.log('上传的文件中有超过大小限制的文件');
				return false;
			}

			while(i < len){
				self.length++;
				self.fd.append("file" + i, files[i]);
				i++;
			}

		}

	},

	/**
	 * @desc 事件绑定函数
	 * @param	{obj} element : DOM元素
	 * @param	{string} type : 事件名称
	 * @param	{function} handler : 事件函数
	 */
	addHandler : function (element, type, handler) {
		if(element.addEventListener){
			element.addEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.attachEvent("on" + type, handler);
		}else{
			element["on" + type] = handler;
		}
	},

	/**
	 * @desc 阻止默认事件
	 */
	preventDefault: function(event){
		var event = event ? event : window.event;
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
		
	},

	/**
	 * @desc 执行上传
	 */
	toUpload : function(){

		var _this = this;

		if(this.settings.url && this.length){
			$.ajax({
				url: this.settings.url,
				type: 'POST',
				data: this.fd,
				/**
				*必须false才会自动加上正确的Content-Type
				*/
				contentType:false,
				/**
				* 必须false才会避开jQuery对 formdata 的默认处理
				* XMLHttpRequest会对 formdata 进行正确的处理
				*/
				processData:false
			}).done(function(result){
				if(_this.settings.successCallback){
					  _this.settings.successCallback(result);
				}
			}).fail(function(err){
				if(_this.settings.errorCallback){
					  _this.settings.errorCallback(err);
				}
			});
		}else{
			console.log("url地址未定义或未选择要上传的文件");
			return false;
		}
			
	},
	/**
	 * @desc 检测文件后缀(扩展名)是否符合要求
	 * @param (object)->FileList 文件列表
	 * @return (bool) true | false
	 */
	checkFileType : function (files) {
		var i = 0,
			len = files.length;
		while(i < len){
			var suffix = files[i].name.match(FILE_EXT_REGEXP)[1];

			if(this.settings.type.length){
				
				var index = this.settings.type.indexOf(suffix);
				if(index < 0){
					return false;
				}
			}
			i++;
		}

		return true;
	},

	/**
	 * @desc 检测文件大小是否符合要求
	 * @param (object)->FileList 文件列表
	 * @return (bool) true | false
	 */
	checkFileSize : function (files) {
		var i = 0,
			len = files.length;
		while(i < len){

			if(files[i].size > this.settings.perFileSize){
				return false;
			}
			i++;
		}

		return true;
	}



});

// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = drapUploadFile;
} else {
    window.drapUploadFile = drapUploadFile;
}
