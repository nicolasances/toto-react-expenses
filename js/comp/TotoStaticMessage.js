import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import TRC from 'toto-react-components';

export default class TotoStaticMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={this.props.image} />
        <Text style={styles.text}>{this.props.text}</Text>
        <Text style={styles.detail}>{this.props.detail}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  image: {
    width: 42,
    height: 42,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    marginVertical: 12,
  },
  text: {
    fontSize: 22,
    color: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    marginVertical: 12,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    textAlign: 'center',
  },
})
