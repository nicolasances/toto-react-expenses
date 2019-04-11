import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoBarChart from 'TotoReactExpenses/js/TotoBarChart';
import categoriesMap from 'TotoReactExpenses/js/util/CategoriesMap';
import user from 'TotoReactExpenses/js/User';

export default class MonthSpendingCategoriesGraph extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.loadSpendingCategories = this.loadSpendingCategories.bind(this);
    this.valueLabel = this.valueLabel.bind(this);
    this.categoryImgLoader = this.categoryImgLoader.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {

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
      this.setState({settings: data}, this.loadSpendingCategories);
    })

  }

  // React to events
  onExpenseCreated(event) {this.loadSpendingCategories();}

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadSpendingCategories() {

    // Define how many days in the past
    let maxCategories = 12;
    let yearMonth = moment().format('YYYYMM');
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getTopSpendingCategoriesOfMonth(user.userInfo.email, yearMonth, maxCategories, targetCurrency).then((data) => {

      if (data == null || data.categories == null) return;

      this.setState({categories: null}, () => {
        this.setState({categories: data.categories}, this.prepareData);
      })

    });

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.categories) return;

    for (var i = 0; i < this.state.categories.length; i++) {

      let cat = this.state.categories[i];

      preparedData.push({
        x: i,
        y: cat.amount
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
    return value.toFixed(0);
  }

  /**
   * Returns the image for the specified category
   */
  categoryImgLoader(datum) {

    if (this.state.categories == null) return;

    let image = categoriesMap.get(this.state.categories[datum.x].category).image;

    return image;

  }

  /**
   * Render the comp
   */
  render() {
    return (
      <View style={styles.container}>
        <TotoBarChart
          data={this.state.preparedData}
          valueLabelTransform={this.valueLabel}
          maxBarWidth={40}
          xLabelImgLoader={this.categoryImgLoader}
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
