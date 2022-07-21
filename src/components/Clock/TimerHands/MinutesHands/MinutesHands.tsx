import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {BaseHands} from '../BaseHands';

const styles = StyleSheet.create({});

const _MinutesHands = () => {
  const baseMinutesDeg = useMemo(() => {
    return (((Date.now() / (1000 * 60)) % 60) / 60) * 360;
  }, []);

  return (
    <BaseHands
      type="minutes"
      baseDeg={baseMinutesDeg}
      width={2}
      height={100}
      interval={1000}
      step={1 / 60 / 60}
      color={'#666'}
    />
  );
};

export const MinutesHands = memo(_MinutesHands);
