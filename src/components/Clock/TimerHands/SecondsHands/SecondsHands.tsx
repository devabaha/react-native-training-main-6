import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BaseHands} from '../BaseHands';

const styles = StyleSheet.create({});

const _SecondsHands = () => {
  const baseSecondsDeg = useMemo(() => {
    return Math.floor((((Date.now() / 1000) % 60) / 60) * 360);
  }, []);

  return (
    <BaseHands
      type="seconds"
      baseDeg={baseSecondsDeg}
      width={1}
      height={120}
      interval={1000}
      step={1 / 60}
      color={'red'}
      mode="classic">
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'red',
          position: 'absolute',
          top: 15,
        }}
      />
    </BaseHands>
  );
};

export const SecondsHands = memo(_SecondsHands);
