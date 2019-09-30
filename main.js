const axios = require("axios");
var ping = require("ping");

const express = require("express");
var server = express();

//-----settings-----

//enter all networkadapters that can be pinged to reach your pc
let hosts = ["192.168.178.127", "192.168.178.29"];

//all hue-settings. See README.md
var hueIp = "";
var hueUsername = "";
var hueLightId = "";

//in seconds
var timeBetweenRetryPing = 1;
var timeBetweenLastPing = 1;

// retry counter. Also change at line 59. Use it to specify how often it should be checked
var retries = 1;

//-----variables-----
var hostsCombined = false;
var itemsProcessed = 0;
var retriestmp = retries;

var hueUrl =
  "http://" +
  hueIp +
  "/api/" +
  hueUsername +
  "/lights/" +
  hueLightId +
  "/state";

function callHue() {
  axios
    .put(hueUrl, {
      on: true,
      bri: 255
    })
    .then(function(response) {
      // (  console.log(response);)
    })
    .catch(function(error) {
      console.log(error);
    });
}

function reset() {
  itemsProcessed = 0;
  hostsCombined = false;
}

function combineHosts(isAlive) {
  hostsCombined = isAlive || hostsCombined;

  if (itemsProcessed === hosts.length - 1) {
    setTimeout(() => {
      if (retriestmp > 0) {
        retriestmp--;
        reset();
        pingAll();
      } else {
        if (!hostsCombined) {
          setTimeout(() => {
            //Ping Bridge;
            console.log(
              "PC can't be reached. Hue will send API-Request to:",
              hueUrl
            );
            callHue();
          }, timeBetweenLastPing * 1000);
        } else {
          //abort
          console.log(
            "PC is still reachable, Maybe unsaved work? Will not execute API-Request"
          );
        }
        retriestmp = retries;
        reset();
      }
    }, timeBetweenRetryPing * 1000);
    console.log(hostsCombined);
  }
  itemsProcessed++;
}

function pingAll() {
  hosts.forEach(function(host, index) {
    ping.sys.probe(host, function(isAlive) {
      var msg = isAlive
        ? "host " + host + " is alive"
        : "host " + host + " is dead";
      console.log(msg);
      combineHosts(isAlive);
    });
  });
}

server.post("/shutdown", (req, res) => {
  pingAll();
  res.sendStatus(200);
});

server.get("/desktopkillswitch", (req, res) => {
  res.sendStatus(200);
});

server.get("/", (req, res) => {
  //index to trigger abort page
  res.sendFile(__dirname + "/index.html");
});

const port = 5123;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
