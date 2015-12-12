var express = require('express');
var router = express.Router();

var combined = require("../public/js/tilesets/combined.json");
var smallStars = combined.src.tmp.smallstars;
var resPlanets = combined.src.tmp.planets;
var info = require("../public/data/info.json");
var galaxy = {};

var keys = Object.keys(smallStars);
var keys_planets = Object.keys(resPlanets);
galaxy.sectors = [];
galaxy.tunnels = [];
var tempStars = [];
var discoveredStars = [];
var planets = [];

var words = "A star is a luminous sphere of plasma held together by its own gravity.".split(" ");

for(var sysNum = 0; sysNum < 5; sysNum++) {
    var system = [];
    for (var y = 0; y < 30; y++) {
        var arr = [];
        for (var x = 0; x < 30; x++) {
            if (Math.random() >= 0.5) {
                var r = Math.floor(random(keys.length));
                var loc = "S1/" + sysNum + "(" + x + ":" + y + ")";
                var nme = (Math.random() < 0.2) ? words[random(words.length)] + " " + words[random(words.length)] : loc;
                var discovered = Math.random() < 0.4 && sysNum == 0;
                var newSystem = {
                    name: nme,
                    loc: loc,
                    type: keys[r],
                    mass: Math.floor(Math.random() * 100),
                    temp: Math.floor(Math.random() * 100),
                    discovered: discovered
                };
                arr.push(newSystem);
                if(Math.random() < 0.2)
                    tempStars.push(loc);
                if(discovered) {
                    discoveredStars.push(newSystem);
                }
            } else {
                arr.push({});
            }
        }
        system.push(arr);
    }
    galaxy.sectors.push(system);
}
var id = 0;
for(var i = 0; i < discoveredStars.length; i++) {
    var system = discoveredStars[i];
    var count = random(10) + 1;
    var sysPlanets = [];
    for (var j = 0; j < count; j++) {
        var x = Math.floor(Math.random() * 19);
        var y = Math.floor(Math.random() * 19);
        if (x >= 8 && x <= 11 && y >= 8 && y <= 11) y += 4;
        var planet = {id: id++, x: x, y: y, type: keys_planets[random(keys_planets.length)]};
        if (Math.random() > 0.55) {
            planet.data = {
                mass: random(10), temp: random(99) + 5,
                carbon: random(100),
                silicon: random(100),
                ore: random(100),
                bean: random(100),
                radiation: random(19)
            };
        }
        planets.push(planet);
        sysPlanets.push(planet);
    }
    system.planets = sysPlanets;
    system.star = system.type;
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

function random(a) {
    return Math.floor(Math.random() * a);
}

function locToCoordinates(loc) {
    if(!loc) return null;
    var exp = /S(\d+)[_/](\d+)\((\d+):(\d+)\)/g;
    var matches = exp.exec(loc);
    if(matches != null)
        return {galaxy: matches[1], sector: matches[2], x: matches[3], y: matches[4]};
    else
        return null;
}

router.get('/system/:systemId/static', function(req, res) {
    var planets = [];
    var loc = locToCoordinates(req.params.systemId);
    if(!loc) {
        res.status(500).send("Wrong location " + req.params.systemId);
    }
    var sys = galaxy.sectors[loc.sector][loc.y][loc.x];
    if(sys.discovered) {
        for(var i = 0; i < discoveredStars.length; i++) {
            if(discoveredStars[i].loc == sys.loc) {
                res.json(discoveredStars[i]);
            }
        }
    }
    res.json({
        star: sys.type,
        planets: []
    });
});

router.get('/system/:systemId/', function(req, res) {
    console.log("Here!");
    var fog = [];
    var loc = locToCoordinates(req.params.systemId);
    console.log("Coodinates parsed: ",  loc);
    if(!loc || loc.sector < 0 || loc.sector > 4 || loc.x < 0 || loc.x > 29 || loc.y < 0 || loc.y > 29) {
        res.json({"status": "err", "reason": "wrong location"});
    }
    var sys = galaxy.sectors[loc.sector][loc.y][loc.x];
    console.log("Sys found: ",  sys);
    if(sys.discovered) {
        for (var y = 0; y < 20; y++) {
            var row = [];
            for (var x = 0; x < 20; x++) {
                if (x >= 8 && x <= 11 && y >= 8 && y <= 11)
                    row.push(1);
                else
                    row.push((Math.random()) > 0.5 ? 1 : 0);
            }
            fog.push(row);
        }
    } else {
        for (var y = 0; y < 20; y++) {
            var row = [];
            for (var x = 0; x < 20; x++) {
                row.push(0);
            }
            fog.push(row);
        }
    }
    console.log("Got there just fine");
    res.json({
        fog: fog
    });
});

module.exports = router;
