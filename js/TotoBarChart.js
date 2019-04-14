import React, {Component} from 'react';
import {View, Text, ART, Dimensions, StyleSheet, Image} from 'react-native';
import TRC from 'toto-react-components';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import moment from 'moment';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};
const window = Dimensions.get('window');

/**
 * Creates a bar chart
 * Requires the following:
 * - data                : the data to create the chart in the following form:
 *                         [ { x: numeric, x value,
 *                            y: numeric, y value,
 *                            temporary: boolean, optional, if true will highlight this element as a temporary one
 *                          }, {...} ]
 * - valueLabelTransform : (optional) a function, optional, (value) => {transforms the value to be displayed on the bar (top part)}
 * - xAxisTransform      : (optional, default null) a function to be called with the x axis value to generate a label to put on the bar (bottom part)
 * - xLabelImgLoader     : (optional, default null) a function(datum) => {return the image to be put as an Image source}. This allows to put an image instead of text as a x axis label
 * - xLabelMode          : (optional) specifies the mode in which the x labels are shown:
 *                           - if 'when-changed' the x label is shown only when the value changes
 * - xLabelWidth         : (optional) specified is the label width has to be set or should be unlimited
 *                         default: limited to the bar width
 *                           - if 'unlimited' it won't be limited to the bar width
 * - barSpacing          : (optional) the spacing between bars. Default 2
 * - maxBarWidth         : (optional, default none) the maximum width of a bar
 * - yLines              : (optioanl) the y values for which to draw a horizontal line (to show the scale)
 *                         if passed, it's an [y1, y2, y3, ...]
 *                         each value will correspond to a horizontal line
 * - minY                : (optional) the minimum y value to consider as the "lowest" value, when defining the SCALE
 * - overlayLineData     : (optipnal) the data to draw a line chart on top of the bar chart
 *                         it's an [{x, y}, {x, y}, ...]
 *                         note that the x axis is the same as the one used for the barchart, so it follows the same scale
 * - overlayMinY         : (optional) the minimum y value to consider as the "lowest" value of the overlay line, when defining the SCALE
 */
