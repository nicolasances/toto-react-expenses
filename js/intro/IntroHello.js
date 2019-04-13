import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import TRC from 'toto-react-components';

import user from 'TotoReactExpenses/js/User';

export default class IntroHello extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: user.userInfo,
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('TotoReactExpenses/img/chimp.png')} />
        <Text style={styles.text}>Hey {this.state.user.givenName}!</Text>
        <Text style={styles.text2}>Welcome to Toto Payments!</Text>
        <Text style={styles.detail}>Let's check how this app works!{"\n"}Swipe to start the intro!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    marginVertical: 24,
  },
  text: {
    fontSize: 26,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginTop: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  text2: {
    fontSize: 24,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 24,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textAlign: 'center',
    opacity: 1,
  },
})
