import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, DatePickerIOS, Modal} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

export default class CurrencySelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }

  }

  render() {

    return (
      <TouchableOpacity style={styles.currencySelector} onPress={() => {this.setState({modalVisible: true})}}>
        <Text style={styles.currency}>{this.props.currency}</Text>

        <Modal  animationType="slide" transparent={false} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Currency currency='EUR' selected={this.props.currency == 'EUR'} onPress={() => {this.props.onCurrencyChange('EUR'); this.setState({modalVisible: false})}} />
              <Currency currency='DKK' selected={this.props.currency == 'DKK'} onPress={() => {this.props.onCurrencyChange('DKK'); this.setState({modalVisible: false})}} />
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={() => {this.setState({modalVisible: false})}} />
            </View>
          </View>
        </Modal>

      </TouchableOpacity>
    )
  }

}

/**
 * Currency item
 */
class Currency extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let selectedStyle = this.props.selected ? styles.selected : styles.unselected;
    let selectedTextStyle = this.props.selected ? styles.selectedText : styles.unselectedText;

    return (
      <TouchableOpacity style={[styles.currencyContainer, selectedStyle]} onPress={this.props.onPress}>
        <Text style={[styles.currency, selectedTextStyle]}>{this.props.currency}</Text>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  currencySelector: {
    alignItems: 'center',
    marginTop: 6,
  },
  currency: {
    fontSize: 28,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    paddingTop: 64,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currencyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  unselected: {
    borderColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
  selected: {
    borderColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  unselectedText: {
    color: TRC.TotoTheme.theme.COLOR_THEME,
  },
  selectedText: {
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
})
