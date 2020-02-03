import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import user from 'TotoReactExpenses/js/User';

class MonthSpendingBubble extends Component {

  constructor(props) {
    super(props);

    this.state = {
      yearMonth: moment().format('YYYYMM'),
      month: moment().format('MMM'),
      spending: 0,
      animatedSpending: new Animated.Value(0),
    }

    // Animation control
    this.state.animatedSpending.addListener((progress) => {
      this.setState({spending: progress.value});
    });

    // Bindings
    this.load = this.load.bind(this);
    this.animate = this.animate.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
    this.onExpenseDeleted = this.onExpenseDeleted.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {

    this.load();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.settingsUpdated, this.load);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.settingsUpdated, this.load);
  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(user.userInfo.email).then((data) => {
      this.setState({settings: data}, this.loadSpending);
    })

  }

  // React to events
  onExpenseCreated(event) {this.loadSpending();}
  onExpenseDeleted(event) {this.loadSpending();}

  /**
   * Loads the current month spending
   */
  loadSpending() {

    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getMonthTotalSpending(user.userInfo.email, this.state.yearMonth, targetCurrency).then((data) => {

      // Animate
      if (data != null && data.total != null) this.animate(data.total);

    });
  }

  /**
   * Animate the number roll
   */
  animate(toVal) {

    Animated.timing(this.state.animatedSpending, {
      toValue: toVal,
      easing: Easing.linear,
      duration: 1000,
    }).start();

  }

  render() {

    // Define the currency
    let currency = '€';
    if (this.state.settings && this.state.settings.currency) {
      if (this.state.settings.currency == 'DKK') currency = 'kr.';
    }

    return (
      <View style={styles.container}>
        <View style={styles.currencyContainer}><Text style={styles.currency}>{currency}</Text></View>
        <View style={styles.amountContainer}><Text style={styles.amount}>{this.state.spending.toFixed(0)}</Text></View>
        <View style={styles.monthContainer}><Text style={styles.month}>{this.state.month}</Text></View>
      </View>
    )
  }
}

export default Animated.createAnimatedComponent(MonthSpendingBubble);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyContainer: {
  },
  currency: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  amountContainer: {
  },
  amount: {
    fontSize: 22,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  monthContainer: {
  },
  month: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textTransform: 'uppercase',
    marginBottom: 2
  }
})
