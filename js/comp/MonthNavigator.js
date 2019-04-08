import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, PanResponder, Animated, Easing} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

import * as config from 'TotoReactExpenses/js/Config';
import ExpensesAPI from 'TotoReactExpenses/js/services/ExpensesAPI';

const windowWidth = Dimensions.get('window').width;

export default class MonthNavigator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startingMonth: props.startingMonth,
      months: this.initMonths(),
      currentProspection: 1
    }

    this.stepWidth = windowWidth / 3;

    // Current amount of step scrolls that have been made. it tracks the position of the current Month in the scroll
    this.currentScrollPosition = 0;
    this.animatedx = new Animated.Value(0);
    this.x = 0;
    this.animatedx.addListener((progress) => {this.x = progress.value;});
    // Opacity
    this.animatedOpacity = new Animated.Value(1);
    this.opacity = 1;
    this.animatedOpacity.addListener((progress) => {this.opacity = progress.value;});
    // FontSize
    this.animatedMonthFont = new Animated.Value(22);
    this.monthFont = 22;
    this.animatedMonthFont.addListener((progress) => {this.monthFont = progress.value;});

    // Pan responder to manage the gestures
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.animatedx.setOffset(this.x);
        this.animatedx.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Move the elements
       this.animatedx.setValue(gestureState.dx);
       // Calculate the distance that has been moved, topping it to the cell size
       let distance = Math.abs(gestureState.dx) > windowWidth / 3 ? windowWidth / 3 : Math.abs(gestureState.dx);
       let percentOfWWidth = distance * 3 / windowWidth;
       // Calculate the target opacity based on how far the gesture has come
       let interpolatedOpacity = distance * 3 / windowWidth;
       if (interpolatedOpacity > 0.5) interpolatedOpacity = 0.5;
       this.animatedOpacity.setValue(1 - interpolatedOpacity);
       // Calculate the new font size for the month
       let interpolatedMonthFont = 8 * percentOfWWidth;
       this.animatedMonthFont.setValue(22 - interpolatedMonthFont);

      },
      onPanResponderRelease: (e, gestureState) => {

        this.animatedx.flattenOffset();

        // How many steps have I moved
        let steps = Math.round(Math.abs(gestureState.dx) / this.stepWidth);
        // In which direction
        let direction = gestureState.dx < 0 ? -1 : 1;
        // What's the target spot?
        let target = this.currentScrollPosition * this.stepWidth + steps * direction * this.stepWidth;
        // Update the current scroll position
        this.currentScrollPosition += steps * direction;
        // Animate to the target
        Animated.timing(this.animatedx, {toValue: target, duration: 100}).start();
        // If we're getting to the sides of the months array, let's add months
        if (steps > 0) {
          if (this.state.currentProspection - Math.abs(this.currentScrollPosition) <= 2) this.addMonths(steps);
          // If we're getting back to the center of the array, let's remove months, so we don't consume memory!!
          else if (this.state.currentProspection - Math.abs(this.currentScrollPosition) > 2 ) this.removeMonths();
        }

        // Restore opacity
        this.animatedOpacity.setValue(1);

        // Restore font
        this.animatedMonthFont.setValue(22);

        // Pass the new month to the onMonthChange()
        if (steps > 0) this.onMonthChange();


        // Animated.decay(this.animatedx, {
        //   deceleration: 0.95,
        //   velocity: gestureState.vx
        // }).start();
      },
    });

    this.animatedStyle = {transform: [{translateX: this.animatedx}]}
    this.animatedOpacityStyle = {opacity: this.animatedOpacity};
    this.animatedMonthFontStyle = {fontSize: this.animatedMonthFont};

    // Bindings
    this.onMonthChange = this.onMonthChange.bind(this);

  }

  /**
   * React to a month being changed
   */
  onMonthChange() {

    // Find the center of the array. The array length is always going to be an odd number
    let centerIdx = Math.round(this.state.months.length / 2) - 1; // Will round up to the odd number
    // What is the actual visible center? apply the scroll to the array
    let actualCenterIdx = centerIdx - this.currentScrollPosition;

    // Find the month that has changed
    for (var i = 0; i < this.state.months.length; i++) {
      if (i == actualCenterIdx) {
        if (this.props.onMonthChange) this.props.onMonthChange(this.state.months[i].yearMonth);
      }
    }

    // Call props.onMonthChange()

  }

  /**
   * Creates a month object
   */
  month(mom) {

    return {
      month: mom.format('MMMM'),
      year: mom.format('YYYY'),
      yearMonth: mom.format('YYYYMM'),
    }

  }

  /**
   * Initializes the months
   */
  initMonths() {

    let pastMonths = [];
    let futureMonths = [];

    let currentMonth = this.month(moment(this.props.startingMonth + '01'));

    for (var i = 1; i < 2; i++) {
      pastMonths.push(this.month(moment(this.props.startingMonth + '01').subtract(i, 'month')));
      futureMonths.push(this.month(moment(this.props.startingMonth + '01').add(i, 'month')));
    }

    pastMonths.reverse();

    return [...pastMonths, currentMonth, ...futureMonths];

  }

  /**
   * Adds #num month in the past and one in the future
   * If num == null, use 1
   */
  addMonths(num) {

    let n = num ? num : 1;

    let pastMonths = [];
    let futureMonths = [];

    for (var i = 0; i < n; i++) {
      pastMonths.push(this.month(moment(this.state.months[0].yearMonth + '01', 'YYYYMMDD').subtract(1 + i, 'months')));
      futureMonths.push(this.month(moment(this.state.months[this.state.months.length - 1].yearMonth + '01', 'YYYYMMDD').add((1 + i), 'months')));
    }

    pastMonths.reverse();

    this.setState({
      months: [...pastMonths, ...this.state.months, ...futureMonths],
      currentProspection: this.state.currentProspection + n
    })

  }

  /**
   * Removes a month in the past and one in the future
   */
  removeMonths() {

    let targetProspection = this.state.currentProspection - 1;

    this.state.months.splice(0, 1);
    this.state.months.splice(this.state.months.length - 1, 1);

    this.setState({
      months: [...this.state.months],
      currentProspection: this.state.currentProspection - 1
    })

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Add one more month on each side
    this.addMonths(1);

    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);

  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
  }

  renderItem(item, index) {

    key = 'MonthNav-' + index + '-' + Math.random();

    // If the month is not in the visible area, make it transparent
    // TO DO THAT:
    // Find the center of the array. The array length is always going to be an odd number
    let centerIdx = Math.round(this.state.months.length / 2) - 1; // Will round up to the odd number
    // What is the actual visible center? apply the scroll to the array
    let actualCenterIdx = centerIdx - this.currentScrollPosition;
    // Non visible area <=> index is centerIdx - 2 or + 2
    // let opacity = (Math.abs(actualCenterIdx - index) >= 2) ? {opacity: 0} : {opacity: 1};
    let opacity = (index == actualCenterIdx) ? this.animatedOpacityStyle : {opacity: 0.5};
    if (Math.abs(actualCenterIdx - index) >= 2) opacity = {opacity: 0};

    // Text Color: make it ACCENT if it's the currently selected month
    // let color = (index == actualCenterIdx) ? {color: TRC.TotoTheme.theme.COLOR_ACCENT} : {color: TRC.TotoTheme.theme.COLOR_TEXT};
    let color = {color: TRC.TotoTheme.theme.COLOR_TEXT};

    // Font Size: make it bigger if selected
    let monthFontSize = (index == actualCenterIdx) ? this.animatedMonthFontStyle : {fontSize: 14};
    let yearFontSize = {fontSize: 10}

    // Underline
    // let underline = (index == actualCenterIdx) ? styles.underlined : {};
    let underline = {};

    return (
      <Animated.View key={key} style={[styles.month, this.animatedStyle, opacity, underline]} {...this.panResponder.panHandlers}>
        <Animated.Text style={[color, monthFontSize]}>{item.month}</Animated.Text>
        <Animated.Text style={[styles.yearText, color, yearFontSize]}>{item.year}</Animated.Text>
      </Animated.View>
    )

  }

  render() {

    let months = [];
    for (var i = 0; i < this.state.months.length; i++) {
      months.push(this.renderItem(this.state.months[i], i));
    }

    return (
      <View style={styles.container}>
        <View style={styles.monthsContainer}>
          {months}
        </View>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 1}}></View>
          <View style={[{width: 80, height: 3}, styles.underlined]}></View>
          <View style={{flex: 1}}></View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 24,
  },
  month: {
    width: windowWidth / 3,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    width: windowWidth,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  monthText: {
  },
  yearText: {
  },
  underlined: {
    borderBottomWidth: 1,
    borderBottomColor: TRC.TotoTheme.theme.COLOR_ACCENT
  },
})
