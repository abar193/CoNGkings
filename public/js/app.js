var conkingsui = angular.module('conkingsui', ['ngRoute', 'ui.bootstrap', 'UIControllers']);

conkingsui.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/phones', {
                templateUrl: 'partials/phone-list.html',
                controller: 'PhoneListCtrl'
            }).
            when('/galaxy', {
                templateUrl: 'partials/galaxy.html',
                controller: 'GalaxyController'
            }).
            otherwise({
                redirectTo: '/galaxy'
            });
    }]);

function starCoordinates(event, offsetX, offsetY, cellWidth, cellHeight) {
    var x, y;
    if(event.offsetX !== undefined){
        x = event.offsetX;
        y = event.offsetY;
    } else { // Firefox compatibility
        x = event.layerX - event.currentTarget.offsetLeft;
        y = event.layerY - event.currentTarget.offsetTop;
    }
    x = Math.floor((x - offsetX) / cellWidth);
    y = Math.floor((y - offsetY) / cellHeight);
    return {x: x, y: y};
}

conkingsui.directive('sectorCanvas', function() {
    function link(scope, element, attrs) {
        var stars;
        ctx = element[0].getContext("2d");

        function drawStars() {
            if(stars) {
                console.log("drawing");
                ctx.drawImage(imgSystemBack, 0, 0, 651, 651);
                for(var y = 0; y < stars.length; y++) {
                    for(var x = 0; x < stars[y].length; x++) {
                        if(stars[y][x].type && small_stars['star_small_' + stars[y][x].type]) {
                            var coords = small_stars['star_small_' + stars[y][x].type];
                            ctx.drawImage(imgStarsSmall, coords.x, coords.y, coords.width, coords.height,
                                21 + x * 21, 21 + y * 21, 20, 20);
                        } else {
                            if(stars[y][x].type) console.log("No json-location defined for small-star of type: ", stars[y][x].type);
                        }
                    }
                }
            }
        }
        element.bind('mousemove', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            scope.$apply(function() {
                scope.mouseoverStar(stars[sc.y][sc.x].loc);
            });
        });
        element.bind('mouseup', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            scope.$apply(function() {
                scope.selectStar(stars[sc.y][sc.x].loc);
            });
        });
        scope.$watch(attrs.sectorCanvas, function(value) {
            stars = value;
            drawStars();
        });
    }
    return {
        restrict: "A",
        link: link
    };
});