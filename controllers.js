import QueryDB from "./QueryDB.js";
import { parseSensorData, parseLocData } from "./utils.js";
import { TrafficFlowService, TrafficIncidentService } from "./services.js";

const controllers = Object.create(null);

controllers.onMQTT = function (topic, message) {
  console.log("received MQTT");
  const timestamp = Date.now();
  if (topic === "sensors") {
    // write data to db
    const sensorData = parseSensorData(message);

    QueryDB.createPMSensorDoc(sensorData);
  }

  if (topic === "loc") {
    const locData = parseLocData(message);

    // traffic flow data
    const trafficFlow = new TrafficFlowService(locData);
    trafficFlow
      .populate()
      .then(() => trafficFlow.push())
      .catch(console.log);

    // traffic incidents data
    const trafficIncident = new TrafficIncidentService(locData);
    trafficIncident
      .populate()
      .then(() => trafficIncident.push())
      .catch(console.log);
  }
};

controllers.download = function (req, res) {
  switch (req.params.collection) {
    case "pmsensors":
      QueryDB.getPMSensorDocs()
        .then((data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        })
        .catch(console.log);
      break;

    case "trafficflows":
      QueryDB.getTrafficFlowDocs()
        .then((data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        })
        .catch(console.log);
      break;

    case "trafficincidents":
      QueryDB.getTrafficIncidentDocs()
        .then((data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        })
        .catch(console.log);
      break;

    case "processeddata":
      QueryDB.getProcessedDataDocs()
        .then((data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        })
        .catch(console.log);
      break;

    default:
      res.send("database collection not found...");
  }
};

export default Object.freeze(controllers);
