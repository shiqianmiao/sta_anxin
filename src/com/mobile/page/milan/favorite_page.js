var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var BasePage = require('./base_page.js');
var Confirm = require('com/mobile/page/milan/widget/confirm.js');
var favoriteListRender = require('com/mobile/page/milan/template/favorite_list.tpl');
var UrlParams = require('com/mobile/page/milan/widget/urlParams.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');

var storage = new Storage('favPost');
var GanjiUserInfo = Cookie.get('ssid');
var cityDomain = Cookie.get('cityDomain');

$.extend(exports, BasePage);

exports.favoriteOperate = Widget.define({
    events: {
        'click [data-role="selectAll"]' : 'selectAll',
        'click [data-role="edit"]'      : 'edit',
        'click [data-role="cancel"]'    : 'cancel',
        'click [data-role="delete"]'    : 'remove',
        'click [data-role="item"] input[type="checkbox"]' : 'select'
    },
    init : function (config) {
        this.config      = config;
        this.$el         = config.$el;
        this.selects     = '';
        this.selectedAll = false;
        this.syncToServer();
    },
    select : function () {
        if (this.getSelect(true).length < this.getSelect().length - 1) {
            this.config.$selectAll[0].checked = false;
            this.selectedAll = false;
        }else{
            this.config.$selectAll[0].checked = true;
            this.selectedAll = true;
        }
    },
    selectAll : function () {
        if(this.selectedAll){
            this.deSelectAll();
        }else{
            this._selectAll();
        }
    },
    _selectAll : function () {
        var arr = this.config.$item
                    .find('input[type="checkbox"]');
        arr.forEach(function (item) {
            item.checked = true;
        });
        this.selectedAll = true;
    },
    deSelectAll : function () {
        var arr = this.getSelect();
        arr.forEach(function (item) {
            item.checked = false;
        });
        this.selectedAll = false;
    },
    getSelect : function (tag) {
        var set = [];
        var isForValue = tag || false;
        if (isForValue) {
            set = this.config.$item
            .find('input[type="checkbox"]:checked');
        }else{
            set = this.config.$el
            .find('input[type="checkbox"]');
        }
        return set;
    },
    getSelectParam : function () {
        var arr = this.getSelect(true);
        var values = [];
        arr.forEach(function(item){
            values.push(item.value);
        });
        return values;
    },
    edit : function () {
        this.$el.addClass('active');
    },
    cancel : function () {
        this.$el.removeClass('active');
        this.deSelectAll();
    },
    remove : function () {
        var self = this;
        var params = this.getSelectParam();
        if (params.length > 0) {
            var confirm  = new Confirm();
            confirm.showPop('确定要删除吗？');
            confirm
                .on('yes', function () {
                    self.cancel();
                    confirm.off('yes');
                    self.deleteFromLocalStorage(params);
                    if (GanjiUserInfo && self.config.deleteUrl) {
                        self.deleteFromServer(params);
                    }else{
                        window.location.reload();
                    }
                });
        }
    },
    deleteFromLocalStorage: function (puids) {
        var savedPosts = storage.get('post') || {};
        puids.forEach(function (puid) {
            if (!puid) {
                return;
            }
            delete savedPosts[puid];
        });
        storage.set('post', savedPosts);
    },
    syncToServer: function () {
        var isSync = this.getSync() || false;
        if (typeof isSync === 'string') {
            isSync = isSync==='false'? false : true;
        }
        var localPostDatas = storage.get('post');
        var self = this;
        if(GanjiUserInfo && !isSync) {
            var puids = [];
            $.each(localPostDatas, function(i, v) {
                var puid = v.puid;
                puids.push(puid);
            });

            if(puids.length) {
                puids = puids.join(',');
            }

            $.post('/'+ cityDomain +'_user/favorite_add/', {puid: puids}, function() {
                isSync = true;
                self.setSync(isSync);
                window.location.reload();
            });
        }
    },
    setSync : function (tag) {
        try {
                window.localStorage.setItem('ganji_sync', tag);
            } catch (ex) {

        }
    },
    getSync : function () {
        return window.localStorage.getItem('ganji_sync');
    },
    deleteFromServer: function (puids) {
        var self = this;
        window.location.href = self.config.deleteUrl +'?puid='+ puids.join(',');
    }
});

exports.favoriteList = Widget.define({
    events: {},
    init : function (config) {
        var page = UrlParams.getUrlParams('page') || 1;
        this.config = config;
        this.$el    = config.$el;
        this.pageStep = config.pageStep || 10;
        this.renderList(this.getCurrentPageData(page));
    },
    getData : function () {
        var localPostDatas = [];
        var newFavPostDatas = this._getData();
        if (newFavPostDatas) {
            // newFavPostDatas = JSON.parse(newFavPostDatas);
            Object.keys(newFavPostDatas).forEach(function (puid) {
                var data = newFavPostDatas[puid];
                data._fromNew = true;
                localPostDatas.push(data);
            });
        }
        return localPostDatas;
    },
    renderList : function (data) {
        if(GanjiUserInfo){
            window.location.href = '/'+ cityDomain +'_user/favorite';
        }
        var tpl = favoriteListRender({data:data});
        var self = this;
        self.$el.html(tpl);
        try{
            Widget.initWidget('#postList');
        }catch(ex){}
        try{
            Widget.initWidget('#gjPage');
        }catch(ex){}
    },
    _getData : function () {
        return storage.get('post');
    },
    getCurrentPageData : function (page) {
        if (isNaN(page)) {
            return null;
        }
        var self = this;
        var data = self.getData();
        var currentPage = page < 1 ? 1 : page;
        var postList = data.slice((currentPage - 1) * self.pageStep, currentPage * self.pageStep);
        if (postList.length===0 && page >1) {
            BasePage.tip('当前页已经没有内容，正在为你跳转...');
            setTimeout(function(){
                window.location.href = window.location.origin + window.location.pathname;
            }, 2000);
        }
        return {
            list: postList,
            page: currentPage,
            cityDomain: cityDomain,
            pageCount: Math.ceil(data.length/self.pageStep)
        };

    }

});