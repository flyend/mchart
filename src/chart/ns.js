//global name
var document = global.document;

var defined = Graph.defined,
    extend = Graph.extend,
    pack = Graph.pack,
    noop = function(){};

var isObject = Graph.isObject,
    isNumber = Graph.isNumber,
    isArray = Graph.isArray,
    isString = Graph.isString,
    isFunction = Graph.isFunction,
    isNumberIN = Graph.isNumberIN,
    isEmpty = Graph.isEmptyObject;


var Event = Graph.Chart.Event,
    Mathematics = Graph.Math,
    Geometry = Graph.Geometry,
    Intersection = Geometry.Intersection,
    DashLine = Geometry.Line.Dash,
    Text = Graph.Text,
    Color = Graph.Color,
    Numeric = Graph.Numeric,
    Formatter = Graph.Formatter,
    List = Graph.Cluster.List,
    KDTree = Graph.KDTree;

var toPrecision = Numeric.toPrecision,
    interpolate = Numeric.interpolate;

var arrayFilter = List.filter,
    arrayIndexOf = List.indexOf,
    partition = List.partition;

var mathLog = Mathematics.log;

var hasAxis = function(type){
    return arrayIndexOf(["line", "spline", "column", "bar", "area", "areaspline", "arearange", "scatter", "heatmap", "candlestick"], type) > -1;
};

var hasTouch = Graph.Chart.hasTouch;

var rescale = Graph.Chart.scale;


var DEVICE_PIXEL_RATIO = Graph.DEVICE_PIXEL_RATIO;

var fixLinePixel = Graph.Chart.fixLinePixel;

var fixPixelHalf = Graph.Chart.fixPixelHalf;

var dataLabels = require("./datalabels").deps(Graph, Graph.Text);

var EVENT_MOUSE_OVER = hasTouch ? "touchstart" : "mouseover";
var EVENT_MOUSE_MOVE = hasTouch ? "touchmove" : "mousemove";
var EVENT_MOUSE_OUT = hasTouch ? "touchend" : "mouseout";
var EVENT_MOUSE_DOWN = "mousedown";
var EVENT_MOUSE_UP = "mouseup";

var PI = Math.PI,
    PI2 = PI * 2;

var noop = function(){};