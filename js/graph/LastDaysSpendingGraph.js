import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

import * as config from 'TotoReactExpenses/js/Config';
import TotoLineChart from 'TotoReactExpenses/js/TotoLineChart';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import user from 'TotoReactExpenses/js/User';

export default class LastDaysSpendingGraph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      days: [],
      preparedData: []
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareChartData = this.prepareChartData.bind(this);
    this.valueLabel = this.valueLabel.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Load the data
    this.load();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.settingsUpdated, this.load);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.settingsUpdated, this.load);
  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(user.userInfo.email).then((data) => {
      // Set the state
      this.setState({settings: data}, this.loadPastDaysSpending);
    })

  }

  // React to events
  onExpenseCreated(event) {this.loadPastDaysSpending();}

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadPastDaysSpending() {

    // Define how many days in the past
    let daysInPast = 8;
    let dateFrom = moment().subtract(daysInPast, 'days').format('YYYYMMDD');
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getExpensesPerDay(user.userInfo.email, dateFrom, null, targetCurrency).then((data) => {

      if (data == null || data.days == null) return;

      let days = this.fillInMissingDays(data.days, dateFrom, daysInPast);

      this.setState({days: null}, () => {
        this.setState({days: days}, () => {this.prepareChartData()});
      })

    });

  }

  /**
   * Fills in the missing days
   */
  fillInMissingDays(days, dateFrom, numOfDays) {

    let day = moment(dateFrom, 'YYYYMMDD');

    // Function to check if the day is present in the array
    let dayIsPresent = (d) => {
      for (var i = 0; i < days.length; i++) {
        if (days[i].date == d) return true;
      }
      return false;
    }

    // Fill the missing days
    for (var i = 0; i < numOfDays; i++) {

      if (!dayIsPresent(day.format('YYYYMMDD'))) {

        days.splice(i, 0, {
          date: day.format('YYYYMMDD'),
          amount: 0
        });
      }

      day = day.add(1, 'days');
    }

    return days;

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {

    if (value == null) return '';

    return value.toFixed(0);

  }

  /**
   * Prepares the data for the chart
   */
  prepareChartData() {

    let preparedData = [];

    for (var i = 0 ; i < this.state.days.length; i++) {

      let day = this.state.days[i];

      preparedData.push({
        x: i,
        y: day.amount,
      })
    }

    this.setState({preparedData: []}, () => {this.setState({preparedData: preparedData})});

  }

  /**
   * Get the x axis label
   */
  xAxisTransform(value) {

    if (this.state.days == null) return;
    if (this.state.days.length <= value) return;

    return moment(this.state.days[value].date, 'YYYYMMDD').format('dd');

  }

  /**
   * Render the comp
   */
  render() {
    return (
      <View style={styles.container}>
        <TotoLineChart
          data={this.state.preparedData}
          valueLabelTransform={this.valueLabel}
          valueLabelColor={TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
          curveCardinal={false}
          showValuePoints={true}
          leaveMargins={false}
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
