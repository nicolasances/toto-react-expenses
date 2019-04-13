import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import TRC from 'toto-react-components';

import TotoIntroMessage from 'TotoReactExpenses/js/comp/TotoIntroMessage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const iw = 949;
const ih = 149;
const ratio = ih / iw;

export default class IntroConsolidateSymbol extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('TotoReactExpenses/img/intro/expense.png')} />
        </View>
        <View style={[styles.messageContainer, {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start'}]}>
          <TotoIntroMessage
            text="In the payments list, after adding a payment, you'll see a symbol on the right: it means that you haven't verified that the expense is also shown in your internet banking. When you see that expense in your internet banking, you can click on the symbol and the payment will be considered 'verified'! "
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
    width: width - 48,
    height: (width - 48) * ratio,
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
