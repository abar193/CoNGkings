/**
 * Created by Abar on 30-Oct-15.
 */
var uiCanvas = angular.module('uiCanvas', ['uiServices']);

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

uiCanvas.directive('sectorCanvas', ['galaxyHolder', function(galaxyHolder) {
    function link(scope, element, attrs) {
        var ctx = element[0].getContext("2d");

        function drawStars() {
            if(scope.stars) {
                ctx.drawImage(imgRes.imgSectorBack, 0, 0, 651, 651);
                for(var y = 0; y < scope.stars.length; y++) {
                    for(var x = 0; x < scope.stars[y].length; x++) {
                        if(scope.stars[y][x].type && small_stars['star_small_' + scope.stars[y][x].type]) {
                            var coords = small_stars['star_small_' + scope.stars[y][x].type];
                            var img = (Math.random() < 0.8) ? imgRes.imgStarsSmall :
                                ((Math.random() < 0.5) ? imgRes.imgStarsSmallAltered : imgRes.imgStarsSmallAltered2);
                            ctx.drawImage(img, coords.x, coords.y, coords.width, coords.height,
                                21 + x * 21, 21 + y * 21, 20, 20);
                        } else {
                            if(scope.stars[y][x].type)
                                console.log("No json-location defined for small-star of type:", scope.stars[y][x].type);
                        }
                    }
                }
            }
            if(scope.tunnels && scope.showTunnels) {
                ctx.beginPath();
                for(var i = 0; i < scope.tunnels.length; i++) {
                    var cFrom = locToCoordinates(scope.tunnels[i].from);
                    var cTo = locToCoordinates(scope.tunnels[i].to);
                    if(cTo != null && cFrom != null) {
                        var selSec = scope.selectedSector;
                        if(cFrom.sector == selSec || cTo.sector == selSec) {
                            ctx.moveTo((cFrom.sector == selSec) ? cFrom.x * 21 + 31 : (cFrom.sector > selSec) ? 651 : 0,
                                (cFrom.sector == selSec) ? cFrom.y * 21 + 31 : cTo.y * 21 + 35);
                            ctx.lineTo((cTo.sector == selSec) ? cTo.x * 21 + 31 : (cTo.sector > selSec) ? 651 : 0,
                                (cTo.sector == selSec) ? cTo.y * 21 + 31 : cFrom.y * 21 + 35);
                        }
                    }
                }
                ctx.strokeStyle="#3333BB";
                ctx.stroke();
            }
            ctx.font = "15px Arial";
            ctx.fillStyle = "#3333BB";
            ctx.fillText(scope.selectedSector + "", 5, 15);
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
        scope.$watch(function() { return galaxyHolder.selectedSector(); }, function(value) {
            scope.stars = galaxyHolder.sectors()[galaxyHolder.selectedSector()];
            scope.selectedSector = value;
            drawStars();
        });
        scope.$watch(function() { return galaxyHolder.sectors(); }, function(value) {
            scope.stars = galaxyHolder.sectors()[galaxyHolder.selectedSector()];
            drawStars();
        });
        scope.$watch(function() { return galaxyHolder.tunnels(); }, function(value) {
            scope.tunnels = value;
            drawStars();
        });
        scope.$watch('showTunnels', function(newValue){
            scope.showTunnels = newValue;
            drawStars();
        });
        var intervalID = setInterval(function(){drawStars()}, 500);
        scope.$on('$destroy', function() {
            clearInterval(intervalID);
        });
    }
    return {
        restrict: "A",
        link: link
    };
}]);

function imageFiltered(image, coordinates) {
    var c = document.createElement('canvas');
    c.width = coordinates.width;
    c.height = coordinates.height;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(image,
        coordinates.x,
        coordinates.y,
        coordinates.width,
        coordinates.height,
        0,
        0,
        coordinates.width,
        coordinates.height);
    var data = ctx.getImageData(0, 0, c.width, c.height);
    console.log(data.data);
    var d = data.data;
    for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v;
    }
    console.log(data.data);
    return data;
}

uiCanvas.directive('systemCanvas', [function() {
    function link(scope, element) {
        var ctx = element[0].getContext("2d");

        function drawSystem() {
            ctx.drawImage(imgRes.imgSystemBack, 0, 0, 651, 651);
            var c = document.createElement('canvas');
            c.width = c.height = 651;
            var planetsCtx = c.getContext('2d');
            if(scope.system) {
                var coords = stars_big[scope.system.star];
                if(scope.system.star.indexOf("blackhole") > -1)
                    ctx.drawImage(imgRes.imgBholeBack, 0, 0, 651, 651);
                else
                    ctx.drawImage(imgRes.imgStars, coords.x, coords.y, coords.width, coords.height,
                        8 * 32, 8 * 32, coords.width, coords.height);
                ctx.beginPath();
                for(var y = 0; y < 20; y++) {
                    for(var x = 0; x < 20; x++) {
                        ctx.moveTo(x * 32, 0);
                        ctx.lineTo(x * 32, ctx.canvas.height);
                        ctx.moveTo(0, y * 32);
                        ctx.lineTo(ctx.canvas.width, y * 32);
                    }
                }
                ctx.strokeStyle="#3333BB";
                //ctx.stroke();
                for(var i = 0; i < scope.system.planets.length; i++) {
                    var planet = scope.system.planets[i];
                    coords = planets[planet.type];
                    var img = imgRes.imgPlanets;
                    console.log(planet.x * 32, planet.y * 32);
                    var data = imageFiltered(img, coords);
                    console.log("Final data", data);
                    planetsCtx.putImageData(data,
                        (coords.width > 32) ? planet.x * 32 - ((coords.width - 32) / 2) : planet.x * 32,
                        (coords.height > 32) ? planet.y * 32 - ((coords.height - 32) / 2) : planet.y * 32
                        );
                }
                ctx.drawImage(c, 0, 0);
            }
        }
        scope.$watch('system', function(value) {
            drawSystem();
        });
    }
    return {
        restrict: "A",
        link: link
    };
}]);

