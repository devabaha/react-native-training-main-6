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
import DigitalClock from './DigitalClock/DigitalClock';

const windowWidth = Dimensions.get('window').width;
const CIRCLE_SIZE = (70 * windowWidth) / 100;
const RADIUS = ((CIRCLE_SIZE / 2) * 80) / 100;
const secondsToMilliseconds = 1000;
const minutesToMilliseconds = 60 * secondsToMilliseconds;
const hoursToMilliseconds = 60 * minutesToMilliseconds;

class AnalogClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationHoursHandAnimatedValue: new Animated.Value(0),
      rotationMinutesHandAnimatedValue: new Animated.Value(0),
      rotateSecondsHandAnimatedValue: new Animated.Value(0),
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

  rotateHoursHand = () => {
    Animated.timing(this.state.rotationHoursHandAnimatedValue, {
      toValue: 1,
      // duration: 12 * hoursToMilliseconds,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotationHoursHandAnimatedValue.setValue(0);
      this.rotateHoursHand();
    });
  };

  rotateMinutesHand = () => {
    Animated.timing(this.state.rotationMinutesHandAnimatedValue, {
      toValue: 1,
      duration: 60 * minutesToMilliseconds,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotationMinutesHandAnimatedValue.setValue(0);
      this.rotateMinutesHand();
    });
  };

  rotateSecondsHand = () => {
    Animated.timing(this.state.rotateSecondsHandAnimatedValue, {
      toValue: 1,
      duration: 60 * secondsToMilliseconds,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.state.rotateSecondsHandAnimatedValue.setValue(0);
      this.rotateSecondsHand();
    });
  };

  analogClockAnimate = () => {
    Animated.sequence([
      Animated.timing(this.state.analogClockAnimatedValue, {
        toValue: 1,
        duration: 60 * minutesToMilliseconds,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ]).start(() => {
      this.state.analogClockAnimatedValue.setValue(0);
      this.analogClockAnimate();
    });
  };

  componentDidMount = () => {
    this.getTimeInit();
    // this.rotateHoursHand();
    this.rotateMinutesHand();
    this.rotateSecondsHand();
    this.analogClockAnimate();
  };

  handleSetWakeUp = (time) => {
    if (this.state.timeInput !== time && this.state.timeInput !== false) {
      return;
    }
  };

  render() {
    console.log(this.state.isWakeUp);
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
            <View style={styles.clockInner}>
              {this.hourStep.map((_, i) => {
                const angleThisItemRadius = (Math.PI / 6) * i;
                const itemSize = 12;
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

            <DigitalClock handleSetWakeUp={this.handleSetWakeUp} />
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
        <Text style={styles.timeInputWakeUp}>
          Wake up at: {this.state.timeInput}
        </Text>
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
  clockInner: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
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
  timeInputWakeUp: {
    color: '#b03b60',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default AnalogClock;

// import React from 'react';
// import {StyleSheet, Dimensions, View, Animated, Text} from 'react-native';

// const {width} = Dimensions.get('screen');
// const SIZE = width * 0.9;
// const TICK_INTERVAL = 1000;

// export default class App extends React.Component {
//   state = {
//     index: new Animated.Value(0),
//     tick: new Animated.Value(0),
//     scales: [...Array(6).keys()].map(() => new Animated.Value(0)),
//     time: new Date().toLocaleTimeString(),
//   };

//   _timer = 0;
//   _ticker = null;

//   componentDidMount() {
//     const oneDay = 24 * 60 * 60;

//     this.intervalID = setInterval(() => this.tick(), 1000);
//     this._timer = oneDay - 2000;
//     this.state.tick.setValue(this._timer);
//     this.state.index.setValue(this._timer - 30);

//     this._animate();

//     this._ticker = setInterval(() => {
//       this._timer += 1;
//       this.state.tick.setValue(this._timer);
//     }, TICK_INTERVAL);
//   }

//   componentWillUnmount() {
//     clearInterval(this._ticker);
//     clearInterval(this.intervalID);
//     this._ticker = null;
//   }

//   _animate = () => {
//     const scaleStaggerAnimations = this.state.scales.map((animated) => {
//       return Animated.spring(animated, {
//         toValue: 1,
//         tension: 18,
//         friction: 3,
//         useNativeDriver: true,
//       });
//     });
//     Animated.parallel([
//       Animated.stagger(
//         TICK_INTERVAL / this.state.scales.length,
//         scaleStaggerAnimations,
//       ),
//       Animated.timing(this.state.index, {
//         toValue: this.state.tick,
//         duration: TICK_INTERVAL / 2,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };
//   tick() {
//     this.setState({
//       time: new Date().toLocaleTimeString(),
//     });
//   }
//   render() {
//     const {
//       index,
//       scales: [
//         smallQuadranScale,
//         mediumQuadranScale,
//         bigQuadranScale,
//         secondsScale,
//         minutesScale,
//         hoursScale,
//       ],
//       time,
//     } = this.state;
//     const interpolated = {
//       inputRange: [0, 360],
//       outputRange: ['0deg', '360deg'],
//     };

//     const secondDegrees = Animated.multiply(index, 6);
//     const transformSeconds = {
//       transform: [
//         {rotate: secondDegrees.interpolate(interpolated)},
//         {scale: secondsScale},
//       ],
//     };

//     const rotateMinutes = Animated.divide(
//       secondDegrees,
//       new Animated.Value(60),
//     );
//     const transformMinutes = {
//       transform: [
//         {rotate: rotateMinutes.interpolate(interpolated)},
//         {scale: minutesScale},
//       ],
//     };

//     const rotateHours = Animated.divide(rotateMinutes, new Animated.Value(12));
//     const transformHours = {
//       transform: [
//         {rotate: rotateHours.interpolate(interpolated)},
//         {scale: hoursScale},
//       ],
//     };
//     return (
//       <View style={styles.container}>
//         <View style={styles.subcontainer}>
//           <Animated.View
//             style={[styles.bigQuadran, {transform: [{scale: bigQuadranScale}]}]}
//           />
//           <Animated.View
//             style={[
//               styles.mediumQuadran,
//               {transform: [{scale: mediumQuadranScale}]},
//             ]}
//           />
//           <Animated.View style={[styles.mover, transformHours]}>
//             <View style={[styles.hours]} />
//           </Animated.View>
//           <Animated.View style={[styles.mover, transformMinutes]}>
//             <View style={[styles.minutes]} />
//           </Animated.View>
//           <Animated.View style={[styles.mover, transformSeconds]}>
//             <View style={[styles.seconds]} />
//           </Animated.View>
//           <View
//             style={[
//               styles.smallQuadran,
//               {transform: [{scale: smallQuadranScale}]},
//             ]}
//           />
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginBottom: 50,
//   },
//   subcontainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   mover: {
//     position: 'absolute',
//     width: SIZE,
//     height: SIZE,
//     borderRadius: SIZE / 2,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },
//   hours: {
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     height: '35%',
//     marginTop: '15%',
//     width: 4,
//     borderRadius: 4,
//   },
//   minutes: {
//     backgroundColor: 'rgba(0, 0,0, 0.8)',
//     height: '45%',
//     marginTop: '5%',
//     width: 3,
//     borderRadius: 3,
//   },
//   seconds: {
//     backgroundColor: 'rgba(227, 71, 134, 1)',
//     height: '50%',
//     width: 2,
//     borderRadius: 2,
//   },
//   bigQuadran: {
//     width: SIZE * 0.8,
//     height: SIZE * 0.8,
//     borderRadius: SIZE * 0.4,
//     backgroundColor: 'rgba(200, 200, 200, 0.2)',
//     position: 'absolute',
//   },
//   mediumQuadran: {
//     width: SIZE * 0.5,
//     height: SIZE * 0.5,
//     borderRadius: SIZE * 0.4,
//     backgroundColor: 'rgba(200, 200, 200, 0.4)',
//     position: 'absolute',
//   },
//   smallQuadran: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: 'rgba(227, 71, 134, 1)',
//     position: 'absolute',
//   },
//   dispaly: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   timeDisplay: {
//     fontFamily: 'sans-serif',
//     fontSize: 50,
//     alignSelf: 'center',
//     color: 'rgba(100, 100, 100,1)',
//   },
//   dateDisplay: {
//     fontFamily: 'sans-serif',
//     fontSize: 50,
//     alignSelf: 'center',
//     color: 'rgba(50, 50, 50,1)',
//   },
// });
