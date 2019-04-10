import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

import CurrencySelector from 'TotoReactExpenses/js/comp/CurrencySelector';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';
import user from 'TotoReactExpenses/js/User';

export default class SettingsScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Settings'
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
      currency: 'EUR',
      user: user.userInfo,
    }

    // Load settings
    this.loadSettings();

    // Bindings
    this.saveSettings = this.saveSettings.bind(this);
    this.setCurrency = this.setCurrency.bind(this);

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
   * Loads the settings
   */
  loadSettings() {

    new ExpensesAPI().getSettings(this.state.user.email).then((data) => {

      this.setState({
        currency: data.currency ? data.currency : 'EUR'
      })
    })

  }

  /**
   * Save the settings
   */
  saveSettings() {

    let payload = {
      user: this.state.user.email,
      currency: this.state.currency
    }

    new ExpensesAPI().putSettings(payload).then((data) => {

      // Publish an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.settingsUpdated});

      // Return back
      this.props.navigation.goBack();

    })

  }

  /**
   * updates the currency
   */
  setCurrency(currency) {
    this.setState({currency: currency});
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <View style={styles.line2}>
          <View style={styles.currencyContainer}>
            <Text style={styles.label}>Currency</Text>
            <CurrencySelector currency={this.state.currency} onCurrencyChange={this.setCurrency} />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton
            image={require('TotoReactExpenses/img/tick.png')}
            onPress={this.saveSettings}
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
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8,
    marginBottom: 6,
  },
  line2: {
    marginVertical: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  currencyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonsContainer: {
    marginBottom: 24,
  }
});