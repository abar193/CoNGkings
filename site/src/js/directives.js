/**
 * Created by Abar on 30-Oct-15.
 */
var uiCanvas = angular.module('uiCanvas', ['uiServices']);
var colors = ["green", '#AFAF00', '#00C6C6', '#AF0000', '#FF9100', '#11F'];

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

uiCanvas.directive('sectorCanvas', ['galaxyHolder', 'resourcesHolder', function(galaxyHolder, resourcesHolder) {
    function link(scope, element, attrs) {
        var ctx = element[0].children[1].getContext("2d");
        var ctxTunnels = element[0].children[2].getContext("2d");
        var drawing = false;
        function drawStars() {
            SectorCanvas.drawStars(ctx, scope.stars, scope.highlightedStar, resourcesHolder.smallstars());
            SectorCanvas.drawTunnels(ctxTunnels, scope.selectedSector, scope.tunnels, scope.showTunnels);
            ctx.font = "15px Arial";
            ctx.fillStyle = "#3333BB";
            ctx.fillText(scope.selectedSector + "", 5, 15);
            drawing = false;
        }

        element.bind('mousemove', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            if(sc.x >= 0 && sc.y >= 0)
                scope.$apply(function() {
                    scope.mouseoverStar(scope.stars[sc.y][sc.x].loc);
                });
        });
        element.bind('mouseup', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            scope.$apply(function() {
                scope.selectStar(scope.stars[sc.y][sc.x].loc);
            });
        });
        element.bind('dblclick', function(event){
            var sc = starCoordinates(event, 21, 21, 21, 21);
            scope.$apply(function() {
                scope.openStar(scope.stars[sc.y][sc.x].loc);
            });
        });
        scope.$watch(function() { return galaxyHolder.selectedSector(); }, function(value) {
            scope.stars = galaxyHolder.sectors()[galaxyHolder.selectedSector()];
            scope.selectedSector = value;
            drawStars();
        });
        scope.$watch(function() { return galaxyHolder.sectors(); }, function(value) {
            scope.stars = galaxyHolder.sectors()[galaxyHolder.selectedSector()];
            SectorCanvas.drawStars(ctx, scope.stars, scope.highlightedStar, resourcesHolder.smallstars());
        });
        scope.$watch(function() { return galaxyHolder.tunnels(); }, function(value) {
            scope.tunnels = value;
            SectorCanvas.drawTunnels(ctxTunnels, scope.selectedSector, scope.tunnels, scope.showTunnels);
        });
        scope.$watch('highlightedStar.loc', function(value, oldValue) {
            SectorCanvas.redrawHighlighted(ctx, value, oldValue, scope.highlightedStar, scope.stars, resourcesHolder.smallstars());
        });
        scope.$watch('showTunnels', function(newValue){
            scope.showTunnels = newValue;
            SectorCanvas.drawTunnels(ctxTunnels, scope.selectedSector, scope.tunnels, scope.showTunnels);
        });
    }
    return {
        restrict: "A",
        templateUrl: "/partials/directive-sector.html",
        link: link
    };
}]);

uiCanvas.directive('systemCanvas', ['resourcesHolder', function(resourcesHolder) {
    function link(scope, element) {
        var ctx = element[0].getContext("2d");

        function drawSystem() {
            ctx.drawImage(imgRes.imgSystemBack, 0, 0, 651, 651);
            var c = document.createElement('canvas');
            c.width = c.height = 651;
            var planetsCtx = c.getContext('2d');
            if(scope.system) {
                var coords = resourcesHolder.bigstars()[scope.system.star];
                if(!coords)
                    console.log("No location for " + scope.system.star);
                if(scope.system.star.indexOf("blackhole") > -1)
                    ctx.drawImage(imgRes.imgBholeBack, 0, 0, 651, 651);
                else
                    ctx.drawImage(imgRes.imgStars, coords.x, coords.y, coords.width, coords.height,
                        8 * 32, 8 * 32, coords.width, coords.height);
                for(var i = 0; i < scope.system.planets.length; i++) {
                    var planet = scope.system.planets[i];
                    coords = resourcesHolder.planets()[planet.type];
                    var img = imgRes.imgPlanets;
                    if(scope.dynamic)
                        if(!planet.data)
                            scope.dynamic.fog[planet.y][planet.x] = 0;
                        else
                            scope.dynamic.fog[planet.y][planet.x] = 1;

                    if(planet.alliance) {
                        ctx.beginPath();
                        ctx.arc(planet.x * 32 + 16, planet.y * 32 + 16, 20, 0, 2 * Math.PI, false);
                        ctx.fillStyle = colors[planet.alliance - 1];
                        ctx.fill();
                    }

                    planetsCtx.putImageData((planet.data) ? Filters.none(img, coords) : Filters.grayscaled(img, coords),
                        (coords.width > 32) ? planet.x * 32 - ((coords.width - 32) / 2) : planet.x * 32,
                        (coords.height > 32) ? planet.y * 32 - ((coords.height - 32) / 2) : planet.y * 32
                        );
                }
                if(scope.dynamic && resourcesHolder.fog()) {
                    var f = scope.dynamic.fog;
                    for(var y = 0; y < 20; y++) {
                        for(var x = 0; x < 20; x++) {
                            if(f[y][x] == 0) {
                                coords = resourcesHolder.fog()[fog_name(f, x, y)];
                                //console.log(y, x, coords);
                                planetsCtx.drawImage(imgRes.fog,
                                    coords.x,
                                    coords.y,
                                    coords.width,
                                    coords.height,
                                    x * 32,
                                    y * 32,
                                    coords.width,
                                    coords.height);
                            }
                        }
                    }
                } else {
                    console.log("Fog");
                }
                ctx.drawImage(c, 0, 0);
            }
        }
        element.bind('mouseup', function(event){
            scope.$apply(function() {
                scope.openPlanet(starCoordinates(event, 0, 0, 32, 32));
            });
        });
        scope.$watch('system', function(value) {
            drawSystem();
        });
        scope.$watch('dynamic', function(value) {
            drawSystem();
        });
    }
    return {
        restrict: "A",
        link: link
    };
}]);

uiCanvas.directive('systemButton', function() {
    return {
        //restrict: 'EA',
        transclude: true,
        scope: {
            sys: '=system'
        },
        templateUrl: "/partials/system-button.html"
    };
});

uiCanvas.directive('buildingButton', function() {
   return {
       //restrict: 'EA',
       transclude: true,
       scope: {
           building: "=building"
       },
       link: function(scope, el) {
           scope.buildingClicked = scope.$parent.buildingClicked;
       },
       template:
           '<button ng-if="building.typeid" ' +
           'class="building buttonlink building{{building.typeid}}_small"' +
           ' uib-tooltip={{building.name}} ng-click="buildingClicked(building.typeid)"> ' +
           '<div ng-if="building.cnt == -1" class="widgets unique_16"></div>' +
           '<b ng-if="building.cnt != -1" style="color:white">{{building.cnt}}</b></button>'
   }
});