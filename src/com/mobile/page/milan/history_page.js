var Widget            = require('com/mobile/lib/widget/widget.js');
var $                 = require('$');
var historyListRender = require('com/mobile/page/milan/template/history_list.tpl');

var Storage           = require('com/mobile/lib/storage/storage.js');
var storage           = new Storage('favPost');

exports.historyOperate = Widget.define({
    events: {
        'click [data-role="delete"]' : 'remove'
    },
    init : function (config) {
        this.config      = config;
        this.$el         = config.$el;
        this.selects     = '';
        this.selectedAll = false;
    },
    remove : function () {
        if(!this.deleteFromLocalStorage()){
            window.alert('删除成功！');
            window.location.reload();
        }
    },
    deleteFromLocalStorage: function () {
        storage.set('hist_post', null);
        return this.getData();
    },
    getData : function () {
        return storage.get('hist_post') ? storage.get('hist_post') : null;
    }
});

exports.historyList = Widget.define({
    events: {
        'click [data-role="loadMore"]' : function (e) {
            e.preventDefault();
            this.$el.find('div.post-list.hide').show();
            $(e.currentTarget).hide();
        }
    },
    init : function (config) {
        var self    = this;
        this.config = config;
        this.$el    = config.$el;
        $(document).ready(function(){
            self.renderList({list: self.getData()});
        });
    },
    getData : function () {
        var localPostDatas = [];
        var newFavPostDatas = this._getData();
        if (newFavPostDatas) {
            newFavPostDatas.puids.forEach(function (puid) {
                var data = newFavPostDatas.postList[puid];
                data._fromNew = true;
                localPostDatas.unshift(data);
            });
        }
        return localPostDatas;
    },
    renderList : function (data) {
        var tpl = historyListRender({data:data});
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
        return storage.get('hist_post') ? storage.get('hist_post') : null;
    }

});