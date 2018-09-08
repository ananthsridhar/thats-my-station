import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormComponent from './FormComponent.js';
import DetailComponent from './DetailScreen.js'
import {createStackNavigator} from 'react-navigation';

export default class App extends React.Component {
  render() {
    return <RootStack/>
  }
}

const RootStack = createStackNavigator(
  {
  // Home: FormComponent,
  Details: DetailComponent,
  },
  {
    headerMode: 'none'
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f43',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
