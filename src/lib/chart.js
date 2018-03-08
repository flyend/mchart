/**
 * Class Graph.Chart
 * new Graph.Chart(DOM, options = {})
*/
"use strict";

var Graph = require("./graph");
Graph.Chart.Event = require("chart/event").deps(Graph);
Graph.Chart.angleInQuadrant = require("chart/angleInQuadrant");

;(function(global, Graph){
    var document = global.document;

    var isObject = Graph.isObject;

    var isNumber = Graph.isNumber;

    var isArray = Graph.isArray;

    var isFunction = Graph.isFunction;

    var isNumberIN = Graph.isNumberIN;

    var isEmpty = Graph.isEmptyObject;
    
    var arrayFilter = Graph.Chart.filter;

    var arrayIndexOf = Graph.Chart.indexOf;

    var mathLog = Graph.Math.log;

    var hasAxis = function(type){
        return arrayIndexOf(["line", "spline", "column", "bar", "area", "areaspline", "arearange", "scatter", "heatmap"], type) > -1;
    };

    var hasTouch = Graph.Chart.hasTouch;

    var defined = Graph.defined;

    var extend = Graph.extend;

    var pack = Graph.pack;

    var noop = function(){};

    var rescale = Graph.Chart.scale;

    var Event = Graph.Chart.Event;

    var Intersection = Graph.Chart.Intersection;

    var Text = Graph.Text;

    var Color = Graph.Color;
    
    var Numeric = Graph.Numeric;

    var DEVICE_PIXEL_RATIO = Graph.DEVICE_PIXEL_RATIO;

    var Series = require("chart/series").deps(Graph, Graph.Chart.partition);
    

    var EVENT_MOUSE_OVER = hasTouch ? "touchstart" : "mouseover";
    var EVENT_MOUSE_MOVE = hasTouch ? "touchmove" : "mousemove";
    var EVENT_MOUSE_OUT = hasTouch ? "touchend" : "mouseout";
    var EVENT_MOUSE_DOWN = "mousedown";
    var EVENT_MOUSE_UP = "mouseup";

    function relativeLength(value, percentage){
        var rPercent = /^[+\-\s\.\d]+\s*%\s*$/;
        return isNumber(value) && rPercent.test(percentage)
            ? value * (parseFloat(percentage, 10) / 100)
            : NaN;
    }

    function setAttribute(el, attrs){
        if(el) for(var p in attrs)
            el.setAttribute(p, attrs[p]);
    }

    var getDimension = function(chartWidth, chartHeight, parentWidth, parentHeight){
        var rPercent = /^[+\-\s\.\d]+\s*%\s*$/;
        var width = 0,
            height = 0;
        if(isNumber(chartWidth))
            width = chartWidth;
        if(isNumber(chartHeight))
            height = chartHeight;

        if(rPercent.test(chartWidth)){
            width = parentWidth * (parseFloat(chartWidth, 10) / 100);
        }
        if(rPercent.test(chartHeight)){
            height = parentHeight * (parseFloat(chartHeight, 10) / 100);
        }
        return {
            width: Math.max(0, pack("number", width, 0)),
            height: Math.max(0, pack("number", height, 0))
        };
    };

    //default chart options
    var defaultOptions = {
        type: "line",
        chart: {
            width: undefined,
            height: undefined,
            spacing: hasTouch ? [0, 0, 0, 0] : [10, 10, 15, 10],
            backgroundColor: "#FFFFFF",
            style: {
                fontFamily: "\"Lucida Grande\", \"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif",
                fontSize: "12px",
                fontWeight: "normal",
                color: "#333333"
            },
            reflow: true,
            animation: {
                duration: 500,
                easing: "ease-in-out"
            }
        },
        colors: ["#50E3C2", "#21A6EE", "#807CCC", "#72e6f7", "#8cd49c", "#ffc977", "#b794d5", "#f7a35c", "#434348", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
        title: {
            enabled: true,
            text: "Chart title",
            align: "center",
            margin: 15,
            style: {
                fontSize: "16px",
                fontWeight: "bold"
            },
            x: 0,
            y: 0
        },
        subtitle: {
            enabled: false,
            text: undefined,
            align: "center",
            style: {
                fontSize: "13px"
            },
            x: 0,
            y: 3
        },
        legend: {
            enabled: true,
            style: {
                color: "#606060",
                fontWeight: "bold",
                cursor: "default"
            }
        },
        tooltip: {
            enabled: true,
            shared: true,
            useHTML: true
        },
        yAxis: {
            enabled: true,
            type: "linear",
            lineColor: "#d3d0cb",
            lineWidth: 1,
            tickColor: "#d3d0cb",
            tickWidth: 1,
            gridLineColor: "#f3f2f0",
            gridLineWidth: 1
        },
        xAxis: {
            enabled: true,
            type: "categories",
            title: {
                enabled: false
            },
            lineColor: "#d3d0cb",
            lineWidth: 1,
            tickColor: "#d3d0cb",
            tickWidth: 1,
            gridLineColor: "#f3f2f0",
            gridLineWidth: 1
        },
        colorAxis: {
            enabled: true,
            title: {
                enabled: false
            },
            layout: "vertical",
            floating: true,
            verticalAlign: "top",
            tickLength: 20,
            lineWidth: 0,
            labels: {
                align: "center"
            },
            stops: [
                [0, "#EFEFFF"],
                [1, "#102D4C"]
            ]//default stops
        },
        polarAxis:  {
            enabled: true,
            startAngle: undefined,//default -90,//top
            endAngle: undefined,
            size: "85%",
            center: ["50%", "50%"],//center
            radiusAxis: {
                enabled: false
            },
            angleOptions: {
                
            },
            //tickLength: 6,
            tickColor: "rgba(0,0,0,.5)",
            
        },
        plotOptions: {
            series: {
                left: 0,
                right: 0,
                top: 20,
                bottom: 0
            },
            line: {
                lineWidth: 2,
                marker: {
                    //enabled: null,//auto
                    radius: 4,
                    //lineColor: "#ffffff",
                    lineWidth: 0
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        color: "#606060"
                    }
                }
            },
            spline: {
                lineWidth: 2,
                marker: {
                    radius: 4
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        color: "#606060"
                    }
                }
            },
            area: {
                lineWidth: 2,
                marker: {
                    radius: 4
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        color: "#606060"
                    }
                }
            },
            areaspline: {
                lineWidth: 2,
                marker: {
                    radius: 4
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        color: "#606060"
                    }
                }
            },
            column: {
                borderColor: "#FFFFFF",
                borderRadius: 0,
                borderWidth: 0,
                dataLabels: {
                    enabled: false,
                    //align: "center",[left|center|right]
                    //verticalAlign: "top",[top|middle|bottom]
                    style: {
                        color: "#606060"
                    }
                }
            },
            bar: {
                borderColor: "#FFFFFF",
                borderRadius: 0,
                borderWidth: 0,
                dataLabels: {
                    enabled: false,
                    //align: "right",[left|center|right]
                    //verticalAlign: "middle",[top|middle|bottom]
                    style: {
                        color: "#606060"
                    }
                }
            },
            pie: {
                showInLegend: false,
                borderColor: "#FFFFFF",
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    distance: hasTouch ? 0 : 25,
                    inside: hasTouch ? true : undefined,
                    connectorWidth: 1,
                    connectorPadding: 5,
                    style: {
                        color: "#606060"
                    }
                }
            },
            funnel: {
                showInLegend: false,
                borderColor: "#FFFFFF",
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    distance: hasTouch ? 0 : 30,
                    inside: hasTouch ? true : undefined,
                    style: {
                        color: "#606060"
                    }
                }
            },
            map: {
                borderColor: "rgb(204, 204, 204)",
                borderWidth: 1,
                dataLabels: {
                    enabled: false,
                    align: "center",
                    style: {
                        color: "#606060"
                    }
                }
            },
            venn: {
                borderColor: "#FFFFFF",
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    style: {
                        color: "#606060"
                    }
                }
            },
            heatmap: {
                dataLabels: {
                    enabled: false
                },
                radius: 30,
                blur: 0.15,
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 256,
                        y2: 1
                    },
                    stops: [
                        [0.25, "rgb(0,0,255)"],
                        [0.55, "rgb(0,255,0)"],
                        [0.85, "yellow"],
                        [1, "rgb(255,0,0)"]
                    ]
                }
            },
            node: {
                borderColor: "#333333",
                borderWidth: 1,
                lineWidth: 1,
                dataLabels: {
                    enabled: true,
                    align: "center",
                    style: {
                        color: "#606060"
                    }
                }
            },
            radar: {
                lineWidth: 2,
                marker: {
                    radius: 4,
                    lineWidth: 0
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: "#606060"
                    }
                }
            }
        },
        credits: {
            enabled: true,
            text: "MChart By MX",
            style: {
                cursor: "pointer",
                color: "#909090",
                fontSize: "10px"
            },
            href: undefined,
            position: {
                align: "right",
                x: -10,
                y: -5,
                verticalAlign: "bottom"
            }
        },
        rangeSelector: {
            //enabled: false,
            //start: "0%",
            //end: "100%"
        }
    };

    /*
     * OffScreen Canvas
    */
    function Layer(container, width, height){
        var canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");

        setAttribute(this.canvas = canvas, {
            width: width,
            height: height,
            style: [
                "position:absolute",
                "left:0px",
                "top:0px",
                "-webkit-user-select:none",
                "cursor:default"
            ].join(";")
        });
        rescale(this.context, width, height, DEVICE_PIXEL_RATIO);

        container.appendChild(this.canvas);
    }

    function globalStyle(options){
        var chartOptions = options.chart || {},
            plotOptions = options.plotOptions;
        var split = function(){
            var r = [];
            [].forEach.call(arguments, function(item){
                r = r.concat(isArray(item) ? item : [item]);
            });
            return r;
        };
        split(options.yAxis, options.xAxis, options.colorAxis, options.polarAxis).map(function(item){
            return item.labels || (item.labels = {});
        }).concat([
            options.tooltip, options.legend, options.credits,
            options.title, options.subtitle,
            plotOptions.line.dataLabels,
            plotOptions.spline.dataLabels,
            plotOptions.area.dataLabels,
            plotOptions.areaspline.dataLabels,
            plotOptions.column.dataLabels,
            plotOptions.bar.dataLabels,
            plotOptions.pie.dataLabels
        ]).forEach(function(item){
            if(defined(item)){
                if(defined(item.style)){
                    for(var p in chartOptions.style){
                        !item.style.hasOwnProperty(p) && (item.style[p] = chartOptions.style[p]);
                    }
                }
                else
                    item.style = chartOptions.style;
            }
        });
    }
   
    function Chart(element, options){
        this.options = extend({}, defaultOptions);//getDefaultOptions(defaultOptions);
        extend(this.options, options);
        globalStyle(this.options);

        this.type = this.options.type || "line";

        var chart = this;
        var chartOptions = pack("object", this.options.chart, {});

        var width = chartOptions.width,
            height = chartOptions.height;

        if(!isNumberIN(width) || !isNumberIN(height)){
            if(element.nodeType === 1){
                var bbox = element.getBoundingClientRect();
                var dimension = getDimension(
                    width,
                    height,
                    pack("number", bbox.width, element.offsetWidth),
                    pack("number", bbox.height, element.offsetHeight)
                );

                width = dimension.width;
                height = dimension.height;
                if(height <= 0){
                    height = pack("number", bbox.height, element.offsetHeight);
                }
                if(width <= 0){
                    width = pack("number", bbox.width, element.offsetWidth);
                }
            }
            else{
                width = pack("number", element.width, 0);
                height = pack("number", element.height, 0);
            }
        }
        this.width = width;
        this.height = height;
        //console.log(this.height, this.width, element)
        if(element.getContext){
            this.canvas = this.container = element;
        }
        else{
            setAttribute(this.container = document.createElement("div"), {
                style: [
                    "width:" + chart.width + "px",
                    "height:" + chart.height + "px",
                    "overflow:hidden",
                    "position:relative",
                    "background:transparent",
                    "-webkit-tap-highlight-color:transparent",
                    "-webkit-user-select:none"
                ].join(";")
            });
            (this.renderer = element).appendChild(this.container);
            this.canvas = new Layer(this.container, this.width, this.height).canvas;
        }
        this.context = this.canvas.getContext("2d");
        //make layer
        this.layer = [];
        if(element.nodeType === 1 && element.constructor === global.HTMLCanvasElement){
            this.renderer = this.context.getImageData(0, 0, width, height);
            rescale(this.context, width, height, DEVICE_PIXEL_RATIO);
        }
        this.layer.push(this.canvas);

        this.charts = [];
        this.series = [];
        this.axis = [];
        this.xAxis = [];
        this.yAxis = [];
        this.colorAxis = [];
        this.polarAxis = [];

        this.legend = null;
        this.title = null;
        this.tooltip = null;
        this.rangeSlider = [];
        this.rangeSelector = [];

        this.xAxisSeries = {};
        this.yAxisSeries = {};
        this.colorAxisSeries = {};
        this.polarAxisSeries = {};
        this.isAxis = false;
        this.srcOptions = options;

        var animationOptions = chartOptions.animation;
        if(!isObject(animationOptions)){
            animationOptions = {enabled: !!animationOptions};
        }

        this.globalAnimation = extend({
            isReady: false,
            enabled: animationOptions.enabled !== false//default true
        }, animationOptions);
        this.globalAnimation.initialize = true;//initial once

        this.globalEvent = {
            click: noop,
            isDragging: false
        };

        Color.GRADIENT_CONTEXT = this.context;
        Text.context(this.context);
    }
    Chart.prototype = {
        constructor: Chart,
        setTitle: function(){
            var options = this.options,
                spacing = options.chart.spacing;
            var context = this.context,
                width = this.width,
                chart = this;

            var Title = function(options){
                var titleOptions = extend({}, options.title),
                    subtitleOptions = extend({}, options.subtitle),
                    style = titleOptions.style || {},
                    rect = {
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    },
                    bbox;
                if(titleOptions.enabled !== false && defined(titleOptions.text)){
                    bbox = Text.measureText(titleOptions.text, {
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight
                    });
                    rect.width += bbox.width;
                    rect.height += bbox.height;// + titleOptions.margin;
                    rect.left = pack("number", titleOptions.x, 0) + (width - bbox.width) / 2;
                    rect.top = pack("number", titleOptions.y, 0) + bbox.height + spacing[0];
                    extend(titleOptions, rect);
                }
                if(subtitleOptions.enabled !== false && defined(subtitleOptions.text)){
                    style = subtitleOptions.style || {};
                    bbox = Text.measureText(subtitleOptions.text, {
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight
                    });
                    rect.height += bbox.height;
                    rect.top += pack("number", subtitleOptions.y, 0) + bbox.height + pack("number", subtitleOptions.y, 0);
                    rect.width = bbox.width;
                    rect.left = pack("number", subtitleOptions.x, 0) + (width - bbox.width) / 2;
                    extend(subtitleOptions, rect);
                }
                this.viewport = rect;
                this.render = function(){
                    context.save();
                    ;[titleOptions, subtitleOptions].forEach(function(item){
                        style = item.style;
                        if(defined(item) && item.enabled !== false){
                            context.textAlign = "start";
                            context.textBaseline = "alphabetic";
                            context.fillStyle = style.color;
                            context.font = style.fontWeight + " " + style.fontSize + " " + (style.fontFamily);
                            context.fillText(item.text, item.left, item.top);
                        }
                    });
                    context.restore();
                };
            };
            
            chart.title = new Title(options);
            return this;
        },
        setCredits: function(){
            var options = this.options,
                credits = options.credits || {},
                position = credits.position,
                style = credits.style,
                bbox,
                factor = 0.6;
            var chart = this;
            var context = chart.context;

            chart.credits = {
                render: function(){
                    if(credits.enabled === true && defined(credits.text)){
                        bbox = Text.measureText(credits.text, style);
                        context.save();
                        context.scale(factor, factor);
                        context.translate(position.x + chart.width / factor - bbox.width, position.y + chart.height / factor);
                        context.fillStyle = style.color;
                        context.textAlign = "start";
                        context.textBaseline = "alphabetic";
                        context.font = style.fontSize + " " + style.fontFamily;
                        context.fillText(credits.text, 0, 0);
                        context.restore();
                    }
                }
            };
        },
        setSeries: function(newData, index){
            var options = this.options,
                chartAnimation = (options.chart || {}).animation || {},
                plotOptions,
                rangeSelectorOptions = options.rangeSelector,
                start,
                end,
                series = this.series,
                seriesColors = options.colors;

            var newSeries;

            var type = newData.type || this.type,
                name = newData.name || "Series " + series.length;

            newSeries = new Series(newData);
            newSeries.type = type;
            newSeries.name = name;
            newSeries.data = newData.data;
            newSeries.index = index;
            newSeries.color = newSeries.color || seriesColors[index % seriesColors.length];
            newSeries.animation = pack("object", newData.animation, {
                duration: pack("number", chartAnimation.duration, 1000),
                easing: chartAnimation.easing || "linear",
                delay: pack("number", chartAnimation.delay, 0),
                enabled: chartAnimation.enabled !== false
            });
            /*if(
                hasAxis(type) &&
                isArray(data = newSeries.data) &&
                !(newSeries.xAxis === null || newSeries.yAxis === null)
            ){*/
            if(defined(rangeSelectorOptions)){
                start = rangeSelectorOptions.start || "0%";
                end = rangeSelectorOptions.end || "100%";
                start = Math.min(100, Math.max(0, pack("number", parseFloat(start, 10), 0)));
                end = Math.min(100, Math.max(0, pack("number", parseFloat(end, 10), 100)));
                newSeries.start = start + "%";
                newSeries.end = end + "%";//xAxis=0
            }
            
            if(defined(newData.layer)){
                newSeries.canvas = this.addLayer(newData.layer);
                newSeries.context = newSeries.canvas.getContext("2d");
            }
            
            plotOptions = extend({}, (options.plotOptions || {})[newSeries.type] || {});
            if(defined(plotOptions) && isObject(plotOptions)){
                newSeries = new Series(extend(plotOptions, newSeries));
            }
            newSeries.shapes = newSeries.addShape();

            return newSeries;
        },
        addSeries: function(newData){
            var newSeries = this.setSeries(newData, this.series.length);
            this.isAxis = this.isAxis || hasAxis(newSeries.type || this.type);
            
            this.series.push(newSeries);
            return this;
        },
        removeSeries: function(removedSeries){
            var series = this.series,
                i = 0;
            if(isObject(removedSeries)){
                for(; i < series.length; i++){
                    if(series[i] === removedSeries){
                        series[i].destroy();
                        this.removeSeriesAt(i);
                        break;
                    }
                }
            }
            return this;
        },
        removeSeriesAt: function(index){
            var series = this.series;
            series.splice(Math.max(0, Math.min(index, series.length - 1)), 1);
        },
        reset: function(){
            var p;
            for(p in this.xAxisSeries)
                delete this.xAxisSeries[p];
            for(p in this.yAxisSeries)
                delete this.yAxisSeries[p];
            for(p in this.colorAxisSeries)
                delete this.colorAxisSeries[p];
            this.polarAxisSeries = {};

            this.xAxis.forEach(function(item){
                delete item.options.stack;
                delete item.options.series;
            });
            this.yAxis.forEach(function(item){
                delete item.options.stack;
                delete item.options.series;
            });
            this.colorAxis.forEach(function(item){
                delete item.options.stack;
                delete item.options.series;
            });
        },
        linkSeries: function(){
            var maxLength = 0,
                sumLength = 0;
            var series = this.series,
                chart = this;

            chart.minAxisZero = false;
            series.forEach(function(series){
                if(series.selected !== false){
                    sumLength = Math.max(sumLength, (series.data || []).length | 0);
                    maxLength = Math.max(maxLength, series.shapes.length);
                }
            });
            series.forEach(function(item){
                item.chart = chart;
                item.sumLength = sumLength;
                if(hasAxis(item.type)){
                    var xaxis = pack("number", item.xAxis, 0),
                        yaxis = pack("number", item.yAxis, 0);
                    var xAxisSeries = chart.xAxisSeries,
                        yAxisSeries = chart.yAxisSeries;
                    chart.minAxisZero = chart.minAxisZero || !!~arrayIndexOf(["column", "bar"], item.type);
                
                    if(!yAxisSeries.hasOwnProperty(yaxis)){
                        yAxisSeries[yaxis] = [item];
                    }
                    else{
                        yAxisSeries[yaxis].push(item);
                    }
                    if(!xAxisSeries.hasOwnProperty(xaxis)){
                        xAxisSeries[xaxis] = [item];
                    }
                    else{
                        xAxisSeries[xaxis].push(item);
                    }
                    item.maxLength = maxLength;
                }
                if(!!~(arrayIndexOf(["map", "heatmap"], item.type))){
                    var coloraxis = pack("number", item.colorAxis, 0),
                        colorAxisSeries = chart.colorAxisSeries;
                    if(!colorAxisSeries.hasOwnProperty(coloraxis)){
                        colorAxisSeries[coloraxis] = [item];
                    }
                    else{
                        colorAxisSeries[coloraxis].push(item);
                    }
                }
                if(!!~(arrayIndexOf(["radar"], item.type))){
                    var polaraxis = pack("number", item.polarAxis, 0),
                        polarAxisSeries = chart.polarAxisSeries;
                    if(!polarAxisSeries.hasOwnProperty(polaraxis)){
                        polarAxisSeries[polaraxis] = [item];
                    }
                    else{
                        polarAxisSeries[polaraxis].push(item);
                    }
                }
                chart.isAxis = chart.isAxis || hasAxis(item.type || chart.type);
            });
        },
        linkAxis: function(){
            var xAxis = [], yAxis = [], colorAxis = [], polarAxis = [];
            var options = this.options,
                rangeSelectorOptions = options.rangeSelector,
                chart = this;
            var viewport;

            var axisOptions;

            //console.log(this.yAxis, this.yAxisSeries);
            var setAxis = function(axis, i, items){
                var name = axis.name,
                    axisSeries = chart[{
                        yAxis: "yAxisSeries",
                        xAxis: "xAxisSeries",
                        polarAxis: "polarAxisSeries"
                    }[name]],
                    hasSeries = axisSeries.hasOwnProperty(i),
                    seriesOptions,
                    mergeOptions,
                    series = [],
                    start,
                    end;
                var axisOptions = axis._options,
                    categories = axisOptions.categories,
                    tickAmount = axisOptions.tickAmount,
                    type = axisOptions.type,
                    logBase = pack("number", (axisOptions.logarithmic || {}).base, 10);
                var minValue, maxValue, minDomain, maxDomain;
                if(items.length > 1){
                    tickAmount = 5;
                }

                if(hasSeries){
                    series = axisSeries[i] || [];
                    seriesOptions = extend({series: series}, Series.normalize(series));
                    seriesOptions.length = series[0].sumLength;
                    start = pack("number", parseFloat(series[0].start, 10), 0);
                    end = pack("number", parseFloat(series[0].end, 10), 100);
                    minValue = seriesOptions.min, maxValue = seriesOptions.max;
                    minDomain = minValue, maxDomain = maxValue;

                    if(type === "logarithmic"){
                        minDomain = minValue = mathLog(Math.max(minValue, 1), logBase);
                        maxDomain = maxValue = mathLog(maxValue, logBase);
                    }
                    if(name === "xAxis"){
                        if(type !== "linear"){
                            minDomain = 0;
                            maxDomain = seriesOptions.length;//default index
                        }
                        if(type !== "categories" && seriesOptions.isX === true){
                            minDomain = minValue = seriesOptions.minX;
                            maxDomain = maxValue = seriesOptions.maxX;
                        }
                    }
                    else if(name === "yAxis"){
                        if(type !== "categories" && seriesOptions.isY === true){
                            minDomain = minValue = seriesOptions.minY;
                            maxDomain = maxValue = seriesOptions.maxY;
                        }
                    }

                    if(chart.minAxisZero && type === "linear"){
                        minDomain = minValue = Math.min(0, seriesOptions.min);//bar & column base value 0
                    }
                    if(isNumber(axisOptions.softMin) && axisOptions.softMin < minValue){
                        minDomain = minValue = axisOptions.softMin;
                    }
                    if(isNumber(axisOptions.softMax) && axisOptions.softMax < maxValue){
                        maxDomain = maxValue = axisOptions.softMax;
                    }
                    if(defined(axisOptions.min)){
                        isNumber(axisOptions.min) && (minDomain = minValue = axisOptions.min);
                    }
                    if(defined(axisOptions.max)){
                        isNumber(axisOptions.max) && (maxDomain = maxValue = axisOptions.max);
                    }
                    if(type === "categories" || (isArray(categories) && categories.length)){
                        minDomain = Math.max(0, Math.min(~~(seriesOptions.length * start / 100), seriesOptions.length - 1));
                        maxDomain = Math.max(Math.ceil(seriesOptions.length * end / 100), minDomain + 1);
                        //console.log(minDomain, maxDomain, series[0].start, series[0].end, seriesOptions);
                    }
                    //console.log(minDomain, maxDomain, minValue, maxValue, seriesOptions)
                    isNumber(axisOptions.tickAmount) && (tickAmount = axisOptions.tickAmount);
                    mergeOptions = {
                        length: seriesOptions.length,
                        domain: [minDomain, maxDomain],
                        minValue: minValue,
                        maxValue: maxValue,
                        tickAmount: tickAmount
                    };
                    if(defined(rangeSelectorOptions)){
                        if(
                            isNumber(rangeSelectorOptions.yAxis) & name === "yAxis" ||
                            isNumber(rangeSelectorOptions.xAxis) & name === "xAxis" ||
                            isNumber(rangeSelectorOptions.polarAxis)
                        ){
                            mergeOptions.startValue = minDomain;
                            mergeOptions.endValue = maxDomain;
                            if(!defined(rangeSelectorOptions.endValue)){
                                mergeOptions.endValue = null;
                            }
                        }
                    }

                    axis.setOptions(mergeOptions);
                    axis.options.maxValue = axis.maxValue;
                    axis.options.minValue = axis.minValue;
                    axis.options.plot = {
                        x: [seriesOptions.minX, seriesOptions.maxX],
                        y: [seriesOptions.minY, seriesOptions.maxY],
                        value: [seriesOptions.min, seriesOptions.max]
                    };
                    axis.options.labelWidth = axis.labelWidth;
                    axis.options.labelHeight = axis.labelHeight;
                }
                var flag = false;
                for(var j = 0; !flag && j < series.length; j++){
                    flag = series[j].selected !== false;
                }
                axis.options.enabled = flag;
            };
            this.yAxis.forEach(function(axis, i, items){
                setAxis(axis, i, items);
            });

            this.xAxis.forEach(function(axis, i, items){
                setAxis(axis, i, items);
            });
            this.polarAxis.forEach(function(axis, i, items){
                setAxis(axis, i, items);
            });
            this.colorAxis.forEach(function(axis, i){
                var hasSeries = chart.colorAxisSeries.hasOwnProperty(i),
                    seriesOptions,
                    series = [];
                var minValue, maxValue;
                if(hasSeries){
                    series = chart.colorAxisSeries[i] || [];
                    seriesOptions = extend({series: series}, Series.normalize(series));
                    minValue = seriesOptions.min, maxValue = seriesOptions.max;
                    isNumber(axis._options.min) && (minValue = axis._options.min);
                    isNumber(axis._options.max) && (maxValue = axis._options.max);
                    axis.setOptions({
                        domain: [minValue, maxValue],
                        minValue: minValue,
                        maxValue: maxValue,
                        x: pack("number", axis._options.x, 20),
                        y: pack("number", axis._options.y, 20),
                        length: seriesOptions.length
                    });
                    axis.scale(0, 150);
                    axis.setOptions({
                        range: [0, 150],
                    });
                    axis.options.maxValue = axis.maxValue;
                    axis.options.minValue = axis.minValue;
                }
                var flag = false;
                for(var j = 0; !flag && j < series.length; j++){
                    flag = series[j].selected !== false;
                }
                axis.options.enabled = flag;
                colorAxis.push(axis.options);
            });
            this.polarAxis.forEach(function(axis){
                polarAxis.push(axis.options);
            });

            if(chart.isAxis){
                viewport = this.getViewport();
                chart.yAxis.forEach(function(axis){
                    axis.scale(0, viewport.height - viewport.top - viewport.bottom);
                });
                chart.xAxis.forEach(function(axis){
                    axis.scale(0, viewport.width - viewport.left - viewport.right);
                });
                chart.yAxis.forEach(function(axis){
                    yAxis.push(axis.options);//保留axis，需设置enabled是否render
                });
                chart.xAxis.forEach(function(axis){
                    xAxis.push(axis.options);
                });
            }
            //if axis enabled false
            var axisSeries;
            axisOptions = {};
            if(!yAxis.length){
                axisSeries = chart.yAxisSeries[0] || [];
                extend(axisOptions, Series.normalize(axisSeries));
                if(chart.minAxisZero){
                    axisOptions.minValue = Math.min(0, axisOptions.minValue);
                }
                axisOptions.minValue = axisOptions.min;
                axisOptions.maxValue = axisOptions.max;
                axisOptions.series = axisSeries;
                yAxis.push(axisOptions);
            }
            if(!xAxis.length){
                axisOptions = {};
                axisSeries = chart.xAxisSeries[0] || [];
                extend(axisOptions, Series.normalize(axisSeries));
                if(chart.minAxisZero){
                    axisOptions.minValue = Math.min(0, axisOptions.min);
                }
                axisOptions.minValue = axisOptions.min;
                axisOptions.maxValue = axisOptions.max;
                axisOptions.series = axisSeries;
                xAxis.push(axisOptions);
            }
            if(!colorAxis.length){
                axisOptions = {};
                axisSeries = chart.colorAxisSeries[0] || [];
                extend(axisOptions, Series.normalize(axisSeries));
                if(isObject(options.colorAxis)){
                    extend(axisOptions, options.colorAxis);
                }
                colorAxis.push(axisOptions);
            }
            if(!polarAxis.length){
                axisOptions = {};
                axisSeries = chart.polarAxisSeries[0] || [];
                extend(axisOptions, Series.normalize(axisSeries));
                if(isObject(options.polarAxis)){
                    extend(axisOptions, options.polarAxis);
                }
                polarAxis.push(axisOptions);
            }
            delete axisOptions.series;
            axisOptions = null;
            //new options
            chart.nextOptions = extend(extend({}, options), {
                colorAxis: colorAxis,
                polarAxis: polarAxis,
                xAxis: xAxis,
                yAxis: yAxis,
                series: this.series
            });
            chart.nextOptions.chart.width = chart.width;
            chart.nextOptions.chart.height = chart.height;
            //resize axis
            this.translateAxis();
        },
        linkRangeSelector: function(){
            var chartOptions = this.options.chart || {},
                spacing = pack("array", chartOptions.spacing, []);
            var legendHeight = this.legend ? this.legend.viewport.height : 0;
            var chart = this;
            var getAxis = function(rangeSelectorOptions){
                var axisMaps = {
                    xAxis: {
                        axis: chart.xAxis,
                        series: chart.xAxisSeries
                    },
                    yAxis: {
                        axis: chart.yAxis,
                        series: chart.yAxisSeries
                    },
                    polarAxis: {
                        axis: chart.polarAxis,
                        series: chart.polarAxisSeries
                    }
                };
                var rsp = rangeSelectorOptions,
                    axisIndex, axis;
                var minValue = Number.MAX_VALUE, maxValue = -minValue;
                var startValue, endValue;
                var data = [];

                if(!rangeSelectorOptions.hasOwnProperty("xAxis")){
                    rsp = extend({xAxis: 0}, rangeSelectorOptions);//default axis
                }
                for(var p in rsp){
                    if(axisMaps.hasOwnProperty(p) && isNumber(axisIndex = rsp[p])){
                        //console.log(axisMaps[p].series);
                        data = [];
                        (axisMaps[p].series[axisIndex] || []).forEach(function(series){
                            series.selected !== false && (data = series.data);
                        });
                        if(defined(axis = axisMaps[p].axis[axisIndex])){
                            //console.log(axis)
                            minValue = Math.min(minValue, axis.minValue);
                            maxValue = Math.max(maxValue, axis.maxValue);
                            startValue = "" + axis.startValue;
                            endValue = "" + axis.endValue;
                        }
                    }
                }
                return {
                    data: data,
                    minValue: minValue,
                    maxValue: maxValue,
                    startValue: startValue,
                    endValue: endValue
                };
            };
            this.rangeSlider.forEach(function(slider){
                if(slider !== null){
                    var rangeSelectorOptions = slider.options,
                        axisOptions = getAxis(slider.options);
                    //console.log(slider.height, viewport)
                    slider.setOptions({
                        data: axisOptions.data,
                        //min: axisOptions.minValue,
                        //max: axisOptions.maxValue,
                        //startValue: axisOptions.startValue,
                        //endValue: axisOptions.endValue,
                        y: pack("number",
                            rangeSelectorOptions.y,
                            Numeric.percentage(slider.height, rangeSelectorOptions.y),
                            chart.height - slider.height - legendHeight - spacing[2]
                        )
                    });
                }
            });
        },
        linkLegend: function(){
            var options = this.options;
            if(this.legend !== null/* && this.globalAnimation.initialize*/){
                var legendHeight = 0,
                    legendX = 0,
                    legendY = 0;
                var seriesData = [],
                    seriesColors = options.colors;
                if(options.legend.enabled !== false){
                    this.series.forEach(function(series, i){
                        var data = series.data;
                        if(series.type === "pie" || series.type === "funnel"){
                            data.forEach(function(item, j){
                                if(item !== null && (isObject(item) && item.value !== null)){
                                    var value = extend({type: series.type, seriesIndex: i, dataIndex: j}, item);//new Data
                                    !defined(value.color) && (value.color = seriesColors[j % seriesColors.length]);
                                    !defined(value.name) && (value.name = value.value);
                                    !defined(value.showInLegend) && (value.showInLegend = series.showInLegend);
                                    seriesData.push(value);
                                }
                            });
                        }
                        else{
                            seriesData.push(series);
                        }
                    });
                    if(seriesData.length){
                        this.legend.setData(seriesData);
                        legendHeight = this.legend.maxHeight;
                    }
                }

                this.legend.viewport = {
                    width: this.legend.width,
                    height: Math.min(legendHeight + pack("number", this.legend.options.margin, 0), this.height / 2),
                    left: legendX,
                    top: legendY
                };
            }
        },
        renderAll: function(){
            var options = this.options;
            var context = this.context,
                chart = this;
            var Renderer = {
                background: function(){
                    if(defined(options.chart.backgroundColor)){
                        context.save();
                        context.fillStyle = options.chart.backgroundColor;
                        context.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
                        context.restore();
                    }
                },
                title: function(){
                    chart.title && chart.title.render();
                },
                credits: function(){
                    chart.credits && chart.credits.render();
                },
                legend: function(){
                    if(chart.legend !== null && chart.legend.data.length){
                        chart.legend.draw();
                    }
                },
                rangeSlider: function(){
                    chart.rangeSlider.forEach(function(slider){
                        slider && slider.draw();
                    });
                },
                tooltip: function(){
                    chart.tooltip && chart.tooltip.draw();
                },
                axis: function(){
                    /*if(chart.isAxis){
                        chart.xAxis.forEach(function(item){
                            if(item.options.enabled !== false){
                                item.draw();
                            }
                        });
                        chart.yAxis.forEach(function(item){
                            if(item.options.enabled !== false){
                                item.draw();
                            }
                        });
                    }*/
                    chart.colorAxis.forEach(function(axis){
                        axis.draw();
                    });
                    chart.polarAxis.forEach(function(axis){
                        axis.draw();
                    });
                }
            };
            ;[
                {z: 1, render: Renderer.background},
                {z: 9, render: Renderer.credits},
                {z: 2, render: Renderer.axis},
                {z: 4, render: Renderer.title},
                {z: 5, render: Renderer.rangeSlider},
                {z: 0, render: function(){
                    if(chart.container.nodeType === 1 && chart.container.constructor === global.HTMLCanvasElement){
                        context.putImageData(chart.renderer, 0, 0);
                    }
                }}
            ].sort(function(a, b){
                return a.z - b.z;
            }).forEach(function(item){
                item.render();
            });
        },
        renderChart: function(charts, redraw){
            var chart = this,
                viewport;
            charts.forEach(function(item){
                if(redraw === "resize"){
                    viewport = chart.getViewport();
                    item.redraw(extend({
                        chartWidth: viewport.width,
                        chartHeight: viewport.height
                    }, viewport.plot));
                }
                else{
                    item.draw();
                }
            });
        },
        clear: function(){
            var width = this.width,
                height = this.height;
            this.series.concat([{context: this.context}]).forEach(function(series){
                var context = series.context;
                if(defined(context)){
                    context.clearRect(0, 0, width * 2, height * 2);
                }
            });
        },
        draw: function(){
            var chart = this;
            if(isEmpty(this.srcOptions) && this.globalAnimation.initialize){
                this.globalAnimation.initialize = false;
                this.renderAll();//title & credits
                return this;
            }

            this.reset();

            if(this.tooltip !== null){
                this.tooltip.hide();//destroy
            }
            if(this.legend !== null && !this.legend.noScroll){
                this.legend.destroy().scrollTop(0);
            }

            this.linkSeries();//add to this series
            this.linkLegend();
            this.linkAxis();
            this.linkRangeSelector();

            var plot = this.getViewport().getPlot();

            this.series.forEach(function(series){
                series.plotX = pack("number", plot.left);
                series.plotY = pack("number", plot.top);
                series.plotWidth = pack("number", plot.width);
                series.plotHeight = pack("number", plot.height);
            });

            var Graphers = Graph.Chart.graphers,
                creator = {};
            //this.charts.splice(0);
            var charts = chart.charts;
            
            this.series.forEach(function(series){
                var type = series.type || chart.type;
                var isCreated = false;
                for(var i = 0; !isCreated && i < charts.length; i++){
                    isCreated = charts[i].type === type;
                }
                if(isCreated){
                    charts[~-i].init(chart.nextOptions);
                }
                else{
                    if(defined(Graphers[type]) && !(type in creator)){
                        creator[type] = true;
                        charts.push(new Graphers[type](chart.canvas, chart.nextOptions));
                    }
                }
            });
            charts.forEach(function(item, i){
                !~(arrayIndexOf.call(null, chart.series.map(function(series){
                    return series.type;
                }), item.type)) && charts.splice(i, 1);
            });

            this.render("update");
        },
        render: function(redraw){
            var options = this.options,
                charts = this.charts,
                chart = this;
            var context = chart.context;
            var globalAnimation = chart.globalAnimation;
            
            var onReady = function(){
                var events = (options.chart || {}).events || {};
                defined(events.load) && events.load.call(chart);
            };
            var onRedraw = function(){
                var events = (options.chart || {}).events || {};
                defined(events.redraw) && events.redraw.call(chart);
            };
            
            var filterAnimation = function(type){
                return !defined(Graph.Animation)
                    || globalAnimation.enabled !== true
                    || !!~arrayIndexOf(["map", "heatmap", "venn", "node"], type);
            };
            var getAnimationList = function(){
                var list = [].slice.call(arguments, 0, -1),
                    initialize = !!arguments[list.length];
                var shapes = [];
                list.forEach(function(item){
                    item.forEach(function(item){
                        item.animateTo(context, initialize).forEach(function(shape){
                            if(!initialize){
                                shape[0].delay = 0;
                            }
                            shapes.push(shape);
                        });
                    });
                });
                return shapes;
            };

            function paintComponent(arr, ani){
                chart.clear();
                chart.renderAll();
                chart.yAxis.concat(chart.xAxis).forEach(function(item){
                    if(item.options.enabled !== false){
                        item.draw();
                    }
                });
                chart.renderChart(arr, redraw);
                ani && ani();
                chart.legend && chart.legend.draw();
                chart.tooltip && chart.tooltip.draw();
            }

            var Animation = new Graph.Animation();

            var animateTo = function(charts, onStep, onReady){
                var animationCharts = [],
                    noAnimationCharts = [];
                animationCharts = arrayFilter(charts, function(item){
                    var filter = filterAnimation(item.type);
                    if(filter){
                        noAnimationCharts.push(item);
                    }
                    return !filter;
                });

                globalAnimation.isReady = false;
                if(noAnimationCharts.length){
                    paintComponent(noAnimationCharts);
                }
                if(defined(Graph.Animation) && animationCharts.length){
                    getAnimationList(animationCharts, true).forEach(function(item){
                        var shape = item[0],
                            step = item[1];
                        Animation.addAnimate(shape, {
                            step: function(target, timer){
                                step(timer);
                            },
                            complete: function(){
                                
                            },
                            duration: pack("number", shape.duration, globalAnimation.duration, 500),
                            easing: pack("string", shape.easing, globalAnimation.easing, "ease-in-out"),
                            delay: pack("number", shape.delay, globalAnimation.delay, 0)
                        });
                    });
                    Animation.fire(function(){
                        globalAnimation.isReady = false;
                        onStep && onStep(noAnimationCharts, animationCharts);
                    }, function(){
                        globalAnimation.isReady = true;
                        paintComponent(charts);
                        chart.series.forEach(function(series){
                            series._shapes = series.shapes;
                            delete series._animators;
                        });
                        chart.xAxis.concat(chart.yAxis).forEach(function(axis){
                            axis._ticks = axis.ticks;
                        });
                        onReady();
                    });
                }
                animationCharts.length | noAnimationCharts.length || chart.renderAll();//no chart
                !animationCharts.length & !!noAnimationCharts.length && onReady();
                globalAnimation.isReady = true;
            };
            
            if(globalAnimation.initialize === true){
                animateTo(charts, function(noAnimationCharts, animationCharts){
                    paintComponent(noAnimationCharts, function(){
                        animationCharts.forEach(function(item){
                            item.onFrame && item.onFrame(context);
                        });
                    });
                }, function(){
                    onReady();
                });
                globalAnimation.initialize = false;//!(globalAnimation.isReady = true);
            }
            else{
                //交互redraw["resize", "click", "hover", "update"]
                //console.log(redraw, globalAnimation.isReady);
                if(globalAnimation.isReady === true && redraw === "update"){
                    //data update
                    var animationCharts = [],
                        noAnimationCharts = [];
                    animationCharts = arrayFilter(charts, function(item){
                        var filter = filterAnimation(item.type);
                        if(filter){
                            noAnimationCharts.push(item);
                        }
                        return !filter;
                    });
                    var shapes = getAnimationList(animationCharts, chart.yAxis, chart.xAxis, false);
                    Animation.stop();
                    shapes.forEach(function(item){
                        var shape = item[0],
                            step = item[1];
                        Animation.addAnimate(shape, {
                            duration: 100,
                            delay: 0,
                            easing: "linear",
                            step: function(target, timer){
                                step(timer);
                            },
                            complete: function(){}
                        });
                    });
                    Animation.fire(function(){
                        //globalAnimation.isReady = false;
                        chart.clear();
                        chart.renderAll();
                        chart.yAxis.concat(chart.xAxis).forEach(function(axis){
                            if(axis.options.enabled !== false){
                                axis.onFrame();
                            }
                        });
                        chart.renderChart(noAnimationCharts);
                        animationCharts.forEach(function(item){
                            item.onFrame && item.onFrame(context);
                        });
                        chart.legend && chart.legend.draw();
                        chart.tooltip && chart.tooltip.draw();
                        onRedraw();
                    }, function(){
                        /*globalAnimation.isReady = true;
                        chart.clear();
                        chart.renderAll();
                        chart.yAxis.concat(chart.xAxis).forEach(function(item){
                            if(item.options.enabled !== false){
                                item.draw();
                            }
                        });
                        chart.renderChart(charts);
                        chart.legend && chart.legend.draw();
                        chart.tooltip && chart.tooltip.draw();
                        onRedraw();*/
                        /*chart.series.forEach(function(series){
                            series._shapes = series.shapes;
                        });
                        chart.xAxis.concat(chart.yAxis).forEach(function(axis){
                            axis._ticks = axis.ticks;
                        });*/
                    });
                    return;
                    Graph.Animation.stop().fire(getAnimationList(animationCharts, false), 0, 1, {
                        step: function(timer){
                            globalAnimation.isReady = false;
                            chart.clear();
                            chart.renderAll();
                            chart.yAxis.concat(chart.xAxis).forEach(function(axis){
                                if(axis.options.enabled !== false){
                                    axis.animateTo(timer);
                                }
                            });
                            animationCharts.forEach(function(item){
                                item.onFrame && item.onFrame(context);
                            });
                            chart.renderChart(noAnimationCharts);
                            chart.legend && chart.legend.draw();
                            onRedraw();
                        },
                        complete: function(){
                            globalAnimation.isReady = true;
                            chart.clear();
                            chart.renderAll();
                            chart.yAxis.concat(chart.xAxis).forEach(function(item){
                                if(item.options.enabled !== false){
                                    item.draw();
                                }
                            });
                            chart.renderChart(charts);
                            chart.legend && chart.legend.draw();
                            chart.tooltip && chart.tooltip.draw();
                            onRedraw();
                            chart.series.forEach(function(series){
                                series._shapes = series.shapes;
                            });
                            chart.xAxis.concat(chart.yAxis).forEach(function(axis){
                                axis._ticks = axis.ticks;
                            });
                        },
                        duration: globalAnimation.duration / 2,
                        easing: globalAnimation.easing
                    });
                    return;
                }

                if(!chart.globalEvent.isDragging && globalAnimation.isReady === true && (redraw === "hover" || redraw === "resize" || redraw === "drag" || redraw === "click")){
                    paintComponent(charts);
                    onRedraw();
                }
            }
        },
        getViewport: function(){
            var options = this.options,
                spacing = options.chart.spacing,
                left = spacing[3],
                right = spacing[1],
                top = spacing[0],
                bottom = spacing[2];
            var legendOptions;
            
            var viewport = {
                left: left,
                right: right,
                top: top,
                bottom: bottom,
                width: this.width,
                height: this.height
            };

            var plot = {};//plotX, plotY, plotWidth, plotHeight
            var offsetLeft = 0,
                offsetRight = 0,
                offsetTop = 0,
                offsetBottom = 0;
            var yAxisTitleHeight = 0;

            //plot space
            var plotSeries = (options.plotOptions || {}).series || {};
            viewport.top += pack("number", plotSeries.top, Numeric.percentage(this.height,  plotSeries.top), 20);
            viewport.bottom += pack("number", plotSeries.bottom, Numeric.percentage(this.height,  plotSeries.bottom), 0);
            viewport.left += pack("number", plotSeries.left, Numeric.percentage(this.width,  plotSeries.left), 0);
            viewport.right += pack("number", plotSeries.right, Numeric.percentage(this.width,  plotSeries.right), 0);

            if(this.title !== null){
                viewport.top += this.title.viewport.height;
            }
            if(this.legend !== null && defined(this.legend.viewport)){
                legendOptions = this.legend.options;
                if(legendOptions.floating !== true){
                    legendOptions.verticalAlign === "top" && (viewport.top += this.legend.viewport.height);
                    legendOptions.verticalAlign === "bottom" && (viewport.bottom += this.legend.viewport.height);
                }
            }
            this.rangeSlider.forEach(function(slider){
                if(slider !== null){
                    legendOptions = slider.options;
                    if(legendOptions.floating !== true && legendOptions.layout !== "vertical"){
                        viewport.bottom += slider.height + (legendOptions.margin | 0);
                    }
                }
            });

            this.yAxis.forEach(function(axis){
                if(axis.options.enabled !== false){
                    if(axis.options.opposite === true){
                        offsetRight += axis.labelWidth || 0;
                    }
                    else{
                        offsetLeft += axis.labelWidth || 0;
                    }
                    yAxisTitleHeight = Math.max(yAxisTitleHeight, pack("number", axis.titleHeight, 0));
                }
            });
            this.xAxis.forEach(function(axis){
                if(axis.options.enabled !== false){
                    if(axis.options.opposite === true){
                        offsetTop += axis.labelHeight || 0;
                    }
                    else{
                        offsetBottom += axis.labelHeight || 0;
                    }
                }
            });
            //viewport.top += offsetTop;
            viewport.top += yAxisTitleHeight;

            top = viewport.top + offsetTop;
            bottom = viewport.bottom + offsetBottom;
            left = viewport.left + offsetLeft;
            right = viewport.right + offsetRight;
            plot = {
                width: viewport.width - right - left,
                height: viewport.height - top - bottom,
                left: left,
                right: right,
                bottom: bottom,
                top: top
            };
            viewport.plot = plot;
            viewport.getPlot = function(){
                return plot;
            };
            //console.log(viewport)
            return viewport;
        },
        setOptions: function(options, redraw){
            var series = [];
            var seriesOptions,
                axisOptions;
            var chart = this;
            extend(this.options, options);
            
            var remove = function(type, axisOptions){
                chart[type].splice(0, axisOptions.length);
            };
            var modify = function(type, axisOptions){
                axisOptions.forEach(function(item, i){
                    var axis = chart[type][i];
                    axis.setOptions(item);
                    axis._options = item;
                });
            };
            var add = function(type, axis){
                axis.forEach(function(item){
                    var axisOptions = extend({}, defaultOptions[type]);
                    extend(axisOptions, item);
                    chart.addAxis(type, axisOptions);
                });
            };
            var execute = function(type, axisOptions){
                axisOptions = pack("array", axisOptions, [axisOptions]);
                axisOptions.length ^ chart[type].length
                    ? axisOptions.length < chart[type].length
                        ? remove(type, axisOptions)
                        : (modify(type, axisOptions), add(type, axisOptions.slice(axisOptions.length)))
                    : modify(type, axisOptions);
            };
            defined(axisOptions = options.xAxis) && execute("xAxis", axisOptions);
            defined(axisOptions = options.yAxis) && execute("yAxis", axisOptions);
            defined(axisOptions = options.polarAxis) && execute("polarAxis", axisOptions);
            defined(axisOptions = options.colorAxis) && execute("colorAxis", axisOptions);

            if(defined(seriesOptions = options.series)){
                seriesOptions = pack("array", seriesOptions, []);
                Graph.Chart.diff(this.series, seriesOptions, function(a, b){
                    return a.name === b.name && a.type === b.type;
                }).modify(function(newIndex, oldIndex){
                    var newSeries, oldSeries;
                    oldSeries = chart.series[oldIndex];
                    newSeries = seriesOptions[newIndex];
                    newSeries.used = true;
                    oldSeries.update(newSeries, false);
                    series.push(oldSeries);
                }).each();
                seriesOptions.forEach(function(item, i){
                    var newSeries;
                    if(!item.used){
                        newSeries = chart.setSeries(item, i);
                        newSeries._diffValues = [];
                        series.push(newSeries);
                        delete item.used;
                    }
                });
                this._series = this.series;
                this.series = series;
            }
            redraw !== false && this.draw();
            return this;
        },
        setSize: function(width, height){
            var options = this.options,
                spacing = options.chart.spacing;
            var chart = this;
            this.width = width;
            this.height = height;
            this.layer.forEach(function(layer){
                rescale(layer.getContext("2d"), width, height, DEVICE_PIXEL_RATIO);
            });
            this.container.style.width = width + "px";
            this.container.style.height = height + "px";

            if(this.legend !== null && this.legend.data.length){
                this.legend.destroy();
                this.legend.setOptions({
                    width: pack("number",
                        (options.legend || {}).width,//absolute value
                        relativeLength(width, (options.legend || {}).width),//percent
                        (width - spacing[1] - spacing[3]) * 0.7//auto
                    )
                });
                this.legend.viewport.height = Math.min(
                    this.legend.maxHeight + (pack("number", this.legend.options.margin, 0)),
                    this.height / 2
                );
            }
            if(this.title !== null){
                this.setTitle();
            }
            this.rangeSlider.forEach(function(slider){
                var rangeSelectorOptions;
                if(slider !== null){
                    rangeSelectorOptions = slider._options;
                    slider.setOptions({
                        width: pack("number",
                            rangeSelectorOptions.width,
                            Numeric.percentage(chart.width, rangeSelectorOptions.width),
                            chart.width - spacing[1] - spacing[3]
                        )
                    });
                }
            });
            this.translateAxis();
            this.render("resize");
        },
        destroy: function(){
            var container = this.container,
                chart = this;
            if(hasTouch){
                new Graph.Touch(container).free();
            }
            else{
                container.removeEventListener("click", chart.globalEvent.click, false);
                container.removeEventListener(EVENT_MOUSE_OVER, chart.globalEvent.mouseover, false);
                container.removeEventListener(EVENT_MOUSE_OUT, chart.globalEvent.mouseout, false);

                container.removeEventListener(EVENT_MOUSE_DOWN, chart.globalEvent.start, false);
                container.removeEventListener(EVENT_MOUSE_MOVE, chart.globalEvent.mousemove, false);
                document.removeEventListener(EVENT_MOUSE_UP, chart.globalEvent.drop, false);

                container.removeEventListener("mousewheel", chart.globalEvent.zoom);
                container.removeEventListener("DOMMouseScroll", chart.globalEvent.zoom);
                global.removeEventListener("resize", chart.globalEvent.resize, false);
            }

            this.layer.forEach(function(layer){
                container.removeChild(layer);
                layer = null;
            });

            if(this.tooltip !== null){
                this.tooltip.useHTML === true && (container.removeChild(this.tooltip.canvas));
            }
            container.parentNode.removeChild(container);

            [container, this.context, this.tooltip, this.legend].concat(
                this.xAxis, this.yAxis, this.colorAxis, this.series
            ).forEach(function(item){
                item = null;
            });
        },
        addLayer: function(isLayer){
            var layer = this.layer;
            return isNumber(isLayer) & isLayer > 0 ?
                (layer[layer.length] = new Layer(this.container, this.width, this.height).canvas)
                : this.canvas;
        },
        addTooltip: function(){
            var options = this.options,
                tooltipOptions = options.tooltip || {};
            var chart = this,
                charts = this.charts;
            var canvas = this.canvas;
            
            var items = [];
            var timer, duration, moving = false;
            
            function hide(){
                (timer || moving) && clearTimeout(timer);
                timer = setTimeout(function(){
                    if(!moving || !items.length){
                        tooltip.hide();
                        clearBuffer();
                        moving = false;
                    }
                }, pack("number", tooltipOptions.hideDelay, 1000));
            }
            function clearBuffer(){
                if(tooltip.context === chart.context){
                    chart.render("hover");//no redraw
                }
                else{
                    tooltip.context.clearRect(0, 0, chart.width, chart.height);
                    if(chart.legend !== null && tooltip.context === chart.legend.context){
                        chart.legend.data.length && chart.legend.draw();
                    }
                }
            }
            function axisTo(x, y){
                chart.colorAxis.forEach(function(axis){
                    if(axis.options.enabled !== false){
                        axis.addTooltip(x, y);
                    }
                });
                chart.yAxis.forEach(function(axis){
                    if(axis.options.plotLine){
                        axis.addTooltip(x, y);
                    }
                });
                chart.xAxis.forEach(function(axis){
                    if(axis.options.plotLine){
                        axis.addTooltip(x, y);
                    }
                });
            }
            function sharedTo(x, y){
                var formatter = tooltipOptions.formatter;
                var viewport = chart.getViewport();
                var plot = viewport.plot;

                items = [];
                if(moving/* && !(x < left || x > width || y < top || y > height)*/){
                    //tooltip.hide();
                    
                    //update charts
                    var keys = {}, key;
                    charts.forEach(function(chart){
                        pack("array", pack("function", chart.getShape, noop).call(chart, x, y, tooltipOptions.shared)).forEach(function(shape){
                            //chart.drawShape(shape.series.context || tooltip.context, shape.shape, shape.series);
                            items.push(shape.shape);
                            if(defined(shape.shape.key)){
                                keys[shape.shape.key] = key = shape.shape.key;
                            }
                        });
                    });
                    //console.log(keys)
                    var title = key;
                    if(items.length){
                        if(defined(formatter)){
                            var text = formatter.call(tooltipOptions.shared ? {
                                x: title,
                                key: title,
                                value: items[0].value,
                                points: items
                            } : {
                                x: title,
                                value: items[0].value,
                                key: title,
                                percentage: items[0].percentage,
                                total: items[0].total,
                                point: items[0],
                                points: items
                            });
                            if(defined(text)){
                                var html = Text.HTML(Text.parseHTML(text)).toHTML();
                                html = html.split(/<br\s*\/*>/);
                                if(defined(html)){
                                    html.forEach(function(item){
                                        tooltip.text({
                                            value: item,
                                            //color: shape.color
                                        });
                                    });
                                }
                            }
                        }
                        else{
                            if(defined(title)){
                                tooltip.text({value: "<b>" + title + "</b>", type: "title"});
                            }
                            items.forEach(function(shape){
                                tooltip.text(shape.name + ": " + shape.value, {
                                    color: shape.color
                                });
                            });
                        }
                        
                        tooltip.setBounds({
                            left: plot.left,
                            right: plot.right,
                            top: plot.top,
                            bottom: plot.bottom,
                            width: plot.width,
                            height: plot.height
                        });
                        tooltip.move(x, y);
                        /*tooltip.addCrosshair(x, y, {
                            left: plot.left,
                            top: plot.top,
                            width: plot.width + plot.left,
                            height: plot.height + plot.top
                        });*/
                        clearBuffer();
                        axisTo(x, y);
                    }
                }
                else{
                    //moving = true;
                }
                !items.length && hide();
            }

            var Tooltip = Graph.Chart.Tooltip,
                tooltip = null;
           /* var tooltipStart = function(tooltip, e){
                container.style.cursor = "default";
                if(chart.globalAnimation.isReady === true){
                    moving = true;
                    if(hasTouch){
                        var pos = Event.normalize(e, tooltip.context.canvas);
                        sharedTo(pos.x, pos.y);
                    }
                }
            };*/
            var tooltipMoved = function(tooltip, e){
                if(chart.globalAnimation.isReady === true){
                    var pos = Event.normalize(e, tooltip.context.canvas);
                    chart.container.style.cursor = "default";
                    moving = true;
                    duration && clearTimeout(duration);
                    //duration = setTimeout(function(){
                        sharedTo(pos.x, pos.y);
                    //}, 1);
                }
            };
            var tooltipEnd = function(){
                moving = false;
                if(chart.globalAnimation.isReady === true){
                    hide();
                }
            };

            var getAllCursor = function(e){
                chart.rangeSlider.forEach(function(slider){
                    if(slider !== null){
                        var pos = Event.normalize(e, chart.canvas);
                        var cursor = slider.getCursor(pos.x, pos.y, e);
                        canvas.style.cursor = cursor !== null ? cursor : "default";
                    }
                });
            };
            
            if(defined(Tooltip) && tooltipOptions.enabled !== false){
                tooltip = new Tooltip(chart.addLayer(tooltipOptions.layer), tooltipOptions);
            }
            /*chart.globalEvent.mouseover = function(e){
                tooltip && tooltipStart(tooltip, e);
                getAllCursor(e);
            };*/
            chart.globalEvent.mousemove = function(e){
                tooltip && tooltipMoved(tooltip, e);
                getAllCursor(e);
            };
            chart.globalEvent.mouseout = function(){
                tooltip && tooltipEnd();
                canvas.style.cursor = "default";
            };
            return (this.tooltip = tooltip);
        },
        addAxis: function(name, axisOptions){
            var Axis = Graph.Chart.Axis,
                axis = null;
            var chart = this;
            axisOptions = axisOptions || {enabled: true};

            if(defined(Axis) && axisOptions.enabled !== false){
                axis = new Axis(
                    this.canvas,
                    extend({
                        name: name,
                        //domain: [axisOptions.min, axisOptions.max],
                        range: axisOptions.range || [0, chart.width],
                    }, axisOptions)
                );
                axis._options = axisOptions;
                if(name === "yAxis"){
                    this.yAxis.push(axis);
                }
                else if(name === "xAxis"){
                    this.xAxis.push(axis);
                }
                else if(name === "colorAxis"){
                    this.colorAxis.push(axis);
                }
                else if(name === "polarAxis"){
                    this.polarAxis.push(axis);
                }
            }
            return axis;
        },
        addLegend: function(legendOptions){
            var Legend = Graph.Chart.Legend,
                legend = null;

            if(defined(Legend) && legendOptions.enabled !== false){
                legend = new Legend(
                    this.canvas,//this.addLayer(legendOptions.layer),
                    legendOptions.series,
                    legendOptions//selected为false不读取
                );
            }
            return legend;
        },
        translateAxis: function(){
            var viewport = this.getViewport();
            var offsetLeft = 0,
                offsetRight = 0,
                offsetTop = 0,
                offsetBottom = 0;
            var xLeftWidth = 0,
                yTopHeight = 0,
                xRightWidth = viewport.width - viewport.right,
                yBottomHeight = viewport.height - viewport.bottom;
            var chart = this;
            if(this.isAxis){
                this.yAxis.forEach(function(axis){
                    if(axis.options.enabled === true){
                        axis.scale(0, viewport.height - viewport.top - viewport.bottom);
                        if((axis.options || {}).opposite === true){
                            offsetRight += axis.labelWidth;
                        }
                        else{
                            offsetLeft += axis.labelWidth;
                        }
                    }
                });
                this.xAxis.forEach(function(axis){
                    if(axis.options.enabled === true){
                        axis.scale(0, viewport.width - viewport.left - viewport.right - offsetLeft - offsetRight);
                        if(axis.options.opposite === true){
                            offsetTop += axis.labelHeight;
                        }
                        else{
                            offsetBottom += axis.labelHeight;
                        }
                    }
                });
                this.xAxis.forEach(function(item){
                    var y;
                    if(item.options.enabled !== false){
                        if(item.options.opposite === true){
                            y = viewport.top + item.labelHeight + yTopHeight;
                            yTopHeight = y;
                        }
                        else{
                            y = yBottomHeight - item.labelHeight;
                            yBottomHeight = y;
                        }
                        item.setOptions({
                            x: viewport.left + offsetLeft,
                            y: y,
                            height: viewport.height - viewport.top - viewport.bottom - offsetTop - offsetBottom,
                            range: [0, viewport.width - viewport.left - viewport.right - offsetLeft - offsetRight]
                        });
                    }
                });
                this.yAxis.forEach(function(item){
                    var x;
                    if(item.options.enabled !== false){
                        if(item.options.opposite === true){
                            x = xRightWidth - item.labelWidth;
                            xRightWidth = x;
                        }
                        else{
                            x = viewport.left;
                            x += item.labelWidth + xLeftWidth;
                            xLeftWidth = x;
                        }
                        item.setOptions({
                            x: x,
                            y: viewport.top + offsetTop,
                            width: viewport.width - viewport.left - viewport.right - offsetLeft - offsetRight,
                            range: [0, viewport.height - viewport.top - viewport.bottom - offsetTop - offsetBottom]
                        });
                    }
                });
            }
            this.polarAxis.forEach(function(axis){
                var axisOptions = axis._options;
                var size = Math.min(
                        viewport.height - viewport.top - viewport.bottom,
                        viewport.width - viewport.left - viewport.right
                    ),
                    center;
                if(axis.options.enabled === true){
                    size = pack("number", axisOptions.size, Numeric.percentage(size, axisOptions.size), size * 0.85, 0);
                    center = (
                        center = pack("array", axisOptions.center, ["50%", "50%"]),
                        center.length < 2 && (center[1] = center[0]), center
                    );
                    center = [
                        pack("number", center[0], Numeric.percentage(chart.width, center[0]), size / 2),
                        pack("number", center[1], Numeric.percentage(chart.height, center[1]), size / 2)
                    ];
                    axis.scale(0, viewport.width - viewport.left - viewport.right);
                    axis.setOptions({
                        center: center,
                        size: size,
                        width: chart.width,// viewport.width - viewport.left - viewport.right,
                        height: chart.height,// viewport.height - viewport.top - viewport.bottom,
                        range: [0, size]
                    });
                }
            });
        },
        bind: function(){
            var options = this.options,
                container = this.container,
                chart = this;
            var draggable = Event.draggable();
            var getZoom = function(e){
                var deltaX, deltaY, delta;
                var vector;
                var scale = {};
                if(hasTouch){
                    vector = e.originEvent.vector;
                    scale.disabled = false;
                    scale.length = vector.length;
                    scale.scale = vector.scale;
                }
                else{
                    deltaX = -e.wheelDeltaX;
                    deltaY = pack("number", -e.detail, e.wheelDelta, e.wheelDeltaY, 0);
                    delta = deltaY === 0 ? deltaX : deltaY;
                    delta = deltaY = pack("number", -e.deltaY, deltaY);
                    deltaX = pack("number", e.deltaX, deltaX);
                    deltaY === 0 && (delta === -deltaX);
                    if(deltaY === 0 && deltaX === 0){
                        scale.disabled = true;
                        return;
                    }
                    delta = Math.max(-1, Math.min(1, delta));
                    scale.length = delta;
                    scale.scale = Math.exp(delta * 0.2);
                }
                return scale;
            };
            var fetchData = function(start, end){
                //setTimeout(function(){
                    chart.series.forEach(function(item){
                        item.start = start;
                        item.end = end;
                        item.shapes = item.addShape();
                    });
                    chart.draw();
                //}, 0);
            };

            chart.globalEvent.click = function(e){
                var pos = Event.normalize(e, container);
                var x = pos.x,
                    y = pos.y;
                var plotOptions, click;
                // x *= chart.canvas.width / bbox.width;
                // y *= chart.canvas.height / bbox.height;
                /*chart.series.forEach(function(series){
                    plotOptions = (options.plotOptions || {})[series.type] || {};
                    click = (click = (click = series.events || {}).click || (plotOptions.events || {}).click);
                });*/

                if(/*isFunction(click) && */chart.globalAnimation.isReady === true){
                    chart.charts.forEach(function(item){
                        var shapes = [];
                        item.series.forEach(function(series){
                            shapes = [];
                            plotOptions = (options.plotOptions || {})[series.type] || {};
                            click = (click = (click = series.events || {}).click || (plotOptions.events || {}).click);
                            if(isFunction(click)){
                                shapes = (item.getShape && item.getShape(x, y)) || [];
                                plotOptions = (options.plotOptions || {})[item.type] || {};
                                shapes.forEach(function(item){
                                    var shape = item.shape;
                                    click = (click = (item.series.events || {}).click || (plotOptions.events || {}).click);
                                    click && click.call({
                                        x: shape.key,
                                        value: shape.value,
                                        color: shape.color,
                                        key: shape.key,
                                        point: shape,
                                        total: shape.total,
                                        percentage: shape.percentage,
                                        series: item.series
                                    }, shape, item.series, e, x, y);
                                });
                            }
                        });
                        shapes = (item.getShape && item.getShape(x, y)) || [];
                        if(shapes.length && item.setSliced){
                            item.setSliced(shapes);
                            chart.render("click");
                        }
                    });
                }
            };
            //dnd
            this.rangeSelector.forEach(function(selector){
                selector._start = selector.from = pack("number", parseFloat(selector.start, 10), 0);
                selector._end = selector.to = pack("number", parseFloat(selector.end, 10), 100);
            });
            chart.globalEvent.start = function(e){
                var sx, sy, viewport;
                draggable.start(container, e);
                sx = draggable.getX(), sy = draggable.getY();
                viewport = chart.getViewport().plot;
                chart.rangeSlider.forEach(function(slider, i){
                    var rangeSelector = chart.rangeSelector[i];
                    rangeSelector.maxWidth = viewport.width * (1 + (1 - (rangeSelector.to - rangeSelector.from) / 100));
                    rangeSelector.dragging = Intersection.rect(
                        {x: sx, y: sy},
                        {x: viewport.left, y: viewport.top, width: viewport.left + viewport.width, height: viewport.top + viewport.height}
                    ) && 1;//no rangeSelector;
                    slider && slider.onStart(0, 0, e);
                });
                chart.charts.forEach(function(item){
                    isFunction(item.onStart) && item.onStart();
                });
                document.addEventListener(EVENT_MOUSE_MOVE, chart.globalEvent.drag, false);
            };
            
            chart.globalEvent.drag = function(e){
                var dx, dy, dir;
                draggable.drag(container, e);
                dx = draggable.getX();
                dy = draggable.getY();
                chart.rangeSlider.forEach(function(slider, i){
                    var rangeSelector = chart.rangeSelector[i],
                        p = Event.normalize(e, container);
                    if(rangeSelector.dragging){
                        dir = draggable.normalize();
                        var dm = Math.max(0, Math.min(1, (Math.abs(dx)) / rangeSelector.maxWidth)) * 100;
                        var v = dir.x > 0 || -1;
                        var start = rangeSelector._start - dm * v,
                            end = rangeSelector._end - dm * v;
                        //console.log(dm)
                        var t = end - start;
                        if(dir.x > 0){
                            start = Math.max(0, start);
                            end = Math.max(t, end);
                        }
                        else{
                            //left
                            end = Math.min(100, end);
                            start = Math.min(100 - t, start);
                        }
                        rangeSelector.from = start;
                        rangeSelector.to = end;
                        slider && slider.startToEnd(start + "%", end + "%");

                        chart.globalEvent.isDragging = chart.globalEvent.isDragging || !chart.globalEvent.isDragging;
                        fetchData(start, end);
                    }
                    slider && slider.onDrag(p.x, p.y, function(sv, ev, start, end){
                        chart.globalEvent.isDragging = chart.globalEvent.isDragging || !chart.globalEvent.isDragging;
                        rangeSelector.from = parseFloat(start, 10);
                        rangeSelector.to = parseFloat(end, 10);
                        fetchData(start, end);
                    });
                });
                chart.charts.forEach(function(item){
                    if(isFunction(item.onDrag)){
                        item.onDrag(dx, dy, e);
                    }
                });
                if(!chart.globalEvent.isDragging){
                    chart.render("drag");//not dragging
                }
            };
            chart.globalEvent.drop = function(){
                chart.rangeSlider.forEach(function(slider, i){
                    var rangeSelector = chart.rangeSelector[i];
                    rangeSelector._start = rangeSelector.from;
                    rangeSelector._end = rangeSelector.to;
                    slider && slider.onDrop(0, 0, function(){
                        //var start = this.start, end = this.end;
                    });
                });
                chart.charts.forEach(function(item){
                    isFunction(item.onDrop) && item.onDrop();
                });
                chart.globalEvent.isDragging = false;
                document.removeEventListener(EVENT_MOUSE_MOVE, chart.globalEvent.drag, false);
            };
            chart.globalEvent.zoom = function(e){
                var viewport = chart.getViewport().plot,
                    x = Event.normalize(e, container),
                    y = x.y;
                x = x.x;
                if(Intersection.rect(
                    {x: x, y: y},
                    {x: viewport.left, y: viewport.top, width: viewport.left + viewport.width, height: viewport.top + viewport.height}
                )){
                    var scale = getZoom(e);
                    if(scale.disabled)
                        return;
                    chart.rangeSlider.forEach(function(slider, i){
                        var rangeSelector = chart.rangeSelector[i];
                        var from = rangeSelector.from,
                            to = rangeSelector.to;
                        var r = Math.max(1 - from / to || 0, 0.1);
                        var v = (scale.length > 0 ? from < to | 0 : -1) * scale.scale * r;
                            v || (from = to);
                        
                        from = Math.max(0, from += v);
                        to = Math.min(100, to -= v);
                        rangeSelector.from = rangeSelector._start = from;
                        rangeSelector.to = rangeSelector._end = to;
                        
                            
                        slider && slider.startToEnd(from + "%", to + "%");
                    });
                    var rangeSelector = chart.rangeSelector;
                    if(rangeSelector.length && rangeSelector[0].from !== rangeSelector[0].to){
                        fetchData(rangeSelector[0].from, rangeSelector[0].to);
                        e.preventDefault && e.preventDefault();
                    }
                }
            };

            chart.globalEvent.resize = function(){
                var renderer = chart.renderer,
                    bbox;
                var width = options.chart.width,
                    height = options.chart.height;
                var timer;
                bbox = renderer.getBoundingClientRect();
                if(!defined(height)){
                    height = Math.max(renderer.offsetHeight, bbox.height);
                }
                if(!defined(width)){
                    width = Math.max(renderer.offsetWidth, bbox.width);
                }
                //console.log(width, height)
                var dimension = getDimension(
                    width,
                    height,
                    Math.max(bbox.width, renderer.offsetWidth),
                    Math.max(bbox.height, renderer.offsetHeight)
                );
                width = Math.max(0, dimension.width);
                height = Math.max(0, dimension.height);
                
                if(chart.globalAnimation.isReady === true){
                    timer && clearTimeout(timer);
                    timer = setTimeout(function(){
                        chart.setSize(width, height, false);
                    }, 100);
                }
            };

            //hover & touchmove
            if(hasTouch){
                new Graph.Touch(container).on({
                    tap: function(e){
                        chart.globalEvent.click(e);
                    },
                    press: function(e){
                        chart.globalEvent.mousemove(e);
                        if(this.status === "end"){
                            chart.globalEvent.mouseout(e);
                        }
                    },
                    swipe: function(e, touch){
                        if(touch.status === "start"){
                            chart.globalEvent.start(e);
                        }
                        else if(touch.status === "move"){
                            chart.globalEvent.drag(e);
                            chart.globalEvent.mousemove(e);
                            //chart.globalEvent.mouseover(e);
                        }
                        else if(touch.status === "end"){
                            chart.globalEvent.drop(e);
                            chart.globalEvent.mouseout(e);
                        }
                    },
                    pinch: function(e){
                        chart.globalEvent.zoom(e);
                    }
                });
            }
            else{
                /*new Event.Set(container).on({
                    click: function(e){
                        chart.globalEvent.click(e);
                    }
                });*/
                container.addEventListener("click", chart.globalEvent.click, false);
                container.addEventListener(EVENT_MOUSE_OVER, chart.globalEvent.mousemove, false);
                container.addEventListener(EVENT_MOUSE_OUT, chart.globalEvent.mouseout, false);

                container.addEventListener(EVENT_MOUSE_DOWN, chart.globalEvent.start, false);
                container.addEventListener(EVENT_MOUSE_MOVE, chart.globalEvent.mousemove, false);
                document.addEventListener(EVENT_MOUSE_UP, chart.globalEvent.drop, false);

                container.addEventListener("mousewheel", chart.globalEvent.zoom);
                container.addEventListener("DOMMouseScroll", chart.globalEvent.zoom);
                if(
                    options.chart.reflow !== false &&
                    !(isNumber(options.chart.width) && isNumber(options.chart.height))//no resize
                ){
                    global.addEventListener("resize", chart.globalEvent.resize, false);
                }
            }
        },
        export: function(image, width, height, type){
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("2d");
            var w = image.width,
                h = image.height;
            var data;

            rescale(context, width, height, DEVICE_PIXEL_RATIO);
            context.drawImage(
                image,
                0, 0, w, h,
                0, 0, width, height
            );
            data = canvas.toDataURL(type);
            document.location.href = data.replace(type, "image/octet-stream");
        }
    };

    Graph.Chart.setOptions = function(options){
        defaultOptions = extend(defaultOptions, options);
    };
    Graph.Chart.getOptions = function(){
        return defaultOptions;
    };
    
    Graph.Chart.fn = Graph.Chart.prototype = {
        init: function(canvas, options){
            if(Chart.call(this, canvas, options) === null){
                return this;
            }

            var options = this.options,
                chart = this;
            var width = this.width,
                spacing = options.chart.spacing;
            
            //create title
            this.setTitle();
            //create credits
            this.setCredits();
            
            pack("array", options.series, []).forEach(function(item){
                chart.addSeries(item);
            });

            //create axis
            var add = function(type, axis){
                pack("array", axis, [axis]).forEach(function(item){
                    var axisOptions = extend({}, defaultOptions[type]);
                    extend(axisOptions, item || {});
                    chart.addAxis(type, axisOptions);
                });
            };
            add("yAxis", options.yAxis), add("xAxis", options.xAxis),
            add("colorAxis", options.colorAxis), add("polarAxis", options.polarAxis);
            
            //create legend
            var legendOptions = extend({}, options.legend || {});
            extend(legendOptions, {
                //series: this.series,//showInLegend
                //borderWidth: 1,
                width: pack("number",
                    legendOptions.width,//absolute value
                    relativeLength(width, legendOptions.width),//percent
                    (width - spacing[1] - spacing[3]) * 0.7//auto
                ),
                x: {
                    left: spacing[3],
                    center: 0,
                    right: spacing[1]
                }[pack("string", legendOptions.align, "center")] + pack("number", legendOptions.x, 0),
                y: {
                    top: spacing[0] + chart.title.viewport.height,
                    middle: 0,
                    bottom: spacing[2]
                }[pack("string", legendOptions.verticalAlign, "bottom")] + pack("number", legendOptions.y, 0)
            });
            var legend = this.addLegend(legendOptions);
            if(legend !== null){
                legend.onClick(chart.container, function(item, index){
                    var series = chart.series,
                        selected = this.selected,
                        curSeries;
                
                    if(item.type === "pie" || item.type === "funnel"){
                        pack("object", pack("object",
                            series[pack("number", item.seriesIndex, -1)], {}
                        ).data[pack("number", item.dataIndex, -1)], {}).selected = selected;
                        //item.selected = selected;
                    }
                    else{
                        curSeries = series[index];
                        curSeries.selected = selected;//modified series
                    }
                    series.forEach(function(item){
                        item._shapes = item.shapes;
                        item.shapes = item.addShape();
                    });
                    legend.noScroll = true;
                    chart.draw();
                }).onState(chart.container, function(item){
                    var series = chart.series,
                        shape = item;
                    if(item.type === "pie" || item.type === "funnel"){
                        var shapes = pack("object",
                            series[pack("number", item.seriesIndex, -1)], {}
                        ).shapes;
                        shapes.forEach(function(shape){
                            delete shape.state;
                        });
                        (shape = shapes[pack("number", item.dataIndex, -1)] || {}).state = !0;
                    }
                    else{
                        series.forEach(function(series){
                            delete series.state;
                        });
                        shape.state = !0;
                    }
                    chart.render("hover");
                    delete shape.state;
                }).onScroll(chart.container, function(){
                    chart.render("click");
                });
                this.legend = legend;
            }

            var RangeSelector = Graph.Chart.RangeSelector;
            if(defined(options.rangeSelector)){
                (isArray(options.rangeSelector) ? options.rangeSelector : [options.rangeSelector]).forEach(function(item){
                    var rangeSelectorOptions = extend({}, item || {}),
                        rangeSlider = null;
                    var xAxisIndex = rangeSelectorOptions.xAxis,
                        yAxisIndex = rangeSelectorOptions.yAxis,
                        polarAxisIndex = rangeSelectorOptions.polarAxis;
                    if(chart.xAxis[xAxisIndex] || chart.yAxis[yAxisIndex] || chart.polarAxis[polarAxisIndex]){
                        var width = pack("number",
                                rangeSelectorOptions.width,
                                Numeric.percentage(chart.width, rangeSelectorOptions.width),
                                chart.width - spacing[1] - spacing[3]
                            ),
                            height = pack("number",
                                rangeSelectorOptions.height,
                                Numeric.percentage(chart.height, rangeSelectorOptions.height),
                                30
                            );
                        extend(rangeSelectorOptions, {
                            width: width,
                            height: height,
                            x: pack("number", rangeSelectorOptions.x, Numeric.percentage(width, rangeSelectorOptions.x), spacing[3])
                        });
                        if(defined(RangeSelector) && rangeSelectorOptions.enabled === true){
                            rangeSlider = new RangeSelector(chart.canvas, rangeSelectorOptions);
                            rangeSlider._options = item || {};
                        }
                        chart.rangeSlider.push(rangeSlider);
                        chart.rangeSelector.push({
                            start: rangeSelectorOptions.start,
                            end: rangeSelectorOptions.end
                        });
                    }
                });
            }

            chart.draw();
            chart.addTooltip();
            chart.container.nodeType === 1 && chart.bind();

            return this;
        }
    };
    extend(Graph.Chart.prototype, Chart.prototype);
    Graph.Chart.fn.init.prototype = Graph.Chart.fn;
})(typeof window !== "undefined" ? window : this, Graph);