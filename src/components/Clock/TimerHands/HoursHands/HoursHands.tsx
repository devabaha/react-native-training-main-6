import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {BaseHands} from '../BaseHands';

const styles = StyleSheet.create({});

const _HoursHands = () => {
  const baseHoursDeg = useMemo(() => {
    const currentHours =
      ((Date.now() / (1000 * 60 * 60)) % 12) +
      (Math.abs(new Date().getTimezoneOffset() / 60) % 12);

    return (currentHours / 12) * 360;
  }, []);

  return (
    <BaseHands
      type="hours"
      baseDeg={baseHoursDeg}
      width={4}
      height={66}
      interval={1000}
      step={1 / 60 / 60 / 12}
      color={'#333'}
    />
  );
};

export const HoursHands = memo(_HoursHands);
