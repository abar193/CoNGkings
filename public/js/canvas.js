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
        var stars, tunnels;
        var showTunnels = true;
        var selectedSector = 0;
        ctx = element[0].getContext("2d");

        function drawStars() {
            if(stars) {
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
            if(tunnels && showTunnels) {
                ctx.beginPath();
                for(var i = 0; i < tunnels.length; i++) {
                    var cFrom = locToCoordinates(tunnels[i].from);
                    var cTo = locToCoordinates(tunnels[i].to);
                    if(cTo != null && cFrom != null) {
                        if(cFrom.sector == selectedSector || cTo.sector == selectedSector) {
                            ctx.moveTo((cFrom.sector == selectedSector) ? cFrom.x * 21 + 31 : (cFrom.sector > selectedSector) ? 651 : 0,
                                (cFrom.sector == selectedSector) ? cFrom.y * 21 + 31 : cTo.y * 21 + 35);
                            ctx.lineTo((cTo.sector == selectedSector) ? cTo.x * 21 + 31 : (cTo.sector > selectedSector) ? 651 : 0,
                                (cTo.sector == selectedSector) ? cTo.y * 21 + 31 : cFrom.y * 21 + 35);
                        }
                    }
                }
                ctx.strokeStyle="#3333BB";
                ctx.stroke();
            }
            ctx.font = "15px Arial";
            ctx.fillStyle = "#3333BB";
            ctx.fillText(selectedSector + "", 5, 15);
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
        scope.$watch(function() { return galaxyHolder.selectedSector(); }, function(value) {
            stars = galaxyHolder.sectors()[galaxyHolder.selectedSector()];
            selectedSector = value;
            drawStars();
        });
        scope.$watch(function() { return galaxyHolder.sectors(); }, function(value) {
            stars = galaxyHolder.sectors()[galaxyHolder.selectedSector];
            drawStars();
        });
        scope.$watch(function() { return galaxyHolder.tunnels(); }, function(value) {
            tunnels = value;
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
}]);

