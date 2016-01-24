var express = require('express');
var router = express.Router();

var combined = require("../public/js/tilesets/combined.json");
var smallStars = combined.src.tmp.smallstars;
var resPlanets = combined.src.tmp.planets;
var info = require("../public/data/info.json");
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
    res.write('{"id":"1030001730","starid":"1030001700","atm":"Ammonia","own":1,"pop":128380,"pop_rate":0,"crime":0,"home":1,"storage":1,"const_rate":1.2,"prod_rate":2.21,"star_img":"star18_3.png","buildings":[{"id":"67822","typeid":"12","img":"city_56.png","name":"Город","cnt":10},{"id":"67823","typeid":"1","img":"siliconext_32.png","name":"Песчаный карьер","candelete":1,"cnt":7},{"id":"67824","typeid":"2","img":"carbonext_32.gif","name":"Нефтяная вышка","candelete":1,"cnt":6},{"id":"67825","typeid":"3","img":"oreext_32.gif","name":"Рудник","candelete":1,"cnt":9},{"id":"67826","typeid":"13","img":"castle_32.gif","name":"Резиденция","candelete":1,"once":1,"cnt":1},{"id":"67827","typeid":"6","img":"storage_32.gif","name":"Склад","candelete":1,"once":1,"cnt":1},{"id":"67828","typeid":"10","img":"solarpower_32.gif","name":"Солнечная батарея","candelete":1,"cnt":12},{"id":"67829","typeid":"18","img":"plants1_32.png","name":"Ферма","candelete":1,"cnt":7},{"id":"67929","typeid":"8","img":"factory_32.png","name":"Фабрика","candelete":1,"cnt":1},{"id":"67944","typeid":"9","img":"lab_32.png","name":"Лаборатория","candelete":1,"once":1,"cnt":1},{"id":"67963","typeid":"17","img":"academy_32.gif","name":"Казармы","candelete":1,"once":1,"cnt":1},{"id":"67978","typeid":"7","img":"works_32.png","name":"Завод","candelete":1,"cnt":7},{"id":"68329","typeid":"4","img":"customs_32.gif","name":"Таможня","candelete":1,"once":1,"cnt":1},{"id":"68426","typeid":"15","img":"bunker_32.gif","name":"Бункер","candelete":1,"cnt":1},{"id":"68427","typeid":"14","img":"turret_32a.gif","name":"Турель","candelete":1,"cnt":2},{"id":"68746","typeid":"16","img":"radar_32.gif","name":"Радар","candelete":1,"once":1,"cnt":1},{"id":"68828","typeid":"21","img":"office_32.gif","name":"Диспетчерская","candelete":1,"once":1,"cnt":1}]}');
    res.end();
    return;
});

router.get('/planets/', function(req, res, next) {
    res.json(planets.filter(function(planet) {return planet.alliance == 1}));
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
