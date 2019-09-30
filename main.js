const axios = require("axios");
var ping = require("ping");

const express = require("express");
const server = express();

server.post("/shutdown", (req, res) => {
  res.sendStatus(200);
  //do stuff
});

server.get("/desktopkillswitch", (req, res) => {
  res.sendStatus(200);
  //do stuff
});

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const port = 5123;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
