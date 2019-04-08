import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import Swiper from 'react-native-swiper';

import LastDaysSpendingGraph from 'TotoReactExpenses/js/graph/LastDaysSpendingGraph';
import MonthSpendingBubble from 'TotoReactExpenses/js/comp/MonthSpendingBubble';
import MonthSpendingCategoriesGraph from 'TotoReactExpenses/js/graph/MonthSpendingCategoriesGraph';
import ExpensesPerMonthGraph from 'TotoReactExpenses/js/graph/ExpensesPerMonthGraph';
import TopSpendingCategoriesPerMonth from 'TotoReactExpenses/js/graph/TopSpendingCategoriesPerMonth';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Expenses'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        rightButton={{
                          image: require('TotoReactExpenses/img/settings.png'),
                          navData: {screen: 'SettingsScreen'}
                        }}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      todaySessions: null
    }

    // Bindings
    // this.onSessionDeleted = this.onSessionDeleted.bind(this);

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
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <View style={styles.area1}>
          <View style={{flex: 1}}><LastDaysSpendingGraph /></View>
          <View style={{flex: 0.5, alignItems: 'center'}}><MonthSpendingBubble /></View>
        </View>

        <View style={styles.area2}>
          <View style={styles.buttonContainer}><TRC.TotoIconButton image={require('TotoReactExpenses/img/stats.png')} /></View>
          <View style={styles.buttonContainer}><TRC.TotoIconButton image={require('TotoReactExpenses/img/add.png')} size='xl' label='New expense' onPress={() => {this.props.navigation.navigate('NewExpenseScreen')}}/></View>
          <View style={styles.buttonContainer}><TRC.TotoIconButton image={require('TotoReactExpenses/img/list.png')} onPress={() => {this.props.navigation.navigate('ExpensesListScreen')}}/></View>
        </View>

        <View style={styles.area3}>
          <Swiper style={{}} showsPagination={false}>
            <MonthSpendingCategoriesGraph />
            <ExpensesPerMonthGraph />
            <TopSpendingCategoriesPerMonth />
          </Swiper>
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
  area1: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 24,
  },
  area2: {
    flexDirection: 'row',
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginHorizontal: 6,
  },
  area3: {
    marginTop: 24,
    flex: 1,
  },
});
