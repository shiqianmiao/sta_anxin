var confirmPopRender = require('com/mobile/page/milan/template/confirm_pop_fav.tpl');
var $ = require('$');
var EventEmitter = require('com/mobile/lib/event/event.js');

function Confirm ($el) {
    if( Confirm.unique !== undefined ){
        return Confirm.unique;
    }
    var self = this;
    this.$el = $el || $('.js-confirm-pop');
    this.$el
    .on('click','[data-role="confirm"]',function(e){
        e.preventDefault();
        self.hidePop();
        self.trigger('yes');
    })
    .on('click','[data-role="cancel"]',function(e){
        e.preventDefault();
        self.hidePop();
        self.trigger('no');
    });
    this.showPop = function (data) {
        self.$el.html(confirmPopRender({data:data})).show();
    };
    this.hidePop = function () {
        self.$el.hide();
    };
    Confirm.unique = this;
}
Confirm.prototype = new EventEmitter();
Confirm.prototype.constructor = EventEmitter;

return Confirm;