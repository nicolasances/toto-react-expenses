import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import TRC from 'toto-react-components';

import TotoIntroMessage from 'TotoReactExpenses/js/comp/TotoIntroMessage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class IntroGraph2 extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
        </View>
        <View style={styles.messageContainer}>
          <TotoIntroMessage
            arrow={false}
            layout="column" 
            text="This chart displays how much you spent each month in the last couple of years" />
        </View>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('TotoReactExpenses/img/intro/graph2.png')} />
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
    width: width - 24,
    height: height / 2.1,
    marginLeft: 6,
    marginBottom: 60,
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 12,
    width: width,
  },
})
