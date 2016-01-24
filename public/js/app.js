var conkingsui = angular.module('conkingsui', ['ngRoute', 'ui.bootstrap', 'UIControllers', 'uiCanvas', 'uiServices']);

conkingsui.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/sector', {
                templateUrl: 'partials/sector.html',
                controller: 'GalaxyController'
            }).when('/system/:systemId', {
                templateUrl: 'partials/system.html',
                controller: 'SystemController'
            }).when('/test', {
                templateUrl: 'partials/blank.html',
                controller: 'GalaxyController'
            }).otherwise({
                redirectTo: '/sector'
            });
    }
]);

conkingsui.filter('bignumsshortener', function() {
    return function(input) {
        input = parseInt(input) || 0;
        if(input >= 1000000) {
            return Math.round(input / 1000000) + "M";
        }
        if(input >= 1000) {
            return Math.round(input / 1000) + "k";
        }
        return out;
    };
});

conkingsui.run(function(resourcesHolder) {

});