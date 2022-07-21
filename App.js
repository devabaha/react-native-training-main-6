/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import AnalogClock from './src/components/AnalogClock';
import {Clock} from './src/components/Clock';
class App extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <AnalogClock />
        <Clock />
      </SafeAreaView>
    );
  }
}
export default App;
