(function(global){
    var document = global.document;
    function factory(Graph){
        var pack = Graph.pack;

        var defined = Graph.defined;

        var extend = Graph.extend;

        var hasTouch = defined(document) && ("ontouchstart" in document);// document.documentElement.ontouchstart !== undefined;

        var normalize = function(e, element){
            var x, y;
            var pos, bbox;
            e = e || global.event;
            if(!e.target)
                e.target = e.srcElement;
            pos = e.touches ? e.touches.length ? e.touches[0] : e.changedTouches[0] : e;
            bbox = element.getBoundingClientRect();
            if(!bbox){
                //bbox = offset(element);
            }
            
            if(pos.pageX === undefined){
                x = Math.max(e.x, e.clientX - bbox.left);
                y = e.y;
            }
            else{
                x = pos.pageX - bbox.left;
                y = pos.pageY - bbox.top;
            }
            x *= pack("number", element.width / Graph.DEVICE_PIXEL_RATIO, element.offsetWidth) / bbox.width;
            y *= pack("number", element.height / Graph.DEVICE_PIXEL_RATIO, element.offsetHeight) / bbox.height;
            return {
                x: x - Math.max(document.body.scrollLeft, global.scrollX),
                y: y - Math.max(document.body.scrollTop, global.scrollY)
            };
        };
        var Event = {
            hasTouch: hasTouch,
            normalize: normalize
        };
        return extend(Event, {
            draggable: function(){
                var sx = 0, sy = 0, dx = 0, dy = 0;
                return {
                    start: function(element, e){
                        sy = normalize(e, element);
                        dx = sx = sy.x;
                        dy = sy = sy.y;
                    },
                    drag: function(element, e){
                        dy = normalize(e, element);
                        dx = dy.x - sx;
                        dy = dy.y - sy;
                    },
                    drop: function(){
                        sx = sy = dx = dy = 0;
                    },
                    getX: function(){
                        return dx;
                    },
                    getY: function(){
                        return dy;
                    },
                    normalize: function(){
                        var length = Math.sqrt(dx * dx + dy * dy),
                            x = dx,
                            y = dy;
                        if(length > 0){
                            x /= length;
                            y /= length;
                        }
                        return {
                            x: x,
                            y: y
                        };
                    }
                };
            }
        });
    }
    return {
        deps: function(){
            var args = Array.prototype.slice.call(arguments, 0);
            return factory.apply(global, [].concat(args));
        }
    };
})(typeof window !== "undefined" ? window : this)