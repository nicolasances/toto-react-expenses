import React, {Component} from 'react';
import {Platform, View, StyleSheet, AppState, StatusBar} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import TRC from 'toto-react-components';
import user from './js/User';

// Navigation import
import HomeScreen from './js/screens/HomeScreen';
import NewExpenseScreen from './js/screens/NewExpenseScreen';
import ExpensesListScreen from './js/screens/ExpensesListScreen';
import ExpenseDetailScreen from './js/screens/ExpenseDetailScreen';
import SettingsScreen from './js/screens/SettingsScreen';
import IntroScreen from './js/screens/IntroScreen';

// Client Id
const clientId = Platform.OS == 'android' ? '209706877536-2hkg1qkvpsokqls7p78lbjahvqfknhh4.apps.googleusercontent.com' : '209706877536-ib0fd6co73jetqqjstq5tv9facsulf52.apps.googleusercontent.com';

/**
 * Navigation Stack
 */
const AppNavigator = createStackNavigator({

  HomeScreen: {screen: HomeScreen},
  NewExpenseScreen: {screen: NewExpenseScreen},
  ExpensesListScreen: {screen: ExpensesListScreen},
  ExpenseDetailScreen: {screen: ExpenseDetailScreen},
  SettingsScreen: {screen: SettingsScreen},
  IntroScreen: {screen: IntroScreen},

}, {
  initialRouteName: 'HomeScreen',
  defaultNavigationOptions: {
    headerStyle: {
      elevation: 0,
      backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

/**
 * App
 */
export default class App extends Component {

  constructor(props) {
    super(props);

    // Instantiate the sign in utility
    this.totoSignIn = new TRC.TotoSignIn(clientId);

    // this.totoSignIn.signOut();

    // Init so that the signed in check is set as 'in progress'
    this.state = {
      isSignedIn: null,
      isLoaded: false
    }

    // Bind functions
    this.onLogin = this.onLogin.bind(this);
    this.checkLoadedState = this.checkLoadedState.bind(this);

    // Check if the user is loaded
    setTimeout(this.checkLoadedState, 100);

    // Check if the user is signed in already
    this.totoSignIn.isSignedIn().then((result) => {

      // If there is a result && the result is the user info (and not false)
      if (result != null && result != false) {
        // Update the state and set the user info
        this.setState({
          isSignedIn: true,
          result // userInfo
        }, () => {
          result().then((r) => {
            // Update the global user
            if (r) user.setUserInfo(r.user);
            else this.setState({isSignedIn: false})
            // Update the "loaded" state
            this.checkLoadedState();
          });
        });
      }
      // If the result is false then it means the user is not logged in
      else {
        // Update the state and set as "not signed in"
        this.setState({
          isSignedIn: false
        })
      }
    });

  }

  /**
   * Checks if the state has been loaded. This means:
   */
  checkLoadedState() {

    this.setState({
      isLoaded: user && user.userInfo
    })
  }

  /**
   * Called when the user clicks on the login button
   */
  onLogin() {

    this.totoSignIn.signIn().then((userInfo) => {

      console.log(userInfo);

      // Set the user
      user.setUserInfo(userInfo.user);

      // Update the state
      this.setState({
        isSignedIn: userInfo != null
      }, this.checkLoadedState)
    });
  }

  render() {

    // If the signed in check is in progress, return an empty page
    if (this.state.isSignedIn == null) return (
      // Eventually put the app logo
      <View style={styles.loginContainer}>
      </View>
    )

    // If the user isn't signed in, return a login page
    if (!this.state.isSignedIn) return (
      <View style={styles.loginContainer}>
        <TRC.TotoLoginComponent onLogin={this.onLogin} />
      </View>
    )

    // If the groceries images haven't been loaded, wait
    if (!this.state.isLoaded) return (
      <View style={styles.loginContainer}>
      </View>
    )

    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} />
        <AppContainer />
        <TRC.TotoNotification />
      </View>
    );
  }
}

/**
 * Styles for the app
 */
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  }

});
