import React from 'react';
import {PermissionsAndroid} from 'react-native';
import { Alert,Button,StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Icon ,Overlay } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import station_data from './resources/stationData.json';

Mapbox.setAccessToken('pk.eyJ1IjoibmFudGhzcmVlMjIiLCJhIjoiY2psZzZ3enliMTB0czNxcWc5OW82c3VsZCJ9.1OhBvdJmJn5AjBs4w71Luw');

export default class MapComponent extends React.Component {

  constructor(){
    super();
    this.renderStations = this.renderStations.bind(this);
  }

  componentDidMount(){
    PermissionsAndroid.requestMultiple(
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION],
            {
                title: 'Give Location Permission',
            message: 'App needs location permission to find your position.'
        }
    ).then(granted => {
        console.log(granted);
        Promise.resolve();
    }).catch(err => {
        console.warn(err);
        Promise.reject(err);
    });
  }

  stationMarker(station){
    const markerCoordinate = [];
    markerCoordinate.push(station.station_longitude);

    markerCoordinate.push(station.station_latitude);
    console.log(markerCoordinate);
    const markerTitle = station.station_name;

    return (
      <Mapbox.PointAnnotation
      key={station.id}
      id={""+station.id}
      title={markerTitle}
      coordinate={markerCoordinate}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title='Look! An annotation!' />
      </Mapbox.PointAnnotation>
    );
  }

  renderStations(){
    origin = this.props.origin;
    dest = this.props.destination;
    const locations = [];
    locations.push(this.stationMarker(origin));
    locations.push(this.stationMarker(dest));
    console.log(locations);
    return locations;
  }

  updateCameraOverUser(){

  }

  render(){
    return (
      <View style={{flex:3,borderRadius:20,borderColor:"green",borderWidth:5,overflow: 'hidden',margin:20,marginTop:0}}>
            <Mapbox.MapView
                      styleURL={Mapbox.StyleURL.Dark}
                      zoomLevel={13}
                      style={{flex:1}}
                      showUserLocation={true}
                      userTrackingMode={Mapbox.UserTrackingModes.FollowWithHeading}
                      pitch= {60}
                      pitchWithRotate= {false}
                      dragRotate= {false}
                      touchZoomRotate = {false}
                      onUserLocationUpdate = {this.updateCameraOverUser}
                      rotateEnabled={false}
                      pitchEnabled = {false}
                      minZoomLevel = {}
                      maxZoomLevel = {}
                      >
                    {this.renderStations()}
              </Mapbox.MapView>

      </View>
  );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  }
});
