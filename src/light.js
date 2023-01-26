const axios = require("axios");
require("dotenv").config();

const getIp = `https://vadymklymenko.com/ping/?ip=${process.env.MY_IP}`;

async function getApiRes() {
  const request = await axios.get(getIp);
  return request.data;
}

module.exports = getApiRes;
