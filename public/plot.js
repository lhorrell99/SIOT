const Plot = Object.create(null);

const getValues = function (data, value) {
  // returns an array of values for a column of the dataframe
  return data.map((o) => o[value]);
};

const getCentrePoint = function (lons, lats) {
  // returns the central point of a pair of coordinate arrays
  const lonCP =
    Math.min(...lons) + 0.5 * (Math.max(...lons) - Math.min(...lons));
  const latCP =
    Math.min(...lats) + 0.5 * (Math.max(...lats) - Math.min(...lats));
  return { lonCP, latCP };
};

const getZoom = function (lons, lats) {
  const maxLon = Math.max(...lons);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const minLat = Math.min(...lats);

  const maxBound = Math.max(maxLon - minLon, maxLat - minLat) * 111;
  const zoom = 14 - Math.log(maxBound);
  return zoom;
};

Plot.timeSeriesPMDF = function (divID, dataset) {
  const trace1 = {
    type: "scatter",
    mode: "lines",
    name: "pm conc",
    y: getValues(dataset, "pmAvgSmoothed"),
    x: getValues(dataset, "timestamp"),
    text: "pm conc",
    line: {
      color: "rgb(0, 5, 250)",
    },
  };

  const trace2 = {
    type: "scatter",
    mode: "lines",
    name: "delay factor",
    y: getValues(dataset, "delayFactor"),
    x: getValues(dataset, "timestamp"),
    text: "delay factor",
    yaxis: "y2",
    line: {
      color: "rgb(0, 252, 254)",
    },
  };

  const plotData = [trace1, trace2];

  const layout = {
    font: {
      family: "Atkinson Hyperlegible, sans-serif",
      color: "rgb(52, 52, 52)",
    },
    yaxis: {
      title: "particulate matter concentration",
      showline: true,
      color: "rgb(52, 52, 52)",
    },
    yaxis2: {
      title: "traffic flow delay factor",
      side: "right",
      overlaying: "y",
      showline: true,
      showgrid: false,
      color: "rgb(52, 52, 52)",
    },
    showlegend: true,
    legend: { orientation: "h", x: 0.5, xanchor: "center" },
    plot_bgcolor: "rgb(246, 246, 246)",
    paper_bgcolor: "rgb(246, 246, 246)",
  };

  Plotly.setPlotConfig({
    responsive: true,
    displaylogo: false,
  });

  Plotly.newPlot(divID, plotData, layout);
};

Plot.sessionMap = function (divID, dataset, colorBy) {
  const lons = getValues(dataset, "lon");
  const lats = getValues(dataset, "lat");

  let colorData;

  if (colorBy === "PM") {
    // color by average particulate matter concentration
    colorData = getValues(dataset, "pmAvgSmoothed");
  }

  if (colorBy === "TF") {
    // color by delay factor
    colorData = getValues(dataset, "delayFactor");
  }

  const plotData = [
    {
      type: "scattermapbox",
      mode: "markers",
      text: colorData,
      lon: lons,
      lat: lats,
      marker: {
        color: colorData,
        colorscale: "Jet",
        cmin: Math.min(...colorData),
        cmax: Math.max(...colorData),
        opacity: 0.5,
        size: 10,
        colorbar: {
          thickness: 10,
          titleside: "right",
          outlinecolor: "rgba(68,68,68,0)",
          ticks: "outside",
          ticklen: 2,
        },
      },
      name: "Map Plot",
    },
  ];

  const layout = {
    font: {
      family: "Atkinson Hyperlegible, sans-serif",
      color: "rgb(52, 52, 52)",
    },
    dragmode: "zoom",
    mapbox: {
      center: {
        lat: getCentrePoint(lons, lats).latCP,
        lon: getCentrePoint(lons, lats).lonCP,
      },
      domain: {
        x: [0, 1],
        y: [0, 1],
      },
      style: "light",
      zoom: getZoom(lons, lats),
    },
    margin: {
      r: 0,
      t: 0,
      b: 0,
      l: 0,
      pad: 0,
    },
    showlegend: false,
    plot_bgcolor: "rgb(246, 246, 246)",
    paper_bgcolor: "rgb(246, 246, 246)",
  };

  Plotly.setPlotConfig({
    mapboxAccessToken: "APIKEY",
    displaylogo: false,
    scrollZoom: false,
  });

  Plotly.newPlot(divID, plotData, layout);
};

export default Object.freeze(Plot);
