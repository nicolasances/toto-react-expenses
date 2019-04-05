import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

import categoriesMap from 'TotoReactExpenses/js/util/CategoriesMap';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import TotoFlatList from 'TotoReactExpenses/js/TotoFlatList';

export default class ExpensesListScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Expenses list'
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

    // Loading expenses
    this.loadExpenses();

    // Bindings
    this.loadExpenses = this.loadExpenses.bind(this);

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
   * Loads expenses of the month
   */
  loadExpenses() {

    new ExpensesAPI().getExpenses(this.state.yearMonth).then((data) => {

      this.setState({expenses: null}, () => {this.setState({expenses: data.expenses})});

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
        value: moment(ex.date).format('YYYYMMDD')
      },
      rightSideValue: amount
    }

  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <TotoFlatList
          data={this.state.expenses}
          dataExtractor={this.dataExtractor}
          />

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
