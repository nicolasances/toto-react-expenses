import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';
import * as array from 'd3-array';

const d3 = {array};

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoLineChart from 'TotoReactExpenses/js/TotoLineChart';

export default class ExpensesPerMonthGraph extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

    // Load past days expenses
    this.loadExpenses();

    // Binding
    this.prepareData = this.prepareData.bind(this);
    this.loadExpenses = this.loadExpenses.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);
  }

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadExpenses() {

    // Define how many days in the past
    let maxMonths = 40;
    let yearMonthFrom = moment().startOf('month').subtract(maxMonths - 1, 'months').format('YYYYMM');

    new ExpensesAPI().getExpensesPerMonth(yearMonthFrom).then((data) => {

      if (data == null || data.months == null) return;

      this.setState({months: null}, () => {
        this.setState({months: data.months}, this.prepareData);
      })

    });

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.months) return;

    for (var i = 0; i < this.state.months.length; i++) {

      let month = this.state.months[i];

      preparedData.push({
        x: i,
        y: month.amount
      })
    }

    this.setState({preparedData: null, yLines: null}, () => {
      this.setState({preparedData: preparedData, yLines: this.buildRelevantYLines()});
    })

  }

  /**
   * Builds the relevant yLines
   */
  buildRelevantYLines() {

    if (this.state.months == null || this.state.months.length == 0) return;

    let minAmount = d3.array.min(this.state.months, (d) => {return d.amount});
    let maxAmount = d3.array.max(this.state.months, (d) => {return d.amount});

    let yLines = [];

    let numOfLines = 5;
    let increment = ((maxAmount - minAmount) / numOfLines);

    for (var i = 1; i <= numOfLines; i++) {
      yLines.push(Math.floor((minAmount + i * increment) / 100) * 100);
    }

    return yLines;

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {
    return value.toFixed(0);
  }

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  xAxisTransform(value) {

    if (this.state.months == null) return;

    let month = this.state.months[value];
    let parsedMonth = moment(month.yearMonth + '01', 'YYYYMMDD');

    // Add only one month out of three
    let label;
    if (this.lastMonthLabeled == null && value > 0) label = parsedMonth.format('MMM YY');
    else if (parsedMonth.diff(this.lastMonthLabeled, 'M') > 2) label = parsedMonth.format('MMM YY');

    if (label) this.lastMonthLabeled = parsedMonth;

    return label;

  }

  /**
   * Render the comp
   */
  render() {
    return (
      <View style={styles.container}>
        <TotoLineChart
          data={this.state.preparedData}
          showValuePoints={true}
          valuePointsSize={3}
          curveCardinal={true}
          leaveMargins={false}
          yLines={this.state.yLines}
          xAxisTransform={this.xAxisTransform}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
