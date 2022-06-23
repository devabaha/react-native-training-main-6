import React, {Component} from 'react';
import {ScrollView, StyleSheet, KeyboardAvoidingView, View} from 'react-native';
import Fruits from './Fruits';
class ListFruits extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={this.props.keyboardStatus && styles.container}>
          <View style={styles.contentContainer}>
            {this.props.fruits.map((fruit, index) => {
              return (
                <Fruits
                  key={index}
                  color={fruit.color}
                  name={fruit.name}
                  imageUrl={fruit.imageUrl}
                  handleRemoveFruit={this.props.handleRemoveFruit.bind(this, index)}
                  a={2}
                />
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.6,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 4,
  },
});

export default ListFruits;
