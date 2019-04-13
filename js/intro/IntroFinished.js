import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import TRC from 'toto-react-components';

import user from 'TotoReactExpenses/js/User';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';

export default class IntroFinished extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: user.userInfo,
    }

    // Bindings
    this.finish = this.finish.bind(this);

  }

  /**
   * Completes the demo
   */
  finish() {

    // UPdate the app settings
    new ExpensesAPI().putAppSettings({user: this.state.user.email, showDemo: false}).then((data) => {

      this.props.onFinished();

    })

  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('TotoReactExpenses/img/chimp.png')} />
        <Text style={styles.text}>Good {this.state.user.givenName}!</Text>
        <Text style={styles.text2}>You can now start!!</Text>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 60}}>
          <TRC.TotoIconButton
            image={require('TotoReactExpenses/img/tick.png')}
            onPress={this.finish}
            />
        </View>
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
