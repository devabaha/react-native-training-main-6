import React, {memo, useMemo} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {DigitalClock} from '../Digital';
import {Separator} from './Separator';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#333',
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorLogo: {
    fontStyle: 'italic',
    fontWeight: '800',
    letterSpacing: 2,
    color: '#dcdc',
  },
  dialsItemContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dialsItem = Array.from({length: 60});

const _Dials = ({dimensions = 340, borderWidth = 20, containerStyle = {}}) => {
  const containerBaseStyle = useMemo(() => {
    return [
      styles.container,
      {
        width: dimensions,
        height: dimensions,
        padding: borderWidth,
        borderRadius: dimensions / 2,
        borderWidth,
      },
      containerStyle,
    ];
  }, [dimensions, borderWidth, containerStyle]);

  const decorLogoBaseStyle = useMemo(() => {
    return [
      styles.decorLogo,
      {
        top: ((dimensions - borderWidth) / 100) * -15,
      },
    ];
  }, [dimensions, borderWidth]);

  const decorDigitalClockBaseStyle = useMemo(() => {
    return {
      top: ((dimensions - borderWidth) / 100) * 20,
    };
  }, [dimensions, borderWidth]);

  return (
    <View style={containerBaseStyle}>
      <View style={styles.decorContainer}>
        <DigitalClock titleStyle={decorDigitalClockBaseStyle} />
        <Text style={decorLogoBaseStyle}>ABAHA</Text>
      </View>

      {dialsItem.map((_, index) => {
        const width = index % 5 === 0 ? 2 : 1;
        const height = index % 5 === 0 ? 20 : 8;
        return (
          <Separator
            key={index}
            width={width}
            height={height}
            position={index}
            totalSeparators={dialsItem.length}
            dialsDimensions={dimensions - borderWidth * 2}
            step={5}
          />
        );
      })}
    </View>
  );
};

export const Dials = memo(_Dials);
