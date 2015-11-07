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
                ctx.drawImage(imgSystemBack, 0, 0, 651, 651);
                for(var y = 0; y < scope.stars.length; y++) {
                    for(var x = 0; x < scope.stars[y].length; x++) {
                        if(scope.stars[y][x].type && small_stars['star_small_' + scope.stars[y][x].type]) {
                            var coords = small_stars['star_small_' + scope.stars[y][x].type];
                            ctx.drawImage(imgStarsSmall, coords.x, coords.y, coords.width, coords.height,
                                21 + x * 21, 21 + y * 21, 20, 20);
                        } else {
                            if(scope.stars[y][x].type) console.log("No json-location defined for small-star of type: ", scope.stars[y][x].type);
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
    }
    return {
        restrict: "A",
        link: link
    };
}]);

