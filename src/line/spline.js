(function(){
    function factoy(Graph, Line){
        var extend = Graph.extend,
            pack = Graph.pack,
            arrayFilter = Graph.Cluster.List.filter;

        var Spline = function(canvas, options){
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.type = "spline";

            this.init(options);
        };
        extend(Spline.prototype, Line.prototype, {
            constructor: Spline,
            init: function(options){
                this.series = arrayFilter(pack("array", options.series, []), function(series){
                    return series.type === "spline";
                });
                Line.prototype.init.call(this, options);
            }
        });
        return Spline;
    }
    return {
        deps: function(){
            var args = Array.prototype.slice.call(arguments, 0);
            return factoy.apply(global, [].concat(args));
        }
    };
})()