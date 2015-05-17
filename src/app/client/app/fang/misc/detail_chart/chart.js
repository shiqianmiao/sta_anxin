var $ = require('$');
var LineChart = require('com/mobile/lib/chart/Chart.line.scrollable.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var DataShareAPI = new HttpAPI({
    path: '/datashare/'
});

// var lineColors = ['85,187,34,1','152,152,152,1','217,217,217,1'];
var lineColors = ['#55bb22','#989898','#d9d9d9'];

exports.init = function (config) {
    return new exports.chart(config);
};

exports.chart = Widget.define({
    events : {},
    init : function (config) {
        var $body = $('body');
        var self  = this;
        var chartConfig = {
            responsive : true,
            hideYLabels: false,
            scaleShowLabels: true,
            animation:false,
            labelPointTimeout:0.1
        };
        $body.css({
            'background':'#fff'
        });
        self.needShowLegend = true;
        this.config = config;

        if (config.type === 1) {
            this.$el = $('<canvas width="640" height="140"></canvas>');
            self.needShowLegend = false;
            chartConfig.responsive = false;
            chartConfig.hideYLabels = true;
            chartConfig.scaleShowLabels = false;
            chartConfig.showPointLabels = true;
        } else {
            this.$el = $('<canvas width="640" height="280"></canvas>');
        }

        this.getData(function (err, data) {
            $body.removeClass('loading');
            if (err) {
                $body.addClass('offline');
                return;
            }
            if (chartConfig.responsive) {
                $body.append($(self.resize(self.$el[0])));
            }else{
                $body.append(self.$el);
            }
            setTimeout(function () {
                self.renderChart({
                    labels : data.labels,
                    datasets : self.datasets(data.datasets, data.names)
                }, chartConfig);
            }, 300);
            NativeAPI.invoke('triggerEvent', {name: 'housingTrendChartRenderEnd'});
        });
    },
    datasets : function (data, names) {
        var datasets = [];
        var self     = this;
        // var config   = {};
        var legendHtml = '';

        data.forEach(function (item, index) {
            datasets.push({
                fillColor : 'rgba(0,0,0,0)',
                strokeColor : lineColors[index],
                pointColor : lineColors[index],
                pointStrokeColor : '#fff',
                data : item
            });
            if (names) {
                legendHtml += self.legendString(lineColors[index], names[index]);
            }
        });
        if (self.needShowLegend) {
            $('<div style="text-align:center;">'+ legendHtml +'</div>').appendTo('body');
        }
        return datasets;
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
        var ctx = self.$el[0].getContext('2d');
        if(self.chart){
            self.chart.destroy();
        }

        params.scaleLabel = '<%=value%>';
        params.tooltipTemplate = '<%if (label){%><%=label%>: <%}%><%= value%>';
        var myChart = new LineChart(ctx, data, params);
        if (this.config.type === 1) {
            this.offsetToleft();
        }
        self.chart = myChart;
    },
    offsetToleft: function () {
        var self   = this;
        var offset = this.$el.width()/2;
        var step   = parseInt(offset/20, 10);

        $('body').scrollLeft(offset);
        var timer = setTimeout(function () {
            if (!$('body').scrollLeft()) {
                var i = 1;
                var intervalTimer = setInterval(function () {
                    $('body').scrollLeft(i * step );
                    if (i >= 20) {
                        $('body').scrollLeft(self.$el.width()/2);
                        clearInterval(intervalTimer);
                        return;
                    }
                    i++;
                }, 40);
            }
            timer = 0;
        }, 2500);
    },
    legendString: function (color, name) {
        return '<span style="padding:2px 5px; color:'+color+';"><i style="padding: 5px; margin:0 5px; border-radius: 5px; display: inline-block;background:'+ color +';"></i>'+ name +'</span>';
    },
    getData: function (callback) {
        var config = this.config;
        var request;
        if (config.type === 1) {
            request = DataShareAPI.request('POST', {'interface' : 'HousingPriceTrend'}, '', {
                'class': JSON.stringify({
                    'getHousingTrend':{
                        'getCityAvgPrice':[],
                        '_classArgs':[{'city_code':config.city_code}]
                    }
                })
            });
        } else {
            request = DataShareAPI.request('POST', {'interface' : 'HousingXiaoquInfo'}, '', {
                'class': JSON.stringify({
                    'XiaoquModel':{ 'getXiaoquBaseInfoByCityPinyin':[ config.city_code, config.name] }
                })
            });
        }

        request
            .done(function (data) {
                var labels   = [];
                var datasets = [];
                var names    = [];
                var colors   = [];
                if (config.type === 1) {
                    if (data &&
                        data.getHousingTrend &&
                        data.getHousingTrend.getCityAvgPrice
                    ) {
                        data = data.getHousingTrend.getCityAvgPrice;
                    } else {
                        data = null;
                    }
                } else if (data && data.XiaoquModel && data.XiaoquModel.getXiaoquBaseInfoByCityPinyin) {
                    data = data.XiaoquModel.getXiaoquBaseInfoByCityPinyin;
                }
                if (data && config.type === 1) {
                    var myArr = [];
                    datasets = data.map(function (row) {
                        return row.price;
                    });
                    labels = data.map(function (row) {
                        return row.month.slice(-2)+'月';
                    });
                    myArr.push(datasets.reverse());
                    data.datasets = myArr;
                    data.labels = labels.reverse();

                }else if (data && config.type === 2) {
                    if (data.xiaoqu_qushi_data) {
                        var theData   = data.xiaoqu_qushi_data;
                        var parentKey = Object.keys(theData);
                        var theLabels = Object.keys(theData[parentKey[0]].data).reverse();

                        labels    = theLabels.length > 6 ? theLabels.slice(-6) : theLabels;

                        parentKey.forEach(function (item) {
                            names.push(theData[item].label);
                            colors.push(theData[item].label);
                            datasets.push(labels.map(function (row) {
                                    return theData[item].data[row];
                                }));
                        });
                        data.labels = labels.map(function (row) {
                            return row.slice(-2) + '月';
                        });
                        data.names    = names;
                        data.datasets = datasets;
                    }
                }
                callback(null, data);
            })
            .fail(function () {
                callback(new Error('网络异常，请稍候再试'));
            });
    }
});
