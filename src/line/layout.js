(function(global){

    var isZero = function(min, max){ return min <= 0 && max >= 0; };

    function factoy(Mathematics, Numeric){
        var interpolate = Numeric.interpolate;
        var mathMin = Math.min,
            mathMax = Math.max,
            mathFloor = Math.floor;
        var mathLog = Math.log;

        return function(panels) {

            function getKey(series, xAxisOptions, index, size) {
                var categories = xAxisOptions.categories,
                    startIndex = +series.startIndex;// pack("number", series.startIndex, 0);
                isNaN(startIndex) || (startIndex = 0);

                var key = index;
                if(categories && categories.length){
                    key = mathFloor(index + size + startIndex);
                    if(defined(categories[key]))
                        key = categories[key];
                }
                else{
                    //key = (minTickValue) + index * (maxTickValue - minTickValue) / length;
                    key = mathFloor(key + size + startIndex);
                }
                return key;
            }

            panels.forEach(function(pane) {
                var series = pane.series;
                var newData = partition(series, function(a, b){
                    var axis = (a.yAxis) === (b.yAxis) && (a.xAxis === b.xAxis);
                    if(axis){
                        if(typeof a.stack === "undefined" && typeof b.stack === "undefined")
                            return false;
                        return a.stack === b.stack && a.type === b.type;
                    }
                    return false;
                });
                    
                newData.forEach(function(group){
                    var n = group.length,
                        m = group[0].data.length,
                        j,//data size
                        i = 0;//series size
                    /*group.forEach(function(series){
                        m = mathMax(series.data.length, m);
                    });*/
                    var series, shape, value, total, positiveTotal, negativeTotal = 0;
                    var plotX, plotY, plotWidth, plotHeight;
                    var pointWidth, pointHeight, center, centerY, zeroY, yBottom, xLeft, x, y, highY;
                    var yAxisOptions,
                        xAxisOptions,
                        logBase, minValue, maxValue,
                        reversed;
                    //series properties
                    var inverted, pointPosition,
                        coordinate;
                    var isStart;
                    var size;

                    m = pack("number", group[0].maxLength, /*group[0].data.length,*/ group[0].maxLength);

                    for(j = 0; j < m; j++){
                        positiveTotal = 0;
                        negativeTotal = 0;
                        for(i = 0; i < n; i++){
                            series = group[i];//stack series
                            shape = series.shapes[j] || {};
                            value = shape.value;

                            inverted = !!series.inverted;
                            coordinate = series.coordinate;
                            pointPosition = series.pointPosition;

                            plotX = series.plotX;
                            plotY = series.plotY;
                            plotWidth = series.plotWidth;
                            plotHeight = series.plotHeight;

                            yAxisOptions = series._yAxis;// yAxis[series.yAxis | 0];
                            logBase = (yAxisOptions.logarithmic || {}).base || 10;
                            reversed = yAxisOptions.reversed;
                            maxValue = yAxisOptions.maxValue;
                            minValue = yAxisOptions.minValue;
                            xAxisOptions = series._xAxis;

                            isStart = pointPosition === "start";
                            size = mathMax(1, m - isStart);

                            pointHeight = plotHeight / size;
                            pointWidth = plotWidth / size;
                            center = (pointWidth / 2) * !isStart;
                            centerY = (pointHeight / 2) * !isStart;
                            zeroY = plotHeight - (isZero(minValue, maxValue)
                                ? reversed === true
                                    ? interpolate(0, minValue, maxValue, plotHeight, 0)
                                    : interpolate(0, minValue, maxValue, 0, plotHeight)
                                : 0
                            );
                            yBottom = plotY + zeroY;
                            yBottom = mathMin(plotHeight + plotY, yBottom);
                            xLeft = plotX;

                            if(series.selected === false || value === 0 || shape.isNULL){
                                value = 0;
                            }
                            else if(value < 0){
                                negativeTotal += value;
                            }
                            else{
                                positiveTotal += value;
                            }

                            if(yAxisOptions.type === "logarithmic"){
                                negativeTotal += value;
                                positiveTotal = mathLog(negativeTotal, logBase);
                            }
                            if(coordinate === "xy"){
                                x = interpolate.apply(null, [
                                    isArray(shape.source) ? shape.source[0] : isObject(shape.source) ? shape._x : null,
                                    xAxisOptions.minValue, xAxisOptions.maxValue, 0, plotWidth
                                ]);
                                x += plotX + center;
                                y = interpolate.apply(null, [
                                    isArray(shape.source) ? shape.source[1] : isObject(shape.source) ? shape._y : null,
                                    minValue, maxValue
                                ].concat(reversed === true ? [0, plotHeight] : [plotHeight, 0]));
                                y += plotY;
                            }
                            else{
                                if(isArray(shape.source) && shape.source.length > 1){
                                    //连续性
                                    x = j * pointWidth;// interpolate.apply(null, [shape.source[0], xAxisOptions.minValue, xAxisOptions.maxValue, 0, plotWidth]);
                                    x += plotX;
                                    x += center;
                                    y = isNumber(shape.source[1]) ? interpolate.apply(null,
                                        [shape.source[1], minValue, maxValue].concat(
                                            reversed === true ? [0, plotHeight] : [plotHeight, 0]
                                        )
                                    ) : NaN;
                                    y += plotY;
                                    highY = isNumber(shape.source[2]) ? interpolate.apply(null,
                                        [shape.source[2], minValue, maxValue].concat(
                                            reversed === true ? [0, plotHeight] : [plotHeight, 0]
                                        )
                                    ) : NaN;
                                    highY += plotY;
                                }
                                else if(isNumber(shape._x) && isNumber(shape._y)){
                                    x = plotX + j * pointWidth;//离散性
                                    x += center;
                                    y = interpolate.apply(null,
                                        [shape._y, minValue, maxValue].concat(
                                            reversed === true ? [0, plotHeight] : [plotHeight, 0]
                                        )
                                    );
                                    y += plotY;
                                }
                                else{
                                    if(inverted){
                                        pointWidth = plotHeight / (m);
                                        //console.log(inverted, pointWidth);
                                        y = j * pointWidth;
                                        y += plotY;
                                        y += centerY;
                                        x = interpolate(
                                            value < 0 ? negativeTotal : positiveTotal,
                                            minValue,
                                            maxValue,
                                            0,
                                            plotWidth
                                        );
                                        x += plotX;
                                    }
                                    else{
                                        x = j * pointWidth;
                                        x += plotX;
                                        x += center;
                                        //m === 1 && (x += center);
                                        y = [value < 0 ? negativeTotal : positiveTotal, minValue, maxValue, plotHeight, 0];
                                        reversed === true && (y[3] = y[4], y[4] = plotHeight);
                                        y = interpolate.apply(null, y);
                                        y += plotY;
                                    }
                                }
                            }

                            var prevShape = inverted ? {
                                x: xLeft, y: y,
                                x1: xLeft, y1: y,
                                x2: xLeft, y2: y
                            } : {
                                x: x, y: yBottom,
                                x1: x, y1: yBottom,
                                x2: x, y2: yBottom
                            };
                            if(i > 0){
                                prevShape = group[i - 1].shapes[j];
                                yBottom =  prevShape.y;
                                xLeft = prevShape.x;
                                yBottom = mathMin(plotHeight + plotY, yBottom);
                            }

                            total = n > 1 ? value >= 0 ? positiveTotal : negativeTotal : undefined;//series not shared
                            if(series.selected === false){
                                //y = plotY + zeroY;
                            }
                            y = mathMin(plotY + plotHeight, y);
                            shape.x = shape.x1 = shape.x2 = x;
                            shape.y = shape.y1 = shape.y2 = y;
                            shape.highY = highY;
                            shape.total = total;
                            shape.percentage = n > 1 ? value / total * 100 : undefined;
                            shape.size = pointWidth;
                            shape.margin = center;
                            shape.yBottom = yBottom;
                            shape.xLeft = xLeft;
                            shape.key = getKey(series, xAxisOptions, j, center / plotWidth / m, m);
                            shape.index = j;
                            shape.prevShape = prevShape;
                        }
                    }
                });

                series.forEach(function(item){
                    if(item.type === "spline" || item.type === "areaspline"){
                        Renderer.pointSpline(item.shapes, item);
                    }
                });
            });
        };
    }
    return {
        deps: function(){
            var args = Array.prototype.slice.call(arguments, 0);
            return factoy.apply(global, [].concat(args));
        }
    };
}).call(typeof window !== "undefined" ? window : this)