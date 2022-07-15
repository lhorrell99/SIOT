import QueryAPI from "./QueryAPI.js";
import { buildIncidentURL, buildFlowURL } from "./utils.js";
import config from "./config.js";
import QueryDB from "./QueryDB.js";

class TrafficFlowService {
  constructor(locData) {
    this.data = locData;
  }

  populate() {
    const URL = buildFlowURL(config.tomtomApiKey, this.data.lat, this.data.lon);
    return QueryAPI.fetchJSON(URL).then((json) => this.assign(json));
  }

  assign(json) {
    this.data = { ...this.data, ...json.flowSegmentData };
  }

  push() {
    QueryDB.createTrafficFlowDoc(this.data);
  }
}

class TrafficIncidentService {
  constructor(locData) {
    this.data = locData;
    this.data.delta = 0.0001; // sets the size of bounding box for incident search area
  }

  populate() {
    const URL = buildIncidentURL(
      config.tomtomApiKey,
      this.data.lat,
      this.data.lon,
      this.data.delta
    );
    return QueryAPI.fetchJSON(URL).then((json) => this.assign(json));
  }

  assign(json) {
    if (!json.incidents.length) {
      // no incidents found
      this.data.incident = false;
      return;
    }
    this.data.incident = true;
    this.data = { ...this.data, ...json.incidents[0].properties };
  }

  push() {
    if (this.data.incident) {
      // log incident info to database
      QueryDB.createTrafficIncidentDoc(this.data);
    }
  }
}

export { TrafficFlowService, TrafficIncidentService };
