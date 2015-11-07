var express = require('express');
var router = express.Router();

var stars = require("../public/js/smallstars");
var planets = require("../public/js/planets");
var info = require("../public/data/info.json");
var galaxy = {};

var keys = Object.keys(stars);
var keys_planets = Object.keys(planets);
galaxy.sectors = [];
galaxy.tunnels = [];
var tempStars = [];

for(var sysNum = 0; sysNum < 5; sysNum++) {
    var system = [];
    for (var y = 0; y < 30; y++) {
        var arr = [];
        for (var x = 0; x < 30; x++) {
            if (Math.random() >= 0.5) {
                var r = Math.floor((Math.random() * keys.length));
                var nme = "S1/" + sysNum + "(" + x + ":" + y + ")";
                arr.push({
                    "name": nme,
                    loc: nme,
                    type: keys[r].substr(11),
                    "mass": Math.floor(Math.random() * 100),
                    "temp": Math.floor(Math.random() * 100)
                });
                if(Math.random() < 0.2)
                    tempStars.push(nme);
            } else {
                arr.push({});
            }
        }
        system.push(arr);
    }
    galaxy.sectors.push(system);
}

for(var i = 0; i < tempStars.length / 4; i++) {
    var a = Math.floor(Math.random() * tempStars.length);
    var b = a + Math.floor(Math.random() * 40 - 10);
    if(b < 0) b = 0;
    if(b >= tempStars.length) b = tempStars.length - 1;
    if(b == a) b = (a > 0) ? a - 1 : a + 1;
    galaxy.tunnels.push({from: tempStars[a], to: tempStars[b]});
}

router.get('/info', function(req, res, next) {
    res.json(info);
});

router.get('/galaxy', function(req, res, next) {
    res.json(galaxy);
});

router.get('/sector/:sectorId/stars', function(req, res, next) {
    res.json(galaxy.sectors[req.params.sectorId]);
});

router.get('/tunnels', function(req, res) {
    res.json(galaxy.tunnels);
});

router.get('/system/:systemId', function(req, res) {
    return {
        star: ""
    }
});

module.exports = router;
