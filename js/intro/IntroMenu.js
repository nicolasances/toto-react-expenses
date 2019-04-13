import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import TRC from 'toto-react-components';

import TotoIntroMessage from 'TotoReactExpenses/js/comp/TotoIntroMessage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class IntroMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={[styles.messageContainer, {flex: 1, justifyContent: 'flex-end'}]}>
          <TotoIntroMessage
            text="The left button gives you access to your settings"
            arrowDir="down"
            />
        </View>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('TotoReactExpenses/img/intro/menu.png')} />
        </View>
        <View style={[styles.messageContainer, {flex: 1, justifyContent: 'flex-start'}]}>
          <TotoIntroMessage
            text="The center button is for adding payments, the right one to see the list of payments"
            avatarPosition='right'
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
  imgContainer: {
    // marginBottom: 12,
  },
  img: {
    width: 400,
    height: 140,
    marginLeft: 6,
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 12,
    width: width,
  },
})
