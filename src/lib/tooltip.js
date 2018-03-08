/**
 * Class Chart.Tooltip
 * new Chart.Tooltip(Canvas, options = {})
*/
"use strict";

var Graph = require("lib/graph");

;(function(global, Graph){
    var document = global.document;
    
    var Chart = Graph.Chart || {};

    var isObject = Graph.isObject;

    var isNumber = Graph.isNumber;

    var isFunction = Graph.isFunction;

    var defined = Graph.defined;

    var extend = Graph.extend;

    var pack = Graph.pack;

    var fixLinePixel = Chart.fixLinePixel;

    var Text = Graph.Text;

    var DashLine = Chart.DashLine;

    var defaultOptions = {
        animation: true,
        style: {
            fontSize: "12px",
            fontWeight: "normal",
            color: "#666666",
            cursor: "default",
            lineHeight: "16px"
        },
        padding: "5px",
        enabled: true,
        crosshairs: undefined,
        shared: true,
        formatter: undefined,
        borderWidth: 0,
        borderRadius: 4,
        borderColor: "#7B7B7B",
        backgroundColor: "rgba(251, 251, 251, .85)",
        shadow: true,
        headerFormat: "",
        //crosshairs: {color, width, dashStyle, snap}
        positioner: undefined//The return should be an object containing x and y values
    };

    var symbolCallout = function(x, y, w, h, options){
        var arrowLength = 6,
            halfDistance = 6,
            r = Math.min((options && options.r) || 0, w, h),
            safeDistance = r + halfDistance,
            anchorX = options && options.anchorX,
            anchorY = options && options.anchorY,
            path;

        path = [
            "M", x + r, y, 
            "L", x + w - r, y, // top side
            "C", x + w, y, x + w, y, x + w, y + r, // top-right corner
            "L", x + w, y + h - r, // right side
            "C", x + w, y + h, x + w, y + h, x + w - r, y + h, // bottom-right corner
            "L", x + r, y + h, // bottom side
            "C", x, y + h, x, y + h, x, y + h - r, // bottom-left corner
            "L", x, y + r, // left side
            "C", x, y, x, y, x + r, y // top-right corner
        ];
        if (anchorX && anchorX > w && anchorY > y + safeDistance && anchorY < y + h - safeDistance) { // replace right side
            path.splice(13, 3,
                "L", x + w, anchorY - halfDistance, 
                x + w + arrowLength, anchorY,
                x + w, anchorY + halfDistance,
                x + w, y + h - r
            );
        } else if (anchorX && anchorX < 0 && anchorY > y + safeDistance && anchorY < y + h - safeDistance) { // replace left side
            path.splice(33, 3, 
                "L", x, anchorY + halfDistance, 
                x - arrowLength, anchorY,
                x, anchorY - halfDistance,
                x, y + r
            );
        } else if (anchorY && anchorY > h && anchorX > x + safeDistance && anchorX < x + w - safeDistance) { // replace bottom
            path.splice(23, 3,
                "L", anchorX + halfDistance, y + h,
                anchorX, y + h + arrowLength,
                anchorX - halfDistance, y + h,
                x + r, y + h
            );
        } else if (anchorY && anchorY < 0 && anchorX > x + safeDistance && anchorX < x + w - safeDistance) { // replace top
            path.splice(3, 3,
                "L", anchorX - halfDistance, y,
                anchorX, y - arrowLength,
                anchorX + halfDistance, y,
                w - r, y
            );
        }
        //console.log(path);
        return function(context){
            context.beginPath();
            context.moveTo(x + r, y);
            context.lineTo(x + w - r, y);//top side
            context.bezierCurveTo(x + w, y, x + w, y, x + w, y + r);//top-right corner
            context.lineTo(x + w, y + h - r);//right side
            context.bezierCurveTo(x + w, y + h, x + w, y + h, x + w - r, y + h);//bottom-right corner
            context.lineTo(x + r, y + h);//bottom side
            context.bezierCurveTo(x, y + h, x, y + h, x, y + h - r);//bottom-left corner
            context.lineTo(x, y + r);//left side
            context.bezierCurveTo(x, y, x, y, x + r, y);//top-right corner
            /*context.lineTo(x + w, y + h);//right
            context.lineTo(x, y + h);//bottom
            context.lineTo(x, y);*/
            //context.closePath();
        };
    };

    var symbolHTML = function(tag, text){
        var style = [].concat(Array.prototype.slice.call(arguments, 2)).join(";");
        return "<" + tag + " style='" + style + "'>" + text + "</" + tag + ">";
    };

    function Tooltip(){
        this.init.apply(this, arguments);
    }
    Tooltip.prototype = {
        Item: function(x, y, options){
            this.x = x;
            this.y = y;
            this.node = null;
            this.selected = options.selected;
        },//new this.Element
        init: function(canvas, options){
            var tooltipOptions;
            this.options = extend({}, defaultOptions);
            tooltipOptions = extend(this.options, options);
            this.useHTML = !!tooltipOptions.useHTML;
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            if(canvas.nodeType === 1 && this.useHTML === true){
                var style = tooltipOptions.style || {};
                var attr = {
                    position: "absolute",
                    border: (tooltipOptions.borderWidth | 0) + "px solid " + tooltipOptions.borderColor,
                    "border-radius": tooltipOptions.borderRadius / 2 + "px",
                    "background-color": tooltipOptions.backgroundColor,
                    padding: tooltipOptions.padding,
                    "line-height": style.lineHeight,
                    "font-weight": style.fontWeight || "normal",
                    "font-size": style.fontSize || "12px",
                    "font-family": style.fontFamily || "sans-serif",
                    "white-space": "nowrap",
                    color: style.color || "#666",
                    //visibility: "visible",
                    display: "none",
                    "z-index": 3,
                    "box-shadow": "0px 0px 3px #7B7B7B"
                };
                if(tooltipOptions.animation){
                    attr.transition = "left .1s linear, top .1s linear";
                }
                this.canvas = document.createElement("div");
                for(var p in attr) if(attr.hasOwnProperty(p)){
                    this.canvas.style[p.replace(/\-(\w)/g, function(all, s){
                        return s.toUpperCase();
                    })] = attr[p];
                }
                canvas.parentNode.appendChild(this.canvas);
            }

            this.x = +tooltipOptions.x;
            this.y = +tooltipOptions.y;
            if(isNaN(this.x)){
                this.x = -9999;
            }
            if(isNaN(this.y)){
                this.y = -9999;
            }

            this.width = 0;
            this.height = 0;
            this.data = [];
        },
        addCrosshair: function(){
            var options = this.options,
                crosshairs = options.crosshairs;
            var bounds = this.bounds;
            if(!defined(bounds))
                return this;
            var x = this.dx,
                y = this.dy;
            var lineWidth = 1,
                color = "#ACD8FF";
            var context = this.context;
            var left = bounds.left || 0,
                top = bounds.top || 0,
                width = (bounds.width + left) || 100,
                height = (bounds.height + top) || 25;
            
            var lineTo = function(x0, y0, x1, y1, prop){
                var dashStyle = pack("string", prop.dashStyle, "solid"),
                    linePixel;
                context.lineWidth = prop.lineWidth;
                context.strokeStyle = prop.color;
                context.beginPath();
                
                linePixel = fixLinePixel(
                    x0,
                    y0,
                    x1,
                    y1,
                    prop.lineWidth
                );
                if(dashStyle === "solid"){
                    context.moveTo(x0, y0);
                    context.lineTo(x1, y1);
                    context.stroke();
                }
                else{
                    DashLine[dashStyle] ? DashLine[dashStyle](
                        context,
                        linePixel.x,
                        linePixel.y,
                        linePixel.width,
                        linePixel.height
                    ) : (context.moveTo(x0, y0), context.lineTo(x1, y1), context.stroke());
                }
            };

            if(defined(crosshairs) && (crosshairs.length || crosshairs === true)){
                context.save();
                crosshairs = crosshairs === true ? !0 : crosshairs[0];
                
                if(defined(crosshairs)){
                    lineTo(
                        Math.max(x, Math.min(width, x)),
                        top,
                        Math.max(x, Math.min(width, x)),
                        height,
                        {
                            lineWidth: crosshairs.lineWidth || lineWidth,
                            color: crosshairs.color || color,
                            dashStyle: crosshairs.dashStyle,
                            snap: !!crosshairs.snap
                        }
                    );
                }
                crosshairs = options.crosshairs[1];
                if(defined(crosshairs)){
                    lineTo(
                        left,
                        Math.max(y, Math.min(height, y)),
                        width,
                        Math.max(y, Math.min(height, y)),
                        {
                            lineWidth: crosshairs.lineWidth || lineWidth,
                            color: crosshairs.color || color,
                            dashStyle: crosshairs.dashStyle,
                            snap: !!crosshairs.snap
                        }
                    );
                }
                context.restore();
            }
            return this;
        },
        parseHTML: function(item, isLast){
            var content = "";
            if(defined(item.color)){
                content += symbolHTML("span", "",
                    "display:inline-block",
                    "margin:3px",
                    "border-radius:" + item.symbolWidth / 2 + "px",
                    "width:" + item.symbolWidth + "px",
                    "height:" + item.symbolWidth + "px",
                    "background-color:" + (item.color || "inherit")
                );
            }
            content += item.value;
            content += isLast ? "" : "<br />";
            return content;
        },
        formatter: function(){
            var options = this.options,
                style = options.style || {},
                fontStyle = {
                    fontStyle: style.fontStyle || "normal",
                    fontSize: style.fontSize || "12px",
                    fontWeight: style.fontWeight || "normal",
                    fontFamily: style.fontFamily || "Arial",
                    lineHeight: style.lineHeight || "normal",
                    color: style.color
                };
            var canvas = this.canvas,
                context = this.context,
                data = this.data,
                useHTML = this.useHTML,
                tooltip = this;

            var content = "";

            data.forEach(function(item, i, items){
                var fontWeight = fontStyle.fontWeight;
                if(item.type === "title"){
                    fontWeight = "bold";
                }
                if(useHTML === true){
                    content += tooltip.parseHTML(item, !(items.length - i - 1));
                }
                else{
                    context.save();
                    context.textAlign = "start";
                    context.textBaseline = "alphabetic";
                    context.fillStyle = (fontStyle.color || "#ccc");
                    context.font = [
                        fontStyle.fontStyle,
                        fontWeight,
                        fontStyle.fontSize + "/" + fontStyle.lineHeight,
                        fontStyle.fontFamily
                    ].join(" ");
                    var tag = Text.HTML(Text.parseHTML(item.value, fontStyle), context);
                    context.translate(item.x, item.y - item.height);
                    tag.toCanvas();
                    if(item.type !== "title"){
                        context.fillStyle = item.color;
                        context.beginPath();
                        context.arc(-item.symbolWidth / 1.5, item.height / 2, item.symbolWidth / 2, 0, Math.PI * 2);
                        context.fill();
                    }
                    context.restore();
                }
            });
            if(useHTML === true){
                canvas.innerHTML = content;
            }
        },
        setLabels: function(){
            var options = this.options,
                style = options.style,
                padding = parseInt(options.padding, 10) | 0,
                //itemWidth = (options.width || 200) - padding * 2,
                lineHeight = 4,
                symbolWidth = 6;
            var x = this.x,
                y = this.y;
            var sumHeight = 0,
                sumWidth = 0;

            var canvas = this.canvas,
                useHTML = this.useHTML,
                tooltip = this;

            var content = "", bbox;

            this.data.forEach(function(item, i, items){
                var bbox = Text.measureText(item.value, style);
                var dy = -~i * (bbox.height);
                item.height = bbox.height;
                item.x = x + padding;
                item.symbolWidth = symbolWidth;
                if(i){
                    dy += i * lineHeight;
                }
                item.y = y + dy + padding;
                sumHeight = dy + padding;
                sumWidth = Math.max(bbox.width, sumWidth);
                if(useHTML === true){
                    content += tooltip.parseHTML(item, !(items.length - i - 1));
                }
            });
            if(defined(options.height) && isNumber(options.height)){
                this.height = options.height;
            }
            else{
                this.height = sumHeight + padding;
            }
            if(defined(options.width) && isNumber(options.height)){
                this.width = options.width;
            }
            else{
                this.width = sumWidth + symbolWidth + padding * 2;
            }
            if(useHTML === true){
                canvas.style.display = "block";
                canvas.innerHTML = content;
                bbox = canvas.getBoundingClientRect();
                this.width = bbox.width;
                this.height = bbox.height;
            }
        },
        setBounds: function(bounds){
            this.bounds = bounds;
        },
        draw: function(){
            this.addCrosshair();
            if(this.data.length){
                this.setLabels();
                this.show();
                if(this.useHTML !== true){
                    this.style();
                }
                this.formatter();
                this.data.splice(0);
            }
        },
        style: function(){
            var options = this.options,
                padding = pack("number", parseFloat(options.padding, 10), 0),
                context = this.context;
            var x = this.x - padding, y = this.y,
                width = this.width + padding, height = this.height;
            context.save();
            context.lineWidth = options.borderWidth || 0;
            context.fillStyle = options.backgroundColor;
            if(options.shadow === true){
                context.shadowColor = "#7B7B7B";
                context.shadowBlur = 6;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            
            if(defined(options.borderColor)){
                context.strokeStyle = options.borderColor;
            }
            symbolCallout(x, y, width, height, {
                r: options.borderRadius || 4
            })(context);
            
            if(defined(options.borderWidth) && options.borderWidth > 0){
                context.stroke();
            }
            if(defined(options.backgroundColor)){
                context.fill();
            }
            context.restore();
        },
        setOptions: function(options){
            extend(this.options, options);
            return this;
        },
        move: function(x, y){
            this.dx = x;
            this.dy = y;
        },
        show: function(){
            var options = this.options;
            var canvas = this.canvas,
                data = this.data,
                useHTML = this.useHTML;
            var margin = 8;
            var bounds = this.bounds;
            var height = bounds.height - bounds.top - bounds.bottom,
                width = bounds.width - bounds.left - bounds.right;
            var tooltipHeight = this.height,
                tooltipWidth = this.width;
            var x = this.dx,
                y = this.dy;
            
            x += margin;
            y += margin;
            if(y + tooltipHeight >= height){
                y -= tooltipHeight;
                y -= margin * 2;
            }
            if(x + tooltipWidth >= width){
                x -= tooltipWidth;
                x -= margin * 2;
            }
            if(x <= bounds.left){
                x = bounds.left + margin;
            }
            if(tooltipHeight > bounds.height){
                y = this.dy - tooltipHeight / 2;
            }
            if(tooltipHeight >= bounds.height){
                y = this.dy - tooltipHeight / 2;
                if(y + tooltipHeight >= bounds.height){
                    y = bounds.height - tooltipHeight - margin;
                }
            }
            if(y <= bounds.top){
                y = bounds.top;
            }
            this.x = x;
            this.y = y;
            if(isFunction(options.positioner)){
                x = options.positioner.call(this, x, y, {
                    plotX: x,
                    plotY: y
                });
                if(isObject(x) && isNumber(x.x) && isNumber(x.y)){
                    this.x = x.x;
                    this.y = x.y;
                }
                x = null;
            }
            if(data.length){
                if(useHTML === true){
                    canvas.style.display = "block";
                    canvas.style.left = this.x + "px";
                    canvas.style.top = this.y + "px";
                }
                //data.splice(0);
            }
        },
        hide: function() {
            this.width = 0;
            this.height = 0;
            delete this.dx, delete this.dy;
            this.bounds = {};
            this.addCrosshair();
            this.destroy();
        },
        text: function(value, params) {
            params = params || {};
            // value can be string or array
            if(!isObject(value)){
                value = {name: value, value: value};
            }
            defined(params.color) && (value.color = params.color);
            this.data.push(value);
            return this;
        },
        destroy: function(){
            this.data.splice(0);
            if(this.useHTML === true){
                this.canvas.style.display = "none";
                //this.canvas.innerHTML = "";
            }
        }
    };
    Chart.Tooltip = Tooltip;

    if(typeof module === "object")
        module.exports = Tooltip;
    else if(typeof define === "function" && define.amd)
        define(Tooltip);
    else{
        Chart.Tooltip = Tooltip;
    }
})(typeof window !== "undefined" ? window : global, Graph);