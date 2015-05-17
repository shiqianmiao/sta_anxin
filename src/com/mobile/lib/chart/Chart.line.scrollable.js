var Chart = require('./Chart.core.js');
var helpers = Chart.helpers;
var each = helpers.each;
var aliasPixel = helpers.aliasPixel;
var toRadians = helpers.radians;
require('./Chart.line.js');
var ScrollAbleScale = Chart.Scale.extend({
    calculateX : function(index){
        var
            innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
            valueWidth = innerWidth/(this.valuesCount - ((this.offsetGridLines) ? 0 : 1)),
            valueOffset;

        if (this.xLabelMinWidth > valueWidth) {
            valueWidth = this.xLabelMinWidth;
        }

        valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

        if (this.offsetGridLines){
            valueOffset += (valueWidth/2);
        }

        valueOffset += this.fixX || 0;

        return Math.round(valueOffset);
    },
    draw : function(){
        var ctx = this.ctx,
            yLabelGap = (this.endPoint - this.startPoint) / this.steps,
            xStart = Math.round(this.xScalePaddingLeft);
        if (this.display){
            ctx.fillStyle = this.textColor;
            ctx.font = this.font;
            if (!this.hideYLabels) {
                each(this.yLabels,function(labelString,index){
                    var yLabelCenter = this.endPoint - (yLabelGap * index),
                        linePositionY = Math.round(yLabelCenter);

                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    if (this.showLabels){
                        ctx.fillText(labelString,xStart - 10,yLabelCenter);
                    }
                    ctx.beginPath();
                    if (index > 0){
                        // This is a grid line in the centre, so drop that
                        ctx.lineWidth = this.gridLineWidth;
                        ctx.strokeStyle = this.gridLineColor;
                    } else {
                        // This is the first line on the scale
                        ctx.lineWidth = this.lineWidth;
                        ctx.strokeStyle = this.lineColor;
                    }

                    linePositionY += helpers.aliasPixel(ctx.lineWidth);

                    ctx.moveTo(xStart, linePositionY);
                    ctx.lineTo(this.width, linePositionY);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;
                    ctx.beginPath();
                    ctx.moveTo(xStart - 5, linePositionY);
                    ctx.lineTo(xStart, linePositionY);
                    ctx.stroke();
                    ctx.closePath();

                },this);
            }

            each(this.xLabels,function(label,index){
                var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
                    // Check to see if line/bar here and decide where to place the line
                    linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
                    isRotated = (this.xLabelRotation > 0);

                ctx.beginPath();

                if (index > 0){
                    // This is a grid line in the centre, so drop that
                    ctx.lineWidth = this.gridLineWidth;
                    ctx.strokeStyle = this.gridLineColor;
                } else {
                    // This is the first line on the scale
                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.lineColor;
                }
                ctx.moveTo(linePos,this.endPoint);
                ctx.lineTo(linePos,this.startPoint - 3);
                ctx.stroke();
                ctx.closePath();


                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.lineColor;


                // Small lines at the bottom of the base grid line
                ctx.beginPath();
                ctx.moveTo(linePos,this.endPoint);
                ctx.lineTo(linePos,this.endPoint + 5);
                ctx.stroke();
                ctx.closePath();

                ctx.save();
                ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
                ctx.rotate(toRadians(this.xLabelRotation)*-1);
                ctx.font = this.font;
                ctx.textAlign = (isRotated) ? 'right' : 'center';
                ctx.textBaseline = (isRotated) ? 'middle' : 'top';
                ctx.fillText(label, 0, 0);
                ctx.restore();
            },this);

        }
    }
});

