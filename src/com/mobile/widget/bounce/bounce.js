var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var normalTmpl = require('com/mobile/widget/bounce/template/normal.tpl');

exports.normal = Widget.define({
    events: {
        'click [data-role="button"]': 'start'
    },
    init: function(config) {
        this.config = config;
    },
    getData: function(callback) {
        var postArray = [0, 1, 2, 3, 4, 5, 6, 7];

        var onComplete = function() {
            window.alert('complete');
        };

        callback(postArray, onComplete);
    },
    start: function() {
        var self = this;
        var config = this.config;

        var createTmpl = function(dataArray, onComplete) {

            /*
            <b>0</b>
            <div style="top: -111px;">    
                <b>3</b>
                <b>2</b>
                <b>1</b>
                <b>0</b>
            </div>
            */
            var html = normalTmpl({
                data: dataArray.reverse(),
                // width: config.itemWidth,
                height: config.itemHeight
            });

            config.$board
                .find('.js-entry')
                .remove()
                .end()
                .append(html);

            self.active(onComplete);
        };

        this.getData(createTmpl);
    },
    active: function(onComplete) {
        var config = this.config;

        config.$board.find('.js-entry').each(function() {
            $(this)
                .animate({
                    top: 0
                }, {
                    duration: config.duration,
                    complete: onComplete
                });
        });
    }
});