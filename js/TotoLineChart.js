import React, {Component} from 'react';
import {Animated, Easing, View, Text, ART, Dimensions, StyleSheet} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import moment from 'moment';
import TRC from 'toto-react-components';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};

/**
 * Creates a bar chart
 *
 * NOTE THE FOLLOWING
 *
 * 1. This component is RESPONSIVE: the height will be taken from the height of the wrapping element
 *
 *
 * Requires the following:
 * - data                   : the data to create the chart in the following form:
 *                            [ { x: numeric, x value,
 *                                y: numeric, y value,
 *                                temporary: boolean, optional, if true will highlight this element as a temporary one
 *                              }, {...} ]
 * - valueLabelTransform    : (optional) a function (value) => {transforms the value to be displayed on the bar (top part)}
 * - xAxisTransform         : (optional) a function to be called with the x axis value to generate a label to put on the bar (bottom part)
 * - moreSpaceForXLabels    : (optional, default false) pass true if the x axis label needs extra space (e.g. ends up in two lines)
 * - showValuePoints        : (optional, default true), shows the value points (circles)
 * - valuePointsBackground  : (optional, default THEME color), defines the background color of the value points (Circles)
 * - valuePointsSize        : (optional, default 6), defines the radius of the circle value points
 * - curveCardinal          : (optional, default true), shows the curve as a curve cardinal. If set to false it will use the basic curve (curveLinear)
 * - leaveMargins           : (optional, default true), leave a 24 margin horizontally on each side of tthe graph
 * - areaColor              : (optional, default no color), colors the area underlying the graph with the specified color
 * - yLines                 : (optional) the y values for which to draw a horizontal line (to show the scale)
 *                            if passed, it's an [y1, y2, y3, ...]
 *                            each value will correspond to a horizontal line
 * - yLinesNumberLocale     : (optional) the locale to use to format the number with toLocaleString('<locale>') ... e,g. 'it'
 * - valueLabelColor        : (optional, default COLOR_TEXT) the color of the value labels
 */