Chart.types.Line.extend({
    name: 'ScrollAbleLineChart',
    initialize:  function(data){
        //Declare the extension of the default point, to cater for the options passed in to the constructor
        this.PointClass = Chart.Point.extend({
            strokeWidth : this.options.pointDotStrokeWidth,
            radius : this.options.pointDotRadius,
            display: this.options.pointDot,
            hitDetectionRadius : this.options.pointHitDetectionRadius,
            showPointLabels: this.options.showPointLabels || false,
            ctx : this.chart.ctx,
            inRange : function(mouseX){
                return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
            }
        });

        this.datasets = [];

        //Set up tooltip events on the chart
        if (this.options.showTooltips && !this.options.showPointLabels){
            helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
                var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
                this.eachPoints(function(point){
                    point.restore(['fillColor', 'strokeColor']);
                });
                helpers.each(activePoints, function(activePoint){
                    activePoint.fillColor = activePoint.highlightFill;
                    activePoint.strokeColor = activePoint.highlightStroke;
                });

                this.showTooltip(activePoints);
            });
        }

        //Iterate through each of the datasets, and build this into a property of the chart
        helpers.each(data.datasets,function(dataset){
            var datasetObject = {
                label : dataset.label || null,
                fillColor : dataset.fillColor,
                strokeColor : dataset.strokeColor,
                pointColor : dataset.pointColor,
                pointStrokeColor : dataset.pointStrokeColor,
                points : []
            };

            this.datasets.push(datasetObject);


            helpers.each(dataset.data, function(dataPoint,index){
                //Best way to do this? or in draw sequence...?
                if (helpers.isNumber(dataPoint)){
                //Add a new point for each piece of data, passing any required data to draw.
                    datasetObject.points.push(new this.PointClass({
                        value : dataPoint,
                        label : data.labels[index],
                        datasetLabel: dataset.label,
                        strokeColor : dataset.pointStrokeColor,
                        fillColor : dataset.pointColor,
                        highlightFill : dataset.pointHighlightFill || dataset.pointColor,
                        highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
                    }));
                }
            },this);

            this.buildScale(data.labels);


            this.eachPoints(function(point, index){
                helpers.extend(point, {
                    x: this.scale.calculateX(index),
                    y: this.scale.endPoint
                });
                point.save();
            }, this);

        },this);
        this.render();
        // window.console.log();
        if (this.options.showPointLabels) {
            var self = this;
            setTimeout(function () {
                self.drawPointLabels(self.datasets[0].points);
            }, (self.options.labelPointTimeout || 3 ) * 1000);
        }

    },
    buildScale : function(labels){
        var self = this;

        var dataTotal = function(){
            var values = [];
            self.eachPoints(function(point){
                values.push(point.value);
            });

            return values;
        };

        var scaleOptions = {
            templateString : this.options.scaleLabel,
            height : this.chart.height,
            width : this.chart.width,
            ctx : this.chart.ctx,
            textColor : this.options.scaleFontColor,
            fontSize : this.options.scaleFontSize,
            fontStyle : this.options.scaleFontStyle,
            fontFamily : this.options.scaleFontFamily,
            valuesCount : labels.length,
            beginAtZero : this.options.scaleBeginAtZero,
            integersOnly : this.options.scaleIntegersOnly,
            hideYLabels: this.options.hideYLabels,
            calculateYRange : function(currentHeight){
                var updatedRanges = helpers.calculateScaleRange(
                    dataTotal(),
                    currentHeight,
                    this.fontSize,
                    this.beginAtZero,
                    this.integersOnly
                );
                helpers.extend(this, updatedRanges);
            },
            xLabels : labels,
            xLabelMinWidth: this.options.xLabelMinWidth || 0,
            font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
            lineWidth : this.options.scaleLineWidth,
            lineColor : this.options.scaleLineColor,
            gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
            gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : 'rgba(0,0,0,0)',
            padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
            showLabels : this.options.scaleShowLabels,
            display : this.options.showScale
        };

        if (this.options.scaleOverride){
            helpers.extend(scaleOptions, {
                calculateYRange: helpers.noop,
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
            });
        }


        this.scale = new ScrollAbleScale(scaleOptions);
    },
    drawPointLabels: function (Elements) {
        each(Elements, function(Element) {
            var tooltipPosition = Element.tooltipPosition();
            new Chart.PointLabel({
                x: Math.round(tooltipPosition.x),
                y: Math.round(tooltipPosition.y),
                xPadding: this.options.tooltipXPadding,
                yPadding: this.options.tooltipYPadding,
                fillColor: this.options.tooltipFillColor,
                // textColor: this.options.tooltipFontColor,
                textColor: this.options.tooltipFillColor,
                fontFamily: this.options.tooltipFontFamily,
                fontStyle: this.options.tooltipFontStyle,
                fontSize: this.options.tooltipFontSize,
                caretHeight: this.options.tooltipCaretSize,
                cornerRadius: this.options.tooltipCornerRadius,
                text: helpers.template(this.options.pointLabelTemplate, Element),
                chart: this.chart
            }).draw();
        }, this);
    }
});

Chart.PointLabel = Chart.Element.extend({
    draw : function () {
        var ctx  = this.chart.ctx;
        ctx.font = helpers.fontString(this.fontSize,this.fontStyle,this.fontFamily);

        this.xAlign = 'center';
        this.yAlign = 'above';

        var caretPadding = -7;

        var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
            tooltipRectHeight = this.fontSize + 2*this.yPadding,
            tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;
        if (this.x + tooltipWidth/2 >this.chart.width){
            this.xAlign = 'left';
        } else if (this.x - tooltipWidth/2 < 0){
            this.xAlign = 'right';
        }

        if (this.y - tooltipHeight < 0){
            this.yAlign = 'below';
        }


        var tooltipX = this.x - tooltipWidth/2,
            tooltipY = this.y - tooltipHeight;

        ctx.fillStyle = this.fillColor;

        switch(this.yAlign)
        {
        case 'above':
            break;
        case 'below':
            tooltipY = this.y + caretPadding + this.caretHeight;
            break;
        }

        switch(this.xAlign)
        {
        case 'left':
            tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
            break;
        case 'right':
            tooltipX = this.x - (this.cornerRadius + this.caretHeight);
            break;
        }
        ctx.fillStyle = this.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
        // window.console.log(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2,this.y);
    }
});
module.exports = function (ctx, data, options) {
    return new Chart(ctx).ScrollAbleLineChart(data, options);
};
