import stationData from "../resources/stationData.json";
import * as Properties from "../resources/properties.js";

const utilityFunctions = {
  getDistanceInKm(coord1, coord2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(coord2[1] - coord1[1]); // deg2rad below
    var dLon = this.deg2rad(coord2[0] - coord1[0]);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1[1])) *
      Math.cos(this.deg2rad(coord2[1])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    // console.log("Dist : "+d);
    return d;
   
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  getStation(station_id) {
    let fromStation = "";
    for (let i = 0; i < stationData.length; i++) {
      if (stationData[i].id == station_id) {
        fromStation = stationData[i];
        return fromStation;
      }
    }
  },

  setToStations(line_no) {
    let toDd = [];
    stationData.map((station, id) => {
      if (station.line_no == line_no) {
        toDd.push(station);
      }
    });
    return toDd;
  },

  getStationsInLine(line_no) {
    let stations = [];
    stations = stationData.filter(stn => (stn.line_no = line_no));
    return stations;
  },

  getNearestStation(currentPostion,stationsList) {
    let dist = 999.99;
    let stations = arguments.length==2?stationsList:stationData;
    let nearest = stations[0];
    stations.map((station, id) => {
      thisDist = this.getDistanceInKm(currentPostion, station.coordinates);
      if (dist > thisDist) {
        nearest = station; dist = thisDist;
      }
    })
    return nearest;
  },

  getStationsBetween(from, to) {
    let stations = this.getStationsInLine(to.line_no);
    let stationsBetween = stations.filter((stn) => {
      if (from.pos_in_line < to.pos_in_line) {
        return (stn.pos_in_line > from.pos_in_line && stn.pos_in_line < to.pos_in_line)
      }
      else {
        return (stn.pos_in_line < from.pos_in_line && stn.pos_in_line > to.pos_in_line)
      }
    });
    return stationsBetween;
  },


  //Return travel time in seconds between two given stations
  getTotalTravelTime(from, to) {
    var dist = this.getDistanceInKm(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );
    var totalTime =
      (Properties.STATION_HALT_TIME + Properties.TIME_BETWEEN_STATIONS) *
      this.getStationsBetween(from, to).length +
      Properties.TIME_BETWEEN_STATIONS / 2;
    console.log(totalTime/60 + " m");
    return totalTime;
  },

  getNextStation(from,to,currentPostion){
    //Get array of stations in line
    let stations = this.getStationsBetween(from,to);
    stations.filter(station => JSON.stringify(station) === JSON.stringify(from) ).filter(station => JSON.stringify(station) === JSON.stringify(to));
    let nextStation = this.getNearestStation([currentPostion.coords.longitude,currentPostion.coords.latitude], stations);
    // console.log("The Dist : "+this.getDistanceInKm([currentPostion.coords.longitude,currentPostion.coords.latitude],nextStation.coordinates))
    return nextStation;
  },

  //Mock Station Data
  getAllData() {
    var fromDd = [];
    console.log("Called Station Data Retrieval");
    fetch("https://my.api.mockaroo.com/station_data.json?key=41b13700")
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({
          stationData: data,
          fromStations: data
        });
      });
  },

  scriptImportTester() {
    console.log("Script imported");
  }
};

export default utilityFunctions;
