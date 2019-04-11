import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, DatePickerIOS, Modal, Platform, DatePickerAndroid} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

const android = Platform.OS == 'android';

export default class DateSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: props.date ? new Date(moment(props.date, 'YYYYMMDD')) : new Date(),
      modalVisible: false,
    }

    this.setTime = this.setTime.bind(this);
    this.selectADate = this.selectADate.bind(this);
  }

  /**
   * Sets the time of the finish or start of session based on the this.state.selected param
   */
  setTime(date) {

    this.setState({date: date});

  }

  /**
   * Selects a date: based on the platform:
   * - iOS      - opens a modal to select the date through DatePickerIOS component
   * - Android  - opens the Android date picker dialog directly
   */
  selectADate() {

    if (android) {

      DatePickerAndroid.open({date: this.state.date}).then(({action, year, month, day}) => {

        if (action !== DatePickerAndroid.dismissedAction) {
          let selectedDate = new Date(year, month, day);
          this.setTime(selectedDate);
          this.props.onDateChange(selectedDate);
        }
      })
    }
    else this.setState({modalVisible: true});

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

    // Date picker
    let datepicker
    if (!android) datepicker = (
      <DatePickerIOS
          date={this.state.date}
          onDateChange={this.setTime}
          mode='date'
          />
    )

    return (
      <TouchableOpacity style={styles.todayContainer} onPress={this.selectADate}>
        <Text style={[styles.todayDay]}>{todayDay}</Text>
        <Text style={[styles.todayMonth]}>{todayMonth}</Text>
        {yearText}

        <Modal  animationType="slide" transparent={false} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              {datepicker}
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
