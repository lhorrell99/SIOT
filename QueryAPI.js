import fetch from "node-fetch";

const QueryAPI = Object.create(null);

// query API and parse returned data as JSON
QueryAPI.fetchJSON = function (URL) {
  return fetch(URL).then((res) => res.json());
};

export default Object.freeze(QueryAPI);
