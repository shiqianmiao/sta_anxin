var LineChart = require('com/mobile/lib/chart/Chart.line.scrollable.js');
var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events : {},
    init : function (config) {
        this.config = config;
        this.$el = config.$el;

        config.chartData = {
            'label': ['一月', '二月', '三月', '四月','五月','六月', '七月','八月','九月', '十月', '十一月', '十二月'],
            'value3': ['5092','5122','5151','5159','5109','5727', '3092','3122','3131','3139','3109','3727']
        };

        this.renderChart(config.chartData, config.percent);
    },
    renderChart : function (data, percent) {
        var self = this;
        var ctx = self.$el[0].getContext('2d');
        if(self.chart){
            self.chart.destroy();
        }
        var lineChartData = {
            labels : data.label,
            datasets : [
                {
                    label: 'My First dataset',
                    fillColor : 'rgba(230,230,230,0)',
                    strokeColor : 'rgba(205,248,203,1)',
                    pointColor : 'rgba(205,248,203,1)',
                    pointStrokeColor : '#fff',
                    pointHighlightFill : '#fff',
                    pointHighlightStroke : 'rgba(220,220,220,1)',
                    data : data.value3
                }
            ]
        };
        var params = {
            responsive : false,
            hideYLabels: true,
            scaleShowLabels: false
        };
        if (percent === true) {
            params.scaleLabel = '<%=value%><%= "%" %>';
            params.tooltipTemplate = '<%if (label){%><%=label%>: <%}%><%= value%><%= "%" %>';
        }
        var myChart = new LineChart(ctx, lineChartData, params);
        self.chart = myChart;
    }
});