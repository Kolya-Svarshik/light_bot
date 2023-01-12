const fetch = require("node-fetch");
require("dotenv").config();

const url = `https://vadymklymenko.com/ping/?ip=${process.env.MY_IP}`;

async function getApiRes() {
  const request = fetch(url, {
    method: "GET",
    headers: { "Content-Text": "application/json" },
  }).then((res) => res.json());
  return request;
}

// request.then((res) => res.json()).then((json) => console.log(json));

module.exports = getApiRes;
