/**
 * Frontend AngularJS controllers
 * Created by Abar on 18-Oct-15.
 */

var uiControllers = angular.module('UIControllers', ['uiServices']);

uiControllers.controller('InfoCtrl', function ($scope, $http) {
    $scope.info = {"player": "unknown"};
    $http.get('/api/info').success(function(data){ $scope.info = data; });
});

function locToCoordinates(loc) {
    if(!loc) return null;
    var exp = /S(\d+)\/(\d+)\((\d+):(\d+)\)/g;
    var matches = exp.exec(loc);
    if(matches != null)
        return {galaxy: matches[1], sector: matches[2], x: matches[3], y: matches[4]};
    else
        console.log("Incorrect location format!", loc);
}

uiControllers.controller('GalaxyController', function ($scope, $http, $location, galaxyHolder) {
    $scope.selectedStar = {  };
    $scope.highlightedStar = { };
    $scope.tmpsectors = [0, 1, 2, 3, 4];
    $scope.selectedSystems = galaxyHolder.systems();
    $scope.showTunnels = true;

    $scope.mouseoverStar = function mouseoverStar(loc) {
        $scope.selectedStar = findByCoodrinates(locToCoordinates(loc));
    };

    $scope.selectStar = function selectStar(loc) {
        var newStar = findByCoodrinates(locToCoordinates(loc));
        if(!newStar) return;

        for(var i = 0; i < $scope.selectedSystems.length; i++) {
            if($scope.selectedSystems[i].loc == loc) {
                if(i == 0) return; // bring old star to first place
                var t = $scope.selectedSystems[i];
                $scope.selectedSystems[i] = $scope.selectedSystems[0];
                $scope.selectedSystems[0] = t;
                return;
            }
        }
        $scope.selectedSystems.unshift(newStar); // insert new
        if($scope.selectedSystems.length > 3)
            $scope.selectedSystems = $scope.selectedSystems.slice(0, 4);
    };

    $scope.openStar = function openStar(loc) {
        galaxyHolder.systems($scope.selectedSystems);
        $location.path("/system/" + loc.replace(/\//g, "_"));
    };

    $scope.selectSector = function(id) {
        galaxyHolder.selectSector(id);
    };

    function findByCoodrinates(loc) {
        if(!loc) return null;
        return galaxyHolder.sectors()[loc.sector][loc.y][loc.x];
    }

});

function random(a) {
    return Math.floor(Math.random() * a);
}

uiControllers.controller('SystemController', function ($scope, $http, $routeParams, $location, galaxyHolder, backendCommunicator) {
    $scope.system = undefined;
    $scope.dynamic = undefined;
    $scope.selectedSystems = galaxyHolder.systems();
    $scope.righttab = "systems";
    $scope.dev = {planetpath: "2/15(9:20)4"};
    $scope.planet = {
    };
    $scope.parsedPlanet = {atm: "unknown"};
    $scope.openPlanet = function(coordinates) {
        for(var i = 0; i < $scope.system.planets.length; i++) {
            var planet = $scope.system.planets[i];
            if(planet.x == coordinates.x && planet.y == coordinates.y) {
                $scope.planet = planet;
                $scope.righttab = "planet";
                $scope.parsedPlanet = {atm: "unknown"};
                backendCommunicator.getPlanet($scope.dev.planetpath)
                .then(function ok(data) {
                    globala = data;
                    parsePlanet(data.data);
                },function err(data) {
                    console.log("Err", arguments);
                });
            }
        }
    };
    $http.get('api/system/' + $routeParams.systemId + '/static').success(function(data) {
        $scope.system = data;
    });
    $http.get('api/system/' + $routeParams.systemId).success(function(data) {
        $scope.dynamic = data;
    });
    $scope.back = function() {
        $location.path("/sector");
    };
    $scope.openStar = function openStar(loc) {
        $location.path("/system/" + loc.replace(/\//g, "_"));
    };
    $scope.toggleTab = function toggleTab(value) {
        $scope.righttab = value;
    };

    function parsePlanet(data) {
        var placementMap = {
            "1":  {x: 1, y: 0},
            "2":  {x: 0, y: 0},
            "3":  {x: 2, y: 0},
            "18": {x: 3, y: 0},
            "10": {x: 0, y: 1},
            "8":  {x: 1, y: 1},
            "7":  {x: 2, y: 1},
            "9":  {x: 3, y: 1},
            "17": {x: 1, y: 2},
            "4":  {x: 2, y: 2}
        };
        $scope.parsedPlanet = data;
        $scope.parsedPlanet.atm = data.atm.toLowerCase() || "unknown";
        $scope.parsedPlanet.head = false;
        $scope.parsedPlanet.parsedBuildings =
            [
                [
                    {}, {}, {}, {}
                ], [
                    {}, {}, {}, {}
                ], [
                    {}, {}, {}, {}
                ]
            ];
        if(data.buildings) {
            var i, other = false, unusedBuildings = [];
            if(data.own == 1) {
                for(i = 0; i < Object.keys(placementMap).length; i++) {
                    if(placementMap.hasOwnProperty(Object.keys(placementMap)[i])) {
                        var pl = placementMap[Object.keys(placementMap)[i]];
                        $scope.parsedPlanet.parsedBuildings[pl.y][pl.x] = {type: Object.keys(placementMap)[i], count: 0};
                    }
                }
            } else other = true;
            for(i = 0; i < data.buildings.length; i++) {
                var build = data.buildings[i];
                if(build.typeid == 13) $scope.parsedPlanet.head = true;
                if(build.typeid == 12) $scope.parsedPlanet.cities = data.buildings[i].cnt;
                if(build.typeid in placementMap) {
                    var pl = placementMap[build.typeid];
                    $scope.parsedPlanet.parsedBuildings[pl.y][pl.x] = build;
                } else if(other) unusedBuildings.push(build);
            }
            if(other) {
                for(var y = 0; y < 3; y++) {
                    for(var x = 0; x < 4; x++) {
                        if(!$scope.parsedPlanet.parsedBuildings[y][x].typeid && unusedBuildings.length > 0)
                            $scope.parsedPlanet.parsedBuildings[y][x] = unusedBuildings.pop();
                    }
                }
            }
        }
    }

});

uiControllers.filter('systype', function() {
    return function(input) {
        if(!input) return;
        var r = /[a-z]+/;
        var a = r.exec(input)[0];
        return a.charAt(0).toUpperCase() + a.slice(1);
    };
});