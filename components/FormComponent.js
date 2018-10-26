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
  PermissionsAndroid
} from "react-native";
import { Icon, Overlay } from "react-native-elements";
import OverlayComponent from "./OverlayComponent.js";

import station_data from "../resources/stationData.json";
import utilityFunctions from "../scripts/utilities.js";
import AlarmNotification from "../native_modules/AlarmNotification"
import ToastExample from "../native_modules/ToastModule";

export default class FormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      modalData: [],
      whichModal: "",
      fromStation: "",
      toStation: "",
      stationData: station_data,
      fromStations: [...new Set(station_data)],
      toStationList: ""
    };
    this.onPress = this.onPress.bind(this);
    this.setStation = this.setStation.bind(this);
    this.onPressGo = this.onPressGo.bind(this);
    //console.log(station_data[0].name);
  }

  componentDidMount() {
    //this.getAllData();
    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ],
      {
        title: "Give Location Permission",
        message: "App needs location permission to find your position."
      }
    )
      .then(granted => {
        // console.log(granted);
        Promise.resolve();
      })
      .catch(err => {
        // console.warn(err);
        Promise.reject(err);
      });
  }

  onPress(e) {
    //console.log(e);
    AlarmNotification.show('AWESOEM!',AlarmNotification.SHORT);
    if (e === "from") {
      this.setState({
        modalData: this.state.stationData,
        whichModal: "from",
        modalVisible: true
      });
    } else {
      if (this.state.fromStation === "") {
        Alert.alert(
          "Select From First",
          "You have to first select the Origin before selecting Destination",
          [{ text: "Okay", onPress: () => console.log("PressedOkay") }]
        );
      } else {
        this.setState({
          modalData: this.state.toStations,
          whichModal: "to",
          modalVisible: true
        });
      }
    }
  }

  setStation(stationId) {
    // console.log("Form Component" + stationId);
    let theStation = utilityFunctions.getStation(stationId);
    if (this.state.whichModal === "from") {
      let toL = utilityFunctions.setToStations(theStation.line_no);
      this.setState({
        fromStation: theStation,
        toStation: "",
        toStations: toL
      });
    } else {
      this.setState({
        toStation: theStation
      });
    }
  }

  onPressGo() {
    if (this.state.fromStation != "" && this.state.toStation != "") {
      this.props.navigation.navigate("Details", {
        fromStation: this.state.fromStation,
        toStation: this.state.toStation
      });
    } else {
      Alert.alert("Select Stations First");
    }
  }

  render() {
    let modalData = this.state.modalData;
    return (
      <View style={styles.container}>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "powderblue"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Hello</Text>
          </View>
          <View style={{ flex: 1, padding: 40 }}>
            <View style={{ padding: 40 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onPress("from")}
                name="from"
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text>
                    {" "}
                    {this.state.fromStation == ""
                      ? "SELECT ORIGIN"
                      : this.state.fromStation.name}{" "}
                  </Text>
                  <Icon name="rowing" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 40 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onPress("to")}
                name="to"
              >
                <Text>
                  {" "}
                  {this.state.toStation == ""
                    ? "SELECT DESTINATION"
                    : this.state.toStation.name}{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={this.onPressGo} title="Go" color="#841584" />
          </View>
        </View>
        <OverlayComponent
          modalVisible={this.state.modalVisible}
          modalData={this.state.modalData}
          modalClose={() =>
            this.setState(prevState => ({
              modalVisible: !prevState.modalVisible
            }))
          }
          itemSelected={this.setStation}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f43",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    alignItems: "center",
    // backgroundColor: '#DDDDDD',
    padding: 5,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#d6d7da"
  }
});
