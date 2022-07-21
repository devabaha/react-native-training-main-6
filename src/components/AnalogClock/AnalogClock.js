import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TextInput,
  Easing,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import dayjs from 'dayjs';
import DigitalClock from './DigitalClock/DigitalClock';

const windowWidth = Dimensions.get('window').width;
const CIRCLE_SIZE = (80 * windowWidth) / 100;
const TICK_INTERVAL = 1000;
class AnalogClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationHandsAnimatedValue: new Animated.Value(0),
      tick: new Animated.Value(0),
      analogClockAnimatedValue: new Animated.Value(0),

      initTime: {
        hoursInit: 0,
        minutesInit: 0,
        secondsInit: 0,
      },
      timeInput: '',
      isWakeUp: false,
    };
    this.hourStep = Array.from({
      length: 12,
    });
    this.minuteStep = Array.from({
      length: 60,
    });
    this.timer = 0;
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

  componentDidMount() {
    this.getTimeInit();

    const current = dayjs();
    const diff = current.endOf('day').diff(current, 'seconds'); // thoi gian con lai trong ngay
    const oneDayToSeconds = 24 * 60 * 60;

    this.timer = oneDayToSeconds - diff;
    this.state.tick.setValue(this.timer);
    this.state.rotationHandsAnimatedValue.setValue(this.timer - 30);

    this.handleAnimate();

    this.tickerId = setInterval(() => {
      console.log(Math.floor((((Date.now() / 1000) % 60) / 60) * 360))
      this.timer += 1;
      this.state.tick.setValue(this.timer);
    }, TICK_INTERVAL);
    this.analogClockAnimate();
  }

  componentWillUnmount() {
    clearInterval(this.tickerId);
  }

  handleAnimate = () => {
    Animated.timing(this.state.rotationHandsAnimatedValue, {
      toValue: this.state.tick,
      duration: TICK_INTERVAL / 2,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  // rotateHoursHand = () => {
  //   Animated.timing(this.state.rotationHoursHandAnimatedValue, {
  //     toValue: 1,
  //     // duration: 12 * hoursToMilliseconds,
  //     duration: 1000,
  //     useNativeDriver: true,
  //     easing: Easing.linear,
  //   }).start(() => {
  //     this.state.rotationHoursHandAnimatedValue.setValue(0);
  //     this.rotateHoursHand();
  //   });
  // };

  // rotateMinutesHand = () => {
  //   Animated.timing(this.state.rotationMinutesHandAnimatedValue, {
  //     toValue: 1,
  //     duration: 60 * minutesToMilliseconds,
  //     useNativeDriver: true,
  //     easing: Easing.linear,
  //   }).start(() => {
  //     this.state.rotationMinutesHandAnimatedValue.setValue(0);
  //     this.rotateMinutesHand();
  //   });
  // };

  // rotateSecondsHand = () => {
  //   Animated.timing(this.state.rotateSecondsHandAnimatedValue, {
  //     toValue: 1,
  //     duration: 60 * secondsToMilliseconds,
  //     useNativeDriver: true,
  //     easing: Easing.linear,
  //   }).start(() => {
  //     this.state.rotateSecondsHandAnimatedValue.setValue(0);
  //     this.rotateSecondsHand();
  //   });
  // };

  analogClockAnimate = () => {
    Animated.sequence([
      Animated.timing(this.state.analogClockAnimatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ]).start(() => {
      this.state.analogClockAnimatedValue.setValue(0);
      this.analogClockAnimate();
    });
  };

  render() {
    const secondDegrees = Animated.multiply(
      this.state.rotationHandsAnimatedValue,
      6,
    );
    const baseSecondsDeg = Math.floor((((Date.now() / 1000) % 60) / 60) * 360);

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.clockBlock,
              this.state.isWakeUp && {
                transform: [
                  {
                    scale: this.state.analogClockAnimatedValue.interpolate({
                      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      outputRange: [0.5, 0.7, 1.1, 1.3, 1.5, 1],
                    }),
                  },
                ],
                opacity: this.state.analogClockAnimatedValue,
              },
            ]}>
            <View style={styles.clockInnerHour}>
              {this.hourStep.map((_, i) => {
                const angleThisItemRadius = (Math.PI / 6) * i;
                const RADIUS = ((CIRCLE_SIZE / 2) * 75) / 100;
                const coordinateHourStyle = {
                  top:
                    RADIUS * Math.sin(angleThisItemRadius - Math.PI / 2) +
                    RADIUS -
                    10,
                  left:
                    RADIUS * Math.cos(angleThisItemRadius - Math.PI / 2) +
                    RADIUS -
                    6,
                };
                return (
                  <View key={i} style={[styles.hourStep, coordinateHourStyle]}>
                    <Text style={{fontSize: 20, fontWeight: '600'}}>
                      {i === 0 ? 12 : i}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.clockInnerMinutes}>
              {this.minuteStep.map((_, i) => {
                const angleThisItemRadius = (Math.PI / 30) * i;
                const angleThisItemDegree = 6 * i;
                const RADIUS = ((CIRCLE_SIZE / 2) * 90) / 100;

                const coordinateMinuteStyle = {
                  top: RADIUS * Math.sin(angleThisItemRadius) + RADIUS + 16,
                  left: RADIUS * Math.cos(angleThisItemRadius) + RADIUS + 12,
                  transform: [{rotate: `${angleThisItemDegree}deg`}],
                };
                return (
                  <View
                    key={i}
                    style={[styles.minuteStep, coordinateMinuteStyle]}></View>
                );
              })}
            </View>

            <View style={styles.centerClock}>
              <Animated.View
                style={[
                  styles.wrapHand,
                  styles.wrapHoursHand,
                  // {
                  //   transform: [
                  //     {
                  //       rotate:
                  //         this.state.rotationHoursHandAnimatedValue.interpolate(
                  //           {
                  //             inputRange: [0, 1],
                  //             outputRange: [
                  //               `${
                  //                 this.state.initTime.hoursInit * 30 +
                  //                 30 *
                  //                   ((this.state.initTime.minutesInit * 6) /
                  //                     360)
                  //               }deg`,
                  //               `${
                  //                 this.state.initTime.hoursInit * 30 +
                  //                 30 *
                  //                   ((this.state.initTime.minutesInit * 6) /
                  //                     360) +
                  //                 360
                  //               }deg`,
                  //             ],
                  //           },
                  //         ),
                  //     },
                  //   ],
                  // },
                ]}>
                <View style={[styles.hoursHand]}></View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.wrapHand,
                  styles.wrapMinutesHand,
                  // {
                  //   transform: [
                  //     {
                  //       rotate:
                  //         this.state.rotationMinutesHandAnimatedValue.interpolate(
                  //           {
                  //             inputRange: [0, 1],
                  //             outputRange: [
                  //               `${this.state.initTime.minutesInit * 6}deg`,
                  //               `${
                  //                 this.state.initTime.minutesInit * 6 + 360
                  //               }deg`,
                  //             ],
                  //           },
                  //         ),
                  //     },
                  //   ],
                  // },
                ]}>
                <View style={styles.minutesHand}></View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.wrapHand,
                  styles.wrapSecondsHand,
                  // {
                  //   transform: [
                  //     {
                  //       rotate:
                  //         this.state.rotateSecondsHandAnimatedValue.interpolate(
                  //           {
                  //             inputRange: [0, 1],
                  //             outputRange: [
                  //               `${this.state.initTime.secondsInit * 6}deg`,
                  //               `${
                  //                 this.state.initTime.secondsInit * 6 + 360
                  //               }deg`,
                  //             ],
                  //           },
                  //         ),
                  //     },
                  //   ],
                  // },

                  // {
                  //   transform: [
                  //     {
                  //       rotate: secondDegrees.interpolate({
                  //         inputRange: [0, 1],
                  //         outputRange: [
                  //           `${this.state.initTime.secondsInit * 6}deg`,
                  //           `${this.state.initTime.secondsInit * 6 + 360}deg`,
                  //         ],
                  //       }),
                  //     },
                  //   ],
                  // },
                ]}>
                <View style={styles.secondsHand}></View>
              </Animated.View>

              <View style={styles.centerClock}></View>
            </View>
            <DigitalClock />
          </Animated.View>

          <View style={styles.timeInputBlock}>
            <TextInput
              placeholder="hh:mm"
              value={this.state.timeInput}
              onChangeText={(text) =>
                this.setState({
                  timeInput: text,
                })
              }
              style={styles.timeInputTyping}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
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
    backgroundColor: '#faf2ee',
  },
  clockInnerHour: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
  },
  clockInnerMinutes: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 999,
    position: 'absolute',
  },
  centerClock: {
    zIndex: 1,
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
  minuteStep: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: '#b03b60',
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
  timeInputSet: {
    marginLeft: 8,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#ffe0ce',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
});

export default AnalogClock;
