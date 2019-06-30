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
import { Icon } from 'react-native-elements'
import OverlayComponent from "./OverlayComponent.js";
var { height, width } = Dimensions.get('window');
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
          "You have to select the Origin before selecting Destination",
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
      AlarmNotification.showNotification(this.state.fromStation.name + " TO " + this.state.toStation.name);
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
            backgroundColor: "#0D1F2D"
          }}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: 'white', fontSize: 30 }}>THATS MY STATION</Text>
          </View>
          <View style={{ flex: 1, padding: 20, justifyContent: "space-evenly" }}>
            <View style={{ padding: 20 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onPress("from")}
                name="from"
              >
                <Text style={styles.touchText}>
                  {" "}
                  {this.state.fromStation == ""
                    ? "FROM"
                    : this.state.fromStation.name.toUpperCase()}{" "}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onPress("to")}
                name="to"
              >
                <Text style={styles.touchText}>
                  {" "}
                  {this.state.toStation == ""
                    ? "TO"
                    : this.state.toStation.name.toUpperCase()}{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.goButton}>
            <Button style={{ borderRadius: 50, height: 50 }} onPress={this.onPressGo} title="Go" color="#841584" />
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
    backgroundColor: "#5D737E",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: '#173851',
    padding: 5,
    borderWidth: 2,
    borderBottomColor: "#d6d7da",
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    alignContent: "center",
    alignItems: "center"
  },
  goButton: {
    flex: 1,
    width: width * 0.8,
    height: 50,
    alignSelf: "center",
    justifyContent: "center"
  },
  touchText: {
    color: 'white'
  }
});
