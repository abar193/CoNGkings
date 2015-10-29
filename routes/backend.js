var express = require('express');
var router = express.Router();

var stars = require("../public/js/smallstars");
var info = require("../public/data/info.json");
var galaxy = {};

var keys = Object.keys(stars);
galaxy.sectors = [];
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
            } else {
                arr.push({});
            }
        }
        system.push(arr);
    }
    galaxy.sectors.push(system);
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

module.exports = router;
