import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class DigitalClock extends Component {
  state = {
    timeStamp: '',
  };

  timerId = 0;

  getTimeStamp = () => {
    const dateInstance = new Date();
    const hour =
      dateInstance.getHours() < 10
        ? `0${dateInstance.getHours()}`
        : `${dateInstance.getHours()}`;
    const minute =
      dateInstance.getMinutes() < 10
        ? `0${dateInstance.getMinutes()}`
        : `${dateInstance.getMinutes()}`;
    const second =
      dateInstance.getSeconds() < 10
        ? `0${dateInstance.getSeconds()}`
        : `${dateInstance.getSeconds()}`;
    const timeStampNow = `${hour}:${minute}:${second}`;
    this.setState({
      timeStamp: timeStampNow,
    });
  };

  componentDidMount = () => {
    this.timerId = setInterval(() => {
      this.getTimeStamp();
    }, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timerId);
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.timeStamp}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    width: '50%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default DigitalClock;
