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
var { height, width } = Dimensions.get('window');
// const POLLING_INTERVAL = 5 * 1000;

export default class DetailScreen extends React.Component {
  constructor() {
    super();
    this.onPressGoBack = this.onPressGoBack.bind(this);
    this.getCurrentLocationDistance = this.getCurrentLocationDistance.bind(
      this
    );
    this.switchToNextStation = this.switchToNextStation.bind(this)
    this.getProgressMade = this.getProgressMade.bind(this);
    this.arrivalSetup = this.arrivalSetup.bind(this);
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
    //console.log("Mounted");
    // console.log(utilityFunctions.getNearestStation([80.271959, 13.052202]));
    const { navigation } = this.props;
    var orig = navigation.getParam("fromStation", { name: "Unset" });
    var dest = navigation.getParam("toStation", { name: "Unset" });
    this.setState({
      origin: orig,
      destination: dest,
      currentStation: orig,
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
        return {
          timerValue: prevState.timerValue++,
          timeLeft: prevState.timeLeft - prevState.timerValue
        }
      },
      () => {
        this.state.timerValue % Properties.POLLING_INTERVAL === 0
          ? this.getCurrentLocationDistance()
          : null;
      }
    );
  }


  //NOTES : Implement such that timer starts only when speed > 0, one time, when leaving origin station
  getCurrentLocationDistance() {
    navigator.geolocation.getCurrentPosition(pos => {
      // console.log("Recieved Location : ");
      // console.log(pos.coords);
      let nextStation = utilityFunctions.getNextStation(this.state.currentStation, this.state.destination, pos);
      // console.log(nextStation);

      //console.log(this.state.timeLeft);
      let distToNext = utilityFunctions.getDistanceInKm([pos.coords.latitude, pos.coords.longitude], nextStation.coordinates);
      // console.log(distToNext);
      nextStation = distToNext < 0.2 ? this.switchToNextStation(nextStation) : this.state.currentStation;
      this.setState(state => {
        return {
          distanceToDest: utilityFunctions.getDistanceInKm(
            [pos.coords.latitude, pos.coords.longitude],
            state.destination.coordinates
          ),
          currentPosition: pos.coords,
          currentStation: nextStation
        }
      });
      AlarmNotification.showNotification(this.formatTimeLeft() + "remaining " +
        this.state.origin.name + " TO " + this.state.destination.name);
    });
  }

  arrivalSetup() {
    console.log("Destination!");
    AlarmNotification.cancelNotification();
    AlarmNotification.showAlarmNotification();
    this.setState({
      timeLeft: 0
    })
    clearInterval(this.state.locTimer);
  }

  switchToNextStation(next) {

    if (next.name === this.state.destination.name) {
      this.arrivalSetup();
    }
    else {
      console.log("Switching");
      this.setState(state => {
        return {
          timeLeft: utilityFunctions.getTotalTravelTime(next, state.destination)
        }
      })
    }
    return next;
  }

  formatTimeLeft() {
    return Math.floor(this.state.timeLeft / 60) + ':' + (this.state.timeLeft % 60 < 10 ? '0' + (this.state.timeLeft % 60) : this.state.timeLeft % 60);
  }

  getProgressMade() {
    let progress = 0
    if (this.state.currentStation != undefined) {
      let total = utilityFunctions.getStationsBetween(this.state.origin, this.state.destination).length;
      let present = utilityFunctions.getStationsBetween(this.state.origin, this.state.currentStation).length;
      progress = (present / total) * 100;
    }
    return progress;
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
    let current = this.state.currentStation;
    return (

      <View style={styles.mainContainer}>
        <MapComponent
          origin={navigation.getParam("fromStation", { name: "Unset" })}
          destination={navigation.getParam("toStation", { name: "Unset" })}
        ></MapComponent>
        <DetailComponent
          origin={origin}
          dest={destination}
          current={current}
          timeLeft={this.formatTimeLeft()}
          progressMade={this.getProgressMade()}
        />
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
  constructor(props) {
    super(props);
    this.state = {
      currentStation: props.current
    }
  }

  componentDidMount() {
    //this.getAllData();
    // console.log(this.props.current.name);
    // console.log(this.props.current);
  }

  render() {
    const origin = this.props.origin;

    const currName = this.props.current || { name: '' };
    const destination = this.props.dest;
    return (
      // <View style={{flex:1,justifyContent:"flex-start"}}>

      //   <View style={{height:height*0.1,width:width*0.8,backgroundColor:'black',alignSelf:"center",borderBottomLeftRadius:25,borderBottomRightRadius:25}}>
      //       <View style={{flex:0.5,backgroundColor:'green',borderBottomLeftRadius:25,borderBottomRightRadius:25}} />
      //       <View style={{position:"absolute",flexDirection:"row",alignContent:"center",justifyContent:"space-between",height:height*0.095,width:width*0.78,backgroundColor:'yellow',alignSelf:"center",borderBottomLeftRadius:25,borderBottomRightRadius:25}}>
      //         <Text>Chennai</Text>
      //         <Text>Cheskldhasj</Text>
      //       </View>
      //   </View>

      // </View>
      <View style={styles.displayContainer}>
        <View style={{ flex: 1 }}>

          <View style={{
            borderColor: "#9EA3B0",
            borderWidth: 5,
            borderStyle: "solid",
            flex: 1, alignItems: 'stretch',
            backgroundColor: '#0D1F2D'
          }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly' }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DisplayField color="white" text={origin.code} fSize={30} style={{ flex: 1, alignItems: 'center' }} />
                <DisplayField color="white" text={origin.name} fSize={12} style={{ flex: 1, alignItems: 'center' }} />
                {/* <DisplayField
                color="white"
                text={" Via "+currName.code}
                fSize={15}
              /> */}
              </View>
              <DisplayField color="white" text={'TO'} fSize={15} style={{ flex: 1, alignItems: 'center' }} />
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DisplayField
                  color="white"
                  text={destination.code}
                  fSize={30}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                />
                <DisplayField
                  color="white"
                  text={destination.name}
                  fSize={10}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                />
              </View>
            </View>
            <ProgressBarComponent color="green" progress={this.props.progressMade}></ProgressBarComponent>
          </View>
          {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <ProgressComponent color="blue" progress={80}>

            </ProgressComponent>
            <View style={{
              flex: 1, flexDirection: "row",
              position: "absolute", alignSelf: "center", justifyContent: "center", alignContent: "space-between",
              backgroundColor: 'grey',
              borderRadius: 50, paddingLeft: 40, paddingRight: 40,
              height: 40
            }}>
              <DisplayField color="white" text={origin.name} fSize={15} />
              <View></View>
              <DisplayField
                color="white"
                text={"To " + destination.name}
                fSize={15}
              />
            </View>
          </View> */}
          <View
            style={{
              width: width * 0.3, height: 80,
              backgroundColor: 'green',
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}>
            <DisplayField color="white" text={this.props.timeLeft} fSize={20} />
            {/* <ProgressComponent color="blue" progress={80} /> */}
          </View>
        </View>
      </View >
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
      fontSize: this.props.fSize
    };
    return (
      <View style={{}}>
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

class ProgressBarComponent extends React.Component {
  render() {
    const style = {
      backgroundColor: this.props.color,
      flex: this.props.progress * 0.01

    };
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          height: 10
        }}
      >
        <View style={style} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  displayContainer: {
    padding: 10,
    flex: 1,
    elevation: 2
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
    padding: 10,
    paddingBottom: 20
  },
  detailContainer: {
    // 10px outset 
    borderColor: "#90dae5",
    borderWidth: 10,
    borderStyle: "solid",
  }
});
