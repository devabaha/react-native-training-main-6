import React, {Component, memo, useEffect, useState} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

const _DigitalClock = ({titleStyle}: {titleStyle?: StyleProp<TextStyle>}) => {
  const [update, setUpdate] = useState('');

  useEffect(() => {
    let interval = setInterval(() => {
      setUpdate(new Date().toLocaleTimeString());
    }, 0);

    return () => {
      clearInterval(interval);
    };
  });

  return <Text style={titleStyle}>{update}</Text>;
};

export const DigitalClock = memo(_DigitalClock);
