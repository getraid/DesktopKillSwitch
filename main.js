const axios = require("axios");
var ping = require("ping");

const express = require("express");
var server = express();
let callback = null;
let hosts = ["192.168.178.127", "192.168.178.29"];
var itemsProcessed = 0;
var x = false;
var retries = 1;

function callHue() {
  // Method to call hue
}

function reset() {
  itemsProcessed = 0;
  x = false;
}

function settysetty(vally) {
  console.log("setty", itemsProcessed, " ", hosts.length);
  x = x || vally;
  if (itemsProcessed === hosts.length - 1) {
    console.log("processy");
    setTimeout(() => {
      if (retries > 0) {
        retries--;
        reset();
        pingAll();
      } else {
        retries = 1;
        reset();
        if (!x) {
          setTimeout(() => {
            //Ping Bridge;
            console.log("tot");
            callHue();
          }, 1 * 60 * 1000);
        } else {
          console.log("lebt");
        }
      }
    }, 5 * 60 * 1000);
    console.log(x);
  }
  itemsProcessed++;
}

function pingAll() {
  hosts.forEach(function(host, index) {
    ping.sys.probe(host, function(isAlive) {
      // var msg = isAlive
      //   ? "host " + host + " is alive"
      //   : "host " + host + " is dead";
      console.log(isAlive);
      settysetty(isAlive);
    });
  });
}

server.post("/shutdown", (req, res) => {
  pingAll();

  res.sendStatus(200);

  // pingplong.then(function(res) {
  //   console.log(res);
  // });
  // var counter = hosts.length;
  // hosts.forEach(function(host, index) {
  //   console.log(host + " started ...");
  //   setTimeout(function() {
  //     console.log(index + ": " + host);
  //     pingplong(host);

  //     counter -= 1;
  //     if (counter === 0) {
  //       console.log("ich verstehe");
  //     }
  //     // call your callback here
  //   }, 10);
  // });

  // function pingplong(host) {
  //   ping.sys.probe(host, function(isAlive) {
  //     var msg = isAlive
  //       ? "host " + host + " is alive"
  //       : "host " + host + " is dead";
  //     console.log(msg);
  //   });
  // }

  // hosts.forEach(function(host, index, array) {
  //   itemsProcessed++;

  //   console.log("items", itemsProcessed, "arr", array.length);

  //   ping.promise.probe(host).then(function(res) {
  //     console.log(res.alive);
  //   });
  //    if (itemsProcessed === array.length) {
  //     console.log("timos mutter stinkt");
  //   }
  // });
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
