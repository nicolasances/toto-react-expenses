import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';
import * as array from 'd3-array';

const d3 = {array};

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoLineChart from 'TotoReactExpenses/js/TotoLineChart';
import TotoStaticMessage from 'TotoReactExpenses/js/comp/TotoStaticMessage';
import user from 'TotoReactExpenses/js/User';

export default class ExpensesPerMonthGraph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.loadExpenses = this.loadExpenses.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.settingsUpdated, this.load);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.settingsUpdated, this.load);
  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(user.userInfo.email).then((data) => {
      // Set state
      this.setState({settings: data}, this.loadExpenses);
    })

  }


  // React to events
  onExpenseCreated(event) {this.loadExpenses();}

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadExpenses() {

    // Define how many days in the past
    let maxMonths = 40;
    let yearMonthFrom = moment().startOf('month').subtract(maxMonths - 1, 'months').format('YYYYMM');
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getExpensesPerMonth(user.userInfo.email, yearMonthFrom, targetCurrency).then((data) => {

      if (data == null || data.months == null) {this.setState({loaded: true}); return;}

      this.setState({months: null}, () => {
        this.setState({loaded: true, months: data.months}, this.prepareData);
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
    if (this.state.months[value] == null) return;

    let month = this.state.months[value];
    let parsedMonth = moment(month.yearMonth + '01', 'YYYYMMDD');

    // Add only one month out of three
    let label;
    if (this.lastMonthLabeled != null && value == 0) this.lastMonthLabeled = null;
    if (this.lastMonthLabeled == null && value > 0) label = parsedMonth.format('MMM YY');
    else if (parsedMonth.diff(this.lastMonthLabeled, 'M') > 2) label = parsedMonth.format('MMM YY');

    if (label) this.lastMonthLabeled = parsedMonth;

    return label;

  }

  /**
   * Render the comp
   */
  render() {

    let message = this.state.loaded && (this.state.months == null || this.state.months.length == 0) ? (
      <TotoStaticMessage
        image={require('TotoReactExpenses/img/statistics.png')}
        text="Here you'll see the amounts that you spent each month!"
        detail="Just start adding some expenses and witness Toto's magic!"
        />
    ) : null;

    return (
      <View style={styles.container}>
        {message}
        <TotoLineChart
          data={this.state.preparedData}
          showValuePoints={true}
          valuePointsSize={3}
          curveCardinal={true}
          leaveMargins={false}
          yLines={this.state.yLines}
          xAxisTransform={this.xAxisTransform}
          moreSpaceForXLabels={true}
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
