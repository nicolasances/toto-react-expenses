import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, DatePickerIOS, Modal} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

export default class DateSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: props.date ? new Date(moment(props.date, 'YYYYMMDD')) : new Date(),
      modalVisible: false,
    }

    this.setTime = this.setTime.bind(this);
  }

  /**
   * Sets the time of the finish or start of session based on the this.state.selected param
   */
  setTime(date) {

    this.setState({date: date});

  }

  render() {

    let date = moment(this.state.date, 'YYYYMMDD');

    // Current calendar date
    let todayDayOfWeek = date.format('dddd');
    let todayDay = date.format('DD');
    let todayMonth = date.format('MMMM');
    let todayYear = date.format('YYYY');

    let yearText;
    if (this.props.showYear) yearText = (
      <Text style={[styles.todayYear]}>{todayYear}</Text>
    )

    return (
      <TouchableOpacity style={styles.todayContainer} onPress={() => {this.setState({modalVisible: true})}}>
        <Text style={[styles.todayDay]}>{todayDay}</Text>
        <Text style={[styles.todayMonth]}>{todayMonth}</Text>
        {yearText}

        <Modal  animationType="slide" transparent={false} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DatePickerIOS
              date={this.state.date}
              onDateChange={this.setTime}
              mode='date'
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={require('../../img/tick.png')} onPress={() => {this.props.onDateChange(this.state.date); this.setState({modalVisible: false});}} />
              <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={() => {this.setState({modalVisible: false})}} />
            </View>
          </View>
        </Modal>

      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  todayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDay: {
    fontSize: 44,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  todayMonth: {
    fontSize: 16,
    textTransform: 'uppercase',
    opacity: 0.8,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  todayYear: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
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
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  }
})
