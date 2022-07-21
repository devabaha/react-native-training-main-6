import React, {
  Children,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {BaseHandsProps} from '.';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  handsBaseStyle: {
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 5,
  },
});

const _BaseHands = ({
  type,
  mode = 'modern',
  baseDeg = 0,
  step = 1,
  interval = 1000,
  width = 0,
  height = 0,
  color = '#aaa',
  children = null,
}: BaseHandsProps) => {
  const rotateValueRef = useRef(0);
  const [animatedCycle] = useState(new Animated.Value(0));

  const [animatedRotate] = useState(new Animated.Value(0));

  useEffect(() => {
    const getRealTimeIntervalId = setInterval(() => {
      let timeValue = 0;
      let nextDeg = 0;
      switch (type) {
        case 'hours':
          const timeZone = Math.abs(new Date().getTimezoneOffset() / 60);
          timeValue = ((Date.now() / (1000 * 60 * 60)) % 12) + (timeZone % 12);
          nextDeg = (timeValue / 12) * 360;
          break;
        case 'minutes':
          timeValue = (Date.now() / (1000 * 60)) % 60;
          nextDeg = (timeValue / 60) * 360;
          break;
        case 'seconds':
          timeValue = (Date.now() / 1000) % 60;
          if (mode === 'classic') {
            timeValue = Math.floor(timeValue);
          }
          nextDeg = (timeValue / 60) * 360;
          break;
      }

      animatedRotate.setValue(nextDeg);
    }, 0);

    return () => {
      clearInterval(getRealTimeIntervalId);
    };
  }, [type, mode]);

  // useEffect(() => {
  //   const animatedRotateListenerId = animatedCycle.addListener(({value}) => {
  //     if (value >= 1) {
  //       rotateValueRef.current += step;
  //       Animated.timing(animatedRotate, {
  //         toValue: rotateValueRef.current * 360,
  //         duration: mode === 'classic' ? 0 : 1000,
  //         useNativeDriver: true,
  //         easing: Easing.linear,
  //       }).start(({finished}) => {
  //         if (finished && rotateValueRef.current >= 360) {
  //           animatedRotate.setValue(0);
  //           rotateValueRef.current = 0;
  //         }
  //       });
  //     }
  //   });

  //   const loopRotating = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(animatedCycle, {
  //         toValue: 1,
  //         duration: interval,
  //         useNativeDriver: true,
  //         easing: Easing.linear,
  //       }),
  //     ]),
  //   );

  //   loopRotating.start();

  //   return () => {
  //     loopRotating.stop();
  //     animatedCycle.removeListener(animatedRotateListenerId);
  //   };
  // }, [interval, animatedCycle, step, mode]);

  const wrapperBaseStyle = useMemo(() => {
    return [
      styles.wrapper,
      {
        width: height * 2,
        height: height * 2,
        // transform: [
        //   {
        //     rotate: baseDeg + 'deg',
        //   },
        // ],
      },
    ];
  }, [baseDeg, height]);

  const containerBaseStyle = useMemo(() => {
    return [
      styles.container,
      {
        transform: [
          {
            rotate: animatedRotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      },
    ];
  }, [animatedRotate]);

  const handsBaseStyle = useMemo(() => {
    return [
      styles.handsBaseStyle,
      {
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: width / 2,
      },
    ];
  }, [width, height, color]);

  return (
    <Animated.View style={wrapperBaseStyle}>
      <Animated.View style={containerBaseStyle}>
        <View style={handsBaseStyle} />
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export const BaseHands = memo(_BaseHands);
