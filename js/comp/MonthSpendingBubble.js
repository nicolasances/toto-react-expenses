import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';

class MonthSpendingBubble extends Component {

  constructor(props) {
    super(props);

    this.state = {
      yearMonth: moment().format('YYYYMM'),
      month: moment().format('MMM'),
      spending: 0,
      animatedSpending: new Animated.Value(0)
    }

    // Animation control
    this.state.animatedSpending.addListener((progress) => {
      this.setState({spending: progress.value});
    });

    // Load current year month total
    this.loadSpending();

    // Bindings
    this.animate = this.animate.bind(this);
  }

  /**
   * Loads the current month spending
   */
  loadSpending() {

    new ExpensesAPI().getMonthTotalSpending(this.state.yearMonth).then((data) => {

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
    return (
      <View style={styles.container}>
        <View style={styles.currencyContainer}><Text style={styles.currency}>€</Text></View>
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
