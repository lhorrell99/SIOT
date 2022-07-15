const Ajax = Object.create(null);

const json = (response) => response.json();

// query the input URL and process returned JSON
Ajax.query = function (route) {
  return window
    .fetch(route, {
      method: "GET",
    })
    .then(json);
};

export default Object.freeze(Ajax);
