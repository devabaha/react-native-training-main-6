import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Animated, Button, Easing, StyleSheet, Text, View} from 'react-native';
import {SunRay} from './SunRay';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    marginBottom: 50,
  },
  innerSunContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerSun: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: 'yellow',
  },
  sunTitle: {
    color: 'purple',
    fontWeight: 'bold',
  },
});

const r = 50;
const sunRayWidth = 20;
const sunRayHeight = 40;
const sunRays = Array.from({length: (2 * (Math.PI * r)) / sunRayWidth});

const _TheSun = () => {
  const [animatedRotates] = useState(sunRays.map(() => new Animated.Value(0)));
  const [animatedTranslates] = useState(
    sunRays.map(() => new Animated.Value(0)),
  );
  const [animatedSpin] = useState(new Animated.Value(0));
  const [isShow, setShow] = useState<boolean | undefined>(undefined);
  const totalDuration = 1000;
  const duration = totalDuration / sunRays.length;

  useEffect(() => {
    if (isShow === undefined) return;
    Animated.stagger(
      (duration * 2) / 3,
      animatedRotates.map((animation, index) => {
        const animations: Animated.CompositeAnimation[] = [
          Animated.timing(animation, {
            toValue: isShow ? 1 : 0,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ];
        if (isShow) {
          animations.push(
            Animated.sequence([
              Animated.timing(animatedTranslates[index], {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
            ]),
          );
        } else {
          animations.push(
            Animated.sequence([
              Animated.timing(animatedTranslates[index], {
                toValue: 2,
                duration: duration * 3,
                easing: Easing.quad,
                useNativeDriver: true,
              }),
              Animated.timing(animatedTranslates[index], {
                toValue: 0,
                duration: 0,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
            ]),
          );
        }
        return Animated.parallel(animations);
      }),
    ).start(({finished}) => {
      if (finished && isShow) {
        Animated.spring(animatedSpin, {
          toValue: 1,
          mass: 2,
          useNativeDriver: true,
        }).start(({finished}) => {
          animatedSpin.setValue(0);
        });
      }
    });
  }, [isShow]);

  const toggle = useCallback(() => {
    setShow(prevValue => !prevValue);
  }, []);

  const containerBaseStyle = useMemo(() => {
    return [
      styles.container,
      {
        width: r * 2,
        height: r * 2,
        transform: [
          {
            scale: animatedSpin.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [1, 1.2, 1],
            }),
          },
          {
            rotate: animatedSpin.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', 360 * 2 + 'deg'],
            }),
          },
        ],
      },
    ];
  }, [r, animatedSpin]);

  const innerSunContainerBaseStyle = useMemo(() => {
    return [
      styles.innerSunContainer,
      {
        borderRadius: r,
      },
    ];
  }, [r]);

  const innerSunBaseStyle = useMemo(() => {
    return [
      styles.innerSun,
      {
        borderRadius: r,
      },
    ];
  }, [r]);

  const renderSunRays = useCallback(() => {
    return sunRays.map((_, index) => {
      return (
        <SunRay
          key={index}
          index={index}
          r={r}
          totalSunRays={sunRays.length}
          sunRayHeight={sunRayHeight}
          sunRayWidth={sunRayWidth}
          animatedRotateValue={animatedRotates[index]}
          animatedTranslateValue={animatedTranslates[index]}
        />
      );
    });
  }, [
    sunRays,
    r,
    sunRayWidth,
    sunRayHeight,
    animatedRotates,
    animatedTranslates,
  ]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={containerBaseStyle}>
        {renderSunRays()}

        <View style={innerSunContainerBaseStyle}>
          <View style={innerSunBaseStyle} />
          <Text style={styles.sunTitle}>Sun</Text>
        </View>
      </Animated.View>

      <Button title="Toggle" onPress={toggle} />
    </View>
  );
};

export const TheSun = memo(_TheSun);
