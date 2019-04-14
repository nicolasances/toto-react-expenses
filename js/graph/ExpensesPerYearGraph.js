import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';
import * as array from 'd3-array';

const d3 = {array};

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoBarChart from 'TotoReactExpenses/js/TotoBarChart';
import TotoStaticMessage from 'TotoReactExpenses/js/comp/TotoStaticMessage';
import user from 'TotoReactExpenses/js/User';

export default class ExpensesPerYearGraph extends Component {

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
    this.valueLabel = this.valueLabel.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseCreated, this.loadExpenses);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseDeleted, this.loadExpenses);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseUpdated, this.loadExpenses);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.settingsUpdated, this.load);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.loadExpenses);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseDeleted, this.loadExpenses);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.loadExpenses);
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

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadExpenses() {

    // Define target currency
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getExpensesPerYear(user.userInfo.email, targetCurrency).then((data) => {

      if (data == null || data.years == null) {this.setState({loaded: true}); return;}

      this.setState({years: null}, () => {
        this.setState({loaded: true, years: data.years}, this.prepareData);
      })

    });

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.years) return;

    for (var i = 0; i < this.state.years.length; i++) {

      let year = this.state.years[i];

      preparedData.push({
        x: i,
        y: year.amount
      })
    }

    this.setState({preparedData: null}, () => {
      this.setState({preparedData: preparedData});
    })

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {

    let currency = '';
    if (this.state.settings != null) {
      if (this.state.settings.currency == 'EUR') currency = '€';
      else if (this.state.settings.currency == 'DKK') currency = 'kr.'
      else currency = this.state.settings.currency;
    }

    return Math.round(value,0).toLocaleString('it') + ' ' + currency;
  }

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  xAxisTransform(value) {

    if (this.state.years == null) return;
    if (this.state.years[value] == null) return;

    let year = this.state.years[value].year;

    return year;

  }

  /**
   * Render the comp
   */
  render() {

    let message = this.state.loaded && (this.state.years == null || this.state.years.length == 0) ? (
      <TotoStaticMessage
        image={require('TotoReactExpenses/img/statistics.png')}
        text="Here you'll see the amounts that you spent each year!"
        detail="Just start adding some expenses and witness Toto's magic!"
        />
    ) : null;

    return (
      <View style={styles.container}>
        {message}
        <TotoBarChart
          data={this.state.preparedData}
          valueLabelTransform={this.valueLabel}
          xAxisTransform={this.xAxisTransform}
          maxBarWidth={70}
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
