/**
 * @desc 菜单组件
 * @copyright (c) 2013 273 Inc
 * @author 缪石乾
 * @since 2013-09-12
 */

var $ = require('jquery');
var _ = require('underscore');
var Backend = require('com/backend/js/backend.js');
var Backbone = require('lib/backbone/backbone.js');


var Tongji = Backbone.View.extend({
    //获取统计数量的url
    url : '',
    refreshTime : 0, //过多久刷新数量
    rsyncDom : '', //是否要同步数量到其他元素上

    constructor : function (el) {

        this.el = el;
        Backbone.View.apply(this, arguments);
    },
    initialize : function () {
        var $el = this.$el;

        this.url = $el.data('url') || '';
        this.refreshTime = $el.data('time') || 0;
        this.rsyncDom = $el.data('rsync') || '';

        if (this.url != '') {
            this.render();
        }
    },
    render : function () {
        var self = this;

        $.ajax({
            url : self.url,
            type : "POST",
            dataType : "json",
            data : {
                
            },
            success : function(result) {
                if (result.errorCode) {
                    //失败
                    //Backend.trigger('alert-error', result.msg);
                } else {
                    //成功
                    self.$el.html(result.data);
                    if (self.rsyncDom != '' && $(self.rsyncDom).length > 0) {
                        $(self.rsyncDom).html(result.data);
                    }
                }
            },
            error : function() {
                //Backend.trigger('alert-error', "获取菜单数量失败!");
            }
        });
        //定时刷新统计的数量
        if (self.refreshTime > 0) {
            setInterval(function(){
                $.ajax({
                    url : self.url,
                    type : "POST",
                    dataType : "json",
                    data : {
                        
                    },
                    success : function(result) {
                        if (result.errorCode) {
                            //失败
                            //Backend.trigger('alert-error', result.msg);
                        } else {
                            //成功
                            self.$el.html(result.data);
                            if (self.rsyncDom != '' && $(self.rsyncDom).length > 0) {
                                $(self.rsyncDom).html(result.data);
                            }
                        }
                    },
                    error : function() {
                        //Backend.trigger('alert-error', "获取菜单数量失败!");
                    }
                });
            }, self.refreshTime);
        }
    },
});

module.exports = function (el) {

    return new Tongji(el);
}
