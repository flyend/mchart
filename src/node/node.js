(function(global, Chart){

    var find = (function(){
        var indexOf = function(nodes, key, filter){
            var i = -1, n = nodes.length;
            while(++i < n && !filter(nodes[i], key));
                return i < n ? nodes[i] : null;//i or -1
        };
        var equal = function(a, b){
            return a.name === b;
        };

        return function(nodes, links, filter){
            var arrays = [];
            filter = filter || equal;
            links.forEach(function(item){
                var source = indexOf(nodes, item.source, filter),
                    target = indexOf(nodes, item.target, filter);
                if(source !== null && target !== null){
                    arrays.push({
                        source: source,
                        target: target,
                        link: item
                    });
                }
            });
            return arrays;
        };
    })();

    var Symbol = {
        dount: function(x, y, w, h) {
            var r = Math.min(w, h);
            return function(context){
                context.beginPath();
                context.arc(x, y + r / 2, r, 0, PI2, true);
                context.arc(x, y + r / 2, r * 0.4, 0, PI2, false);
            };
        },
        square: function(x, y, w, h, r){
            r = 6;//typeof r === "undefined" ? 0 : Math.min(r || 0, w, h);
            return function(context){
                context.beginPath();
                context.moveTo(x + r, y);
                //top-right
                context.lineTo(x + w - r, y);
                context.bezierCurveTo(x + w, y, x + w, y, x + w, y + r);//top-right corner
                //bottom-right
                context.lineTo(x + w, y + h - r);
                context.bezierCurveTo(x + w, y + h, x + w, y + h, x + w - r, y + h);//bottom-right corner
                //bottom-left
                context.lineTo(x + r, y + h);
                context.bezierCurveTo(x, y + h, x, y + h, x, y + h - r);//bottom-left corner
                //top-left
                context.lineTo(x, y + r);
                context.bezierCurveTo(x, y, x, y, x + r, y);//top-left corner
                //context.closePath();
            };
        },
        triangle: function(x, y, w, h){
            return function(context){
                context.beginPath();
                context.moveTo(x, y + h / 2);
                context.lineTo(x + w / 2, y - h / 2);
                context.lineTo(x + w, y + h / 2);
                context.lineTo(x, y + h / 2);
            };
        },
        circle: function(x, y, w, h){
            //var cpw = 0.166 * w;
            return function(context){
                context.beginPath();
                /*context.moveTo(x + w / 2, y);
                context.bezierCurveTo(x + w + cpw, y, x + w + cpw, y + h, x + w / 2, y + h);
                context.bezierCurveTo(x - cpw, y + h, x - cpw, y, x + w / 2, y);*/
                context.arc(x + w / 2, y + w / 2, w / 2, 0, PI2);
                context.closePath();
            };
        },
        hexagon: function(x, y, w, h){
            var r = Math.max(w, h);
            return function(context){
                var i = -1, n = 6, a;
                var sin = Math.sin, cos = Math.cos;
                r /= 2;
                context.beginPath();
                context.moveTo(x + cos(0) * r + r, y + sin(0) * r + r);
                while(++i < n){
                    context.lineTo(
                        x + cos(a = i / n * PI2) * r + r,
                        y + sin(a) * r + r
                    );
                }
                context.closePath();
            };
        },
        path: function(x, y, w, h, r){
            var path = this;
            var arc = Chart.arc;
            return function(context){
                //context.stroke(new Path2D(path));
                var moveX, moveY,//line
                    centerX, centerY;//arc
                path = path.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, "$1 $2")
                    .replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, "$1 $2");
                var tokens = path.split(/[\s+]/g),
                    length = tokens.length,
                    i = 0,
                    d;
                //console.log(tokens)

                context.save();
                context.translate(x, y + r / 2);
                context.beginPath();
                //Path.parse
                for(; i < length; i++){
                    d = tokens[i];
                    switch(d){
                        case "M":
                            context.moveTo(moveX = centerX = +tokens[++i], moveY = centerY = +tokens[++i]);
                        break;
                        case "L":
                            context.lineTo(moveX = +tokens[++i], moveY = +tokens[++i]);
                        break;
                        case "A":
                            arc(context,
                                moveX,//ex
                                moveY,//ey
                                [+tokens[++i],//rx
                                +tokens[++i],//ry
                                +tokens[++i],//large
                                +tokens[++i],//sweep
                                +tokens[++i],//rotation
                                moveX = +tokens[++i],//x
                                moveY = +tokens[++i]]//y
                            );
                        break;
                        case "Z":
                            moveX = centerX, moveY = centerY;
                            i++;
                            context.closePath();
                        break;
                    }
                }
                context.restore();
                //console.log(path)
            };
        }
    };

    var Renderer = {
        linked: function(source, target, lineWidth){
            if(!source || !target)
                return null;
            lineWidth = (lineWidth || 1) - 1;
            
            var smoothing = 0.5; 
            var abox = {x: source.x, y: source.y, width: source.width, height: source.height},
                bbox = {x: target.x, y: target.y, width: target.width, height: target.height};
            
            var points = [
                {x: abox.x + abox.width * smoothing, y: abox.y - lineWidth},//source right
                {x: abox.x + abox.width * smoothing, y: abox.y + abox.height + lineWidth},//source bottom
                {x: abox.x - lineWidth, y: abox.y + abox.height * smoothing},//source left
                {x: abox.x + abox.width + lineWidth, y: abox.y + abox.height * smoothing},//source top

                {x: bbox.x + bbox.width * smoothing, y: bbox.y - lineWidth},//target right
                {x: bbox.x + bbox.width * smoothing, y: bbox.y - lineWidth},//target bottom
                {x: bbox.x - lineWidth, y: bbox.y + bbox.height * smoothing},//target left
                {x: bbox.x + bbox.width + lineWidth, y: bbox.y + bbox.height * smoothing}//target top
            ];

            var distance = [],
                links = [],
                maps = {};//i ==> j
            var dx, dy;
            var x1, y1, x2, y2, x3, y3, x4, y4;

            for(var i = 0; i < 4; i++){
                for(var j = 4; j < 8; j++){
                    var left = (i !== 3 && j !== 6) || (points[i].x < points[j].x);
                    var right = (i !== 2 && j !== 7) || (points[i].x > points[j].x);
                    var top = (i !== 1 && j !== 4) || (points[i].y < points[j].y);
                    var bottom = (i !== 0 && j !== 5) || (points[i].y > points[j].y);
                    if((i === j - 4) | (left & right & top & bottom)){
                        maps[distance[distance.push((dx = Math.abs(points[i].x - points[j].x)) + (dy = Math.abs(points[i].y - points[j].y))) - 1]] = [i, j];
                    }
                }
            }
            
            if(distance.length === 0){
                links = [0, 4];//start - end
            }
            else{
                links = maps[Math.min.apply(Math, distance)];//i ==> j
            }
            //console.log(links);
            x1 = points[links[0]].x;//i ==> j point
            y1 = points[links[0]].y;//move point
            x4 = points[links[1]].x;//j
            y4 = points[links[1]].y;//end point

            dx = Math.max(Math.abs(x4 - x1) / 2, lineWidth);// middle point min
            dy = Math.max(Math.abs(y4 - y1) / 2, lineWidth);

            x2 = [x1, x1, x1 - dx, x1 + dx][links[0]];//control point p1
            y2 = [y1 - dy, y1 + dy, y1, y1][links[0]];

            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][links[1]];//p2
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][links[1]];

            return {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                x3: x3,
                y3: y3,
                x4: x4,
                y4: y4
            };
        }
            
    };

    function Shape(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.series = [];
    }
    Shape.prototype = {

    };

    /*
     * Class Node
    */
    function Node(canvas, options){
        Shape.call(this, canvas);

        this.type = "node";
        this.init(options);
    }
    Node.prototype = {
        constructor: Node,
        init: function(options){
            var type = this.type;
            this.options = extend({}, options);
            this.series = arrayFilter(pack("array", options.series, []), function(series){
                return series.type === type;
            });
            relayout(type, this.options);
        },
        draw: function(){
            var context = this.context,
                chart = this;
            this.series.forEach(function(series){
                var shapes = series.shapes;
                if(series.selected !== false){
                    shapes.forEach(function(node){
                        node.sourceLinks = [];
                        node.targetLinks = [];
                    });
                    //draw link
                    var links = pack("array", series.links, []).length > 0 && find(shapes, series.links, function(a, b){
                        return a.name === b;
                    });
                    (links || []).forEach(function(item){
                        item.source.sourceLinks.push(item);
                        item.target.targetLinks.push(item);

                        var p = Renderer.linked(item.source, item.target);
                        if(p){
                            chart.drawLink(context, item, series);
                        }
                    });
                }
                //draw node
                shapes.forEach(function(shape){
                    chart.drawShape(context, shape, series);
                });
                //draw data labels
                if(series.selected !== false){
                    shapes.forEach(function(shape){
                        chart.drawLabels(context, shape, series);
                    });
                }
            });
        },
        redraw: function(){
            relayout(this.type, this.options);
            this.draw();
        },
        drawShape: function(context, shape, series){
            var borderWidth = pack("number", shape.borderWidth, series.borderWidth, 0),
                borderColor = shape.borderColor || series.borderColor,
                fillColor = shape.color || series.fillColor,
                symbol = pack("string", shape.symbol, "square"),
                radius = shape.radius,
                width = shape.width,
                height = shape.height;

            var x = shape.x, y = shape.y;
            var linePixel = fixLinePixel(x, y, width, height, borderWidth);

            if(isNumber(shape.current) && shape.current > -1){
                fillColor = Color.parse(fillColor);
                fillColor.a = fillColor.a * 0.8;
                fillColor = Color.rgba(fillColor);
                //this.onSelected(shape);
            }
            if(defined(shape.hover)){
                if(shape.hover === true){
                    /*fillColor = Color.parse(fillColor);
                    fillColor.a = .6;
                    fillColor = Color.rgba(fillColor);*/
                }
            }

            context.save();
            context.fillStyle = fillColor;
            (defined(shape.path) ? Symbol.path : Symbol[symbol] ? Symbol[symbol] : Symbol.square).apply(
                shape.path,
                [linePixel.x, linePixel.y, linePixel.width, linePixel.height, radius]
            )(context);
            context.fill();
            borderWidth > 0 && (context.lineWidth = borderWidth, context.strokeStyle = borderColor, context.stroke());
            context.restore();
        },
        drawLabels: function(context, shape, series){
            dataLabels.value(shape.name).align(function(type, bbox){
                var x = shape.x,
                    w = bbox.width,
                    w2 = shape.width;
                var t = pack("string", type, "center");
                return {
                    left: x - w,
                    center: x + (w2 - w) / 2,
                    right: x + w2
                }[t];
            }).vertical(function(type, bbox){
                var t = pack("string", type, "middle");
                var y = shape.y,
                    h = bbox.height,
                    h2 = shape.height;
                return {
                    top: y,
                    middle: y + h + (h2 - h) / 2,
                    bottom: y + h + h2
                }[t];
            }).call(shape, series, context);
        },
        drawLink: function(context, item, series){
            var source = item.source,
                target = item.target,
                link = item.link;
            var options = this.options,
                plotOptions = pack("object", pack("object", options.plotOptions, {}).node, {}),
                style = pack("object", plotOptions.dataLabels.style, {}),
                lineWidth = pack("number", link.lineWidth, series.lineWidth),
                lineColor = link.lineColor || series.lineColor || "#000",
                fontStyle = {
                    fontStyle: pack("string", style.fontStyle, "normal"),
                    fontSize: pack("string", style.fontSize, "12px"),
                    fontWeight: pack("string", style.fontWeight, "normal"),
                    fontFamily: pack("string", style.fontFamily, "Arial"),
                    color: link.color || "#000"
                },
                value = link.value;
            var targetColor = Color.parse(lineColor),
                linearGradient;
            var point = Renderer.linked(source, target);
            targetColor.a = 0.5;

            context.save();
            if(point){
                linearGradient = context.createLinearGradient(point.x1, point.y1, point.x4, point.y4);
                linearGradient.addColorStop(0, lineColor);
                linearGradient.addColorStop(1, Color.rgba(targetColor));
                lineColor = linearGradient;
                if(source._selected === true){
                    targetColor.a = 0.1;
                    lineColor = Color.rgba(targetColor);
                }

                context.beginPath();
                context.moveTo(point.x1, point.y1);
                context.bezierCurveTo(point.x2, point.y2, point.x3, point.y3, point.x4, point.y4);
                (context.lineWidth = lineWidth) > 0 && (context.strokeStyle = lineColor, context.stroke());
            }
            if(defined(value) && point){
                var bbox = Text.measureText(value, fontStyle);
                var dx = point.x4 + 5,
                    dy = point.y4 - lineWidth;
                //right
                if(point.x1 < point.x4){
                    dx = point.x4 - bbox.width - 5;
                }
                context.font = [
                    fontStyle.fontStyle,
                    fontStyle.fontWeight,
                    fontStyle.fontSize,
                    fontStyle.fontFamily
                ].join(" ");
                context.fillStyle = fontStyle.color;
                context.fillText(value, dx, dy);
            }
            context.restore();
        },
        getShape: function(x, y){
            var series,
                shape,
                sl = this.series.length,
                dl,
                i,
                j;
            var symbol;
            var inRanged = false;
            var results = [];
            //no shared

            for(i = 0; i < sl; i++){
                series = this.series[i];
                for(j = 0, dl = series.shapes.length; j < dl; j++){
                    shape = series.shapes[j];
                    symbol = shape.symbol;
                    if(symbol === "square"){
                        inRanged = Intersection.rect(
                            {x: x, y: y},
                            {x: shape.x, y: shape.y, width: shape.x + shape.width, height: shape.y + shape.height}
                        );
                    }
                    else if(symbol === "circle" || symbol === "dount"){
                        inRanged = Intersection.distance(
                            {x: x, y: y},
                            {x: shape.x + shape.radius, y: shape.y + shape.radius}
                        ) <= shape.radius;
                    }
                    else if(symbol === "triangle" || symbol === "hexagon"){
                        inRanged = Intersection.polygon(
                            {x: x, y: y},
                            []
                        );
                    }
                    delete shape.current;
                    //console.log(x, y, inRanged, symbol, shape)
                    if(inRanged){
                        shape.current = j;
                        results.push({
                            series: series,
                            shape: shape
                        });
                        break;
                    }
                }
            }
            this.onSelected(results);
            return results;
        },
        onSelected: function(results){
            this.series.forEach(function(series){
                series.shapes.forEach(function(shape){
                    shape._selected = !!results.length;
                });
            });

            function getConnectionsLink(o, direction) {
                var links = [];
                direction = direction || "both";

                if (direction == "source" || direction == "both") {
                    links = links.concat(getConnectionsNode(o.source, "source"));
                }
                if (direction == "target" || direction == "both") {
                    links = links.concat(getConnectionsNode(o.target, "target"));
                }

                return links;
            }
            function getConnectionsNode(o, direction) {
                var links = [];
                direction = direction || "both";

                if ((direction == "source" && o.sourceLinks.length < 2) || direction == "both") {
                    o.targetLinks.forEach(function(p) { links = links.concat(getConnectionsLink(p, direction)); });
                }
                if ((direction == "target" && o.targetLinks.length < 2) || direction == "both") {
                    o.sourceLinks.forEach(function(p) { links = links.concat(getConnectionsLink(p, direction)); });
                }

                return links;
            }
            function getConnections(o, direction) {
                return getConnectionsNode(o, direction);
            }
            if(results.length){
                results.forEach(function(result){
                    var selection = [result.shape];
                    selection.forEach(function(o) {
                        getConnections(o).forEach(function(p) {
                            selection.push(p);
                        });
                    });
                    selection.forEach(function(shape){
                        shape._selected = false;
                    });
                });
            }
        },
        onStart: function(){
            this.series.forEach(function(series){
                series.shapes.forEach(function(shape){
                    shape._x = shape.x;
                    shape._y = shape.y;
                });
            });
        },
        onDrag: function(x, y){
            this.series.forEach(function(series){
                series.shapes.forEach(function(shape){
                    shape.x = shape._x + x;
                    shape.y = shape._y + y;
                });
            });
        }
    };

    function relayout(type, options){
        options.panel.forEach(function(pane){
            var series = arrayFilter(pane.series, function(series){
                return series.type === type;
            });
            series.forEach(function(series){
                var plotX = pack("number", series.plotX, 0),
                    plotY = pack("number", series.plotY, 0),
                    plotWidth = pack("number", series.plotWidth),
                    plotHeight = pack("number", series.plotHeight);
                series.shapes.forEach(function(shape){
                    var x = shape._x,
                        y = shape._y,
                        symbol = pack("string", shape.symbol, series.symbol, "square"),
                        radius = pack("number", shape.radius, series.radius, 50),
                        width = pack("number", shape.width, series.width, radius),
                        height = pack("number", shape.height, series.height, 20);
                    !isNumber(x) && (x = Math.random() * plotWidth);
                    !isNumber(y) && (y = Math.random() * plotHeight);//layout auto

                    if(symbol === "hexagon" || symbol === "circle"){
                        width = height = radius * 2;
                    }
                    if(series.selected === false){
                        width = height = radius = 0;
                    }

                    extend(shape, {
                        radius: radius,
                        width: width,
                        height: height,
                        symbol: symbol,
                        name: shape.name || series.name,
                        x: x,
                        y: y
                    });
                });
            });
        });
    }

    var graphers = (Chart.graphers = Chart.graphers || {}),
        charts,
        type;
    for(type in (charts || (charts = {
        Node: Node
    }))){
        graphers[type.toLowerCase()] = Chart[type] = charts[type];
    }
})(typeof window !== "undefined" ? window : this, Graph.Chart);