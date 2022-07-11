import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class DigitalClock extends Component {
  state = {
    timeStamp: '',
    timeStampNotSeconds: '',
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
    const timeStampNotSeconds = `${hour}:${minute}`;
    return [timeStampNow, timeStampNotSeconds];
  };

  componentDidMount = () => {
    if (
      this.props.timeInput !== '' &&
      this.state.timeStampNotSeconds !== '' &&
      this.props.timeInput === this.state.timeStampNotSeconds
    ) {
      // this.props.handleSetWakeUp(true);
      console.log(this.props.timeInput, '-', this.state.timeStampNotSeconds);
    } else {
      // this.props.handleSetWakeUp(false);
      console.log('not match');
    }
    this.timerId = setInterval(() => {
      const timeStampNow = this.getTimeStamp();
      this.setState({
        timeStamp: timeStampNow[0],
        timeStampNotSeconds: timeStampNow[1],
      });
    }, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timerId);
  };

  render() {
    return (
      <>
        {!!this.state.timeStamp && (
          <View style={styles.container}>
            <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '25%',
    padding: 2,
    borderWidth: 2,
    borderColor: '#ee9599',
    borderRadius: 4,
  },
});

export default DigitalClock;
