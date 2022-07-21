import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {HoursHands} from './HoursHands';
import {MinutesHands} from './MinutesHands';
import {SecondsHands} from './SecondsHands';

const styles = StyleSheet.create({
  bottomLatch: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ddd',
  },
  topLatch: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
  },
});

const _TimerHands = () => {
  return (
    <>
      <View style={styles.bottomLatch} />
      <SecondsHands />
      <MinutesHands />
      <HoursHands />
      <View style={styles.topLatch} />
    </>
  );
};

export const TimerHands = memo(_TimerHands);
