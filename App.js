/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, createRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Text,
  TextInput,
  Easing,
  KeyboardAvoidingView,
  Button,
  Keyboard,
} from 'react-native';
import DigitalClock from './src/DigitalClock';

const CIRCLE_SIZE = 250;
const RADIUS = ((CIRCLE_SIZE / 2) * 80) / 100;
const secondsToMilliseconds = 1000;
const minutesToMilliseconds = 60 * secondsToMilliseconds;
const hoursToMilliseconds = 60 * minutesToMilliseconds;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationHoursHandAnimatedValue: new Animated.Value(0),
      rotationMinutesHandAnimatedValue: new Animated.Value(0),
      rotateSecondsHandAnimatedValue: new Animated.Value(0),
      initTime: {
        hoursInit: 12,
        minutesInit: 0,
        secondsInit: 0,
      },
      timeInput: '',
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

  rotateHoursHand() {
    Animated.timing(this.state.rotationHoursHandAnimatedValue, {
      toValue: 1,
      duration: 12 * hoursToMilliseconds,
      // duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotationHoursHandAnimatedValue.setValue(0);
      this.rotateHoursHand();
    });
  }

  rotateMinutesHand() {
    Animated.timing(this.state.rotationMinutesHandAnimatedValue, {
      toValue: 1,
      duration: 60 * minutesToMilliseconds,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotationMinutesHandAnimatedValue.setValue(0);
      this.rotateMinutesHand();
    });
  }

  rotateSecondsHand() {
    Animated.timing(this.state.rotateSecondsHandAnimatedValue, {
      toValue: 1,
      duration: 60 * secondsToMilliseconds,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotateSecondsHandAnimatedValue.setValue(0);
      this.rotateSecondsHand();
    });
  }

  componentDidMount() {
    this.getTimeInit();
    // this.rotateHoursHand();
    this.rotateMinutesHand();
    this.rotateSecondsHand();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}>
          <Animated.View style={styles.clockBlock}>
            <View style={styles.clockInner}>
              {this.hour.map((_, i) => {
                const angleThisItemRadius = (Math.PI / 6) * i;
                const itemSize = 16;
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
                          this.state.rotationHoursHandAnimatedValue.interpolate(
                            {
                              inputRange: [0, 1],
                              outputRange: [
                                `${
                                  this.state.initTime.hoursInit * 30 +
                                  30 *
                                    ((this.state.initTime.minutesInit * 6) /
                                      360)
                                }deg`,
                                `${
                                  this.state.initTime.hoursInit * 30 +
                                  30 *
                                    ((this.state.initTime.minutesInit * 6) /
                                      360) +
                                  360
                                }deg`,
                              ],
                            },
                          ),
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
                                `${
                                  this.state.initTime.minutesInit * 6 + 360
                                }deg`,
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
                          this.state.rotateSecondsHandAnimatedValue.interpolate(
                            {
                              inputRange: [0, 1],
                              outputRange: [
                                `${this.state.initTime.secondsInit * 6}deg`,
                                `${
                                  this.state.initTime.secondsInit * 6 + 360
                                }deg`,
                              ],
                            },
                          ),
                      },
                    ],
                  },
                ]}>
                <View style={styles.secondsHand}></View>
              </Animated.View>

              <View style={styles.centerClock}></View>
            </View>
          </Animated.View>

          <View style={styles.timeInputBlock}>
            <TextInput
              placeholder="14:06"
              value={this.state.timeInput}
              onChangeText={(text) =>
                this.setState({
                  timeInput: text,
                })
              }
              style={styles.timeInputTyping}
            />
            <View style={styles.timeInputConfirm}>
              <Button
                title="Set"
                color="#b03b60"
                onPress={() => {
                  this.setState({
                    timeInput: '',
                  });
                  Keyboard.dismiss();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        <DigitalClock />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clockBlock: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: '#ee9599',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbe4d7',
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
    height: CIRCLE_SIZE / 1.6,
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
    backgroundColor: '#b03b60',
    width: 1,
    height: '60%',
    borderRadius: 8,
  },
  timeInputBlock: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeInputTyping: {
    flex: 1,
    paddingHorizontal: 12,
    height: '100%',
    backgroundColor: '#ffe0ce',
    fontSize: 24,
    borderRadius: 4,
    fontWeight: '600',
  },
  timeInputConfirm: {
    marginLeft: 8,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#ffe0ce',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
});

export default App;
