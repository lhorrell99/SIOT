import PMSensor from "./models/PMSensor.js";
import TrafficIncident from "./models/TrafficIncident.js";
import TrafficFlow from "./models/TrafficFlow.js";
import ProcessedData from "./models/ProcessedData.js";

const onCreateResponse = function (error, data) {
  if (error) {
    return console.log(error);
  }
  return data; // return newly created doc
};

const buildCreateDoc = function (Model) {
  return function (data) {
    const instance = new Model(data);
    instance.save(onCreateResponse);
  };
};

const buildGetDocs = function (Model) {
  return function () {
    return new Promise(function (resolve, reject) {
      Model.find({}, function (error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    });
  };
};

const QueryDB = Object.create(null);

QueryDB.createPMSensorDoc = buildCreateDoc(PMSensor);
QueryDB.createTrafficIncidentDoc = buildCreateDoc(TrafficIncident);
QueryDB.createTrafficFlowDoc = buildCreateDoc(TrafficFlow);
QueryDB.createProcessedDataDoc = buildCreateDoc(ProcessedData);

QueryDB.getPMSensorDocs = buildGetDocs(PMSensor);
QueryDB.getTrafficIncidentDocs = buildGetDocs(TrafficIncident);
QueryDB.getTrafficFlowDocs = buildGetDocs(TrafficFlow);
QueryDB.getProcessedDataDocs = buildGetDocs(ProcessedData);

export default Object.freeze(QueryDB);
