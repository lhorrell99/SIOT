import Ajax from "./ajax.js";
import Plot from "./plot.js";

const UI = Object.create(null);
const el = (id) => document.getElementById(id);

const state = {
  session: 10, // stores current session (initialised to 10 because its the most interesting)
  lastSession: null, // stores the value of the last session in the data
  data: null, // stores the whole data
  sessionData: null, // stores the current session data
};

const getLastSession = function () {
  // returns the highest session from the processed data
  const sessionArr = state.data.map((o) => o.sessionNo);
  state.lastSession = Math.max(...sessionArr);
};

const updateSessionData = function () {
  state.sessionData = state.data.filter((o) => o.sessionNo === state.session);
};

const onDataLoad = function (data) {
  state.data = data;
  getLastSession();
  UI.refresh();
};

const incrementSession = function () {
  if (state.session === state.lastSession) {
    // wrap around
    state.session = 0;
  } else {
    state.session++;
  }
  // refresh UI
  UI.refresh();
};

const decrementSession = function () {
  if (!state.session) {
    // wrap around
    state.session = state.lastSession;
  } else {
    state.session--;
  }
  // refresh UI
  UI.refresh();
};

UI.refresh = function () {
  // refresh UI contents
  updateSessionData();
  el("currentSessionLabel").textContent = state.session;
  Plot.sessionMap("sessionMapPlotPM", state.sessionData, "PM");
  Plot.sessionMap("sessionMapPlotTF", state.sessionData, "TF");
  Plot.timeSeriesPMDF("timeSeriesPMDF", state.sessionData);
};

UI.init = function () {
  // assign onclicks
  el("incrementSession").onclick = incrementSession;
  el("decrementSession").onclick = decrementSession;
  // load data
  Ajax.query("/download/processeddata").then(onDataLoad).catch(console.log);
};

export default Object.freeze(UI);
