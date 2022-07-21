import React, {memo, useMemo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    backgroundColor: '#888',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 22,
    fontWeight: '500',
    bottom: -28,
  },
});

const _Separator = ({
  width = 2,
  height = 20,
  position = 0,
  totalSeparators = 1,
  dialsDimensions = 150,
  step = 5,
  latchDimensions = 30,
}) => {
  const containerBaseStyle = useMemo(() => {
    return [
      styles.container,
      {
        transform: [
          {
            translateX:
              Math.sin((Math.PI * 2 * position) / totalSeparators) *
              (dialsDimensions / 2),
          },
          {
            translateY:
              -Math.cos((Math.PI * 2 * position) / totalSeparators) *
              (dialsDimensions / 2),
          },
          {
            rotate: (Math.PI * 2 * position) / totalSeparators + 'rad',
          },
          {
            translateY: height / 2,
          },
        ],
      },
    ];
  }, [position, totalSeparators, dialsDimensions, height]);

  const separatorBaseStyle = useMemo(() => {
    return [
      styles.separator,
      {
        width,
        height,
      },
    ];
  }, [position, width, height]);

  const labelContainerBaseStyle = useMemo(() => {
    return [
      styles.labelContainer,
      {
        width: latchDimensions,
        height: latchDimensions,
        borderRadius: latchDimensions / 2,
      },
    ];
  }, [latchDimensions]);

  const labelBaseStyle = useMemo(() => {
    return [
      styles.label,
      {
        transform: [
          {
            rotate: -(Math.PI * 2 * position) / totalSeparators + 'rad',
          },
        ],
      },
    ];
  }, [position, totalSeparators]);

  return (
    <View style={containerBaseStyle}>
      <View style={separatorBaseStyle} />
      {position % step === 0 && (
        <Animated.View style={labelContainerBaseStyle}>
          <Animated.Text style={labelBaseStyle}>
            {position / step || 12}
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
};

export const Separator = memo(_Separator);
