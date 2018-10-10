import stationData from "../resources/stationData.json";

const POLLING_INTERVAL = 5 * 1000;
const STATION_HALT_TIME = 5 * 1000;
const TIME_BETWEEN_STATIONS = 5 * 1000;

const utilityFunctions = {
  getDistanceFromLatLonInKm(coord1,coord2) {
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

  getStationsBetween(from,to){
    let stations = this.getStationsInLine(to.line_no);
    let stationsBetween = stations.filter((stn)=>{
      if(from.pos_in_line<to.pos_in_line)
      {
        return (stn.pos_in_line>from.pos_in_line&&stn.pos_in_line<to.pos_in_line)
      }
      else {
        return  (stn.pos_in_line<from.pos_in_line&&stn.pos_in_line>to.pos_in_line)
      }
    });
    return stationsBetween;
  },

  getTotalTravelTime(from, to) {
    var dist = this.getDistanceFromLatLonInKm(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );
    var totalTime =
      (STATION_HALT_TIME + TIME_BETWEEN_STATIONS) *
        this.getStationsBetween(from,to).length +
      TIME_BETWEEN_STATIONS / 2;
      console.log(totalTime/(100*60)+" m");
      return (totalTime/(100*60)).toFixed(2);
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
