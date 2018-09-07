import React from 'react';
import { Alert,Button,StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Icon ,Overlay } from 'react-native-elements';

import station_data from './resources/stationData.json'

export default class DetailComponent extends React.Component {

  constructor(){
    super();

  }

  componentDidMount(){
    //this.getAllData();
  }

  render() {
    const { navigation } = this.props;
    const origin = navigation.getParam('fromStation',{station_name:'Unset'});
    const destination = navigation.getParam('toStation',{station_name:'Unset'})
  return(
    <View style={styles.container}>
      <View style={{flex:1}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
            <DisplayField color="white" text={"From " + origin.station_name} fSize={20} />
            <DisplayField color="white" text={"To "+ destination.station_name} fSize={20} />
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
            <DisplayField color="white" text="TimeLeft" fSize={20} />
            <DisplayField color="white" text="Progress Bar" fSize={20} />
        </View>
      </View>
      <View style={{flex:5,backgroundColor:'blue'}}>
      </View>
    </View>
    );
  }



/*End Utility functions*/

}

class DisplayField extends React.Component {
  constructor() {
    super();
  }

  render() {
    const style = {
      color: this.props.color,
      fontSize: this.props.fSize,
      padding : 10
    };
    return (
      <View>
        <Text style={style}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop : 40,
    flex: 1,
    backgroundColor: '#f43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    // backgroundColor: '#DDDDDD',
    padding: 5,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#d6d7da'
  }
});
