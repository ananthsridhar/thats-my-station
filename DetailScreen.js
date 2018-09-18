import React from 'react';
import { Alert,Button,StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Icon ,Overlay } from 'react-native-elements';
import MapComponent from './MapComponent.js';

export default class DetailScreen extends React.Component {

  constructor(){
    super();
    this.onPressGoBack = this.onPressGoBack.bind(this);
  }

  onPressGoBack(){
    Alert.alert("Going Back");
  }

  render(){
    const { navigation } = this.props;
    const origin = navigation.getParam('fromStation',{station_name:'Unset'});
    const destination = navigation.getParam('toStation',{station_name:'Unset'})
    return (
        <View style={styles.mainContainer}  >
            <DetailComponent origin={origin} dest={destination} style={{flex:2,padding:20}}/>
            <MapComponent />
            <View style={{flex:1,backgroundColor:'blue'}}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onPressGoBack}
            >
              <Text> Go Back </Text>
            </TouchableOpacity>
            </View>
          </View>
  );
  }
}


class DetailComponent extends React.Component {

  constructor(){
    super();
  }

  componentDidMount(){
    //this.getAllData();
  }

  render() {
    const origin = this.props.origin;
    const destination = this.props.dest;
  return(
    <View style={styles.container}>
      <View style={{flex:1}}>
        <View style={{flex:1,flexDirection:'row'}}>
            <DisplayField color="white" text={"From " + origin.station_name} fSize={20} />
            <DisplayField color="white" text={"To "+ destination.station_name} fSize={20} />
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
            <DisplayField color="white" text="11:00" fSize={20} />
            <ProgressComponent color="blue" progress={80} />
        </View>
      </View>

    </View>);

  }
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
      <View style={{flex:1,height:50,flexDirection: 'row'}}>
        <Text style={style}>{this.props.text}</Text>
      </View>
    );
  }
}

class ProgressComponent extends React.Component {
  render() {
    const style = {
      backgroundColor: this.props.color,
      flex: this.props.progress*0.01,
      borderRadius:10,
      height : 50
    };
    return (
      <View style={{flex:1,flexDirection: 'row', backgroundColor: "white",borderRadius:10,height : 50 }}>
        <View style={style} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding : 40,
    flex: 1
  },
  button: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    // backgroundColor: '#DDDDDD',
    padding: 5,
    borderRadius: 50
  },
  mainContainer :{
    flex:1,
    padding:20,
    backgroundColor: '#f43'
  }
});
