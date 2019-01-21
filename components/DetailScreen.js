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
  BackHandler
} from "react-native";
import { Icon, Overlay } from "react-native-elements";
import MapComponent from "./MapComponent.js";
import utilityFunctions from "../scripts/utilities.js";
import * as Properties from "../resources/properties.js";
import AlarmNotification from "../native_modules/AlarmNotification";

const POLLING_INTERVAL = 5 * 1000;

export default class DetailScreen extends React.Component {
  constructor() {
    super();
    this.onPressGoBack = this.onPressGoBack.bind(this);
    this.getCurrentLocationDistance = this.getCurrentLocationDistance.bind(
      this
    );
    this.state = {
      origin: {
        id: 2,
        name: "Chennai Beach",
        line_no: 2,
        pos_in_line: 0,
        latitude: 13.092253,
        longitude: 80.292397,
        coordinates: [80.292397, 13.092253]
      },
      destination: {
        id: 4,
        name: "Chennai Beach",
        line_no: 2,
        pos_in_line: 0,
        latitude: 13.092253,
        longitude: 80.292397,
        coordinates: [80.292397, 13.092253]
      },
      timeLeft: 0,
      timerValue: 0
    };
    utilityFunctions.scriptImportTester();
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onPressGoBack);
    console.log("Mounted");
    console.log(utilityFunctions.getNearestStation([80.271959, 13.052202]));
    const { navigation } = this.props;
    var orig = navigation.getParam("fromStation", { name: "Unset" });
    var dest = navigation.getParam("toStation", { name: "Unset" });
    this.setState({
      origin: orig,
      destination: dest,
      distanceToDest: utilityFunctions.getDistanceInKm(
        orig.coordinates,
        dest.coordinates
      ),
      timeLeft: utilityFunctions.getTotalTravelTime(orig, dest)
    });
    //Initially find out how far to destination
    this.getCurrentLocationDistance();
    //Run function to poll location every five seconds
    this.distanceIntervaledPing();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onPressGoBack);
    clearInterval(this.state.locTimer);
  }
  distanceIntervaledPing() {
    let timer = setInterval(() => {
      this.tick();
    }, 1000);
    this.setState({
      locTimer: timer
    });
  }

  tick() {
    // console.log(this.state.timerValue);
    this.setState(
      (prevState, props) => {
        timerValue: prevState.timerValue++;
      },
      () => {
        this.state.timerValue % 5 === 0
          ? this.getCurrentLocationDistance()
          : null;
      }
    );
  }

  getCurrentLocationDistance() {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log("Recieved Location : " + pos.coords.latitude);
      //console.log(this.state.timeLeft);
      this.setState({
        distanceToDest: utilityFunctions.getDistanceInKm(
          [pos.coords.longitude, pos.coords.latitude],
          this.state.destination.coordinates
        ),
        currentPosition: pos.coords
      });
      AlarmNotification.showNotification(this.state.origin.name + " TO " + this.state.destination.name);
    });
  }

  onPressGoBack() {
    Alert.alert(
      "Cancel Alarm?",
      "This will cancel your currently running Alarm",
      [
        {
          text: "Schnapp,Cancel",
          onPress: () => console.log("cancel"),
          style: "cancel"
        },
        { text: "Yeah,Cool", onPress: () => { AlarmNotification.cancelNotification(); this.props.navigation.goBack(); } }
      ]
    );
    // this.props.navigation.goBack();
    return true;
  }

  render() {
    const { navigation } = this.props;
    let origin = this.state.origin;
    let destination = this.state.destination;

    return (

      <View style={styles.mainContainer}>
        <MapComponent
          origin={navigation.getParam("fromStation", { name: "Unset" })}
          destination={navigation.getParam("toStation", { name: "Unset" })}
        ></MapComponent>
        <View style={{ flex: 1 }}>
          <DetailComponent
            origin={origin}
            dest={destination}
            timeLeft={this.state.timeLeft}
          />
        </View>
        <View style={{ flex: 2, justifyContent: "flex-end" }}>
          <TouchableOpacity style={styles.button} onPress={this.onPressGoBack}>
            <Text> Go Back </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

class DetailComponent extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    //this.getAllData();
  }

  render() {
    const origin = this.props.origin;
    const destination = this.props.dest;
    return (
      <View style={styles.displayContainer}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <DisplayField color="white" text={origin.name} fSize={15} />
            <DisplayField
              color="white"
              text={"To " + destination.name}
              fSize={15}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <ProgressComponent color="blue" progress={80}>

            </ProgressComponent>
            <View style={{
              flex: 1, flexDirection: "row",
              position: "absolute", alignSelf: "center", justifyContent: "center", alignContent: "space-between",
              backgroundColor: 'grey',
              borderRadius: 50, paddingLeft: 40,paddingRight: 40,
              height: 40
            }}>
                <DisplayField color="white" text={origin.name} fSize={15} />
                <DisplayField
                  color="white"
                  text={"To " + destination.name}
                  fSize={15}
                />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <DisplayField color="white" text={this.props.timeLeft} fSize={20} />
            <ProgressComponent color="blue" progress={80} />
          </View>
        </View>
      </View>
    );
  }
}

class DisplayField extends React.Component {
  constructor() {
    super();
  }

  render() {
    const style = {
      flex:1,
      color: this.props.color,
      fontSize: this.props.fSize,
      marginLeft: 10
    };
    return (
      <View style={{ flex: 1, height: 50, flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
        <Text style={style}>{this.props.text}</Text>
      </View>
    );
  }
}

class ProgressComponent extends React.Component {
  render() {
    const style = {
      backgroundColor: this.props.color,
      flex: this.props.progress * 0.01,
      borderRadius: 50

    };
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 50,
          height: 50
        }}
      >
        <View style={style} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  displayContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: 'rgba(157, 162, 175, 0.89)'
  },
  button: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E55C52',
    padding: 2,
    borderRadius: 50,
    marginBottom: 5
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f43"
  }
});
