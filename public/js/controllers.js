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
        if($scope.selectedSystems.length > 2)
            $scope.selectedSystems = $scope.selectedSystems.slice(0, 3);
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

uiControllers.controller('SystemController', function ($scope, $http, $routeParams, $location, galaxyHolder) {
    $scope.system = undefined;
    $scope.dynamic = undefined;
    $scope.selectedSystems = galaxyHolder.systems();
    $scope.righttab = "planet";
    $scope.planet = {
        mass: random(10),
        temp: random(99) + 5,
        carbon: (Math.random() > 0.3) ? random(100) : undefined,
        silicon: (Math.random() > 0.3) ? random(100) : undefined,
        ore: (Math.random() > 0.3) ? random(100) : undefined,
        bean: (Math.random() > 0.3) ? random(100) : undefined,
        radiation: (Math.random() > 0.5) ? random(20) : undefined
    };
    $scope.parsedPlanet = {
        cities: 10,
        head: true  ,
        buildings: [
            [
                {type: 1, count: 12},
                {type: 2, count: 8},
                {type: 3, count: 15},
                {type: 18, count: 7}
            ], [
                {type: 10, count: 10},
                {type: 8, count: 0},
                {type: 7, count: 3},
                {type: 9, count: -1}
            ], [
                {},
                {type: 17, count: 0},
                {type: 4, count: -1},
                {}
            ]
        ]
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