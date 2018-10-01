import React from 'react';
import { Alert,Button,StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Icon ,Overlay } from 'react-native-elements';
import OverlayComponent from './components/OverlayComponent.js'

import station_data from '../resources/stationData.json'

export default class FormComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      modalVisible : false,
      modalData : [],
      whichModal : "",
      fromStation : "",
      toStation:"",
      stationData : station_data,
      fromStations : [...new Set(station_data)],
      toStationList : ""
    }
    this.onPress = this.onPress.bind(this);
    this.setStation = this.setStation.bind(this);
    this.onPressGo = this.onPressGo.bind(this);
    //console.log(station_data[0].name);
  }

  componentDidMount(){
    //this.getAllData();
  }

  onPress(e){
    //console.log(e);
    if(e==="from")
    {
      this.setState({
        modalData : this.state.stationData,
        whichModal : "from",
        modalVisible : true
      })
    }
    else {
      if(this.state.fromStation==="")
      {
        Alert.alert('Select From First','You have to first select the Origin before selecting Destination',[{text: 'Okay', onPress: () => console.log('PressedOkay')}])
      }
      else{
        this.setState({
          modalData : this.state.toStations,
          whichModal : "to",
          modalVisible : true
        })
      }
    }
  }

  setStation(stationId){
    // console.log("Form Component" + stationId);
    let theStation = this.getStation(this.state.stationData,stationId);
    if(this.state.whichModal==="from")
    {
      let toL = this.setToStations(this.state.stationData,theStation.line_no);
      this.setState({
        fromStation : theStation,
        toStation : "",
        toStations : toL
      })
    }
    else
    {
        this.setState({
          toStation : theStation
        })
    }
  }

  onPressGo(){
    console.log("Go!")
    if(this.state.fromStation!="" && this.state.toStation!="")
    {
      console.log("Go2!")
      this.props.navigation.navigate('Details',{
        fromStation : this.state.fromStation,
        toStation : this.state.toStation,
      });
      console.log("Go3!")
    }
    else {
      Alert.alert("Select Stations First");
    }
  }

  render() {

    let modalData = this.state.modalData;
    return (
      <View style={styles.container}>
        <View style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor: 'powderblue'}} >
          <View style={{flex:1}}>
            <Text>Hello</Text>
          </View>
          <View style={{flex :1,padding:40}}>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('from')}
                name="from"
              >
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text> {this.state.fromStation==""?"SELECT ORIGIN":this.state.fromStation.name} </Text><Icon name='rowing'/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('to')}
                name="to"
              >
                <Text> {this.state.toStation==""?"SELECT DESTINATION":this.state.toStation.name} </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:1}}>
          <Button
              onPress={this.onPressGo}
              title="Go"
              color="#841584"
              />
          </View>
        </View>
        <OverlayComponent
        modalVisible={this.state.modalVisible}
        modalData={this.state.modalData}
        modalClose={()=>this.setState((prevState)=>({modalVisible:!prevState.modalVisible}))}
        itemSelected={this.setStation}
        />
      </View>
    );
  }


/*Utility functions to retrieve station data*/


getAllData() {
    var fromDd = [];
    console.log("Called Station Data Retrieval");
    fetch("https://my.api.mockaroo.com/station_data.json?key=41b13700")
      .then(results => {
        //console.log(results.json())
        return results.json();
      })
      .then(data => {
        //console.log(data);
        this.setState({
          stationData: data,
          fromStations : data
        });
      });
  }

  getStation(stationData, station_id) {
    let fromStation = "";
    for (let i = 0; i < stationData.length; i++) {
      if (stationData[i].id == station_id) {
        fromStation = stationData[i];
        return fromStation;
      }
    }
  }

  setToStations(stationData, line_no) {
    let toDd = [];
    stationData.map((station, id) => {
      if (station.line_no == line_no) {
        toDd.push(
          station
        );
      }
    });
    return toDd;
  }




/*End Utility functions*/

}

// class OverlayComponent extends React.Component {
//   constructor(props)
//   {
//     super(props);
//     this.state = {
//       modalVisible : this.props.modalVisible
//     }
//     this.selectedItemReturn = this.selectedItemReturn.bind(this);
//   }
//
// selectedItemReturn(sid){
//     this.props.modalClose();
//     this.props.itemSelected(sid)
//         // console.log("Select "+sid);
//   }
//
//   render(){
//     return (
//       <Overlay isVisible={this.props.modalVisible}
//       onBackdropPress={() => this.props.modalClose()}>
//         <View style={{padding : 40,backgroundColor:'yellow',height:400}}>
//           <ScrollView>
//             {    this.props.modalData.map((data,id)=>{
//                   return (
//                     <TouchableListItem key={id} sid={data.id} text={data.name} selectItem={this.selectedItemReturn}/>
//                   )
//               })
//             }
//           </ScrollView>
//         </View>
//       </Overlay>
//     );
//   }
// }
//
//
// class TouchableListItem extends React.Component {
//   render(){
//     return (
//       <TouchableOpacity style={{backgroundColor:'green',padding:10,borderWidth: 0.5,
//       borderColor: '#d6d7da'}} onPress={()=>this.props.selectItem(this.props.sid)}>
//         <Text>{this.props.text}</Text>
//       </TouchableOpacity>
//     );
//   }
// }


const styles = StyleSheet.create({
  container: {
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
