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
        var stars, tunnels;
        var showTunnels = true;
        ctx = element[0].getContext("2d");

        function drawStars() {
            var lastStar = {};
            if(stars) {
                ctx.drawImage(imgSystemBack, 0, 0, 651, 651);
                for(var y = 0; y < stars.length; y++) {
                    for(var x = 0; x < stars[y].length; x++) {
                        if(stars[y][x].type && small_stars['star_small_' + stars[y][x].type]) {
                            var coords = small_stars['star_small_' + stars[y][x].type];
                            lastStar = stars[y][x]; // TODO: refractor, make normal service
                            ctx.drawImage(imgStarsSmall, coords.x, coords.y, coords.width, coords.height,
                                21 + x * 21, 21 + y * 21, 20, 20);
                        } else {
                            if(stars[y][x].type) console.log("No json-location defined for small-star of type: ", stars[y][x].type);
                        }
                    }
                }
            }
            if(tunnels && showTunnels) {
                console.log(lastStar);
                var sector = locToCoordinates(lastStar.loc).sector;
                ctx.beginPath();
                for(var i = 0; i < tunnels.length; i++) {
                    var cFrom = locToCoordinates(tunnels[i].from);
                    var cTo = locToCoordinates(tunnels[i].to);
                    if(cTo && cFrom) {
                        if(cFrom.sector == sector || cTo.sector == sector) {
                            ctx.moveTo((cFrom.sector == sector) ? cFrom.x * 21 + 31 : (cFrom.sector > sector) ? 651 : 0,
                                (cFrom.sector == sector) ? cFrom.y * 21 + 31 : cTo.y * 21 + 35);
                            ctx.lineTo((cTo.sector == sector) ? cTo.x * 21 + 31 : (cTo.sector > sector) ? 651 : 0,
                                (cTo.sector == sector) ? cTo.y * 21 + 31 : cFrom.y * 21 + 35);
                        }
                    }
                }
                ctx.strokeStyle="#3333BB";
                ctx.stroke();
            }
        }
        element.bind('mousemove', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            if(sc.x >= 0 && sc.y >= 0)
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
            tunnels = scope.tunnels;
            stars = value;
            drawStars();
        });
        scope.$watch('showTunnels', function(newValue){
            showTunnels = newValue;
            drawStars();
        });
    }
    return {
        restrict: "A",
        link: link
    };
});