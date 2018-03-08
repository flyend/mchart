# M-Chart
####M-Chart is a mobile visual component library based on canvas.####

# Example Usage
```javascript
 // Load M-Chart, if you use the way below, you import the whole package of M-Chart,including all components and charts.

var Mchart = require("mchart.js");


//if you do not want to import the whole package, you can also import the object separately. "Graph" is a global object.
// "Graph.Chart" is a chart constructor, "Graph.Chart.Axis" is a axis constructor. see usages below.

require("/lib/graph");//exports Chart, binding the global Graph.Chart
require("/lib/chart");
require("/lib/axis");
require("/lib/legend");
require("/lib/tooltip");

// require the pie chart
require("/pie/js/pie");
//Generate pie chart
new Graph.Chart(DOMElement, {
	type: "pie",
	series: [{
		data: []
	}]
});

// simple API
@DOMElement => DOM structure with height and width, and can be CANVAS
@options => {
	chart: {...} => Options regarding the chart area and plot area as well as general chart options.
	title: {...} => The chart's main title.
	subtitle: {...} => The chart's subtitle.
	series: {...} => The actual series to append to the chart.
	legend: {...} => The legend is a box containing a symbol and name for each series item or point item in the chart.
	tooltip: {...} => Options for the tooltip that appears when the user hovers over a series or point.
	plotOptions: {...} => The plotOptions is a wrapper object for config objects for each series type.
	xAxis: {...} => The X axis or category axis. Normally this is the horizontal axis.
	yAxis: {...} => The Y axis or value axis. Normally this is the vertical axis, though if the chart is inverted this is the horizontal axis.
}

```
