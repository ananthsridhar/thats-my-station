import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormComponent from './FormComponent.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MainContainer/>
        </View>
    );
  }
}

class MainContainer extends React.Component {
   render(){
     return (
       <View style={{flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',}}>
        <FormComponent/>
     </View>
     )
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f43',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
