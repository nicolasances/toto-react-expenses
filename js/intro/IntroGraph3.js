import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import TRC from 'toto-react-components';

import TotoIntroMessage from 'TotoReactExpenses/js/comp/TotoIntroMessage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const iw = 976;
const ih = 859;
const ratio = ih / iw;

export default class IntroGraph3 extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <TotoIntroMessage
            arrow={false}
            size='l'
            layout="column" 
            text="This chart displays what was the most expensive category of expenses each month in the last year" />
        </View>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('TotoReactExpenses/img/intro/graph3.png')} />
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
    height: (width - 24) * ratio,
    marginLeft: 6,
    marginBottom: 60,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginVertical: 12,
    width: width,
  },
})