export default class TotoLineChart extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Init the state!
    this.state = {
      yLines: [],
      // Graph settings
      settings: {
        lineColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
        valueLabelColor: props.valueLabelColor ? props.valueLabelColor : TRC.TotoTheme.theme.COLOR_TEXT,
        valueCircleColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
      },
      height: 0,
      width: 0,
    }

    // Default properties
    this.showValuePoints = this.props.showValuePoints == null ? true : this.props.showValuePoints;
    this.curveCardinal = this.props.curveCardinal == null ? true : this.props.curveCardinal;
    this.graphMargin = (this.props.leaveMargins == null || this.props.leaveMargins) ? 24 : -2;
    this.areaColor = this.props.areaColor;
    this.valuePointsBackground = this.props.valuePointsBackground == null ? TRC.TotoTheme.theme.COLOR_THEME : this.props.valuePointsBackground;
    this.valuePointsSize = this.props.valuePointsSize == null ? 6 : this.props.valuePointsSize;
    this.genericShapeStrokeWidth = 2;

    // Binding
    this.initGraph = this.initGraph.bind(this);
    this.createYLines = this.createYLines.bind(this);

  }

  /**
   * Mount the component
   */
  componentDidMount() {
  }

  /**
  * Unmount the component
  */
  componentWillUnmount() {
  }

  /**
   * Receives updated properties
   */
  initGraph() {

    if (this.props.data == null || this.props.data.length == 0) return;

    // SIZES AND Padding of elements
    this.xLabelSize = 12;
    this.xLabelBottomPadding = 6;

    if (this.props.moreSpaceForXLabels) this.xLabelSize += 12

    // Define the vertical and horizontal margins of the graph, in order to fit the circles
    let paddingV = 0, paddingH = 0;
    if (this.showValuePoints) {
      paddingV = this.valuePointsSize / 2 + 2 * this.genericShapeStrokeWidth;
      paddingH = this.valuePointsSize + 2 * this.genericShapeStrokeWidth;
    }
    // Add the padding due to the labels
    if (this.props.xAxisTransform) paddingV += 2 * this.xLabelBottomPadding + this.xLabelSize; // 2* to leave some space between the label and the graph

    // Define the min and max x values
    let xMin = d3.array.min(this.props.data, (d) => {return d.x});
    let xMax = d3.array.max(this.props.data, (d) => {return d.x});

    // Define the min and max y values
    let yMin = d3.array.min(this.props.data, (d) => {return d.y});
    let yMax = d3.array.max(this.props.data, (d) => {return d.y});

    // Update the scales
    this.x = d3.scale.scaleLinear().range([this.graphMargin + paddingH, this.state.width - this.graphMargin - paddingH]).domain([xMin, xMax]);
    this.y = d3.scale.scaleLinear().range([this.state.height - paddingV, paddingV]).domain([0, yMax]);

  }
  /**
   * Creates the horizontal y scale lines as requested in the property yLines
   */
  createYLines(ylines) {

    if (ylines == null) return;
    if (this.props.data == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let line = d3.shape.line()
          .x((d) => {return d.x})
          .y((d) => {return d.y});

      let path = line([{x: 0, y: this.y(ylines[i])}, {x: this.state.width, y: this.y(ylines[i])}]);

      shapes.push(this.createShape(path, TRC.TotoTheme.theme.COLOR_THEME_LIGHT + 50, null, 1));
    }

    return shapes;

  }

  /**
   * Creates the labels to put on the ylines, if any
   */
  createYLinesLabels(ylines) {

    if (ylines == null) return;
    if (this.props.data == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let key = 'Label-YLine-' + Math.random();

      // Value formatting
      let value = ylines[i];
      if (this.props.yLinesNumberLocale && ylines[i]) value = ylines[i].toLocaleString(this.props.yLinesNumberLocale);

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: 6, top: this.y(ylines[i]) + 3}}>
          <Text style={styles.yAxisLabel}>{value}</Text>
        </View>
      );

      shapes.push(element);
    }

    return shapes;

  }

  /**
   * Transforms cartesian coord in polar coordinates
   */
  polarCoord(centerX, centerY, radius, angleInDegrees) {

    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  /**
   * Creates a circle path
   */
  circlePath(cx, cy, radius) {

    let startAngle = 0;
    let endAngle = 360;

    var start = this.polarCoord(cx, cy, radius, endAngle * 0.9999);
    var end = this.polarCoord(cx, cy, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ]

    return d.join();

  }

  /**
   * Returns a shape drawing the provided path
   */
  createShape(path, color, fillColor) {

    let key = 'TotoLineChartShape-' + Math.random();

    return (
      <Shape key={key} d={path} strokeWidth={this.genericShapeStrokeWidth} stroke={color} fill={fillColor} />
    )
  }

  /**
   * Create the labels with the values
   */
  createValueLabels(data) {

    if (data == null) return;

    // The labels
    let labels = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      if (data[i].y == null) continue;

      // The single datum
      let value = data[i].y;

      // Transform the value if necessary
      if (this.props.valueLabelTransform) value = this.props.valueLabelTransform(value);

      // Positioning of the text
      let x = this.x(data[i].x);
      let y = this.y(data[i].y);
      let key = 'Label-' + Math.random();
      let label;

      if (this.props.valueLabelTransform) label = (
        <Text style={[styles.valueLabel, {color: this.state.settings.valueLabelColor}]}>{value}</Text>
      )

      // Define the left shift based on the length of the string
      let leftShift = 8;
      if (value.length == 1) leftShift = 4;
      else if (value.length == 2) leftShift = 7;
      else if (value.length == 3) leftShift = 10;

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: x - leftShift, top: y - 24, alignItems: 'center'}}>
          {label}
        </View>
      );

      labels.push(element);
    }

    return labels;
  }

  /**
   * Create the x axis labels
   */
  createXAxisLabels(data) {

    if (data == null) return;
    if (this.props.xAxisTransform == null) return;

    // The labels
    let labels = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let value = data[i].x;

      // Transform the value if necessary
      value = this.props.xAxisTransform(value);

      // Positioning of the text
      let x = this.x(data[i].x) - 10;
      let key = 'Label-X-' + Math.random();

      // Create the text element, only if there's a value to display
      if (value != null) {

        let element = (
          <View key={key} style={{position: 'absolute', left: x, top: this.state.height - this.xLabelBottomPadding - this.xLabelSize, width: 20, alignItems: 'center'}}>
            <Text style={styles.xAxisLabel}>{value}</Text>
          </View>
        );

        labels.push(element);
      }
    }

    return labels;
  }

  /**
   * Creates the bars
   */
  createLine(data) {

    // Don't draw if there's no data
    if (data == null) return;

    var line = d3.shape.line();

    line.x((d) => {return this.x(d.x)})
        .y((d) => {return this.y(d.y)})
        .curve(this.curveCardinal ? d3.shape.curveCardinal : d3.shape.curveLinear);

    var path = line([...data]);

    // Return the shape
    return this.createShape(path, this.state.settings.lineColor);

  }

  /**
   * Creates the area chart
   */
  createArea(data) {

    // Don't draw if there's no data
    if (data == null) return;

    var area = d3.shape.area();

    area.x((d) => {return this.x(d.x)})
        .y1((d) => {return this.y(d.y)})
        .y0(this.y(0) + 1)
        .curve(this.curveCardinal ? d3.shape.curveCardinal : d3.shape.curveLinear);

    var path = area([...data]);

    // Return the shape
    return this.createShape(path, this.state.settings.lineColor, this.areaColor);

  }

  /**
   * Creates the circles for every value
   */
  createCircles(data) {

    if (data == null) return;

    let circles = [];

    for (var i = 0; i < data.length; i++) {

      let datum = data[i];

      let circle = this.circlePath(this.x(datum.x), this.y(datum.y), this.valuePointsSize);

      circles.push(this.createShape(circle, this.state.settings.valueCircleColor, this.valuePointsBackground));
    }

    return circles;

  }

  /**
   * Renders the component
   */
  render() {

    this.initGraph();

    let line = this.areaColor ? this.createArea(this.props.data) : this.createLine(this.props.data);
    let circles = this.showValuePoints ? this.createCircles(this.props.data) : null;
    let labels = this.createValueLabels(this.props.data);
    let xLabels = this.createXAxisLabels(this.props.data);
    let ylines = this.createYLines(this.props.yLines);
    let ylinesLabels = this.createYLinesLabels(this.props.yLines);

    return (
      <View style={styles.container} onLayout={(event) => {this.setState({height: event.nativeEvent.layout.height, width: event.nativeEvent.layout.width})}}>
        <Surface height={this.state.height} width={this.state.width}>
          {line}
          {ylines}
          {circles}
        </Surface>
        {labels}
        {ylinesLabels}
        {xLabels}
      </View>
    )
  }

}

/**
 * Stylesheets
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 10,
  },
  xAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_TEXT + '50',
    fontSize: 10,
    textAlign: 'center'
  },
  yAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 10,
  },
});
