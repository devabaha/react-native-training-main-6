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

class App extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <AnalogClock />
      </SafeAreaView>
    );
  }
}
export default App;
