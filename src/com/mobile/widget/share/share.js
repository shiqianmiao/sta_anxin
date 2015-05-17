var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');

module.exports = Share;

function Share (config) {
    var config = config || {};
    var imgs = document.getElementsByTagName('IMG'),len = imgs.length;
    var defaults = {
        url: window.location,
        title: document.title,
        desc: document.title,
        imgUrl: len > 0 ? imgs[0].src : '',
        imgTitle: len > 0 ? imgs[0].title : ''
    };
    if (config.$btnEl) {
        this.$btnEl = config.$btnEl;
        this.shareObj = $.extend(defaults, config.shareObj || {});
    }

    this.initialize();
}
Share.getPlantform = function() {
    return $.os;
};
Share.getVersion = function(version) {
    var arr = version.split('.'), result= parseFloat(arr[0] + '.' + arr[1]);
    return result;
};

Share.prototype = {
    qqBrowser :{ version: 0, is: false,lowerApi: 'http://3gimg.qq.com/html5/js/qb.js',higher: 'http://jsapi.qq.com/get?api=app.share', apiReady: false},
    ucBrowser:{ version: 0, is: false},
    ucPlatform: {weibo: 'SinaWeibo',friend:'WechatFriends',circle:'WechatTimeline'},
    ucOldPlatform: {weibo: 'kSinaWeibo',friend:'kWeixin',circle:'kWeixinFriend'},
    qqPlatform: {weibo: 11,friend:1,circle:8},
    shareEnable : false,
    isWeixinBrowser: false,
    isGanjiApp: false,
    platforms: null,
    $btnEl: $('body'),
    shareObj: {},
    $el: $('#js-share-wrap'),
    scrollTop: document.body.scrollTop,
    initialize: function() {
        this.initCss();
        this.platforms = Share.getPlantform();
        this.initBrowserInfo();
        this.initQQApi();
        this.render();
        this.initEvent();
    },
    initCss: function(css) {
        require.async(css || 'http://sta.ganjistatic1.com/src/css/mobile/milan/share.css');
    },
    initEvent: function() {
        var self = this,shareObj = this.shareObj;
        if(!this.shareEnable) {
            this.$el.on('click',function(e){
                self.close();
                e.preventDefault();
            });
        }
        this.$btnEl.on('click',function(e){
            var shareObj = self.shareObj;
            if(self.isGanjiApp) {
                NativeAPI.invoke(
                    'showShareDialog',
                    {
                        title: shareObj.title,
                        text: shareObj.desc,
                        url: shareObj.url,
                        img: shareObj.imgUrl
                    }
                );
            } else {
                if (self.isNewUc) {
                    self.shareWithUc(shareObj.url,shareObj.title,shareObj.desc,shareObj.imgUrl,$(this).data('platform'));
                    return;
                }
                self.show();
                e.preventDefault();
            }
        });
        this.$el.on('click','.js-share-item', function(e) {
            self.share(shareObj.url,shareObj.title,shareObj.desc,shareObj.imgUrl,$(this).data('platform'));
            e.preventDefault();
        });
        this.$el.on('click', '.js-close',function(e) {
            self.close();
            e.preventDefault();
        });
    },
    initBrowserInfo: function() {
        var self = this;
        var qqBrowser = self.qqBrowser, ucBrowser = self.ucBrowser;
        qqBrowser.is = (navigator.appVersion.split('MQQBrowser/').length > 1) && (navigator.appVersion.split('MicroMessenger/').length <= 1) &&  (navigator.appVersion.split('QQ/').length <= 1) ? true : false;
        ucBrowser.is = (navigator.appVersion.split('UCBrowser/').length > 1) ? true : false;
        if (qqBrowser.is) {
            qqBrowser.version = Share.getVersion(navigator.appVersion.split('MQQBrowser/')[1]);
        }
        if (this.ucBrowser.is) {
            ucBrowser.version = Share.getVersion(navigator.appVersion.split('UCBrowser/')[1]);
        }
        if ((qqBrowser.is && qqBrowser.version >= 5.4 && self.platforms.ios) || (qqBrowser.is && qqBrowser.version >= 5.3 && self.platforms.android) ||
            (ucBrowser.is && ucBrowser.version >= 10.2 && self.platforms.ios) || (ucBrowser.is && ucBrowser.version >= 9.7 && self.platforms.android)) {
            if (ucBrowser.is && ucBrowser.version >= 10.3 && self.platforms.ios) {
                self.isNewUc = true;
            }
            self.shareEnable = true;
        }  else {
            self.shareEnable = false;
        }


        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)+''==='micromessenger' ||  navigator.appVersion.split('QQ/').length > 1) {
            self.isWeixinBrowser = true;
        } else {
            self.isWeixinBrowser = false;
        }
        self.isGanjiApp = NativeAPI.isSupport();
    },
    initQQApi: function() {
        var self = this;
        var qqBrowser = self.qqBrowser;
        if (qqBrowser.is && self.shareEnable) {
            var url = (qqBrowser.version < 5.4) ? qqBrowser.lowerApi : qqBrowser.higher, node= document.createElement('script'), body = document.getElementsByTagName('body')[0];
            node.onload = function() {
                qqBrowser.apiReady = true;
            };
            node.setAttribute('src', url);
            body.appendChild(node);
        }
    },
    share: function(url,title,description,shareImg,platform) {
        var self = this;
        if (self.shareEnable) {
            if (self.qqBrowser.is) {
                self.shareWithQQ(url,title,description,shareImg,platform);
            } else {
                self.shareWithUc(url,title,description,shareImg,platform);
            }
            setTimeout(function () {
                self.close();
            }, 300);
        }
    },
    shareWithUc: function(url,title,description,shareImg,sharePlatform) {
        var self = this;
        if (typeof (window.ucweb) !== 'undefined') {
            window.ucweb.startRequest('shell.page_share', [title, description, url, self.ucPlatform[sharePlatform], '', '', '']);
        } else {
            if (typeof (window.ucbrowser) !== 'undefined') {
                window.ucbrowser.web_share(title, description, url, self.ucPlatform[sharePlatform], '', '@手机赶集网', 'share_img_id');
            }
        }
    },
    shareWithQQ:function(url,title,description,shareImg,sharePlatform) {
        var self = this,qqBrowser = self.qqBrowser;
        var obj = {url: url,title: title,description: description,img_url: shareImg,img_title:title,to_app:self.qqPlatform[sharePlatform],cus_txt: '请输入此时此刻想要分享的内容'};
        if (typeof (window.browser) !== 'undefined') {
            if (typeof (window.browser.app) !== 'undefined' && qqBrowser.version >= 5.4) {
                window.browser.app.share(obj);
            }
        } else {
            if (typeof (window.qb) !=='undefined' && qqBrowser.version < 5.4) {
                window.qb.share(obj);
            }
        }
    },
    render: function() {
        var htmlArr = [];
        if (this.isGanjiApp) {
            return;
        }
        if (!this.shareEnable) {
            if(this.isWeixinBrowser) {
                htmlArr = [
                    '<div class="share">',
                    '<div class="share-cont">请点击右上角<br>将它发送给指定朋友<br>或分享到朋友圈</div>',
                    '</div>'
                ];
            } else {
                htmlArr = [
                    '<div class="share share-browser">',
                    '<div class="share-cont">点此分享给您的朋友</div>',
                    '</div>'
                ];
            }
        } else {
            htmlArr = [
                '<section id="js-share-wrap" class="container-wrap">',
                '<div class="js-share-bg shareBg js-container">',
                '<div class="sharebox"><div class="float_cross fTitle js-close"></div>',
                '<div class="shareZone">',
                '<div class="platforms_big">',
                '<ul>',
                '<li><span class="js-share-item splat_ico fcircle_big" data-platform="circle"></span><p>微信朋友圈</p></li>',
                '<li><span class="js-share-item splat_ico friend_big" data-platform="friend"></span><p>微信好友</p></li>',
                '<li><span class="js-share-item splat_ico sina_big" data-platform="weibo"></span><p>新浪微博</p></li>',
                '</ul>',
                '</div>',
                '</div>',
                '<span class="share-img" id="share_img_container" style="display:none">',
                '<img class="shareimg_style" src="' + this.shareObj.imgUrl + '" id="share_img_id" style="width:64px;height:64px;"/>',
                '</span>',
                '</div>',
                '</section>'
            ];
        }
        this.$el = $(htmlArr.join(''));
        this.$el.find('.shareBg').css('height', (document.documentElement.clientHeight + 50) + 'px');
        $('body').append(this.$el);
    },
    show: function() {
        this.$el.show();
    },
    close: function() {
        this.$el.hide();
    }
};


