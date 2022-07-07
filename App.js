/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, Animated, Text} from 'react-native';

const CIRCLE_SIZE = 250;
const RADIUS = ((CIRCLE_SIZE / 2) * 80) / 100;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamp: '',
    };
    this.hour = Array.from({
      length: 12,
    });
    this.timerId = 0;
  }

  getTimeStamp = () => {
    const dateInstance = new Date();
    const hour =
      dateInstance.getHours() < 10
        ? `0${dateInstance.getHours()}`
        : `${dateInstance.getHours()}`;
    const minute =
      dateInstance.getMinutes() < 10
        ? `0${dateInstance.getMinutes()}`
        : `${dateInstance.getMinutes()}`;
    const second =
      dateInstance.getSeconds() < 10
        ? `0${dateInstance.getSeconds()}`
        : `${dateInstance.getSeconds()}`;
    const timeStampNow = `${hour}:${minute}:${second}`;
    this.setState({
      timeStamp: timeStampNow,
    });
  };

  componentDidMount = () => {
    this.timerId = setInterval(() => {
      this.getTimeStamp();
    }, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timerId);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={styles.clockContainer}>
          <View style={styles.clockInner}>
            {this.hour.map((x, i) => {
              const angleThisItemDegree = 30 * i;
              const itemSize = 12;
              const angleThisItemRadius =
                (angleThisItemDegree * Math.PI) / 180 - Math.PI / 2;
              const coordinateHourStyle = {
                left:
                  RADIUS * Math.cos(angleThisItemRadius) + RADIUS - itemSize,
                top: RADIUS * Math.sin(angleThisItemRadius) + RADIUS - itemSize,
                transform: [{rotate: `${angleThisItemDegree}deg`}],
              };
              return (
                <View
                  key={i}
                  style={[styles.hourStep, coordinateHourStyle]}></View>
              );
            })}
          </View>
          <Animated.View style={styles.centerClock}>
            <Animated.View style={styles.wrapHand}>
              <View style={styles.hourHand}></View>
            </Animated.View>

            <Animated.View style={styles.wrapHand}>
              <View style={styles.minuteHand}></View>
            </Animated.View>

            <Animated.View style={styles.wrapHand}>
              <View style={styles.secondHand}></View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <View style={styles.alarmPicker}>
          <Text>{this.state.timeStamp}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clockContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockInner: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
  },
  centerClock: {
    position: 'absolute',
    backgroundColor: '#000',
    width: 10,
    height: 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourStep: {
    position: 'absolute',
    backgroundColor: '#000',
    width: 4,
    height: 10,
    borderRadius: 8,
  },
  wrapHand: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourHand: {
    position: 'absolute',
    backgroundColor: '#000',
    width: 6,
    height: CIRCLE_SIZE / 3,
    borderRadius: 8,
    transform: [
      {
        translateY: CIRCLE_SIZE / 8,
      },
    ],
  },
  // minuteHand: {
  //   position: 'absolute',
  //   backgroundColor: '#000',
  //   width: 3,
  //   height: CIRCLE_SIZE / 3,
  //   borderRadius: 8,
  //   transform: [
  //     {
  //       translateY: CIRCLE_SIZE / 8,
  //     },
  //   ],
  // },
  // secondHand: {
  //   position: 'absolute',
  //   backgroundColor: 'red',
  //   width: 1,
  //   height: CIRCLE_SIZE / 3,
  //   borderRadius: 8,
  //   transform: [
  //     {
  //       translateY: CIRCLE_SIZE / 8,
  //     },
  //   ],
  // },
  alarmPicker: {
    backgroundColor: 'pink',
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default App;
