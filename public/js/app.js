var conkingsui = angular.module('conkingsui', ['ngRoute', 'ui.bootstrap', 'UIControllers', 'uiCanvas', 'uiServices']);

conkingsui.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/sector', {
                templateUrl: 'partials/sector.html',
                controller: 'GalaxyController'
            }).
            otherwise({
                redirectTo: '/sector'
            });
    }]);