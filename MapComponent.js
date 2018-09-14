import React from 'react';
import { Alert,Button,StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity, ScrollView } from 'react-native';
import { Icon ,Overlay } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import station_data from './resources/stationData.json';

Mapbox.setAccessToken('pk.eyJ1IjoibmFudGhzcmVlMjIiLCJhIjoiY2psZzZ3enliMTB0czNxcWc5OW82c3VsZCJ9.1OhBvdJmJn5AjBs4w71Luw');

export default class MapComponent extends React.Component {

  constructor(){
    super();

  }

  render(){
    return (
            <Mapbox.MapView
                      styleURL={Mapbox.StyleURL.Dark}
                      zoomLevel={15}
                      centerCoordinate={[11.256, 43.770]}
                      style={{flex:1}}>
          </Mapbox.MapView>
  );
  }
}