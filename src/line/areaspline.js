(function(){
    return {
        deps: function() {
            return function(Graph, Area) {
                var pack = Graph.pack,
                    extend = Graph.extend,
                    arrayFilter = Graph.Cluster.List.filter;
                
                function AreaSpline(canvas, options) {
                    this.canvas = canvas;
                    this.context = canvas.getContext("2d");
                    this.type = "areaspline";
                    
                    this.init(options);
                }
                extend(AreaSpline.prototype, Area.prototype, {
                    init: function(options) {
                        this.series = arrayFilter(pack("array", options.series, []), function(series){
                            return series.type === "areaspline";
                        });
                        Area.prototype.init.call(this, options);
                    }
                });
                return AreaSpline;
            }.apply(global, [].slice.call(arguments));
        }
    };
})()