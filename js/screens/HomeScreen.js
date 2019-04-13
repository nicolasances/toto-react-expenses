import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import Swiper from 'react-native-swiper';

import user from 'TotoReactExpenses/js/User';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
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
                        title='Payments'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      showDemo: true,
      user: user.userInfo,
    }

    // Bindings
    this.onDemoFinished = this.onDemoFinished.bind(this);
    this.loadAppSettings = this.loadAppSettings.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    this.loadAppSettings();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.demoFinished, this.onDemoFinished);

  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.demoFinished, this.onDemoFinished);
  }

  /**
   * When the demo is done
   */
  onDemoFinished() {
    this.setState({showDemo: false});
  }

  /**
   * Loads the app settings
   */
  loadAppSettings() {

    new ExpensesAPI().getAppSettings(this.state.user.email).then((data) => {

      this.setState({
        showDemo: data.showDemo,
      })

      if (data.showDemo) this.props.navigation.navigate('IntroScreen');

    })

  }


  /**
   * Renders the home screen
   */
  render() {

    if (this.state.showDemo) return (
      <View style={styles.container}>
      </View>
    );

    return (
      <View style={styles.container}>

        <View style={styles.area1}>
          <View style={{flex: 1}}><LastDaysSpendingGraph /></View>
          <View style={{flex: 0.5, alignItems: 'center'}}><MonthSpendingBubble /></View>
        </View>

        <View style={styles.area2}>
          <View style={styles.buttonContainer}><TRC.TotoIconButton image={require('TotoReactExpenses/img/settings.png')} onPress={() => {this.props.navigation.navigate('SettingsScreen')}} /></View>
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
