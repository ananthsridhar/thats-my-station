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


export default class DetailScreen extends React.Component {
  constructor() {
    super();
    this.onPressGoBack = this.onPressGoBack.bind(this);
    this.getCurrentLocationDistance = this.getCurrentLocationDistance.bind(this);
    this.state = {
      origin : {
        "id": 2,
        "name": "Chennai Beach",
        "line_no": 2,
        "pos_in_line": 0,
        "latitude": 13.092253,
        "longitude": 80.292397
      },
      destination :{
        "id": 4,
        "name": "Chennai Beach",
        "line_no": 2,
        "pos_in_line": 0,
        "latitude": 13.092253,
        "longitude": 80.292397
      }
    }
    utilityFunctions.scriptImportTester();
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onPressGoBack);
    console.log("Mounted");
    const { navigation } = this.props;
    var orig = navigation.getParam("fromStation", {name: "Unset"});
    var dest =navigation.getParam("toStation", {name: "Unset"}) ;
    this.setState({
      origin : orig,
      destination : dest,
      distanceToDest : utilityFunctions.getDistanceFromLatLonInKm(orig.latitude,orig.longitude,dest.latitude,dest.longitude)
    })
    //Initially find out how far to destination
    this.getCurrentLocationDistance();
    //Run function to poll location every five seconds
    this.distanceIntervaledPing();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onPressGoBack);
   clearInterval(this.state.locTimer);
  }

  distanceIntervaledPing(){
    let timer = setInterval(()=>{this.getCurrentLocationDistance()},POLLING_INTERVAL);
    this.setState({
      locTimer : timer
    })
  }

  getCurrentLocationDistance(){
    navigator.geolocation.getCurrentPosition((pos)=>{
      console.log("Recieved Location : "+pos.coords.latitude);
      this.setState({
        distanceToDest : utilityFunctions.getDistanceFromLatLonInKm(pos.coords.latitude,pos.coords.longitude,this.state.destination.latitude,this.state.destination.longitude)
      });
    })
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
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
        { text: "Yeah,Cool", onPress: () => this.props.navigation.goBack() }
      ]
    );
    // this.props.navigation.goBack();
    return true;
  }

  render() {
    const { navigation } = this.props;
    var origin = this.state.origin;
    var destination =this.state.destination ;
    console.log(this.getDistanceFromLatLonInKm(origin.latitude,origin.longitude,destination.latitude,destination.longitude));
    console.log("State : "+this.state.origin.name+ " "+this.state.destination.name + "distanceToDest : "+this.state.distanceToDest);
    return (
      <View style={styles.mainContainer}>
        <DetailComponent
          origin={origin}
          dest={destination}
          style={{ flex: 2, padding: 20 }}
        />
        <MapComponent origin={navigation.getParam("fromStation", {name: "Unset"})} destination={navigation.getParam("toStation", {name: "Unset"})} />
        <View style={{ flex: 1, backgroundColor: "blue" }}>
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
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <DisplayField color="white" text={origin.name} fSize={15} />
            <DisplayField
              color="white"
              text={"To " + destination.name}
              fSize={15}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <DisplayField color="white" text="11:00" fSize={20} />
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
      color: this.props.color,
      fontSize: this.props.fSize,
      padding: 10
    };
    return (
      <View style={{ flex: 1, height: 50, flexDirection: "row" }}>
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
      borderRadius: 10,
      height: 50
    };
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 10,
          height: 50
        }}
      >
        <View style={style} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#DDDDDD',
    padding: 5,
    borderRadius: 50
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f43"
  }
});
