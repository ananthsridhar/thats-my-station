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

  render(){
    return (
      <View style={{flex:3,borderRadius:20,borderColor:"green",borderWidth:5,overflow: 'hidden',margin:20,marginTop:0}}>
            <Mapbox.MapView
                      styleURL={Mapbox.StyleURL.Dark}
                      zoomLevel={13}
                      style={{flex:1}}
                      showUserLocation={true}
                      userTrackingMode={3}
                      pitch= {60}
                      pitchWithRotate= {false}
                      dragRotate= {false}
                      touchZoomRotate = {false}
                      >
          </Mapbox.MapView>

      </View>
  );
  }
}
