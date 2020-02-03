import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

import DateSelector from 'TotoReactExpenses/js/comp/DateSelector';
import CurrencySelector from 'TotoReactExpenses/js/comp/CurrencySelector';
import AmountSelector from 'TotoReactExpenses/js/comp/AmountSelector';
import CategorySelector from 'TotoReactExpenses/js/comp/CategorySelector';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import YesNoToggle from 'TotoReactExpenses/js/comp/YesNoToggle';

export default class ExpenseDetailScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Details'
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
      expense: this.props.navigation.getParam('expense')
    }

    // Bindings
    this.setDate = this.setDate.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.saveExpense = this.saveExpense.bind(this);
    this.setMonthlyPayment = this.setMonthlyPayment.bind(this);

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

    new ExpensesAPI().putExpense(this.state.expense.id, this.state.expense).then((data) => {

      // Publish an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.expenseUpdated, context: {expense: this.state.expense}});

      // Return back
      this.props.navigation.goBack();

    })

  }

  /**
   * Deletes the expense
   */
  deleteExpense() {

    new ExpensesAPI().deleteExpense(this.state.expense.id).then((data) => {

      // event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.expenseDeleted, context: {expense: this.state.expense}});

      // Go Back
      this.props.navigation.goBack();

    })

  }

  /**
   * Sets the date of the expense
   * The date passed is a Date javascript object
   */
  setDate(date) {

    this.setState({expense: {...this.state.expense, date: moment(date).format('YYYYMMDD')}});

  }

  /**
   * Sets the currency
   */
  setCurrency(c) {

    this.setState({expense: {...this.state.expense, currency: c}});
  }

  /**
   * Sets the amount
   */
  setAmount(a) {

    this.setState({expense: {...this.state.expense, amount: a}});
  }

  /**
   * Sets the category
   */
  setCategory(c) {

    this.setState({expense: {...this.state.expense, category: c}});
  }

  /**
   * Sets the monthly payment attribute
   * @param {string} yesOrNo 
   */
  setMonthlyPayment(yesOrNo) {

    this.setState({
      expense: {...this.state.expense, monthly: yesOrNo == 'yes' ? true : false}
    })

  }


  /**
   * Renders the home screen
   */
  render() {

    let categoryImageSource, categoryImageColor;
    if (this.state.expense.category == null) {
      categoryImageSource = categoriesMap.get('VARIE');
      categoryImageColor = {tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
    }

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <View style={styles.line1}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Date</Text>
              <DateSelector date={this.state.expense.date} showYear={false} onDateChange={this.setDate} />
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.label}>Amount</Text>
              <AmountSelector amount={this.state.expense.amount} onAmountChange={this.setAmount} />
            </View>
            <View style={styles.currencyContainer}>
              <Text style={styles.label}>Currency</Text>
              <CurrencySelector currency={this.state.expense.currency} onCurrencyChange={this.setCurrency} />
            </View>
          </View>

          <View style={styles.line2}>
            <TextInput
              style={styles.descriptionInput}
              value={this.state.expense.description}
              onChangeText={(text) => {this.setState({expense: {...this.state.expense, description: text}})}}
              placeholder='Expense description here...'
              placeholderTextColor={TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
              keyboardType='default'
              />
          </View>

          <View style={styles.line3}>
            <Text style={[styles.label, {marginBottom: 12}]}>Category</Text>
            <CategorySelector category={this.state.expense.category} onCategoryChange={this.setCategory} />
          </View>

          <View style={styles.line4}>
            <YesNoToggle label="Monthly payment" onSelectionChange={this.setMonthlyPayment}/>
          </View>

          <View style={{flex: 1}}>
          </View>

          <View style={styles.line5}>
            <TRC.TotoIconButton image={require('TotoReactExpenses/img/tick.png')} onPress={this.saveExpense} />
            <TRC.TotoIconButton image={require('TotoReactExpenses/img/trash.png')} onPress={this.deleteExpense} />
          </View>

        </View>
      </TouchableWithoutFeedback>
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
    fontSize: 12,
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
    marginVertical: 12,
  },
  line4: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 24
  },
  line5: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  }
});
