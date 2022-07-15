const parseSensorData = function (message) {
  // input: MQTT message (topic: "/sensors")
  // output: timestamped object of PM sensor values
  const msg = message.toString();

  // split string on ","
  const valueArray = msg.split(", ");

  // drop NEO-6M location data (unreliable) and parse as integers
  const pmValues = valueArray.slice(0, 3).map((val) => parseInt(val, 10));

  return {
    timestamp: Date.now(),
    pm1_0: pmValues[0],
    pm2_5: pmValues[1],
    pm10_0: pmValues[2],
  };
};

const parseLocData = function (message) {
  // input: MQTT message (topic: "/loc")
  // output: timestamped location data object
  const data = JSON.parse(message);

  return {
    timestamp: Date.now(),
    lat: data.lat,
    lon: data.lon,
    alt: data.alt,
  };
};

const buildIncidentURL = function (apiKey, lat, lon, delta) {
  // returns query for TOMTOM traffic incidents API
  const round = (val, dp) => Math.round(10 ** dp * val) / 10 ** dp;

  const minLon = round(lon - delta, 6);
  const minLat = round(lat - delta, 6);
  const maxLon = round(lon + delta, 6);
  const maxLat = round(lat + delta, 6);

  return (
    `https://api.tomtom.com/traffic/services/5/incidentDetails` +
    `?key=${apiKey}&bbox=${minLon},${minLat},${maxLon},` +
    `${maxLat}&fields={incidents{properties{iconCategory,` +
    `magnitudeOfDelay,length,delay}}}&language=en-GB&categoryFilter=` +
    `0,1,2,3,4,5,6,7,8,9,10,11,14&timeValidityFilter=present`
  );
};

const buildFlowURL = function (apiKey, lat, lon) {
  // returns query for TOMTOM traffic flow API
  return (
    `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute` +
    `/15/json?key=${apiKey}&point=${lat},${lon}`
  );
};

export { parseSensorData, parseLocData, buildIncidentURL, buildFlowURL };
