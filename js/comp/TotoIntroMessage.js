import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import TRC from 'toto-react-components';

export default class TotoIntroMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let arrowUp;
    if ((this.props.arrow == null || this.props.arrow == true) && this.props.arrowDir != 'down') arrowUp = (
      <View style={styles.arrowContainer}>
        <Image style={styles.arrow} source={require('TotoReactExpenses/img/arrow-up.png')} />
        <Image style={styles.arrow} source={require('TotoReactExpenses/img/arrow-up.png')} />
      </View>
    )

    let arrowDown;
    if ((this.props.arrow == null || this.props.arrow == true) && this.props.arrowDir == 'down') arrowDown = (
      <View style={styles.arrowContainer}>
        <Image style={styles.arrow} source={require('TotoReactExpenses/img/arrow-down.png')} />
        <Image style={styles.arrow} source={require('TotoReactExpenses/img/arrow-down.png')} />
      </View>
    )

    // Sizing
    let textSize = this.props.size == 'l' ? {fontSize: 22} : {fontSize: 18};
    let avatarContainerSize = this.props.size == 'l' ? {width: 80, height: 80, borderRadius: 40} : {width: 60, height: 60, borderRadius: 30};
    let avatarSize = this.props.size == 'l' ? {width: 50, height: 50} : {width: 40, height: 40};

    // Avatar and text position
    let layout = (this.props.layout == 'column') ? layout = {flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'} : {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'};

    // Avatar position (right or left)
    let avatarLeft = (this.props.avatarPosition == null || this.props.avatarPosition == 'left') ? (
      <View style={[styles.avatarContainer, avatarContainerSize]}>
        <Image style={[styles.avatar, avatarSize]} source={require('TotoReactExpenses/img/chimp.png')} />
      </View>
    ) : null;
    let avatarRight = (this.props.avatarPosition == 'right') ? (
      <View style={[styles.avatarContainer, avatarContainerSize]}>
        <Image style={[styles.avatar, avatarSize]} source={require('TotoReactExpenses/img/chimp.png')} />
      </View>
    ) : null;

    // Alignment
    let alignment = (this.props.avatarPosition == 'right') ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'}

    return (
      <View style={[styles.container, alignment]}>
        {arrowUp}
        <View style={[styles.speechContainer, layout]}>
          {avatarLeft}
          <View style={styles.textContainer}>
            <Text style={[styles.comment, textSize]}>"{this.props.text}"</Text>
          </View>
          {avatarRight}
        </View>
        {arrowDown}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  arrowContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    marginBottom: 6,
  },
  arrow: {
    width: 24,
    height: 20,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
  },
  speechContainer: {
  },
  avatarContainer: {
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  textContainer: {
    width: 225,
    marginHorizontal: 12,
  },
  comment: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
  },
})
