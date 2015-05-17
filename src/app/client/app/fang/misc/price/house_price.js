var $ = require('$');
var LineChart = require('com/mobile/lib/chart/Chart.line.scrollable.js');
var Widget = require('com/mobile/lib/widget/widget.js');

exports.chart = Widget.define({
    events : {
    },
    init : function (config) {
        var self  = this;
        var chartConfig = {
            responsive : false,
            hideYLabels: false,
            scaleShowLabels: false,
            animation:true,
            datasetStrokeWidth:2,
            bezierCurve: true,
            showPointLabels : true
        };
        this.config = config;
        this.$el = config.$el;
        this.data = config.sets || {};
        this.$canvas = $('<canvas width="'+ (config.canvasWidth || 640) +'" height="'+ (config.canvasHeight || 150) +'"></canvas>');
        this.$el.append(this.$canvas);
        setTimeout(function () {
            self.renderChart( self.data, chartConfig);
        }, 300);
    },
    renderChart : function (data, params) {
        var self = this;
        var ctx = self.$canvas[0].getContext('2d');
        if(self.chart){
            self.chart.destroy();
        }
        var myChart = new LineChart(ctx, data, params);
        self.chart = myChart;
        this.offsetToleft();
    },
    offsetToleft: function () {
        var self   = this;
        var offset = this.$canvas.width()/2;
        var step   = parseInt(offset/20, 10);

        this.$el.scrollLeft(offset);
        var timer = setTimeout(function () {
            if (!self.$el.scrollLeft()) {
                var i = 1;
                var intervalTimer = setInterval(function () {
                    self.$el.scrollLeft(i * step );
                    if (i >= 20) {
                        self.$el.scrollLeft(offset);
                        clearInterval(intervalTimer);
                        return;
                    }
                    i++;
                }, 10);
            }
            timer = 0;
        }, 2500);
    }
});

exports.toggleMore = function (config) {
    config.$el.on('click', '[data-role="toggleMoreBtn"]', function () {
        config.$el.toggleClass('active');

        if (config.$el.hasClass('active')) {
            config.$toggleMoreBtn.text('收起');
        } else {
            config.$toggleMoreBtn.text('展开全部');
        }
    });
};