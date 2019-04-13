import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';
import Swiper from 'react-native-swiper';

import IntroHello from 'TotoReactExpenses/js/intro/IntroHello';
import IntroDashboard from 'TotoReactExpenses/js/intro/IntroDashboard';
import IntroGraph1 from 'TotoReactExpenses/js/intro/IntroGraph1';
import IntroGraph2 from 'TotoReactExpenses/js/intro/IntroGraph2';
import IntroGraph3 from 'TotoReactExpenses/js/intro/IntroGraph3';
import IntroMenu from 'TotoReactExpenses/js/intro/IntroMenu';
import IntroFinished from 'TotoReactExpenses/js/intro/IntroFinished';

import user from 'TotoReactExpenses/js/User';

export default class IntroScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title=''
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      user: user.userInfo,
    }

    this.onFinished = this.onFinished.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);

  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
  }

  // When finished
  onFinished() {

    // Event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.demoFinished})

    // Go back
    this.props.navigation.goBack();
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <Swiper style={{}} showsPagination={true}>

          <IntroHello />
          <IntroDashboard />
          <IntroMenu />
          <IntroGraph1 />
          <IntroGraph2 />
          <IntroGraph3 />
          <IntroFinished onFinished={this.onFinished}/>

        </Swiper>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
});
