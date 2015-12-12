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
    }]);