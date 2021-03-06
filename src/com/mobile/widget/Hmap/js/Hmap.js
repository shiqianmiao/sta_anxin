/**
 * @desc 移动端 选择地址 组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-26
 */

var $ = require('zepto');

var Hmap = function(opations){

	// 配置参数
	this.settings = {
		perAddrOnclick: function(){}
	};

	$.extend(this.settings, opations);


	this.tpl = '<section id="mobile-addr-mark">'
+			'<header class="select-addr-top boxSha">'
+				'<a class="back" href="#"></a>'
+				'<section class="addr-input-wrap borR-3">'
+					'<img src="imgs/addr.png" class="addr-img">'
+					'<input type="text" placeholder="请输入您的常驻地址" class="addr-input" id="addr-input" />'
+				'</section>'
+			'</header>'
+			'<ul class="addr-list">'
+			'</ul>'
+			'<div id="l-map"></div>'
+		'</section>';

	this.mobileAddrMark = null;
	this.backBtn = null;

	this.Geocoder = null;
	this.Autocomplete = null;
	this.Geolocation = null;

	this.showTip = false; // 是否显示我的地址以及当前地址的tip提示

	// 当前经纬度
	this.longitude = 0;
	this.latitude = 0;

	this.init();

	


};

var proto = Hmap.prototype;

$.extend(proto, {

	constructor : Hmap,
	/**
	 * @desc 初始化
	 *
	 */
	init : function(){
		this.createDom();

	},
	/**
	 * @desc 加载DOM
	 *
	 */
	createDom : function(){
		var self = this;

		// window.BMap_loadScriptTime = (new Date).getTime();
		// // 加载百度地图API script
		// var mapApiScript = document.createElement('script');
		// mapApiScript.src = 'http://api.map.baidu.com/api?v=2.0&ak=SYx6kkaDqpde5gXR06zyEc7t';
		// $('head').append($(mapApiScript));

		$('body').append($(this.tpl));

		this.mobileAddrMark = $('#mobile-addr-mark');
		this.backBtn = $('#mobile-addr-mark .back');
		this.addrList = $('#mobile-addr-mark .addr-list');
		this.addrInput = $('#mobile-addr-mark .addr-input');

		self.bind();
		
	},
	/**
	 * @desc 绑定事件
	 *
	 */
	bind : function(){
		var self = this;
		// 点击返回按钮
		this.backBtn.on('tap', function(){
			self.hide();
		});

		// 实例化地址解析实例
		var myGeo = new BMap.Geocoder();
		this.Geocoder = myGeo;

		// 实例化定位
		var Geolocation = new BMap.Geolocation();
		this.Geolocation = Geolocation;
		this.Geolocation.getCurrentPosition(function(res){
			self.longitude = res.longitude;
			self.latitude = res.latitude;
		});

		// 实例化地图 自动完成api
		var ac = new BMap.Autocomplete({
			"input" : "addr-input",
			"location" : "北京市",
			onSearchComplete : function(){
				// 清空列表
				self.removeList();

				 console.log(ac.getResults());
				var resultsArr = ac.getResults().Nq,
					len = resultsArr.length;

				for(var i = 0; i < len; i++){

					(function(i){

						var details = resultsArr[i].province + resultsArr[i].city + resultsArr[i].district + resultsArr[i].street + resultsArr[i].streetNumber;
						var oLi = document.createElement('li');
						oLi.className = 'per-addr';
						oLi.innerHTML = '<h3 class="business">' + resultsArr[i].business + '</h3><p class="ccc-addr">' + details + '</p>';

						myGeo.getPoint(resultsArr[i].business, function(point){
			                if(point) {
			                    oLi.setAttribute('latitude', point.lat);
			                    oLi.setAttribute('longitude', point.lng);
			                    $(oLi).on('tap', function(){
					            	self.settings.perAddrOnclick(this, oLi.getAttribute('latitude'),  oLi.getAttribute('longitude'), resultsArr[i].business, resultsArr[i]);
					            });

								self.addrList.append($(oLi));
			                }

			            }, "北京市");


					})(i);
					
				}

			}

		});
		this.Autocomplete = ac;

		// 当地址输入表单为空的时候
		this.addrInput.on('keyup', function(){
			if($.trim($(this).val()) == ''){
				self.removeList();
			}
		});

	},
	/**
	 * @desc 显示
	 *
	 */
	show : function(addrStr){
		this.getList(addrStr);
		
		this.mobileAddrMark.css({left: 0});
	},
	/**
	 * @desc 显示
	 *
	 */
	hide : function(){
		this.mobileAddrMark.css({left: '100%'});
	},
	/**
	 * @desc 销毁检索列表
	 *
	 */
	removeList : function(){
		this.addrList.empty();
	},
	/**
	 * @desc 获取列表
	 *
	 */
	getList : function(addrStr){
		var ac = this.Autocomplete;
		var addrStr = $.trim(addrStr);
		var self = this;

		if(addrStr){
			this.myLocation(addrStr);
			this.getLocation();
		}else{
			// 没有我的地址，那就直接定位
			this.getLocation();
		}

	},
	/**
	 * @desc 定位当前地址的方法
	 *
	 */
	getLocation : function(){
		var self = this;
		// 定位
		this.Geocoder.getLocation(new BMap.Point(this.longitude,this.latitude), function(GeocoderResult){
            	var oLi = document.createElement('li')
				oLi.className = 'my-addr-tip';
				oLi.innerHTML = '当前位置';
				self.addrList.append($(oLi));
            	//alert(JSON.stringify(GeocoderResult));
            	var resultsArr = GeocoderResult.surroundingPois;
            	var len = GeocoderResult.surroundingPois.length;

            	for(var i = 0; i < len; i++){

					(function(i){

						var details = resultsArr[i].address;
						var oLi = document.createElement('li');
						oLi.className = 'per-addr';
						oLi.innerHTML = '<h3 class="business">' + resultsArr[i].title + '</h3><p class="ccc-addr">' + details + '</p>';

	                    oLi.setAttribute('longitude', resultsArr[i].point.lng);
						oLi.setAttribute('latitude', resultsArr[i].point.lat);
	                    $(oLi).on('tap', function(){
			            	self.settings.perAddrOnclick(this, oLi.getAttribute('longitude'),  oLi.getAttribute('latitude'), resultsArr[i].title, resultsArr[i]);
			            });

						self.addrList.append($(oLi));


					})(i);
					
				}

        });
	},
	/**
	 * @desc 我的位置
	 *
	 */
	myLocation : function(locationStr){
		var self = this;
		// 清空列表
		self.removeList();

		var oLi = document.createElement('li')
		oLi.className = 'my-addr-tip';
		oLi.innerHTML = '我的地址';
		self.addrList.append($(oLi));

		var oLi2 = document.createElement('li');
		oLi2.className = 'per-addr';
		oLi2.innerHTML = '<h3 class="business business2">' + locationStr + '</h3>';

		$(oLi2).on('tap', function(){
        	self.hide();
        });

		this.addrList.append($(oLi2));
	}


});


// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hmap;
} else {
    window.Hmap = Hmap;
}
