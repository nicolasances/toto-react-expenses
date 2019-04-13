import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import TRC from 'toto-react-components';

import TotoIntroMessage from 'TotoReactExpenses/js/comp/TotoIntroMessage';

const width = Dimensions.get('window').width;

export default class IntroDashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showSecondMessage: false
    }

    setTimeout(() => {
      this.setState({showSecondMessage: true})
    }, 1000)

  }

  render() {

    let secondMessage;
    if (this.state.showSecondMessage) secondMessage = (
      <TotoIntroMessage
        arrow={false}
        size='l'
        layout='column'
        text="The bubble next to it shows the amount that you spent in the current month"
        />
    )

    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('TotoReactExpenses/img/intro/dashboard1.png')} />
        </View>
        <View style={styles.messageContainer}>
          <TotoIntroMessage text="This chart displays how much you spent each day in the last 8 days" />
        </View>
        <View style={{flex: 1, marginTop: 48,}}>
          {secondMessage}
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
  imgContainer: {
    // marginBottom: 12,
  },
  img: {
    width: width-24,
    height: 120
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    width: width,
  },
})
