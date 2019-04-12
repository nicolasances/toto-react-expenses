import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

import categoriesMap from 'TotoReactExpenses/js/util/CategoriesMap';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoFlatList from 'TotoReactExpenses/js/TotoFlatList';
import MonthNavigator from 'TotoReactExpenses/js/comp/MonthNavigator';
import TotoStaticMessage from 'TotoReactExpenses/js/comp/TotoStaticMessage';
import user from 'TotoReactExpenses/js/User';

const windowHeight = Dimensions.get('window').height;

const consolidateImg = require('TotoReactExpenses/img/consolidate.png');

export default class ExpensesListScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Your payments'
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
      yearMonth: moment().format('YYYYMM'),
    }

    // Bindings
    this.loadExpenses = this.loadExpenses.bind(this);
    this.dataExtractor = this.dataExtractor.bind(this);
    this.onItemPress = this.onItemPress.bind(this);
    this.onExpenseUpdated = this.onExpenseUpdated.bind(this);
    this.onExpenseDeleted = this.onExpenseDeleted.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Loading expenses
    this.loadExpenses();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseUpdated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseDeleted);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseUpdated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseDeleted);
  }

  /**
   * Updates the expense
   */
  onExpenseUpdated(event) {

    TRC.TotoEventBus.bus.publishEvent({name: 'totoListDataChanged', context: {item: event.context.expense}});

  }

  /**
   * On deletion of an epense
   */
  onExpenseDeleted(event) {

    this.loadExpenses();

  }

  /**
   * Loads expenses of the month
   */
  loadExpenses() {

    new ExpensesAPI().getExpenses(user.userInfo.email, this.state.yearMonth).then((data) => {

      this.setState({expenses: null}, () => {this.setState({expenses: data.expenses})});

    });
  }

  /**
   * Consolidate the expense
   * The item is from the toto flat list
   */
  consolidateExpense(item) {

    new ExpensesAPI().consolidateExpense(item.item.id).then((data) => {

      if (data == null || data.code == '400') return;

      item.item.consolidated = true;

      TRC.TotoEventBus.bus.publishEvent({name: 'totoListDataChanged', context: {item: item.item}});

    });

  }

  /**
   * Extracts the data for the list
   */
  dataExtractor(item) {

    let ex = item.item;

    // Get the image
    let image = categoriesMap.get(ex.category).image;

    // Define the amount string
    let amount = '';
    if (ex.currency == 'EUR') amount += '€';
    else if (ex.currency == 'DKK') amount += 'kr.';
    else amount += ex.currency;
    amount += ' ' + ex.amount;

    return {
      title: ex.description,
      avatar: {
        type: 'image',
        value: image
      },
      leftSideValue: {
        type: 'date',
        value: ex.date
      },
      rightSideValue: amount,
      sign: ex.consolidated ? null : consolidateImg,
      signSize: 'xl',
      onSignClick: ex.consolidated ? null : this.consolidateExpense
    }

  }

  /**
   * Reacts to the pressing of a list item
   */
  onItemPress(item) {

    this.props.navigation.navigate('ExpenseDetailScreen', {expense: item.item});

  }

  /**
   * When a month gets changed
   */
  onMonthChange(yearMonth) {

    this.setState({yearMonth: yearMonth}, this.loadExpenses);

  }

  /**
   * Renders the home screen
   */
  render() {

    let currentMonthString = moment(this.state.yearMonth + '01', 'YYYYMMDD').format('MMMM');
    let messageText = 'No payments in ' + currentMonthString;

    let message = this.state.expenses == null || this.state.expenses.length == 0 ? (
      <TotoStaticMessage
        image={require('TotoReactExpenses/img/consolidate.png')}
        text={messageText}
        detail="Go back to the previous screen and start adding some payments!"
        />
    ) : null;

    return (
      <View style={styles.container}>

        <View style={{flex: 1}}>
          <MonthNavigator startingMonth={this.state.yearMonth} onMonthChange={this.onMonthChange} />
        </View>

        <View style={{height: windowHeight - 170}}>
          {message}
          <TotoFlatList
          data={this.state.expenses}
          dataExtractor={this.dataExtractor}
          onItemPress={this.onItemPress}
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
});
