# DesktopKillSwitch

An App that should be hosted on a Raspberry Pi to kill the electricity after shutdown of your PC

# Requirements

- [DesktopKillSwitch-Client](https://github.com/getraid/DesktopKillSwitch-client)
- Raspberry Pi or other server, that is always running with a network connection.
- Running Node, NPM
- Hue-Bridge with Hue compatible SmartPlug (In my case OSRAM Smart+ Plug )
- If you use something other than the OSRAM Smart+ Plug, you might need a bit of knowledge about the Hue API.

# Motivation / Idea

Since a recent Windows update my machine started to boot itself up after some random hours or even minutes. I first thought it was magic packet that looped through the switch somehow. But it came so unexpectedly and every night, that I decided I'd use a more "traditional" approach (with like... killing the electricity... you know).  
So I bought myself this OSRAM Smart+ Plug, while it was on a discount and thought to myself: "I need to automate this on shutdown somehow."
And so here I am writing this script. For maybe you, who may be in the same situation. So yeah, you're welcome ✌

# Setup

## Hue

Find your local IP adress of your Hue Bridge and go to `http://<<ip of hue>>/debug/clip.html`

Type into the URL textbox: `/api` and **hit the physical Hue Bridge button** in your living room or somewhere else.

Paste this text into the Message Body:

```json
Body:
{
 "devicetype": "DesktopKillSwitch#specificuser"
}
```

and hit **`POST`**

The `#specificuser` can be changed. But it doesn't matter since we only have one user.

Now you get a response that looks like this:

```json
[
  {
    "success": {
      "username": "N3-Ml1833byTd3L2LJcR7PuzUz1QktG3bc2nXmUu"
    }
  }
]
```

Save this username, as it is important for this application to work.

Next we're going to find our hue power outlet by searching through all our lamps.
We do that with a **`GET`** request to `/api/{username}/lights` in our hue debug window.

If you gave your outlet a name in the Hue app before, you can just CTRL+F for the given name.
We're just searching for the top most number of the object.

In my case it would be `4`, as seen by my output:

```json
	"4": {
		"state": {
			"on": true,
			"alert": "select",
			"mode": "homeautomation",
			"reachable": false
		},
		"swupdate": {
			"state": "notupdatable",
			"lastinstall": "2019-09-18T20:46:08"
		},
		"type": "On/Off plug-in unit",
		"name": "PC Switch",
		"modelid": "Plug 01",
		"manufacturername": "OSRAM",
		"productname": "On/Off plug",
		"capabilities": {
			"certified": false,
			"control": {},
			"streaming": {
				"renderer": false,
				"proxy": false
			}
		},
		"config": {
			"archetype": "classicbulb",
			"function": "functional",
			"direction": "omnidirectional"
		},
		"swversion": "V1.04.12"
	}

```

Save this number as well.

## Install on a Raspberry Pi

My recommendation for this setup would be a Raspberry Pi Zero W, that would be _chilling_ under your table.

[Install Node.js on your Pi](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)
But watch out for the version.
My Pi runs on Node Version`v9.11.2`, so I guess above version 9 should be fine.

Next install git and clone this repo:

```bash
sudo apt install git
cd ~
git clone https://github.com/getraid/DesktopKillSwitch.git
cd DesktopKillSwitch
```

Install the node packages:

```bash
npm install
```

## Program settings

Open main.js with nano

```
nano main.js
```

Scroll to the `---settings---` section and fill in the variables

Example:

```js
//For example LAN and WLAN adresses of your computer
let hosts = ["192.168.178.21", "192.168.178.25"];

//hueIp is the local Ip of your Hue Bridge
//The username is your previously fetched name from the Hue Bridge API
//The hue lightid is your outlet that we also previously fetched before.
var hueIp = "192.168.178.30";
var hueUsername = "N3-Ml1833byTd3L2LJcR7PuzUz1QktG3bc2nXmUu";
var hueLightId = "4";
```

Now you can save and exit this with CTRL+X and then Y

## Run

just run `npm run serve` and you are good to go!

... well only if you never let your terminal session die.

You can either use something like tmux and deattach the window or go the clean route and install this as a service
But frankly I'm too lazy to describe this to you, since there are many tutorials out there.
Just google for something like `linux create service node`
