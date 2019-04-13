import React, {Component} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

export default class CurrencySelector extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={{}}>

        <TextInput
          style={styles.amountInput }
          onChangeText={(text) => {this.props.onAmountChange(parseFloat(text.replace(',', '.')))}}
          keyboardType='numeric'
          placeholder='100'
          defaultValue={this.props.amount ? this.props.amount + '' : ''}
          placeholderTextColor={TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
          />

      </View>
    )
  }

}

const styles = StyleSheet.create({
  amountInput: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    textAlign: 'center',
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
})
