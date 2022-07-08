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
    return timeStampNow;
  };

  componentDidMount = () => {
    this.timerId = setInterval(() => {
      const timeStampNow = this.getTimeStamp();
      this.setState({
        timeStamp: timeStampNow,
      });
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
    backgroundColor: '#ee9599',
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});

export default DigitalClock;
