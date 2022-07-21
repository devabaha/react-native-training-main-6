import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View, TextInput} from 'react-native';

import {Dials} from './Dials';
import {TimerHands} from './TimerHands';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const _Clock = () => {
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarm, setAlarm] = useState(false);

  const animationControl = useRef<Animated.CompositeAnimation | undefined>();
  const checkAlarmIntervalId = useRef<NodeJS.Timer>();

  const [animatedAlarm] = useState(new Animated.Value(0));

  const getRealTime = useCallback(() => {
    return (
      String(new Date().getHours()).padStart(2, '0') +
      ':' +
      String(new Date().getMinutes()).padStart(2, '0')
    );
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(checkAlarmIntervalId.current);
    };
  }, []);

  useEffect(() => {
    animationControl.current && animationControl.current.stop();
    if (!isAlarm) {
      // setAlarmTime('');
      animationControl.current = Animated.spring(animatedAlarm, {
        toValue: 0,
        damping: 5,
        useNativeDriver: true,
      });
    } else {
      animationControl.current = Animated.loop(
        Animated.spring(animatedAlarm, {
          toValue: 1,
          damping: 3,
          useNativeDriver: true,
        }),
      );
    }

    animationControl.current.start();

    return () => {
      animationControl.current && animationControl.current.stop();
    };
  }, [isAlarm]);

  const checkAlarm = useCallback(() => {
    if (!alarmTime || alarmTime !== getRealTime()) {
      if (isAlarm) {
        setAlarm(false);
      }
      clearInterval(checkAlarmIntervalId.current);
    } else {
      checkAlarmIntervalId.current = setInterval(() => {
        if (alarmTime === getRealTime()) {
          setAlarm(true);
        } else if (isAlarm) {
          setAlarmTime('');
          setAlarm(false);
          clearInterval(checkAlarmIntervalId.current);
        }
      }, 100);
    }

    return () => {
      clearInterval(checkAlarmIntervalId.current);
    };
  }, [alarmTime, isAlarm, getRealTime]);

  useEffect(() => {
    checkAlarm();
  }, [checkAlarm]);

  const handleChangeAlarmTime = useCallback((value) => {
    setAlarmTime(value);
  }, []);

  return (
    <>
      <View>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: animatedAlarm.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [1, 0.1, 0.4, 0.1, 1],
              }),
              transform: [
                {
                  rotateY: animatedAlarm.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
                {
                  translateX: animatedAlarm.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [0, -300, 100, 0],
                  }),
                },
                {
                  translateY: animatedAlarm.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [0, 300, -300, 0],
                  }),
                },
                {
                  scaleX: animatedAlarm.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: [1, 0.8, 0.85, 0.8, 0.9, 1],
                  }),
                },
                {
                  scaleY: animatedAlarm.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: [1, 0.9, 1.5, 1.3, 1.5, 1],
                  }),
                },
                {
                  rotateY: animatedAlarm.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
              ],
            },
          ]}>
          <Dials />
          <TimerHands />
        </Animated.View>
      </View>
      {/* <View
        style={{
          position: 'absolute',
          bottom: 100,
          borderWidth: 1,
          padding: 15,
          width: '80%',
        }}>
        <TextInput
          style={{flex: 1, textAlign: 'center'}}
          value={alarmTime}
          placeholder="Enter alarm time in hh:mm"
          onChangeText={handleChangeAlarmTime}
        />
      </View> */}
    </>
  );
};

export const Clock = memo(_Clock);
