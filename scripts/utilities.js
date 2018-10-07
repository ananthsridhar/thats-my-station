import stationData from "../resources/stationData.json";

const POLLING_INTERVAL = 5 * 1000;
const STATION_HALT_TIME = 5 * 1000;
const TIME_BETWEEN_STATIONS = 5 * 1000;

const utilityFunctions = {
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
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
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
  },

  scriptImportTester() {
    console.log("Script imported");
  }
};

export default utilityFunctions;
