import React from 'react';
import { StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Overlay } from 'react-native-elements';

export default class FormComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      modalVisible : false,
      modalData : [],
      whichModal : "",
      fromStation : "",
      toStation:"",
      stationData : "",
      fromStationList : "",
      toStationList : ""
    }
    this.onPress = this.onPress.bind(this);
    this.setStation = this.setStation.bind(this);
  }

  componentDidMount(){
    this.getAllData();
  }

  onPress(e){
    console.log(e);
    if(e==="from")
    {
      this.setState({
        modalData : this.state.stationData,
        whichModal : "from"
      })
    }
    else {
      this.setState({
        modalData : this.state.toStations,
        whichModal : "to"
      })
    }
    this.setState({
      modalVisible : true
    })
  }

  setStation(stationId){
    console.log("Form Component" + stationId);
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
    else {
        this.setState({
          toStation : theStation
        })
      }
  }

  render() {

    let modalData = this.state.modalData;
    return (
      <View>
        <View style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor: 'powderblue'}} >
          <View style={{padding:40}}>
            <Text>Hello</Text>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('from')}
                name="from"
              >
                <Text> {this.state.fromStation==""?"Touch Here":this.state.fromStation.station_name} </Text>
              </TouchableOpacity>
            </View>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('to')}
                name="to"
              >
                <Text> {this.state.toStation==""?"Touch Here":this.state.toStation.station_name} </Text>
              </TouchableOpacity>
            </View>
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
        // data.map((station, id) => {
        //   //console.log(station.station_name);
        //   fromDd.push(
        //     <option value={station.id} key={id}>
        //       {station.station_name} {station.line_no}
        //     </option>
        //   );
        // });
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

class OverlayComponent extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      modalVisible : this.props.modalVisible
    }
    this.selectedItemReturn = this.selectedItemReturn.bind(this);
  }

selectedItemReturn(sid){
    this.props.modalClose();
    this.props.itemSelected(sid)
        console.log("Select "+sid);
  }

  render(){
    return (
      <Overlay isVisible={this.props.modalVisible}
      onBackdropPress={() => this.props.modalClose()}>
        <View style={{padding : 40,backgroundColor:'yellow',height:400}}>
          <ScrollView>
            {    this.props.modalData.map((data,id)=>{
                  return (
                    <TouchableListItem key={id} sid={data.id} text={data.station_name} selectItem={this.selectedItemReturn}/>
                  )
              })
            }
          </ScrollView>
        </View>
      </Overlay>
    );
  }

}


class TouchableListItem extends React.Component {
  render(){
    return (
      <TouchableOpacity style={{backgroundColor:'green',padding:10}} onPress={()=>this.props.selectItem(this.props.sid)}>
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}


class PickerComponent extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
    <Picker
      selectedValue="java"
      style={{height: 50}}
      itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17 }}
      >

  <Picker.Item label="JavaScript" value="js" />
</Picker>
);
  }
}

PickerComponent.defaultProps = {
  pickerData : [{
    text:"Default Data",
    value : "default"
  },
  {
    text:"Default Data",
    value : "default"
  }]
}


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5
  }
});
