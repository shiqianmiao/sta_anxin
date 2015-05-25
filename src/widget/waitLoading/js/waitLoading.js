/**
 * @desc 等待加载弹层组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-19
 */
var Ua = require('widget/clientCheck/js/clientCheck.js'),
	system = Ua.client.system,
	$,
	jq_zp = '';
	if(system.win || system.mac || system.x11){
		jq_zp = 'jquery';
	}else{
		jq_zp = 'zepto';
	}
	$ = require(jq_zp);

var waitLoading = function(){
	this.settings = {
		color : '#333',
		width : '30px',
		height : '30px',
		type : 'circle',
		loadEnd : function(){}
	};
};

$.extend(waitLoading.prototype, {

	constructor : waitLoading,

	mask : null,

	styleList : {
		circle : "circle", 
		chasingDots : "chasingDots", 
		cubeGrid : "cubeGrid", 
		doubleBounce : "doubleBounce", 
		fadingCircle : "fadingCircle", 
		pulse : "pulse", 
		rotatingPlane : "rotatingPlane", 
		threeBounce : "threeBounce", 
		wanderingCubes : "wanderingCubes", 
		wave : "wave", 
		wordpress : "wordpress"
	},

	init : function(opations){
		$.extend(this.settings, opations);
		var self = this;
		// 加载皮肤
		this.skin().done(function () {
            self._init();
        });

	},

	_init : function(){
		this._createDom(this.settings.type);
	},

	_createDom : function(type){
		var templateStr = '';
		switch(type){
			case this.styleList.circle:
				templateStr = '<div class="sk-spinner sk-spinner-circle">'
+							      '<div class="sk-circle1 sk-circle"><span></span></div>'
+							      '<div class="sk-circle2 sk-circle"><span></span></div>'
+							      '<div class="sk-circle3 sk-circle"><span></span></div>'
+							      '<div class="sk-circle4 sk-circle"><span></span></div>'
+							      '<div class="sk-circle5 sk-circle"><span></span></div>'
+							      '<div class="sk-circle6 sk-circle"><span></span></div>'
+							      '<div class="sk-circle7 sk-circle"><span></span></div>'
+							      '<div class="sk-circle8 sk-circle"><span></span></div>'
+							      '<div class="sk-circle9 sk-circle"><span></span></div>'
+							      '<div class="sk-circle10 sk-circle"><span></span></div>'
+							      '<div class="sk-circle11 sk-circle"><span></span></div>'
+							      '<div class="sk-circle12 sk-circle"><span></span></div>'
+							    '</div>';
				break;
			case this.styleList.chasingDots:
				templateStr = '<div class="sk-spinner sk-spinner-chasing-dots">'
+							      '<span class="sk-dot1"></span>'
+							      '<span class="sk-dot2"></span>'
+							    '</div>';
				break;
			case this.styleList.cubeGrid:
				templateStr = '<div class="sk-spinner sk-spinner-cube-grid">'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							      '<span class="sk-cube"></span>'
+							    '</div>';
				break;
			case this.styleList.doubleBounce:
				templateStr = '<div class="sk-spinner sk-spinner-double-bounce">'
+							      '<span class="sk-double-bounce1"></span>'
+							      '<span class="sk-double-bounce2"></span>'
+							    '</div>';
				break;
			case this.styleList.fadingCircle:
				templateStr = '<div class="sk-spinner sk-spinner-fading-circle">'
+							      '<div class="sk-circle1 sk-circle"><span></span></div>'
+							      '<div class="sk-circle2 sk-circle"><span></span></div>'
+							      '<div class="sk-circle3 sk-circle"><span></span></div>'
+							      '<div class="sk-circle4 sk-circle"><span></span></div>'
+							      '<div class="sk-circle5 sk-circle"><span></span></div>'
+							      '<div class="sk-circle6 sk-circle"><span></span></div>'
+							      '<div class="sk-circle7 sk-circle"><span></span></div>'
+							      '<div class="sk-circle8 sk-circle"><span></span></div>'
+							      '<div class="sk-circle9 sk-circle"><span></span></div>'
+							      '<div class="sk-circle10 sk-circle"><span></span></div>'
+							      '<div class="sk-circle11 sk-circle"><span></span></div>'
+							      '<div class="sk-circle12 sk-circle"><span></span></div>'
+							    '</div>';
				break;
			case this.styleList.pulse:
				templateStr = '<div class="sk-spinner sk-spinner-pulse"></div>';
				break;
			case this.styleList.rotatingPlane:
				templateStr = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';
				break;
			case this.styleList.threeBounce:
				templateStr = '<div class="sk-spinner sk-spinner-three-bounce">'
+							      '<span class="sk-bounce1"></span>'
+							      '<span class="sk-bounce2"></span>'
+							      '<span class="sk-bounce3"></span>'
+							    '</div>';
				break;
			case this.styleList.wanderingCubes:
				templateStr = '<div class="sk-spinner sk-spinner-wandering-cubes">'
+							      '<span class="sk-cube1"></span>'
+							      '<span class="sk-cube2"></span>'
+							    '</div>';
				break;
			case this.styleList.wave:
				templateStr = '<div class="sk-spinner sk-spinner-wave">'
+							      '<span class="sk-rect1"></span>'
+							      '<span class="sk-rect2"></span>'
+							      '<span class="sk-rect3"></span>'
+							      '<span class="sk-rect4"></span>'
+							      '<span class="sk-rect5"></span>'
+							    '</div>';
				break;
			case this.styleList.wordpress:
				templateStr = '<div class="sk-spinner sk-spinner-wordpress">'
+							      '<span class="sk-inner-circle"></span>'
+							    '</div>';
				break;
		}

		this.mask = $('<div></div>');
		this.mask.css({display:"none",position:"fixed",width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",top:"0",left:"0",zIndex:"100000"});		
		this.mask.append($(templateStr));
		$(this.mask).find('.sk-spinner').css({width:this.settings.width,height:this.settings.height});
		$(this.mask).find('.sk-spinner span').css({background:this.settings.color});
		if(this.settings.type == this.styleList.pulse || this.settings.type == this.styleList.rotatingPlane){
			$(this.mask).find('.sk-spinner').css({background:this.settings.color});
		}
		$('body').append(this.mask);

		if(this.settings.loadEnd){
			this.settings.loadEnd(this.mask);
		}
	},

	show : function(){
		$(this.mask).show();
		$(document).on('touchmove', this._noScrollFn);
	},

	hide : function(){
		$(this.mask).hide();
		$(document).off('touchmove', this._noScrollFn);
	},

	// 下载皮肤
    skin : function () {
        return require.async(['../skins/' + this.settings.type + '.css']);
    },

    _noScrollFn : function(ev){
    	var ev = ev || window.event;
    	if(ev.preventDefault){
    		ev.preventDefault();
    	}else{
    		ev.returnValue = false;
    	}
    }

});

// 暴露接口
if (typeof module !== 'undefined' && module.exports) {
    module.exports = waitLoading;
} else {
    window.waitLoading = waitLoading;
}
