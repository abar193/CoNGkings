/**
 * Created by Abar on 30-Oct-15.
 */
var uiServices = angular.module('uiServices', []);

uiServices.factory('galaxyHolder', ['$http', function($http) {
    var sectors = [[], [], [], [], []];
    var tunnels = [];
    var selectedSector = -1;
    $http.get('/api/tunnels').success(function(data){
        tunnels = data;
    });
    $http.get('/api/sector/0/stars').success(function(data){
        sectors[0] = data;
        selectedSector = 0;
    });
    var selectSector = function selectSector(id) {
        if(sectors[id].length != 0) {
            selectedSector = id;
        }  else {
            $http.get('/api/sector/' + id + '/stars').success(function(data){
                sectors[id] = data;
                selectedSector = id;
            });
        }
    };

    var getSelectedSector = function getSelectedSector() { return selectedSector; };
    var getSectors = function getSectors() { return sectors; };
    var getTunnels = function getTunnels() { return tunnels; };

    return {
        sectors: getSectors,
        tunnels: getTunnels,
        selectedSector: getSelectedSector,
        selectSector: selectSector
    };
}]);
