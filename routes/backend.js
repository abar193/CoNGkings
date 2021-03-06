var express = require('express');
var router = express.Router();
var fileSystem = require('fs'),
    path = require('path');

var combined = require("../site/dest/public/js/tilesets/combined.json");
var smallStars = combined.tmp.smallstars;
var resPlanets = combined.tmp.planets;
var info = require("../site/dest/public/data/info.json");
var gameconfig = require("./gameconfig");
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
                mass: random(10) + 1, temp: random(99) + 5,
                carbon: (random(5) <= 4) ? random(100) : undefined,
                silicon: (random(5) <= 4) ? random(100) : undefined,
                ore: (random(5) <= 4) ? random(100) : undefined,
                bean: (random(5) <= 4) ? random(100) : undefined,
                radiation: (random(5) <= 1) ? random(20) : undefined
            };
        }
        planets.push(gameconfig.planetMetaInfo(planet));
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
    try {
        res.json(galaxy.sectors[req.params.sectorId]);
    } catch(E) {
        res.json({"status": "error", "reason": "wrong sector location"});
    }
});

router.get('/planet.php', function(req, res, next) {
    res.setHeader("Content-Type", "text/plain; charset=UTF-8");
    res.write('{"id":"0000000","starid":"123456","atm":"Methane","own":1,"pop":5775,"pop_rate":3.92,"crime":0.36,"home":1,"storage":1,"const_rate":0.64,"prod_rate":0.64,"star_img":"star5_2.gif","buildings":[{"id":"69699","typeid":"12","img":"city_56.png","name":"Город","cnt":2},{"id":"69714","typeid":"18","img":"plants1_32.png","name":"Ферма","candelete":1,"cnt":2},{"id":"69715","typeid":"4","name":"Таможня","candelete":1,"cnt":1}],"resources":[{"typeid":"2","color":"#a576d3","name":"Кремний","img":"silicon.gif","val":28},{"typeid":"3","color":"#cfcfdf","name":"Руда","img":"ore.gif","val":41},{"typeid":"4","color":"#5ee440","name":"Био","img":"bean.gif","val":28},{"typeid":"5","color":"#ff5500","name":"Радиоактивность","img":"radiation.gif","val":1}]}');
    res.end();
    return;
});

router.get('/planets/', function(req, res, next) {
    res.json(planets.filter(function(planet) {return planet.alliance == 1}));
});

router.get('/tunnels', function(req, res) {
    res.json(galaxy.tunnels);
});

router.get('/reqdata.php', function(req, res) {
    console.log("hi!");
    var filePath = path.join(__dirname, '..\\bower_components\\reqdata.php');
    console.log("hi2");
    var stat = fileSystem.statSync(filePath);
    console.log("hi3");
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': stat.size
    });

    console.log("hi4");
    var readStream = fileSystem.createReadStream(filePath);

    console.log("hi5");
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
});

function random(a) {
    return Math.floor(Math.random() * a);
}

function locToCoordinates(loc) {
    if(!loc) return null;
    var exp = /S(\d+)[_/](\d+)\((\d+):(\d+)\)/g;
    var matches = exp.exec(loc);
    if(matches != null) {
        if(matches[2] < 0 || matches[2] > galaxy.sectors.length ||
            matches[3] < 0 || matches[3] > galaxy.sectors[0][0].length ||
            matches[4] < 0 || matches[4] > galaxy.sectors[0].length)
            return null;
        return {galaxy: matches[1], sector: matches[2], x: matches[3], y: matches[4]};
    }
    else
        return null;
}

router.get('/system/:systemId/static', function(req, res) {
    var planets = [];
    var loc = locToCoordinates(req.params.systemId);
    if(!loc) {
        res.json({"status": "err", "reason": "wrong location"});
        return;
    }
    var sys = galaxy.sectors[loc.sector][loc.y][loc.x];
    if(sys.discovered) {
        for(var i = 0; i < discoveredStars.length; i++) {
            if(discoveredStars[i].loc == sys.loc) {
                res.json(discoveredStars[i]);
                return;
            }
        }
    }
    res.json({
        star: sys.type,
        planets: []
    });
});

router.get('/system/:systemId/', function(req, res) {
    var fog = [];
    var loc = locToCoordinates(req.params.systemId);
    if(!loc) {
        res.json({"status": "err", "reason": "wrong location"});
        return;
    }
    var sys = galaxy.sectors[loc.sector][loc.y][loc.x];
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
    res.json({
        fog: fog
    });
});

module.exports = router;
