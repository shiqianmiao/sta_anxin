
var iScroll = require('lib/iScroll/iScroll.js'),
	$ = require('zepto'),
	Hiscroll = exports;

var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;



Hiscroll.loaded = function(opations) {

	this.type = opations.opationType;

	this.changeType = function(){
		switch(this.type){
			case 'onlyTop' :
				$('#pullDown').css({visibility: 'visible'});
				$('#pullUp').css({visibility: 'hidden', height:0});
			break;
			case 'onlyBottom' :
				$('#pullUp').css({visibility: 'visible', height:'51px'});
				$('#pullDown').css({visibility: 'hidden'});
			break;
			case 'double' :
				$('#pullUp').css({visibility: 'visible', height:'51px'});
				$('#pullDown').css({visibility: 'visible'});
			break;
			case 'none' :
				$('#pullUp').css({visibility: 'hidden', height:0});
				$('#pullDown').css({visibility: 'hidden'});
			break;
			default :
				$('#pullUp').css({visibility: 'hidden', height:0});
				$('#pullDown').css({visibility: 'hidden'});
			break;
		}
	}

	this.changeType();

	var self = this;

	var freshendFn = opations.refreshCallback ? opations.refreshCallback : function(){};
	var loadmoreFn = opations.loadMoreCallback ? opations.loadMoreCallback : function(){};

	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;

	// 点击加载更多
	// $(pullUpEl).on('tap', function(){
	// 	$(this).find('.pullUpIcon').css({display: 'inline-block'});
	// 	$(this).addClass('loading');
	// 	pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';

	// 	loadmoreFn(myScroll);

	// })
	
	

	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			} else if (pullUpEl.className.match('loading')) {
				// $(pullUpEl).find('.pullUpIcon').css({display: 'none'});
				// $(pullUpEl).removeClass('loading');
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		onScrollMove: function () {
			// console.log(this.y + '-' + this.maxScrollY);
			if(self.type == 'onlyTop' || self.type == 'double'){
				if (this.y > 5 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '放开刷新...';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					this.minScrollY = -pullDownOffset;
				}
			}
			if(self.type == 'onlyBottom' || self.type == 'double'){
				console.log(this.y + '-' + this.maxScrollY);
				if (this.y < (this.maxScrollY - 30) && !pullUpEl.className.match('flip') && this.y < -pullDownOffset) {
					pullUpEl.className = 'flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '放开加载更多...';
					// this.maxScrollY = this.maxScrollY;
				} else if (this.y > (this.maxScrollY + 10) && pullUpEl.className.match('flip')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
					this.maxScrollY = pullUpOffset;
				}
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				freshendFn(myScroll);	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
				loadmoreFn(myScroll);	// Execute custom function (ajax call?)
			}
		}
	});

	Hiscroll.myScroll = myScroll;
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 200);
	// if(!freshLabel){
	// 	$('#pullDown').css({visibility: 'hidden'});
	// }
}

