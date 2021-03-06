(function(global, Chart) {

    var addLayout = require("./layout").deps(Numeric);

    var extent = function(series) {
        var a, b;
        var n = series.length,
            i = 0;
        var l = 0,
            r = n - 1;
        a = series[i];
        b = series[n - 1];
       
        while (++i < n) {
            if (a.selected === false) a = series[++l];
            if (b.selected === false) b = series[--r];
        }
        return [a, b];
    };

    /*
     * Class Column
    */
    function Column(canvas, options) {
        this.type = "column";

        this.shapes = [];

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.init(options);
	}
	Column.prototype = {
        constructor: Column,
		init: function(options) {
            var panels = [],
                panel = options.panel;
            var n = panel.length, i = -1, j, nn;

            var newSeries = [],
                series;
            while (++i < n) {
                newSeries = [];
                for (j = 0, nn = panel[i].series.length; j < nn; j++) if ((series = panel[i].series[j]).type === this.type) {
                    newSeries.push(series);
                    series._diffValues = List.diff(series.shapes, series._shapes || [], function(a, b){
                        return a && b && a.value === b.value;
                    });
                }
                panels.push({
                    series: newSeries
                });
            }
            this.series = newSeries;
            this.options = options;//update
            this.panels = panels;

            addLayout(panels);
        },
        draw: function() {
            var context = this.context,
                chart = this;
            this.series.forEach(function(series){
                series.shapes.forEach(function(shape){
                    chart.drawShape(series.context || context, shape, series);
                    delete shape.current;
                });
            });

            this.series.forEach(function(series){
                if(series.state){
                    chart.drawState(context, series);
                }
                series.shapes.forEach(function(shape){
                    chart.dataLabels(series.context || context, shape, series);
                });
            });
        },
        redraw: function(){
            addLayout(this.panels, 1);
            this.draw();
        },
        animateTo: function(){
            var shapes = [];
            this.series.forEach(function(series){
                var newData = series.shapes,
                    oldData = series._shapes || [];
                var animators = [];
                series._diffValues.remove(function(newIndex){
                    var newShape = newData[newIndex],
                        mergeShape = {
                            /*x0: newShape.x0,
                            y0: newShape.y0,
                            x1: newShape.x1,
                            y1: newShape.y1,*/
                            color: newShape.color,
                            _value: newShape._value,
                            value: newShape.value,
                            percentage: newShape.percentage,
                            shape: newShape
                        };
                    shapes.push([newShape, function(timer){
                        mergeShape.x0 = newShape.x0;
                        mergeShape.y0 = newShape.y0;
                        mergeShape.x1 = newShape.x1;
                        mergeShape.y1 = newShape.y1;
                        if(series.type === "bar"){
                            mergeShape.x1 = newShape.x0 + (newShape.x1 - newShape.x0) * timer;
                        }
                        else{
                            mergeShape.y1 = newShape.y0 + (newShape.y1 - newShape.y0) * timer;
                        }
                    }]);
                    
                    /*if(oldShape){
                        var y0 = oldShape.y0 + (newShape.y0 - oldShape.y0) * timer;
                        var y1 = oldShape.y1 + (newShape.y1 - oldShape.y1) * timer;
                        //console.log(newShape, oldShape);
                        
                        mergeShape.y0 = y0;
                        mergeShape.y1 = y1;
                    }*/
                    return mergeShape;
                }).add(function(newIndex){
                    var oldShape = oldData[newIndex],
                        mergeShape = {
                            x0: oldShape.x0,
                            y0: oldShape.y0,
                            x1: oldShape.x1,
                            y1: oldShape.y1,
                            color: oldShape.color,
                            _value: oldShape._value,
                            value: oldShape.value,
                            percentage: oldShape.percentage,
                            shape: oldShape
                        };
                    shapes.push([oldShape, function(timer){
                        mergeShape.y1 = oldShape.y1 - (oldShape.y1 - oldShape.y0) * timer;
                        mergeShape.x1 = oldShape.x1 - (oldShape.x1 - oldShape.x0) * timer;
                    }]);
                    return mergeShape;
                }).modify(function(newIndex, oldIndex){
                    var newShape = newData[newIndex], oldShape = oldData[oldIndex],
                        mergeShape;
                    var x0, x1, y0, y1;
                    if(oldShape && newShape){
                        mergeShape = {
                            x0: oldShape.x0,
                            y0: oldShape.y0,
                            x1: oldShape.x1,
                            y1: oldShape.y1,
                            color: newShape.color,
                            _value: newShape._value,
                            value: newShape.value,
                            percentage: newShape.percentage,
                            shape: newShape
                        };
                        shapes.push([newShape, function(timer){
                            x0 = oldShape.x0 + (newShape.x0 - oldShape.x0) * timer;
                            x1 = oldShape.x1 + (newShape.x1 - oldShape.x1) * timer;
                            if(series.selected === false){
                                x0 = oldShape.x0 + (newShape.x0 - oldShape.x0) * timer;
                                x1 = oldShape.x1 + (newShape.x1 - oldShape.x1) * timer;
                                y0 = oldShape.y0;
                                y1 = oldShape.y1;
                            }
                            else{
                                x0 = oldShape.x0 + (newShape.x0 - oldShape.x0) * timer;
                                x1 = oldShape.x1 + (newShape.x1 - oldShape.x1) * timer;
                                y0 = oldShape.y0 + (newShape.y0 - oldShape.y0) * timer;
                                y1 = oldShape.y1 + (newShape.y1 - oldShape.y1) * timer;
                            }
                            //y0 = oldShape.y0 + (newShape.y0 - oldShape.y0) * timer;
                            //y1 = oldShape.y1 + (newShape.y1 - oldShape.y1) * timer;

                            mergeShape.x0 = x0;
                            mergeShape.x1 = x1;
                            mergeShape.y0 = y0;
                            mergeShape.y1 = y1;
                        }]);
                    }
                    return mergeShape;
                }).each(function(mergeShape){
                    mergeShape && animators.push(mergeShape);
                });
                series._animators = animators;
                series._shapes = series.shapes;
            });
            return shapes;
        },
        onFrame: function(context){
            var chart = this;
            this.series.forEach(function(series){
                var animators = series._animators;
                animators.forEach(function(shape){
                    chart.drawShape(context, shape, series);
                    chart.dataLabels(context, shape.shape, series);
                });
            });
        },
        drawState: function(){},
        drawShape: function(context, shape, series){
            var x0 = shape.x0,
                y0 = shape.y0,
                x1 = shape.x1,
                y1 = shape.y1;
            var width = Math.abs(x1 - x0),
                height = Math.abs(y0 - y1);
            var borderWidth = pack("number", series.borderWidth, 0),
                borderColor = pack("string", series.borderColor, "#FFFFFF"),
                borderRadius = series.borderRadius;
            var rotation = pack("number", shape.rotation, 0);
            var color = shape.color;
            if(series.selected === false){
                borderWidth = borderRadius = 0;
            }
            if(isObject(color) && defined(color.stops) && isArray(color.stops)){
                var linearGradient = context.createLinearGradient(Math.abs(x1 - x0), y1, Math.abs(x1 - x0), y0);
                color.stops.forEach(function(item){
                    if(isNumber(item[0]) && typeof item[1] === "string")
                        linearGradient.addColorStop(item[0], item[1]);
                });
                color = linearGradient;
            }
            else{
                color = Color.parse(color);
                if(defined(shape.current)){
                    color.a = 0.55;
                }
                color = Color.rgba(color);
            }

            context.save();
            !isArray(borderRadius) && (borderRadius = isNumber(borderRadius) && borderRadius > 0
                ? [borderRadius, borderRadius, borderRadius, borderRadius]
                : [0, 0, 0, 0]);//top, right, bottom and left
            context.beginPath();
            context.moveTo(x0 + pack("number", borderRadius[0], 0), y1);//left-top
            context.lineTo(x1 - pack("number", borderRadius[1], 0), y1);//right-top
            context.bezierCurveTo(x1, y1, x1, y1, x1, y1 + pack("number", borderRadius[1], 0));//right-top corner
            context.lineTo(x1, y0);//right-bottom, height
            context.lineTo(x0, y0);//left-bottom
            context.lineTo(x0, y1 + pack("number", borderRadius[0], 0));//left-top
            context.bezierCurveTo(x0, y1, x0, y1, x0 + pack("number", borderRadius[0], 0), y1);//left-top corner
     
            if (defined(series.shadowColor)) {
                context.shadowColor = series.shadowColor;
                isNumber(series.shadowBlur) && (context.shadowBlur = series.shadowBlur);
                isNumber(series.shadowOffsetX) && (context.shadowOffsetX = series.shadowOffsetX);
                isNumber(series.shadowOffsetY) && (context.shadowOffsetY = series.shadowOffsetY);
            }
            context.fillStyle = color;
            context.fill();
            if(borderWidth > 0){
                context.beginPath();
                context.lineWidth = borderWidth;
                context.strokeStyle = borderColor;
                context.moveTo(x0 + borderWidth / 2, y1 - borderWidth / 2);
                context.lineTo(x1 - borderWidth / 2, y1 - borderWidth / 2);//bottom
                context.lineTo(x1 - borderWidth / 2, y0 + borderWidth / 2);//right
                context.lineTo(x0 + borderWidth / 2, y0 + borderWidth / 2);//top
                context.lineTo(x0 + borderWidth / 2, y1);//left
                context.stroke();
            }
            context.restore();
        },
        dataLabels: function(context, shape, series) {
            var isColumn = series.type === "column";
            dataLabels.align(function(type, bbox) {
                var w = bbox.width,
                    w2 = Math.abs(shape.x1 - shape.x0);
                var offset = 0;
                var t = pack("string", type, isColumn ? "center" : "right");
                if (!defined(type)) {
                    !isColumn && isNumber(shape.value) && shape.value < 0 && (offset = w);
                }
                return {
                    left: shape.x0,
                    center: shape.x0 + (w2 - w) / 2,
                    right: shape.x1 - w * (isColumn) - offset
                }[t];
            }).vertical(function(type, bbox) {
                var h = bbox.height,
                    h2 = Math.abs(shape.y1 - shape.y0);
                var offset = 0;
                var t = pack("string", type, isColumn ? "top" : "middle");
                if (!defined(type)) {
                    isColumn && isNumber(shape.value) && shape.value < 0 && (offset = h);
                }
                return {
                    top: shape[isColumn ? "y1" : "y0"] + offset,
                    middle: (shape[isColumn ? "y1" : "y0"] + h * isColumn) + (h2 - h) / 2,//start + center
                    bottom: shape[isColumn ? "y0" : "y1"]
                }[t];
            }).call(shape, series, context);
        },
        getShape: function(x, y, shared) {
            var series = this.series,
                length = series.length;
            var plotY, plotHeight;

            var shapes, shape, item, area,
                first,
                last;
            var results = [], result;

            function reset(shapes){
                shapes.forEach(function(item){
                    delete item.current;
                });
            }
            var isInside = function(series){
                return !(
                    x < pack("number", series.plotX, 0) ||
                    x > series.plotWidth + pack("number", series.plotX, 0) ||
                    y < pack("number", series.plotY, 0) ||
                    y > series.plotHeight + pack("number", series.plotY, 0)
                );
            };
            item = extent(series);
            first = item[0];
            last  = item[1];

            for(var i = 0; i < length; i++){
                item = series[i];
                if(item.selected === false)
                   continue;
                plotY = item.plotY;
                plotHeight = item.plotHeight;
                
                if(!isInside(item)){
                    return results;
                }
                reset(shapes = item.shapes);

                for(var j = 0; j < shapes.length; j++){
                    shape = shapes[j] || {};
                    if(shape.value === null){
                        continue;
                    }
                    area = {
                        x: shape.x0 - shape.margin,
                        y: shape.y0,
                        width: shape.x1 + shape.margin,
                        height: shape.y1
                    };
                    if(shared && first.shapes[j] && last.shapes[j]){
                        area.x = first.shapes[j] ? first.shapes[j].x0 - shape.margin : 0;
                        area.y = plotHeight + plotY;
                        area.height = plotY;
                        area.width = last.shapes[j] ? last.shapes[j].x1 + shape.margin : 0;
                    }
                    if(Intersection.rect({x: x, y: y}, area)){
                        result = {shape: shape, series: item};
                        result.shape.$value = "" + shape._value;
                        results.push(result);
                        shape.current = j;
                        if(!shared){
                            return results;
                        }
                        break;
                    }
                }
            }
            return results;
        }
    };

    var graphers = (Chart.graphers = Chart.graphers || {}),
        charts,
        type;
    for (type in (charts || (charts = {
        Column: Column,
        Bar: require("./bar").deps(Column)
    }))) {
        graphers[type.toLowerCase()] = Chart[type] = charts[type];
    }

})(typeof window !== "undefined" ? window : this, Graph.Chart);