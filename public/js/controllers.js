/**
 * Frontend AngularJS controllers
 * Created by Abar on 18-Oct-15.
 */

var uiControllers = angular.module('UIControllers', []);

uiControllers.controller('InfoCtrl', function ($scope, $http) {
    $scope.info = {"player": "unknown"};
    $http.get('/api/info').success(function(data){ $scope.info = data; });
});

function locToCoordinates(loc) {
    if(!loc) return null;
    var exp = /S(\d+)\/(\d+)\((\d+):(\d+)\)/g;
    var matches = exp.exec(loc);
    return {galaxy: matches[1], sector: matches[2], x: matches[3], y: matches[4]};
}

uiControllers.controller('GalaxyController', function ($scope, $http) {
    $scope.systems = {};
    $scope.system = [];
    $scope.selectedStar = { name: "S1/1(14:5)", loc: "S1/1(14:5)", type: "star11_4", mass: 39, temp: 65 };
    $scope.selectedSystems = [];
    $http.get('/api/sector/0/stars').success(function(data){
        $scope.systems['sector0'] = data;
        $scope.system = data;
    });

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

    function findByCoodrinates(loc) {
        if(!loc) return null;
        return $scope.systems['sector'+loc.sector][loc.y][loc.x];
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