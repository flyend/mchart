(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Graph = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*
 * Class Animation
 * @param source{Array}
 * @param target{Array}
 * @param options{Object}
 * example
 * Animation.fire([0], [10], {
 *     step: function(){ //this.target},
 *     complete: function(){},
 *     easing: "linear"
 *     duration: 1000
 * })
*/
"use strict";

;(function(callback){
    // Easing functions take at least four arguments:
    // t: Current time
    // b: Start value
    // c: Change in value from start to end
    // d: Total duration of the animation
    // Some easing functions also take some optional arguments:
    // a: Amplitude
    // p: Period
    // s: Overshoot amount
    //
    // The equations are created by Robert Penner.
    // (c) 2003 Robert Penner, all rights reserved.
    // The work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
    var easing = {
        // Deprecated
        "ease-in": function (time) {
            return easing.cubicBezier(0.42, 0, 1, 1, time);
        },

        // Deprecated
        "ease-out": function (time) {
            return easing.cubicBezier(0, 0, 0.58, 1, time);
        },

        // Deprecated
        "ease-in-out": function (time) {
            return easing.cubicBezier(0.42, 0, 0.58, 1, time);
        },

        // Deprecated syntax, will adopt the t, b, c, d syntax as the rest
        "linear": function (time) {
            return time;
        },

        "ease-in-quad": function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },

        "ease-out-quad": function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        "ease-in-out-quad": function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        "ease-in-cubic": function (t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        "ease-out-cubic": function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        "ease-in-out-cubic": function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        "ease-in-quart": function (t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },

        "ease-out-quart": function (t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },

        "ease-in-out-quart": function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },

        "ease-in-quint": function (t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },

        "ease-out-quint": function (t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },

        "ease-in-out-quint": function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        "ease-in-sine": function (t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },

        "ease-out-sine": function (t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },

        "ease-in-out-sine": function (t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },

        "ease-in-expo": function (t, b, c, d) {
            return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },

        "ease-out-expo": function (t, b, c, d) {
            return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },

        "ease-in-out-expo": function (t, b, c, d) {
            if (t===0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },

        "ease-in-circ": function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },

        "ease-out-circ": function (t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },

        "ease-in-out-circ": function (t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },

        "ease-in-elastic": function (t, b, c, d, a, p) {
            a = a || 0;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },

        "ease-out-elastic": function (t, b, c, d, a, p) {
            a = a || 0;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },

        "ease-in-out-elastic": function (t, b, c, d, a, p) {
            a = a || 0;
            if (t===0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },

        "ease-in-back": function (t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        "ease-out-back": function (t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        "ease-in-out-back": function (t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        "ease-in-bounce": function (t, b, c, d) {
            return c - this["ease-out-bounce"](d-t, 0, c, d) + b;
        },

        "ease-out-bounce": function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
            }
        },

        "ease-in-out-bounce": function (t, b, c, d) {
            if (t < d/2) return this["ease-in-bounce"](t*2, 0, c, d) * 0.5 + b;
            return this["ease-out-bounce"](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
        },

        // Deprecated, will be replaced by the new syntax for calling easing functions
        cubicBezier: function (x1, y1, x2, y2, time) {

            // Inspired by Don Lancaster's two articles
            // http://www.tinaja.com/glib/cubemath.pdf
            // http://www.tinaja.com/text/bezmath.html


                // Set start and end point
            var x0 = 0,
                y0 = 0,
                x3 = 1,
                y3 = 1,

                // Convert the coordinates to equation space
                A = x3 - 3*x2 + 3*x1 - x0,
                B = 3*x2 - 6*x1 + 3*x0,
                C = 3*x1 - 3*x0,
                D = x0,
                E = y3 - 3*y2 + 3*y1 - y0,
                F = 3*y2 - 6*y1 + 3*y0,
                G = 3*y1 - 3*y0,
                H = y0,

                // Variables for the loop below
                t = time,
                iterations = 5,
                i, slope, x, y;

            if(time <= 0)
                return 0;

            // Loop through a few times to get a more accurate time value, according to the Newton-Raphson method
            // http://en.wikipedia.org/wiki/Newton's_method
            for (i = 0; i < iterations; i++) {

                // The curve's x equation for the current time value
                x = A* t*t*t + B*t*t + C*t + D;

                // The slope we want is the inverse of the derivate of x
                slope = 1 / (3*A*t*t + 2*B*t + C);

                // Get the next estimated time value, which will be more accurate than the one before
                t -= (x - time) * slope;
                t = t > 1 ? 1 : (t < 0 ? 0 : t);
            }

            // Find the y value through the curve's y equation, with the now more accurate time value
            y = Math.abs(E*t*t*t + F*t*t + G*t * H);

            return y;
        }
    };
    return callback && callback.call(this, easing);
}).call(typeof global !== "undefined" ? global : window, function(easing){
    var toString = Object.prototype.toString;

    var defined = function(v){
        return typeof v !== "undefined" && v !== null;
    };

    var isObject = function(v){
        return toString.call(v) === "[object Object]";
    };

    var isNumber =  function(v){
        return toString.call(v) === "[object Number]" && v === v;
    };
    var extend = function(a, b){
        var n;
        if (!a) {
            a = {};
        }
        for (n in b) {
            var src = a[n],
                copy = b[n];
            if(src === copy)
                continue;
            if(copy && isObject(copy)){
                a[n] = extend(src, copy);
            }
            else if(copy !== undefined){
                a[n] = copy;
            }
        }
        return a;
    };

    var parseCubicBezier = function(value){
        var x1, y1, x2, y2;
        var bezier = value.match(/cubic-bezier\(\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
        if(bezier){
            isNaN(x1 = parseFloat(bezier[1], 10)) && (x1 = 0);
            isNaN(y1 = parseFloat(bezier[2], 10)) && (y1 = 0);
            isNaN(x2 = parseFloat(bezier[3], 10)) && (x2 = 1);
            isNaN(y2 = parseFloat(bezier[4], 10)) && (y2 = 1);

            return function(time){
                return easing.cubicBezier(x1, y1, x2, y2, time);
            };
        }
    };
    var propFilter = function(props, key, a, b, k){
        if(typeof a === "number"){
            props[key] = a + (b - a) * k;
        }
        else if(typeof a === "object" && typeof b === "object"){
            for(var p in b){
                propFilter(props[key], p, a[p], b[p], k);
            }
        }
    };
    var Animation = {
        add: function(){
            return Animation;
        },
        fire: function(source, target){
            var args = Array.prototype.slice.call(arguments, 2),
                options = {};
            //console.log(args);
            if(!args.length){
                return this;
            }
            if(typeof (args[0]) === "object"){
                var fn, p, defaultOptions = {
                    duration: 1000,
                    easing: "linear",
                    complete: function(){},
                    queue: "default"
                };
                for(p in args[0]){
                    options[p] = args[0][p];
                }
                fn = options.easing;
                if(typeof fn === "string"){
                    if(!!~fn.indexOf("cubic-bezier")){
                        fn = parseCubicBezier(fn) || fn["linear"];
                    }
                    else{
                        fn = easing[fn] || easing["linear"];
                    }
                }
                else{
                    fn = easing["linear"];
                }
                options.easing = fn;
                !isNumber(options.duration) && (options.duration = defaultOptions.duration);
            }
            this.running = false;
            var qt = {
                        name: name,
                        list: [],
                        isRunning: false,
                        add: function (animation) {
                            this.list.push(animation);
                        },
                        remove: function (animation) {
                            if (animation) {
                                var index = this.list.indexOf(animation);
                                if (~index) {
                                    this.list.splice(index, 1);
                                }
                            } else {
                                this.list.shift();
                            }
                        },
                        run: function () {
                            if (!this.isRunning && this.list.length > 0) {
                                this.isRunning = true;
                                var listItem = this.list[0];
                                var queue = this;
                                if (listItem.type === "delay") {
                                    setTimeout(function () {
                                        queue.advance();
                                    }, listItem.duration);
                                } else {
                                    Animation.runAnimation(listItem, function () { queue.advance(); });
                                }
                            }
                        },
                        advance: function () {
                            this.list.shift();
                            this.isRunning = false;
                            this.run();
                        },
                        clear: function (finish) {
                            if (this.isRunning) {
                                var animation = this.list[0];
                                animation.cancelled = true;

                                if (finish) {
                                    Animation.setEndValues(animation);
                                    animation.options.complete.call(animation.obj);
                                }
                                this.isRunning = false;
                                Animation.mainTimer.remove(animation);
                            }
                            this.list.length = 0;
                        }
                    };

            function Q(){
                var queue = [];
                var fired = false;

                var _proto_ = {
                    add: function(fn){
                        fired ? fn.call(_proto_) : queue.push(fn);
                        return _proto_;
                    },
                    fire: function(){
                        if(queue.length){
                            var next = function(){
                                _proto_.fire();
                            };
                            var fn = queue.shift().call(_proto_, next);
                            //console.log(fn)
                        }
                        fired = true;
                        return _proto_;
                    }
                };
                return _proto_;
            }
            var id = /*options.queue || */Math.round(new Date().getTime() * Math.random()).toString();
            var animationQueues = this.animationQueues || {};
            

            //var queue = this.queues.create(source, options.queue);
            //console.log(options, queue);
            var animation = {
                id: id,
                obj: source,
                source: source,
                target: target,
                options: {
                    //queue: queue,
                    duration: options.duration,
                    easing: options.easing,
                    complete: options.complete,
                    step: options.step
                }
            };
            if(!animationQueues[id]){
                animationQueues[id] = {
                    isRunning: false,
                    queue: [animation/*, (function(animation){
                        var a = {delay: 1e3};
                        a.source = animation.source;
                        a.target = animation.target;
                        a.options = animation.options;
                        var t = a.source;
                        a.source = a.target;
                        a.target = t;
                        return a;
                    })(animation)*/],
                    clear: function(finish){
                        if(this.isRunning){
                            var animation = this.queue[0];
                            animation.cancelled = true;
                            this.isRunning = false;
                            //if(finish){
                                animation.options.complete.call({
                                    source: animation.source,
                                    target: animation.target
                                }, animation.obj);
                                Animation.mainTimer.remove(animation);
                            //}
                        }
                        this.queue.length = 0;
                    }
                };
            }
            //this.stop();
            var q = Q(id);
            var aQueue = animationQueues[id];
            aQueue.queue.forEach(function(item){
                q.add(function(next){
                    var nextStep = function(){
                        aQueue.isRunning = false;
                        next();
                    };
                    if(!aQueue.isRunning){
                        aQueue.isRunning = true;
                        defined(item.delay) ? setTimeout(function(){
                            Animation.runAnimation(item, nextStep);
                        }, item.delay) : Animation.runAnimation(item, nextStep);
                    }
                    return item;
                });
            });
            q.fire();
            //source.animationQueues[id].fire();
            //queue.add(animation);
            //queue.run();
            this.animationQueues = animationQueues;
        },
        runAnimation: function (animation, callback){
            animation.startTime = new Date().getTime();// + delay
            animation.advanceCallback = callback;
            this.mainTimer.add(animation);
        },
        tick: function(animation){
            var currentTime = new Date().getTime(),
                duration = animation.options.duration,
                remaining = currentTime - animation.startTime,// Math.max(0, animation.startTime + duration - currentTime),
                percent = (remaining / duration),
                position;

            var tweens = animation.options.easing;
            if(percent >= 1){
                this.step(animation, animation.source, animation.target, 1, 1);
                //console.log(animation, this.animationQueues);
                this.finish(animation.id);
                return true;
            }
            if(tweens.length === 1){
                position = tweens.call(easing, percent);
            }
            else{
                position = tweens.call(easing, remaining, 0, 1, duration);
            }
            this.step(animation, animation.source, animation.target, position, percent);
            return true;
        },
        step: function(animation, source, target, k, timer){
            var startValues, 
                diffValues,
                targets = [];
            target.forEach(function(item, i){
                var shape;
                startValues = source[i];
                diffValues = item;
                if(isNumber(startValues) && isNumber(diffValues)){
                    shape = {value: undefined};
                    propFilter(shape, "value", startValues, diffValues, k);
                    targets.push(shape);
                }
                else if(isObject(startValues) && isObject(diffValues)){
                    shape = extend({}, startValues);
                    for(var prop in diffValues){
                        propFilter(shape, prop, startValues[prop], diffValues[prop], k);
                    }
                    targets.push(shape);
                }
            });
            animation.options.step && animation.options.step.call({
                target: targets,
                source: source
            }, timer);
        },
        finish: function(id){
            var aQueue = this.animationQueues;
            if(defined(aQueue[id])){
                aQueue[id].clear(true);
            }
        },
        stop: function(){
            var aQueue = this.animationQueues,
                id;
            for(id in aQueue){
                aQueue[id].clear(false);
            }
            return this;
        },

        delay: function (obj, duration, options) {
            //console.log(obj, duration)
            var queue = obj.animationQueues[(options && options.queue) || "default"];
            if (queue) {
                queue.add({ type: "delay", duration: duration || 0 });
            }
        },

        mainTimer: {
            animations: [],
            add: function (animation) {
                this.animations.push(animation);
                if (this.animations.length === 1) {
                    this.start();
                }
            },
            remove: function (animation) {
                this.animations.splice(this.animations.indexOf(animation), 1);
                if (this.animations.length === 0) {
                    this.stop();
                }
            },
            start: function () {
                this.tick();
            },
            stop: function () {
                cancelAnimationFrame(this.timer);
            },
            tick: function () {
                var self = this;
                //var fps = 16;
                //setTimeout(function () {
                    self.timer = requestAnimationFrame(function(){
                        //console.log(t);
                        self.tick();
                    });

                    var animations = self.animations;
                    var animation;
                    for (var i = 0, l = animations.length; i < l; i++) {
                        animation = animations[i];
                        if (animation && !animation.cancelled) {
                            if (!Animation.tick(animation)) {
                                Animation.mainTimer.remove(animation);
                                i--; l--;
                                animation.advanceCallback();
                                //animation.options.complete.call(animation.obj);
                            }
                        }
                    }
                    if (!this.running) {
                        //redraw(true);
                    }
                //}, 1000 / fps);
            }
        },

        queues: {
            create: function (obj, name) {
                obj.animationQueues = obj.animationQueues || {};
                if (name === undefined) {
                    name = Math.round(new Date().getTime() * Math.random()).toString();
                }
                if (!obj.animationQueues[name]) {
                    obj.animationQueues[name] = {
                        name: name,
                        list: [],
                        isRunning: false,
                        add: function (animation) {
                            this.list.push(animation);
                        },
                        remove: function (animation) {
                            if (animation) {
                                var index = this.list.indexOf(animation);
                                if (~index) {
                                    this.list.splice(index, 1);
                                }
                            } else {
                                this.list.shift();
                            }
                        },
                        run: function () {
                            if (!this.isRunning && this.list.length > 0) {
                                this.isRunning = true;
                                var listItem = this.list[0];
                                var queue = this;
                                if (listItem.type === "delay") {
                                    setTimeout(function () {
                                        queue.advance();
                                    }, listItem.duration);
                                } else {
                                    Animation.runAnimation(listItem, function () { queue.advance(); });
                                }
                            }
                        },
                        advance: function () {
                            this.list.shift();
                            this.isRunning = false;
                            this.run();
                        },
                        clear: function(finish){
                            if(this.isRunning){
                                var animation = this.list[0];
                                animation.cancelled = true;
                                if(finish){
                                    
                                    Animation.setEndValues(animation);
                                    animation.options.complete.call(animation.obj);
                                }
                                this.isRunning = false;
                                Animation.mainTimer.remove(animation);
                            }
                            this.list.length = 0;
                        }
                    };
                }
                return this.get(obj, name);
            },

            get: function (obj, name) {
                return obj.animationQueues[name];
            }
        }
    };

    if(this.Graph){
        this.Graph.Animation = Animation;
    }

    if(typeof module === "object" && module.exports){
        module.exports = Animation;
    }
    else if(typeof define === "function" && define.amd){
        define(Animation);
    }
    else{
        this.Animation = Animation;
    }
});
},{}],2:[function(_dereq_,module,exports){
"use strict";

;(function(global, document){

    var Graph = {};

    var _toString = Object.prototype.toString;

    var isObject = Graph.isObject = function(a){
        return _toString.call(a) === "[object Object]";
    };
    var isNumber = Graph.isNumber = function(a){
        return typeof a === "number" && a === a;
    };
    var isArray = Graph.isArray = function(a){
        return _toString.call(a) === "[object Array]";
    };
    var isFunction = Graph.isFunction = function(a){
        return _toString.call(a) === "[object Function]";
    };
    var isString = Graph.isString = function(a){
        return _toString.call(a) === "[object String]";
    };
    var defined = Graph.defined = function(a) {
        return typeof a !== "undefined" && a !== null;
    };
    /**
     * @param first is object type
     * @param last default value
    */
    var pack = Graph.pack = Graph.pick = function(){
        var r = {
            "number": [0, isNumber],
            "function": [null, isFunction],
            "object": [null, isObject],
            "string": ["", isString],
            "array": [[], isArray]
        };
        var params = Array.prototype.slice.call(arguments, 0),
            type = params[0];
        !isString(type) && (type = "");
        var v, i;

        for(i = 1; i < params.length; i++){
            v = params[i];
            if(type && r[type] && r[type][1] && r[type][1](v)){
                return v;
            }
        }
        return r[type] && r[type][0];
    };

    var toPrecision = function(n, precision){
        var EPSILON = 8;//0.00000001
        if(arguments.length < 2)
            precision = EPSILON;
        return Number.prototype.toPrecision ? Number(n).toPrecision(precision) : (function(n, precision){
            if(n === 0 || isNaN(n) || isFinite(n))
                return "" + n;
            var ln10 = ~~(Math.log(Math.abs(n)) / Math.LN10);//log base
            var m;
            if(precision > ln10){
                m = Math.pow(10, precision - ln10 - 1);
                return "" + (m === 0 ? n : Math.round(n * m) / m);
            }
            m = Math.pow(10, precision - ln10 + 1);
            return "" + (m === 0 ? n : Math.round(n / m) * m);
        })(n, precision);
    };

    var DEVICE_PIXEL_RATIO = global.devicePixelRatio || 1;
    
    var hasTouch = "ontouchstart" in document;// document.documentElement.ontouchstart !== undefined;

    /*
     * merge b to a
     * @param a{Object} source object
     * @param b{Object} target object
     * Returns new object
    */
    var extend = Graph.extend = function(a, b){
        var n;
        if(!isObject(a) && !isFunction(a)){
            a = {};
        }
        for(n in b){
            var src = a[n],
                copy = b[n];
            if(src === copy)
                continue;
            if(copy && isObject(copy)){
                a[n] = extend(src, copy);
            }
            else if(copy !== undefined){
                a[n] = copy;
            }
        }
        return a;
    };

    
    /*
     * The data packet
     * @param data{Array} data Grouping
     * @param filter{Function}
     * Returns Array
    */
    var partition = function(data, filter){
        var length = (data = data || []).length,
            i = 0, j;
        var groups = [], group;
        var visited = new Array(length);
        var a, b;

        for(i = 0; i < length; i++){
            group = [a = data[i]];
            for(j = i + 1; j < length; j++){
                if(filter && filter.call(data, a, b = data[j]) === true){
                    group.push(b);
                    visited[j] = true;
                }
            }
            if(!visited[i])
                groups.push(group);
        }
        visited = null;
        return groups;
    };

    /*
     * The data filter
     * @param data{Array} data source
     * @param filter{Function}
     * Returns Array
    */
    var filter = function(data, filter){
        var length = data.length,
            i = 0;
        var newData = [], a;
        for(; i < length; i++){
            if(filter && filter.call(data, a = data[i]) === true){
                newData.push(a);
            }
        }
        return newData;
    };

    /*
     * The data indexOf
     * @param data{Array} data source
     * @param filter{Function}
     * Returns Array
    */
    var indexOf = function(data, key){
        var indexOf = Array.prototype.indexOf;
        return indexOf ? indexOf.call(data, key) : (function(){
            var i = -1, n = data.length;
            while(++i < n && data[i] !== key);
                return i < n ? i : -1;
        })();
    };

    /*
     * The array fill
     * @param data{Array} data source
     * @param place{.} All js data type
     * Returns Array
    */
    var fill = function(n, place){
        return Array.prototype.fill ? new Array(n = Math.max(0, n) || 0).fill(place) : (function(){
            var array = [];
            while(n--)
                array.push(place);
            return array;
        })();
    };

    
    /*
     * The array fill
     * @param value{Number} value
     * @param min{Number} min range
     * @param max{Number} max range
     * Returns is a number value
    */
    function clamp(value, min, max){
        return (value = value || 0) < min ? min : value > max ? max : value;
    }
    /*
     * linear calculation
     * @param value{Number}
     * @param minValue{Number}
     * @param maxValue{Number}
     * @param minRange{Number}
     * @param maxRange{Number}
     * Returns a linear value, f(y) = ax + b
    */

    var interpolate = function(value, minValue, maxValue, minRange, maxRange){
        var dissRange = maxRange - minRange,//定义域
            dissDomain = maxValue - minValue,//值域
            retValue;
        dissDomain = dissDomain ? 1 / dissDomain : 0;//fix value is 0
        retValue = (value - minValue) * dissDomain;
        return minRange + dissRange * retValue;//ax + b
    };

    /*
     * scale canvas
     * @param g{CanvasRenderingContext2D}
     * @param width{Number}
     * @param height{Number}
     * @param ratio{Number}
    */
    function rescale(g, width, height, ratio){
        g.canvas.width = width * ratio;
        g.canvas.height = height * ratio;
        g.canvas.style.width = width + "px";
        g.canvas.style.height = height + "px";
        g.scale(ratio, ratio);
    }
    
    
    /**
     * Parse percent
    */
    function percentage(value, base){
        var rPercent = /^[+-\s\.\d]+\s*%\s*$/;
        return rPercent.test(value) ? parseFloat(value, 10) / 100 * base : NaN;
    }

    /**
     * Math round
    */
    function round(v, p){
        //如果p大于 0，则四舍五入到指定的小数位
        //如果p等于 0，则四舍五入到最接近的整数
        //如果p小于 0，则在小数点左侧进行四舍五入
        p = Math.pow(10, p || 0);
        return p === 0 ? v : Math.round(v * p) / p;
    }

    /**
     * Graph Chart static constructor
    */
    var Chart = function(canvas, options){
        return new Graph.Chart.fn.init(canvas, options);
    };

    /**
     * svg path a to canvas
     * @example
     * g.beginPath();
     * arc(g, x + l, y + t, [
     *  current[1],
     *  current[2],
     *  current[3],
     *  current[4],
     *  current[5],
     *  current[6] + l,
     *  current[7] + t
     * ], l, t);
     * x = current[6];
     * y = current[7];//next move
     * g.stroke();
    */
    Chart.arc = (function(){
        var arcToSegmentsCache = {},
            segmentToBezierCache = {},
            join = Array.prototype.join,
            argsStr;

        // Copied from Inkscape svgtopdf, thanks!
        function arcToSegments(x, y, rx, ry, large, sweep, rotateX, ox, oy){
            argsStr = join.call(arguments);
            //console.log(argsStr, arcToSegmentsCache)
            if (arcToSegmentsCache[argsStr]) {
              return arcToSegmentsCache[argsStr];
            }

            var th = rotateX * (Math.PI / 180);
            var sin_th = Math.sin(th);
            var cos_th = Math.cos(th);
            rx = Math.abs(rx);
            ry = Math.abs(ry);
            var px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
            var py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
            var pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
            if (pl > 1) {
                pl = Math.sqrt(pl);
                rx *= pl;
                ry *= pl;
            }

            var a00 = cos_th / rx;
            var a01 = sin_th / rx;
            var a10 = (-sin_th) / ry;
            var a11 = (cos_th) / ry;
            var x0 = a00 * ox + a01 * oy;
            var y0 = a10 * ox + a11 * oy;
            var x1 = a00 * x + a01 * y;
            var y1 = a10 * x + a11 * y;

            var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
            var sfactor_sq = 1 / d - 0.25;
            if (sfactor_sq < 0) sfactor_sq = 0;
            var sfactor = Math.sqrt(sfactor_sq);
            if (sweep == large) sfactor = -sfactor;
            var xc = 0.5 * (x0 + x1) - sfactor * (y1-y0);
            var yc = 0.5 * (y0 + y1) + sfactor * (x1-x0);

            var th0 = Math.atan2(y0 - yc, x0 - xc);
            var th1 = Math.atan2(y1 - yc, x1 - xc);

            var th_arc = th1-th0;
            if (th_arc < 0 && sweep == 1){
                th_arc += 2*Math.PI;
            } else if (th_arc > 0 && sweep === 0) {
                th_arc -= 2 * Math.PI;
            }

            var segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
            var result = [];
            for (var i = 0; i < segments; i++) {
                var th2 = th0 + i * th_arc / segments;
                var th3 = th0 + (i + 1) * th_arc / segments;
                result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
            }

            return (arcToSegmentsCache[argsStr] = result);
        }

        function segmentToBezier(cx, cy, th0, th1, rx, ry, sin_th, cos_th){
            argsStr = join.call(arguments);
            if (segmentToBezierCache[argsStr]) {
              return segmentToBezierCache[argsStr];
            }

            var a00 = cos_th * rx;
            var a01 = -sin_th * ry;
            var a10 = sin_th * rx;
            var a11 = cos_th * ry;

            var cos_th0 = Math.cos(th0);
            var sin_th0 = Math.sin(th0);
            var cos_th1 = Math.cos(th1);
            var sin_th1 = Math.sin(th1);

            var th_half = 0.5 * (th1 - th0);
            var sin_th_h2 = Math.sin(th_half * 0.5);
            var t = (8 / 3) * sin_th_h2 * sin_th_h2 / Math.sin(th_half);
            var x1 = cx + cos_th0 - t * sin_th0;
            var y1 = cy + sin_th0 + t * cos_th0;
            var x3 = cx + cos_th1;
            var y3 = cy + sin_th1;
            var x2 = x3 + t * sin_th1;
            var y2 = y3 - t * cos_th1;

            return (segmentToBezierCache[argsStr] = [
                a00 * x1 + a01 * y1,  a10 * x1 + a11 * y1,
                a00 * x2 + a01 * y2,  a10 * x2 + a11 * y2,
                a00 * x3 + a01 * y3,  a10 * x3 + a11 * y3
            ]);
        }

        //<path d="A100{rx}, 100{ry}, 0{rotate}, 1{large}, 0{sweep}, 100{x}, 100{y}"></path>
        return function(g, x, y, coords){
            //x, y => g.moveTo(x, y)
            //var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
            ;(arcToSegments(
                coords[5],//ex
                coords[6],//ey
                coords[0],//rx
                coords[1],//ry
                coords[3],//large
                coords[4],//sweep,
                coords[2],//rotation
                x,
                y
            ) || []).forEach(function(item){
                g.bezierCurveTo.apply(g, segmentToBezier.apply(null, item));
            });
        };
    })();

    /*
     * Intersection
    */

    Chart.Intersection = {
        /*
         * Euclidean distance
         * Returns false or true
        */
        distance: function(p0, p1){
            var x1 = p0.x,
                y1 = p0.y;
            var x2 = p1.x,
                y2 = p1.y;

            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        },
        line: function(p0, p1){
            return this.distance(p0, p1) <= p1.width;
        },
        circle: function(p0, p1){
            var dx = p1.x - p0.x,
                dy = p1.y - p0.y,
                dr = p0.radius + p1.radius;
            return dr * dr - dx * dx - dy * dy < 0.001;
        },
        /*
         * Pie collision detection
         * Returns false or true
         * @param shapes is Shape{Object}, Contains the x, y, size, startAngle and endAngle
         * @param x and y is mouse event
         * @param checkin and checkout is callback
        */
        pie: function(p0, p1){
            var PI2 = Math.PI * 2;
            var dx = p0.x - p1.x,
                dy = p0.y - p1.y;

            var inPie = this.distance(p0, p1) <= p1.radius;
            if(inPie && typeof p1.innerRadius === "number")
                inPie = this.distance(p0, p1) >= p1.innerRadius;

            if(inPie){
                var angle = Math.atan2(dy, dx) + Math.PI / 2;//顺、逆时针开始
                if(angle < 0)
                    angle += PI2;
                if(angle > PI2)
                    angle -= PI2;
                if(angle >= p1.startAngle && angle <= p1.endAngle){
                    return inPie;
                }
            }
            return false;
        },
        /*
         * Rect collision detection
         * Returns false or true
         * @param p0 is Point{Object}, Contains the x, y, size, startAngle and endAngle
         * @param p1 is Point{Object}, Contains the x, y, width, height. p1x = x + width, p1y = y + height
        */
        rect: function(p0, p1){
            var rx = (p0.x - p1.x) * (p0.x - p1.width);
            var ry = (p0.y - p1.y) * (p0.y - p1.height);
            return rx <= 0.0 && ry <= 0.0;
        },
        polygon: function(p0, points){
            var n = 0;
            for(var i = 0, length = points.length, j = length - 1; i < length; j = i, i++){
                var source = points[i],
                    target = points[j];
                //点与多边形顶点重合或在多边形的边上
                if(
                    (source.x - p0.x) * (p0.x - target.x) >= 0 &&
                    (source.y - p0.y) * (p0.y - target.y) >= 0 &&
                    (p0.x - source.x) * (target.y - source.y) === (p0.y - source.y) * (target.x - source.x)
                ){
                    return true;
                }
                //点与相邻顶点连线的夹角
                var angle = Math.atan2(source.y - p0.y, source.x - p0.x) - Math.atan2(target.y - p0.y, target.x - p0.x);
                //确保夹角不超出取值范围（-π 到 π）
                if(angle >= Math.PI)
                    angle -= Math.PI * 2;
                else if(angle <= -Math.PI)
                    angle += Math.PI * 2;
                n += angle;
            }
            return Math.round(n / Math.PI) !== 0;//当回转数为 0 时，点在闭合曲线外部。
        }
    };
    
    /**
     * Event
    */
    Chart.Event = {
        hasTouch: hasTouch,
        normalize: function(e, element){
            var x, y;
            var pos, bbox;
            e = e || window.event;
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
            x *= pack("number", element.width / DEVICE_PIXEL_RATIO, element.offsetWidth) / bbox.width;
            y *= pack("number", element.height / DEVICE_PIXEL_RATIO, element.offsetHeight) / bbox.height;
            //console.log(element.width, element.offsetWidth, bbox)
            return {
                x: x - Math.max(document.body.scrollLeft, window.scrollX),
                y: y - Math.max(document.body.scrollTop, window.scrollY)
            };
        }
    };

    /*
     * Event
    */
    Chart.Event = (function(){
        var Event = {
            hasTouch: hasTouch
        };

        function normalize(e, element){
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
            x *= pack("number", element.width / DEVICE_PIXEL_RATIO, element.offsetWidth) / bbox.width;
            y *= pack("number", element.height / DEVICE_PIXEL_RATIO, element.offsetHeight) / bbox.height;
            //console.log(element.width, element.offsetWidth, bbox)
            return {
                x: x - Math.max(document.body.scrollLeft, global.scrollX),
                y: y - Math.max(document.body.scrollTop, global.scrollY)
            };
        }

        function draggable(){
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


        return extend(Event, {
            normalize: normalize,
            draggable: draggable()
        });
    })();

    /**
     * Dash Line
    */
    Chart.DashLine = {
        line: function(x, y, w, h, dasharray){
            var dx = w - x,
                dy = h - y,
                length = Math.sqrt(dx * dx + dy * dy),
                angle = Math.atan2(dy, dx);
            var dal = dasharray.length,
                di = 0;
            var isDraw = true;

            return function(context){
                context.save();
                context.translate(x, y);
                context.rotate(angle);

                context.moveTo(x = 0, 0);
                while(length > x){
                    x += dasharray[di++ % dal];
                    if(x > length)
                        x = length;
                    context[isDraw ? "lineTo" : "moveTo"](x, 0);
                    isDraw = !isDraw;
                }

                context.stroke();
                context.restore();
            };
        },
        solid: function(context, x, y, w, h){
            //this.line(x, y, w, h, [w])(context);
            context.moveTo(x, y);
            context.lineTo(w, h);
            context.stroke();
        },
        dot: function(context, x, y, w, h){
            this.line(x, y, w, h, [2, 6])(context);
        },
        dash: function(context, x, y, w, h){
            this.line(x, y, w, h, [8, 6])(context);
        },
        shortdash: function(context, x, y, w, h){
            this.line(x, y, w, h, [6, 2])(context);
        },
        shortdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [2, 2])(context);
        },
        shortdashdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [6, 2, 2, 2])(context);
        },
        shortdashdotdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [6, 2, 2, 2, 2, 2])(context);
        },
        longdash: function(context, x, y, w, h){
            this.line(x, y, w, h, [16, 6])(context);
        },
        dashdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [8, 6, 2, 6])(context);
        },
        longdashdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [16, 6, 2, 6])(context);
        },
        longdashdotdot: function(context, x, y, w, h){
            this.line(x, y, w, h, [16, 6, 2, 6, 2, 6])(context);
        }
    };
    

    /**
     * static methods String
    */
    Chart.String = {
        padding: function(v, p){
            return v > -1 && v < 10 ? (p = p || "0") + v : v;
        }
    };

    /**
     * Shape
     *
    */
    Chart.LineSegment = {
        none: function(context, points, options){
            var dashStyle = pack("string", (options = options || {}).dashStyle, "solid");
            var DashLine = Chart.DashLine;
            var length = points.length, i, j;
            var x, y, moveX, moveY;
            var point;

            context.beginPath();
            context.moveTo(moveX = points[i = 0].x, moveY = points[0].y);
            for(; i < length; i++){
                point = points[i];
                x = point.x;
                y = point.y;

                if(point.value === null){
                    //find next point
                    for(j = i + 1; j < length; j++){
                        //console.log(points)
                        if(points[j].value !== null){
                            x = points[j].x;
                            y = points[j].y;
                            break;
                        }
                    }
                    context.moveTo(moveX = x, moveY = y);
                }
                if(point.value !== null){
                    DashLine[dashStyle] && dashStyle !== "solid" ? DashLine[dashStyle](
                        context,
                        moveX, moveY,
                        moveX = x, moveY = y
                    ) : context.lineTo(x, y);
                }
            }
        }
    };

    extend(Chart, {
        graphers: {},
        extend: extend,
        defined: defined,
        hasTouch: hasTouch,
        isObject: isObject,
        isArray: isArray,
        isFunction: isFunction,
        isNumber: isNumber,
        toPrecision: toPrecision,
        filter: filter,
        indexOf: indexOf,
        partition: partition,
        fill: fill,
        interpolate: interpolate,
        percentage: percentage,
        clamp: clamp,
        pack: pack,
        round: round,
        scale: rescale,
        fixLinePixel: function(x, y, w, h, borderWidth){
            var xBorder = -((borderWidth = isNaN(+borderWidth) ? 1 : borderWidth) % 2 ? 0.5 : 0),
                yBorder = borderWidth % 2 ? 0.5 : 1;
            /*return {
                x: x,
                y: y,
                width: w,
                height: h
            };*/
            //horizontal
            var right = Math.round(x + w) + xBorder;
            x = Math.round(x) + xBorder;
            //vertical
            var bottom = Math.round(y + h) + yBorder,
                isTop = Math.abs(y) <= 0.5 && bottom > 0.5;
            y = Math.round(y) + yBorder;
            h = bottom - y;

            if(isTop){
                y -= 1;
                h += 1;
            }

            return {
                x: x,
                width: right - x,
                y: y,
                height: h
            };
        },
        hasAxis: function(type){
            return indexOf(["line", "spline", "column", "bar", "area", "areaspline", "scatter", "heatmap"], type) > -1;
        },
        use: function(list){
            var graphers = (Chart.graphers = Chart.graphers || {});
            !isArray(list) && (list = [list]);

            list.forEach(function(item){
                if(defined(item.type) && defined(item["class"])){
                    graphers[item.type] = item["class"][item.type];
                }
            });
        }
    });
    /*
     * Class Chart
     * @param element is canvas container
     * @param options chart setting
     */
    Graph.Chart = Chart;//Graph.Chart = Chart();

    /*Graph.Numeric = require("./numeric");

    Graph.Math = require("./math");

    Graph.Vector = require("./vector");
    
    Graph.Color = require("./color.src");

    Graph.Chart.Color = Graph.Color;

    Graph.Text = require("./text.src");

    Graph.Cluster = require("./cluster");

    Graph.Chart.diff = require("./align");*/

    Graph.Layout = _dereq_("./layout")(Graph);

    global.Graph =  Graph;
    module.exports = Graph;
})(typeof global !== "undefined" ? global : window, document);
},{"./layout":3}],3:[function(_dereq_,module,exports){
/**
 * Graph.Layout.Cluster
 * Graph.Layout.Partition
 * Graph.Layout.Tree
 * Graph.Layout.Treemap
 * Graph.Layout.Indent
 * Graph.Layout.Area
 * Graph.Layout.Pack
 * Graph.Layout.Hierarchy
*/
"use strict";
(function(factoy){
    var exports = (function(global){
        return function(Graph){
            return factoy.call(global, global, Graph);
        };
    })(this);
    if(typeof module === "object" && module.exports){
        module.exports = exports;
    }
    else if(typeof define === "function" && define.amd){
        define(exports);
    }
    else{
        factoy(this, this.Graph);
    }
}).call(typeof global !== "undefined" ? global : window, function(global, Graph){

    var pick = Graph.pick;

    var extend = Graph.extend;

    var defined = Graph.defined;

    var isArray = Graph.isArray;

    var isNumber = Graph.isNumber;

    var Intersection = Graph.Chart.Intersection;


    /**
     * Layuot
    */

    var Layout = {
        Pack: Pack,
        Hierarchy: Hierarchy
    };

    /**
     * Hierarchy
    */

    function Hierarchy(){

    }

    function recurse(node, depth, nodes){
        var children = (function(d){
            return d.children;
        }).call(null, node);
        var length,
            i = 0,
            v = 0,
            c,
            d;
        node.depth = depth;
        nodes.push(node);
        if(children && (length = children.length)){
            c = node.children = [];
            v = 0;
            for(; i < length; i++){
                d = recurse(children[i], depth + 1, nodes);
                d.parent = node;
                c.push(d);
                v += d.value;
            }
            //c.sort(function(a, b){ return a.value - b.value; });
            //if(sort) c.sort(sort);
            //if(value) node.value = v;
        }
        /*else if(value){
            node.value = +value.call(null, node, depth) || 0;
        }*/
        return node;
    }
    
    
    /**
     * Pack
    */
    function Pack(){
        this.init.apply(this, arguments);
    }
    Pack.create = (function(){
        function tree(node){
            var children = node.children;
            if(children && children.length){
                children.forEach(tree);
                node.radius = radii(children);
            }
            else{
                node.radius = Math.sqrt(node.value);
            }
        }
        function insert(a, b){
            var c = a.next;
            a.next = b;
            b.prev = a;
            b.next = c;
            c.prev = b;
        }
        function splice(a, b){
            a.next = b;
            b.prev = a;
        }

        function place(a, b, c){
            var dx = b.x - a.x,
                dy = b.y - a.y,
                dc = Math.sqrt(dx * dx + dy * dy);
            var da = b.radius + c.radius,
                db = a.radius + c.radius;
            var cos = Math.min(1, Math.max(-1, (db * db + dc * dc - da * da) / (2 * db * dc))),
                x = cos * db,
                y = Math.sin(Math.acos(cos)) * db;
            if(dc){
                dx /= dc;
                dy /= dc;
                c.x = a.x + x * dx + y * dy;
                c.y = a.y + x * dy - y * dx;
            }
            else{
                c.x = a.x + dc;
                c.y = a.y;
            }
        }
        function add(node){
            node.next = node.prev = node;
        }
        function removed(node){
            delete node.next, delete node.prev;
        }
        function radii(nodes){
            var xMin = Number.MAX_VALUE,
                xMax = -xMin,
                yMin = xMin,
                yMax = xMax;

            function bound(node){
                xMin = Math.min(node.x - node.radius, xMin);
                xMax = Math.max(node.x + node.radius, xMax);
                yMin = Math.min(node.y - node.radius, yMin);
                yMax = Math.max(node.y + node.radius, yMax);
            }
            nodes.forEach(add);

            var a, b, c;
            //first node
            a = nodes[0];
            a.x = -a.radius;
            a.y = 0;
            bound(a);

            //second node
            if(nodes.length > 1){
                b = nodes[1];
                b.x = b.radius;
                b.y = 0;
                bound(b);

                if(nodes.length > 2){
                    c = nodes[2];
                    place(a, b, c);
                    bound(c);
                    insert(a, c);
                    a.prev = c;
                    insert(c, b);
                    b = a.next;

                    for(var i = 3; i < nodes.length; i++){
                        var ins = 0, s1 = 1, s2 = 1;
                        place(a, b, c = nodes[i]);
                        for(var j = b.next; j !== b; j = j.next, s1++){
                            if(!Intersection.circle(j, c)){
                                ins = 1;
                                break;
                            }
                        }

                        if(ins === 1){
                            for(var k = a.prev; k !== j.prev; k = k.prev, s2++){
                                if(!Intersection.circle(k, c)){
                                    if(s2 < s1){
                                        ins = -1;
                                        j = k;
                                    }
                                    break;
                                }
                            }
                        }
                        //update
                        if(ins === 0){
                            insert(a, c);
                            b = c;
                            bound(c);
                        }
                        else if(ins > 0){
                            splice(a, j);
                            b = j;
                            i--;
                        }
                        else if(ins < 0){
                            splice(j, b);
                            a = j;
                            i--;
                        }
                    }
                }
            }

            var cx = (xMin + xMax) / 2,
                cy = (yMin + yMax) / 2,
                cr = 0;
            nodes.forEach(function(node){
                node.x -= cx;
                node.y -= cy;
                cr = Math.max(cr, node.radius + Math.sqrt(node.x * node.x + node.y * node.y));
            });
            //console.log(cx, cy, cr)
            nodes.forEach(removed);
            return cr;
        }
        function transform(node, x, y, k){
            var children = node.children;
            x += node.x * k;
            y += node.y * k;

            node.x = x, node.y = y, node.radius *= k;

            if(children) for(var i = 0; i < children.length; i++)
                transform(children[i], x, y, k);
        }
        return function(data, nodes){
            var root, depth = 0;

            recurse(data, depth, nodes);
            root = nodes[0];
            //console.log(root)

            return {
                sort: function(sort){
                    (function(node, callback){
                        var first = [node], second = [];
                        var i, n, children;
                        while((node = first.pop()) != null){
                            second.push(node);
                            if((children = node.children) && (i = -1, n = children.length)) while(++i < n)
                                first.push(children[i]);
                        }
                        while((node = second.pop()) != null)
                            callback(node);
                    })(root, function(node){
                        if(node.children && defined(sort)) node.children.sort(sort);
                    });
                    return this;
                },
                tree: function(){
                    root.x = 0;
                    root.y = 0;
                    tree(root);
                    return this;
                },
                transform: function(w, h){
                    var k = 1 / Math.max(root.radius * 2 / w, root.radius * 2 / h);
                    transform(root, w / 2, h / 2, k);
                }
            };
        };
    })();
    Pack.prototype = {
        init: function(data, options){
            this.data = [];
            this.options = extend({
                nodes: data
            }, options || {});

            if(!defined(this.options.nodes) || arguments.length < 2){
                return this;
            }

            var w = options.size[0],
                h = options.size[1];
            Pack.create.call(this, this.options.nodes, this.data)
                .sort(options.sort)
                .tree()
                .transform(w, h);

            return this;
        },
        pack: function(){
            return this.init(this.options.nodes, this.options);
        },
        padding: function(x){
            var options = this.options;
            if(isNumber(x)){
                options.padding = x;
                return this;
            }
            return pick("number", options.padding, 0);
        },
        sort: function(x){
            var options = this.options;
            if(defined(x)){
                options.sort = x;
                return this;
            }
            return options.sort;
        },
        size: function(x){
            var options = this.options;
            if(isArray(x)){
                !isNumber(x[0]) && (x[0] = 0);
                x = !isNumber(x[1]) ? [x, x] : x;
                options.size = x;
                return this;
            }
            return options.size;
        },
        nodes: function(x){
            var options = this.options;
            if(x){
                options.nodes = x;
                return this;
            }
            return this.data;
        }
    };

    return Layout;
});
},{}],4:[function(_dereq_,module,exports){
"use strict";

_dereq_("lib/graph");

/*require("lib/chart");
require("lib/tooltip");
require("lib/legend");
require("lib/axis");
require("lib/rangeselector");

require("line/js/line.src");
require("column/js/column.src");
require("pie/js/pie.src");
require("scatter/js/scatter.src");
require("funnel/js/funnel.src");
require("radar/js/radar.src");
require("map/js/map.src");
require("venn/js/venn.src");
require("heatmap/js/heatmap.src");
require("node/js/node.src");*/

_dereq_("lib/animation.src");
//require("lib/touch");
//require("mobile.theme");

module.exports = window.Graph;
},{"lib/animation.src":1,"lib/graph":2}]},{},[4])(4)
});