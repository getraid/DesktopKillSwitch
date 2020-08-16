const axios = require("axios");
var ping = require("ping");

const express = require("express");
var server = express();


//-----settings-----

//enter all networkadapters that can be pinged to reach your pc
let hosts = ["192.168.X.X"];

//all hue-settings. See README.md
var hueIp = "192.168.X.X";
var hueUsername = "";
var hueLightId = "";

//in seconds
var timeBetweenRetryPing = 60;

// ---- Dunno if changing the settings below works, since the upper settings serve my purposes -----
var timeBetweenLastPing = 1;

// retry counter. Use it to specify how often it should be checked.
// After all retries, retries will also be called once more. Only last call is used to determine if PC is still reachable
var retries = 3;

//-----variables-----
var hostsCombined = false;
var itemsProcessed = 0;
var retriestmp = retries;
this.allowedToRun = true;

var hueUrl =
  "http://" +
  hueIp +
  "/api/" +
  hueUsername +
  "/lights/" +
  hueLightId +
  "/state";

function callHue () {
  axios
    .put(hueUrl, {
      on: false
    })
    .then(function (response) {
      // (  console.log(response);)
    })
    .catch(function (error) {
      console.log(error);
    });
}

function reset () {
  itemsProcessed = 0;
  hostsCombined = false;
}

function combineHosts (isAlive) {
  hostsCombined = isAlive || hostsCombined;

  if (itemsProcessed === hosts.length - 1) {
    setTimeout(() => {
      if (retriestmp > 0) {
        retriestmp--;
        reset();
        pingAll();
      } else {
        if (!hostsCombined) {
          //Ping Bridge;
          console.log(
            "PC can't be reached. Hue will send API-Request to:",
            hueUrl
          );
          callHue();
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

function pingAll () {
  hosts.forEach(function (host, index) {
    ping.sys.probe(host, function (isAlive) {
      var msg = isAlive
        ? "host " + host + " is alive"
        : "host " + host + " is dead";
      console.log(msg);
      combineHosts(isAlive);
    });
  });
}

server.use(express.static('fonts'));

server.post("/shutdown", (req, res) => {
  if (this.allowedToRun) {
    pingAll();
  }
  res.sendStatus(200);
});

server.get("/desktopkillswitch", (req, res) => {
  res.sendStatus(200);
});


server.post("/stop", (req, res) => {
  process.exit();
});


server.get("/pause", (req, res) => {
  this.allowedToRun = !Boolean(this.allowedToRun);
  res.send('' + this.allowedToRun);
});

server.get("/getpausestatus", (req, res) => {
  res.send('' + this.allowedToRun);
});

server.get("/", (req, res) => {
  //index to trigger abort page
  res.sendFile(__dirname + "/index.html");
});


const port = 5123;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
