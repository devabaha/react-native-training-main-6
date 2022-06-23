/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import base64 from 'react-native-base64';
import {
  SafeAreaView,
  View,
  Image,
  TextInput,
  StyleSheet,
  Button,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import ListFruits from './components/ListFruits';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingFruits: true,
      newFruit: '',
      keyboardStatus: undefined,
      fruits: [],
      value: ''
    };
    this.myRef = React.createRef();
    this.controller = new AbortController();
    this.unMounted = false;
  }

  componentDidMount() {
    this.handleFetchListFruits();

    this.keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({keyboardStatus: true});
      },
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({keyboardStatus: false});
      },
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
    this.controller.abort();
    this.unMounted = true;
  }

  handleFetchListFruits = () => {
    const {signal} = this.controller;
    // if(this.unMounted) return;
    fetch('https://api.github.com/repos/minhnguyenit14/mockend/readme', {
      signal,
    })
      .then((response) => response.json())
      .then((data) => {
        const encodeString = String(data.content.replace(/\n/g, ''));
        this.decodeString(encodeString);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.setState({isFetchingFruits: false});
      });
  };

  decodeString = (encText) => {
    const data = base64.decode(encText);
    const result = JSON.parse(data);
    this.setState({
      fruits: result.fruits,
    });
  };

  handleGetNewFruit = (value) => {
    this.setState({
      newFruit: value.trim(),
    });
  };

  handleAddFruit = () => {
    const colors = ['blue', 'gray', 'orange', 'pink', 'purple'];
    let newArrayFruits = [...this.state.fruits];
    newArrayFruits.unshift({
      name: this.state.newFruit,
      imageUrl:
        'https://anhducdigital.vn/media/product/13251_iphone_13_pro_max_128gb_sierra_blue_3.webp',
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    this.setState({
      newFruit: '',
      fruits: newArrayFruits,
    });

    Keyboard.dismiss();
    // this.myRef.current.clear();
  };

  handleRemoveFruit = (index) => {
    let newArrayFruits = [...this.state.fruits];
    newArrayFruits.splice(index, 1);
    this.setState({
      fruits: newArrayFruits,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://static.fullstack.edu.vn/static/media/f8-icon.7ad2b161d5e80c87e516.png',
            }}
          />
        </View>
        <View style={styles.addFruitInput}>
          <TextInput
            style={styles.addFruitText}
            onChangeText={this.handleGetNewFruit}
            placeholder="Add fruit"
            value={this.state.newFruit}
            // ref={this.myRef}
          />

          <Button
            onPress={this.handleAddFruit}
            disabled={!this.state.newFruit.trim()}
            title="Add"
            color="#f05123"
          />
        </View>
        <ListFruits
          fruits={this.state.fruits}
          keyboardStatus={this.state.keyboardStatus}
          handleRemoveFruit={this.handleRemoveFruit}
        />
        {this.state.isFetchingFruits && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#f05123" />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  addFruitInput: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  addFruitText: {
    marginRight: 'auto',
    width: '100%',
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f6f3f3',
  },
});

export default App;
