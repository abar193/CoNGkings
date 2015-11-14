
SectorCanvas = {};
SectorCanvas.drawStars = function drawStars(ctx, stars, highlightedStar) {
    ctx.clearRect(0, 0, 651, 651);
    if(stars) {
        for(var y = 0; y < stars.length; y++) {
            for(var x = 0; x < stars[y].length; x++) {
                if(stars[y][x].type && small_stars['star_small_' + stars[y][x].type]) {
                    var coords = small_stars['star_small_' + stars[y][x].type];
                    var img = imgRes.imgStarsSmall;
                    if(highlightedStar && highlightedStar.loc == stars[y][x].loc) {
                        ctx.putImageData(Filters.messed(img, coords, 0, 75, 30),
                            21 + x * 21, 21 + y * 21);
                    } else {
                        ctx.drawImage(img,
                            coords.x,
                            coords.y,
                            coords.width,
                            coords.height,
                            21 + x * 21,
                            21 + y * 21,
                            coords.width,
                            coords.height);
                    }
                } else {
                    if(stars[y][x].type)
                        console.log("No json-location defined for small-star of type:", scope.stars[y][x].type);
                }
            }
        }
    }
};
SectorCanvas.drawTunnels = function drawTunnels(ctx, sector, tunnels, tunnelsEnabled) {
    ctx.clearRect(0, 0, 651, 651);
    if(tunnels && tunnelsEnabled) {
        ctx.beginPath();
        for(var i = 0; i < tunnels.length; i++) {
            var cFrom = locToCoordinates(tunnels[i].from);
            var cTo = locToCoordinates(tunnels[i].to);
            if(cTo != null && cFrom != null) {
                var selSec = sector;
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
};
SectorCanvas.redrawHighlighted = function redrawHighlighted(ctx, loc1, loc2, highlightedStar, stars) {
    var arr = [loc1, loc2];
    for(var i = 0; i < arr.length; i++) {
        if(arr[i]) {
            var location = locToCoordinates(arr[i]);
            var x = location.x;
            var y = location.y;
            var coords = small_stars['star_small_' + stars[y][x].type];
            var img = imgRes.imgStarsSmall;
            ctx.clearRect(21 + x * 21, 21 + y * 21, 21, 21);
            if (highlightedStar && highlightedStar.loc == stars[y][x].loc) {
                ctx.putImageData(Filters.messed(img, coords, 0, 75, 30),
                    21 + x * 21, 21 + y * 21);
            } else {
                ctx.drawImage(img,
                    coords.x,
                    coords.y,
                    coords.width,
                    coords.height,
                    21 + x * 21,
                    21 + y * 21,
                    coords.width,
                    coords.height);
            }
        }
    }
};

Filters = {c: document.createElement('canvas')};
Filters.getData = function getData(image, coordinates) {
    var c = this.c;
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
    return ctx.getImageData(0, 0, c.width, c.height);

};
Filters.grayscaled = function grayscaled(image, coordinates) {
    var data = this.getData(image, coordinates);
    var d = data.data;
    for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2156*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v;
    }
    return data;
};

//SectorCanvas.drawStars = function(ctx, stars) {
//
//};

Filters.none = function none(image, coordinates) {
    return this.getData(image, coordinates);
};
Filters.bright = function none(image, coordinates, ammount) {
    var data = this.getData(image, coordinates);
    var d = data.data;
    for (var i=0; i<d.length; i+=4) {
        d[i] += ammount;
        d[i+1] += ammount;
        d[i+2] += ammount;
    }
    return data;
};
Filters.messed = function none(image, coordinates, ammountRed, ammountGreen, ammountBlue) {
    var data = this.getData(image, coordinates);
    var d = data.data;
    for (var i=0; i<d.length; i+=4) {
        d[i] += ammountRed;
        d[i+1] += ammountGreen;
        d[i+2] += ammountBlue;
    }
    return data;
};