export default class TotoBarChart extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Init the state!
    this.state = {
      data: null,
      yLines: [],
      overlayLineData: null
    }

    // Binding
    this.initGraph = this.initGraph.bind(this);
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

    if (this.props.data == null) return;

    // Space between the bars
    this.barSpacing = this.props.barSpacing == null ? 2 : this.props.barSpacing;

    // Labels vertical shift
    this.valueLabelVShift = 24;

    // maximum width of the graph (max width for the x scale)
    this.maxGraphWidth = this.state.width;

    // Set the barWidth
    this.barWidth = this.state.width / this.props.data.length - this.barSpacing * 2;

    // If the barWidth is higher than the maxBarWidth,
    // - set it to the maxBarWidth
    // - reduce the length of the x scale to the number of bars * max bar width so that the bars keep the required distance between each other
    if (this.props.maxBarWidth && this.barWidth > this.props.maxBarWidth) {
      // Set it to max
      this.barWidth = this.props.maxBarWidth;
      // Reduce length of scale
      this.maxGraphWidth = (this.barWidth + this.barSpacing * 2) * this.props.data.length + 2 * this.barSpacing;
    }

    // X Axis image and label size
    this.imageSize = 24;
    this.imageHPadding = 6;
    this.imageVPadding = 6;
    this.imageTopPadding = 6;
    this.xAxisLabelSize = 12;
    this.xlabelVPadding = 9;
    // Resize the image based on the size of the bar
    if (this.barWidth < (this.imageSize + 2 * this.imageHPadding)) {
      this.imageSize = this.barWidth - 2 * this.imageHPadding;
    }
    // if the x axis label is there and the x axis image is there, move the image above the text
    if (this.props.xAxisTransform) this.imageVPadding += this.xAxisLabelSize + this.xlabelVPadding + 3;

    // Define the min and max x values
    let xMin = d3.array.min(this.props.data, (d) => {return d.x});
    let xMax = d3.array.max(this.props.data, (d) => {return d.x});

    // Define the min and max y values
    let yMin = this.props.minY == null ? 0 : this.props.minY;
    let yMax = d3.array.max(this.props.data, (d) => {return d.y});

    // Update the scales
    this.x = d3.scale.scaleLinear().range([this.barSpacing * 2, this.maxGraphWidth - this.barWidth - this.barSpacing * 2]).domain([xMin, xMax]);
    this.y = d3.scale.scaleLinear().range([this.state.height, this.valueLabelVShift]).domain([yMin, yMax]);

    // Define the min and max value of the Y scale for the overalay line chart, if any
    let yOverlayMin = this.props.overlayMinY ? this.props.overlayMinY : 0;
    let yOverlayMax = this.props.overlayLineData ? d3.array.max(this.props.overlayLineData, (d) => {return d.y}) : 0;

    // Define the y scale for the overlay line, if any
    this.yOverlay = this.props.overlayLineData ? d3.scale.scaleLinear().range([0, this.state.height]).domain([yOverlayMin, yOverlayMax]) : null;

    // Update the state with the new data
    // this.setState({data: [], yLines: [], overlayLineData: []}, () => {
    //   this.setState({
    //     data: this.props.data,
    //     yLines: this.props.yLines,
    //     overlayLineData: this.props.overlayLineData
    //   })
    // });
  }

  /**
   * Returns a shape drawing the provided path
   */
  createShape(path, color, fillColor, strokeWidth) {

    if (strokeWidth == null) strokeWidth = 0;

    let key = 'TotoBarChartShape-' + Math.random();

    return (
      <Shape key={key} d={path} strokeWidth={strokeWidth} stroke={color} fill={fillColor} />
    )
  }

  /**
   * Create the labels with the values
   */
  createValueLabels(data) {

    if (this.props.valueLabelTransform == null) return;

    if (data == null) return;

    // The labels
    let labels = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let value = data[i].y;

      // Transform the value if necessary
      if (this.props.valueLabelTransform) value = this.props.valueLabelTransform(value);

      // Positioning of the text
      let x = this.x(data[i].x);
      let y = this.y(data[i].y);
      let key = 'Label-' + Math.random();

      // Definition of the value font size
      // In case the bars are really large, then add some size to the font
      let addedSize = 0;
      if (this.barWidth >= 60) addedSize += 3;

      let fontSize = 14;
      if (value.length > 8) fontSize = 7;
      else if (value.length > 6) fontSize = 8;
      else if (value.length > 4) fontSize = 9;
      else if (value.length > 3) fontSize = 10;

      let font = {
        fontSize: fontSize + addedSize
      }

      // If there is a xLabelImgLoader and the bar is smaller than the image, then shift the value up so that the image can be placed above the bar
      let valueLabelYPos = y - this.valueLabelVShift;
      if (this.props.xLabelImgLoader != null) {
        if (this.state.height - y < this.imageSize + 2 * this.imageVPadding) {
          valueLabelYPos -= this.imageSize + this.imageTopPadding;
        }
      }

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: x, top: valueLabelYPos, width: this.barWidth, alignItems: 'center'}}>
          <Text style={[styles.valueLabel, font]}>{value}</Text>
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

    // Value of the last x label
    let lastValue = null;

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let value = data[i].x;

      // Transform the value if necessary
      value = this.props.xAxisTransform(value);

      // If the label needs to be shown only when it changes value:
      if (this.props.xLabelMode == 'when-changed') {
        // if it equals the last value, continue
        if (value == lastValue) continue;

      }

      // Update the last label value
      lastValue = value;

      // Define the width of the label
      let labelWidth = this.props.xLabelWidth == 'unlimited' ? null : this.barWidth;

      // Define the x position
      // Equals to the start of the bar, unless the xLabelWidth is 'unlimited', in that case a padding is added
      let x = this.x(data[i].x);

      if (this.props.xLabelWidth == 'unlimited') x += 3;

      // Define the key
      let key = 'Label-X-' + Math.random();

      let labelYPos = this.state.height - this.xAxisLabelSize - this.xlabelVPadding;

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: x, top: labelYPos, width: labelWidth, alignItems: 'center'}}>
          <Text style={styles.xAxisLabel}>{value}</Text>
        </View>
      );

      labels.push(element);
    }

    return labels;
  }

  /**
   * Creates a rectangle
   */
  createRect(x0, y0, x1, y1) {
    let p = d3.path.path();
    p.moveTo(x0, y0);
    p.lineTo(x0, y1);
    p.lineTo(x1, y1);
    p.lineTo(x1, y0);
    p.closePath();

    return p;
  }

  /**
   * Creates the bars
   */
  createBars(data) {

    // Don't draw if there's no data
    if (data == null) return;

    // Bars definition
    let bars = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let datum = data[i];

      // Create the rectangle
      let p = this.createRect(this.x(datum.x), this.y(0), this.x(datum.x) + this.barWidth, this.y(datum.y));

      // Define the color of the bar
      // If the datum is indicated as temporary, then color it differently
      let color = (datum.temporary) ? TRC.TotoTheme.theme.COLOR_THEME_DARK + '80' : TRC.TotoTheme.theme.COLOR_THEME_DARK;

      // Push the Shape object
      bars.push(this.createShape(p.toString(), color, color));
    }

    // Return the bars
    return bars;

  }

  /**
   * Creates the horizontal y scale lines as requested in the property yLines
   */
  createYLines(ylines) {

    if (ylines == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let line = d3.shape.line()
          .x((d) => {return d.x})
          .y((d) => {return d.y});

      let path = line([{x: 0, y: this.state.height - this.y(ylines[i])}, {x: this.state.width, y: this.state.height - this.y(ylines[i])}]);

      shapes.push(this.createShape(path, TRC.TotoTheme.theme.COLOR_THEME_LIGHT + 50, null, 1));
    }

    return shapes;

  }

  /**
   * Creates the labels to put on the ylines, if any
   */
  createYLinesLabels(ylines) {

    if (ylines == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let key = 'Label-YLine-' + Math.random();

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: 6, top: this.state.height + 3 - this.y(ylines[i])}}>
          <Text style={styles.yAxisLabel}>{ylines[i]}</Text>
        </View>
      );

      shapes.push(element);
    }

    return shapes;

  }

  /**
   * Creates an overlay line chart on top of the bar chart
   */
  createOverlayLineChart(data) {

    if (data == null) return;

    let line = d3.shape.line()
                  .x((d) => {return this.x(d.x)})
                  .y((d) => {return this.state.height - this.yOverlay(d.y)})

    let path = line(data);

    let shape = this.createShape(path, TRC.TotoTheme.theme.COLOR_THEME_LIGHT, null, 2);

    return shape;

  }

  /**
   * Creates the images for the x axis, if any (xLabelImgLoader != null)
   */
  createXAxisImages(data) {

    if (!this.props.xLabelImgLoader) return;
    if (data == null) return;

    let images = [];

    for (var i = 0; i < data.length; i++) {

      let image = this.props.xLabelImgLoader(data[i]);
      let key = 'TotoBarChartXAxisImg' + Math.random();
      let x = this.x(data[i].x);
      let y = this.y(data[i].y);

      // The image should be "IN" the bar if the bar is heigher than the image size
      let imageYPos = this.state.height - this.imageVPadding - this.imageSize;
      let imageColor = TRC.TotoTheme.theme.COLOR_THEME;
      if (this.state.height - y < this.imageSize + 2 * this.imageVPadding) {
        imageYPos = y - this.imageSize - this.imageTopPadding;
        imageColor = TRC.TotoTheme.theme.COLOR_THEME_DARK;
      }

      let element = (
        <View key={key} style={{position: 'absolute', left: x, top: imageYPos, width: this.barWidth, alignItems: 'center'}}>
          <Image source={image} style={{width: this.imageSize, height: this.imageSize, tintColor: imageColor}} />
        </View>
      );

      images.push(element);
    }

    return images;

  }

  /**
   * Renders the component
   */
  render() {

    this.initGraph();

    let bars = this.createBars(this.props.data);
    let labels = this.createValueLabels(this.props.data);
    let xAxisImages = this.createXAxisImages(this.props.data);
    let xLabels = this.createXAxisLabels(this.props.data);
    let ylines// = this.createYLines(this.state.yLines);
    let ylinesLabels// = this.createYLinesLabels(this.state.yLines);
    let overlayLineChart// = this.createOverlayLineChart(this.state.overlayLineData)

    return (
      <View style={styles.container} onLayout={(event) => {this.setState({height: event.nativeEvent.layout.height, width: event.nativeEvent.layout.width})}}>
        <Surface height={this.state.height} width={this.state.width}>
          {bars}
          {ylines}
          {overlayLineChart}
        </Surface>
        {labels}
        {xLabels}
        {ylinesLabels}
        {xAxisImages}
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
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  xAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 12,
  },
  yAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 10,
  },
});
