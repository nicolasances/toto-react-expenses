import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

import DateSelector from 'TotoReactExpenses/js/comp/DateSelector';
import CurrencySelector from 'TotoReactExpenses/js/comp/CurrencySelector';
import AmountSelector from 'TotoReactExpenses/js/comp/AmountSelector';
import CategorySelector from 'TotoReactExpenses/js/comp/CategorySelector';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import user from 'TotoReactExpenses/js/User';

export default class NewExpenseScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='New expense'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      currency: 'DKK',
      date: moment().format('YYYYMMDD'),
      category: 'VARIE',
    }

    // Bindings
    this.setDate = this.setDate.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.saveExpense = this.saveExpense.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);

  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
  }

  /**
   * Save th expense
   */
  saveExpense() {

    let expense = {
      amount: this.state.amount,
      date: this.state.date,
      category: this.state.category,
      description: this.state.description,
      yearMonth: this.state.date.substring(0, 6),
      consolidated: false,
      currency: this.state.currency,
      user: user.userInfo.email
    }

    new ExpensesAPI().postExpense(expense).then((data) => {

      expense.id = data.id;

      // Publish an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.expenseCreated, context: {expense: expense}});

      // Return back
      this.props.navigation.goBack();

    })

  }

  /**
   * Sets the date of the expense
   * The date passed is a Date javascript object
   */
  setDate(date) {

    this.setState({date: moment(date).format('YYYYMMDD')});

  }

  /**
   * Sets the currency
   */
  setCurrency(c) {

    this.setState({currency: c});
  }

  /**
   * Sets the amount
   */
  setAmount(a) {

    this.setState({amount: a});
  }

  /**
   * Sets the category
   */
  setCategory(c) {

    this.setState({category: c});
  }


  /**
   * Renders the home screen
   */
  render() {

    let categoryImageSource, categoryImageColor;
    if (this.state.category == null) {
      categoryImageSource = categoriesMap.get('VARIE');
      categoryImageColor = {tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
    }

    return (
      <View style={styles.container}>

        <View style={styles.line1}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date</Text>
            <DateSelector date={this.state.date} showYear={false} onDateChange={this.setDate} />
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Amount</Text>
            <AmountSelector amount={this.state.amount} onAmountChange={this.setAmount} />
          </View>
          <View style={styles.currencyContainer}>
            <Text style={styles.label}>Currency</Text>
            <CurrencySelector currency={this.state.currency} onCurrencyChange={this.setCurrency} />
          </View>
        </View>

        <View style={styles.line2}>
          <TextInput
            style={styles.descriptionInput}
            onChangeText={(text) => {this.setState({description: text})}}
            placeholder='Expense description here...'
            placeholderTextColor={TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
            keyboardType='default'
            />
        </View>

        <View style={styles.line3}>
          <Text style={[styles.label, {marginBottom: 12}]}>Category</Text>
          <CategorySelector category={this.state.category} onCategoryChange={this.setCategory} />
        </View>

        <View style={{flex: 1}}>
        </View>

        <View style={styles.line4}>
          <TRC.TotoIconButton
            image={require('TotoReactExpenses/img/tick.png')}
            onPress={this.saveExpense}
            />
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingTop: 24,
  },
  label: {
    fontSize: 15,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8,
    marginBottom: 6,
  },
  line1: {
    marginVertical: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  amountContainer: {
    flex: 1,
    alignItems: 'center',
  },
  currencyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  line2: {
    paddingHorizontal: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  descriptionInput: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  line3: {
    alignItems: 'center',
    marginVertical: 24,
  },
  line4: {
    marginBottom: 24,
  }
});
