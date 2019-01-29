import React from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Picker,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import { Icon, Overlay } from "react-native-elements";
import stationData from "../resources/stationData.json";

var { height, width } = Dimensions.get('window');

export default class OverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stationList: stationData,
      modalVisible: this.props.modalVisible,
      stationSearch: ""
    };
    this.selectedItemReturn = this.selectedItemReturn.bind(this);
    this.filterStationList = this.filterStationList.bind(this);
    this.onSearchBarChange = this.onSearchBarChange.bind(this);
  }

  selectedItemReturn(sid) {
    this.setState({
      stationList: this.props.modalData,
      stationSearch: ""
    });
    this.props.modalClose();
    this.props.itemSelected(sid);
  }

  filterStationList() {
    let stn = this.state.stationSearch;

      console.log("changing search bar with "+stn);
    //console.log("filterStationList with "+stn);
    let tempList = this.props.modalData;
    tempList = tempList.filter(station =>{
      return station.name.toLowerCase().includes(stn);
    });
    this.setState({
      stationList: tempList
    });
    // console.log(tempList);
  }

  onSearchBarChange(stationText) {
    this.setState(
      {
        stationSearch: stationText.toLowerCase()
      },
      () => {
        this.filterStationList();
      }
    );
  }

  render() {
    let stations = this.state.stationSearch != "" ? this.props.modalData : "";
    return (
      <Overlay
      overlayStyle={{height:height*0.8,backgroundColor:"#0D1F2D",paddingLeft:20,paddingRight:20}}
        isVisible={this.props.modalVisible}
        onBackdropPress={() => this.props.modalClose()}
      >
        <View style={{ backgroundColor: "black",height:height*0.75,borderColor:"grey"}}>
          <TextInput
            style={{ height: 60,color:"white",padding:10,borderBottomColor:"#0D1F2D",borderBottomWidth:10,elevation:2,fontSize:15}}
            placeholder="Search For Stations..."
            placeholderTextColor={"white"}
            onChangeText={text => this.onSearchBarChange(text)}
          />
          <ScrollView style={{elevation:2}}
          snapToInterval={50}
          decelerationRate="fast"
          snapToAlignment="start">
              <Text style={{ height: 35,color:"white",padding:8,borderBottomColor:"white",borderBottomWidth:2,fontStyle:'italic' }}>Recommended Stations</Text>
              <TouchableListItem
                  key={999}
                  sid="999"
                  text="Random Nearest"
                  selectItem={this.selectedItemReturn}
                />
                <Text style={{ height: 35,color:"white",padding:8,borderBottomColor:"white",borderBottomWidth:2,borderTopColor:"white",borderTopWidth:2,fontStyle:'italic'  }}>All Stations</Text>
            {this.state.stationList.map((data, id) => {
              
              return (
                <TouchableListItem
                  key={id}
                  sid={data.id}
                  text={data.name.toUpperCase()}
                  selectItem={this.selectedItemReturn}
                />
              );
            })}
          </ScrollView>
        </View>
      </Overlay>
    );
  }
}

class TouchableListItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          height:50,
          backgroundColor: "black",          
          padding: 10,
          borderBottomWidth: 0.7,
          borderBottomColor: "#d6d7da",
          justifyContent:"center"
        }}
        onPress={() => this.props.selectItem(this.props.sid)}
      >
        <Text style={{color : "white",fontSize:14}}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}
