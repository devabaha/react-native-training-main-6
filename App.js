/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Text,
  Easing,
} from 'react-native';
import DigitalClock from './src/DigitalClock';

const CIRCLE_SIZE = 250;
const RADIUS = ((CIRCLE_SIZE / 2) * 80) / 100;
const hoursToMilliseconds = 3600000;
const minutesToMilliseconds = 60000;
const secondsToMilliseconds = 1000;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationHoursHandAnimatedValue: new Animated.Value(0),
      rotationMinutesHandAnimatedValue: new Animated.Value(0),
      rotateSecondsHandAnimatedValue: new Animated.Value(0),
      initTime: {
        hoursInit: 0,
        minutesInit: 0,
        secondsInit: 0,
      },
    };
    this.hour = Array.from({
      length: 12,
    });
  }

  getTimeInit = () => {
    const dateInstance = new Date();
    this.setState({
      initTime: {
        hoursInit: dateInstance.getHours(),
        minutesInit: dateInstance.getMinutes(),
        secondsInit: dateInstance.getSeconds(),
      },
    });
  };

  rotateHandClock() {
    Animated.parallel([
      Animated.timing(this.state.rotationHoursHandAnimatedValue, {
        toValue: 1,
        duration: hoursToMilliseconds,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.rotationMinutesHandAnimatedValue, {
        toValue: 1,
        duration: 60 * minutesToMilliseconds,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.rotateSecondsHandAnimatedValue, {
        toValue: 1,
        duration: 60 * secondsToMilliseconds,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(this.state.rotationHoursHandAnimatedValue, {
          toValue: 0,
          duration: hoursToMilliseconds,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(this.state.rotationMinutesHandAnimatedValue, {
          toValue: 0,
          duration: 60 * minutesToMilliseconds,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(this.state.rotateSecondsHandAnimatedValue, {
          toValue: 0,
          duration: 60 * secondsToMilliseconds,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start();
    });
  }

  componentDidMount() {
    this.getTimeInit();
    this.rotateHandClock();
  }

  render() {
    console.log('re-render App');
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={styles.clockContainer}>
          <View style={styles.clockInner}>
            {this.hour.map((_, i) => {
              const angleThisItemRadius = (Math.PI / 6) * i;
              const itemSize = 14;
              const coordinateHourStyle = {
                left:
                  RADIUS * Math.cos(angleThisItemRadius - Math.PI / 2) +
                  RADIUS -
                  itemSize,
                top:
                  RADIUS * Math.sin(angleThisItemRadius - Math.PI / 2) +
                  RADIUS -
                  itemSize,
              };
              return (
                <View key={i} style={[styles.hourStep, coordinateHourStyle]}>
                  <Text>{i === 0 ? 12 : i}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.centerClock}>
            <Animated.View
              style={[
                styles.wrapHand,
                styles.wrapHoursHand,
                {
                  transform: [
                    {
                      rotate:
                        this.state.rotationHoursHandAnimatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            `${this.state.initTime.hoursInit * 30}deg`,
                            `${this.state.initTime.hoursInit * 30 + 360}deg`,
                          ],
                        }),
                    },
                  ],
                },
              ]}>
              <View style={[styles.hoursHand]}></View>
            </Animated.View>

            <Animated.View
              style={[
                styles.wrapHand,
                styles.wrapMinutesHand,
                {
                  transform: [
                    {
                      rotate:
                        this.state.rotationMinutesHandAnimatedValue.interpolate(
                          {
                            inputRange: [0, 1],
                            outputRange: [
                              `${this.state.initTime.minutesInit * 6}deg`,
                              `${this.state.initTime.minutesInit * 6 + 360}deg`,
                            ],
                          },
                        ),
                    },
                  ],
                },
              ]}>
              <View style={styles.minutesHand}></View>
            </Animated.View>

            <Animated.View
              style={[
                styles.wrapHand,
                styles.wrapSecondsHand,
                {
                  transform: [
                    {
                      rotate:
                        this.state.rotateSecondsHandAnimatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            `${this.state.initTime.secondsInit * 6}deg`,
                            `${this.state.initTime.secondsInit * 6 + 360}deg`,
                          ],
                        }),
                    },
                  ],
                },
              ]}>
              <View style={styles.secondsHand}></View>
            </Animated.View>

            <View style={styles.centerClock}></View>
          </View>
        </Animated.View>

        <DigitalClock />
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
  },
  wrapHand: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wrapHoursHand: {
    height: CIRCLE_SIZE / 3,
  },
  wrapMinutesHand: {
    height: CIRCLE_SIZE / 2,
  },
  wrapSecondsHand: {
    height: CIRCLE_SIZE / 1.5,
  },
  hoursHand: {
    backgroundColor: '#000',
    width: 6,
    height: '60%',
    borderRadius: 8,
  },
  minutesHand: {
    backgroundColor: '#000',
    width: 3,
    height: '60%',
    borderRadius: 8,
  },
  secondsHand: {
    backgroundColor: 'red',
    width: 1,
    height: '60%',
    borderRadius: 8,
  },
});

export default App;
