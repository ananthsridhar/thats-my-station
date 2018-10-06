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
    // console.log("Select "+sid);
  }

  filterStationList() {
    let stn = this.state.stationSearch;

      console.log("changing search bar with "+stn);
    //console.log("filterStationList with "+stn);
    let tempList = this.props.modalData;
    tempList = tempList.filter(function(station) {
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
        isVisible={this.props.modalVisible}
        onBackdropPress={() => this.props.modalClose()}
      >
        <View style={{ padding: 40, backgroundColor: "yellow", height: 400 }}>
          <TextInput
            style={{ height: 40 }}
            placeholder="Search Bar"
            onChangeText={text => this.onSearchBarChange(text)}
          />
          <ScrollView>
            {this.state.stationList.map((data, id) => {
              return (
                <TouchableListItem
                  key={id}
                  sid={data.id}
                  text={data.name}
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
          backgroundColor: "green",
          padding: 10,
          borderWidth: 0.5,
          borderColor: "#d6d7da"
        }}
        onPress={() => this.props.selectItem(this.props.sid)}
      >
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}
