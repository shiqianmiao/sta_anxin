var $ = require('$');
var LineChart = require('com/mobile/lib/chart/Chart.line.js');
var Widget = require('com/mobile/lib/widget/widget.js');

exports.chart = Widget.define({
    events : {},
    init : function (config) {
        var self  = this;
        var chartConfig = {
            responsive : true,
            hideYLabels: false,
            scaleShowLabels: true,
            animation:false,
            labelPointTimeout:0.1,
            pointDotStrokeWidth: 3,
            datasetStrokeWidth:3,
            bezierCurve: false
        };
        this.config = config;
        this.$el = config.$el;
        this.data = config.sets || {};
        this.$canvas = $('<canvas width="640" height="460"></canvas>');
        this.$el.append($(this.resize(this.$canvas[0])));
        setTimeout(function () {
            self.renderChart( self.data, chartConfig);
        }, 300);
    },
    resize: function (canvas) {
        var newWidth  = $('body').width();
        var newHeight = newWidth / (canvas.width/canvas.height);

        canvas.width = newWidth;
        canvas.height= newHeight;
        return canvas;
    },
    renderChart : function (data, params) {
        var self = this;
        var ctx = self.$canvas[0].getContext('2d');
        if(self.chart){
            self.chart.destroy();
        }

        params.scaleLabel = '<%=value%>';
        params.tooltipTemplate = '<%if (label){%><%=label%>: <%}%><%= value%>';
        var myChart = new LineChart(ctx, data, params);
        self.chart = myChart;
    }
});
