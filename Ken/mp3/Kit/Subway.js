// On page load, look for any instances of elements tag with class names we respond to.
// When found, expand those elements appropriately.
function textAndSubwaySetup(load) {
    simpleSetup();
    setupLetterPatterns();
    setupExtractPattern();
    setupLetterCells();
    setupLetterInputs();
    setupSubways();
    setupWordCells();
    indexAllInputFields();
    if (load != false) {  // default is true
        setTimeout(checkLocalStorage, 100);
    }
}

function setupSubways() {
    var subways = document.getElementsByClassName('subway');
    for (var i = 0; i < subways.length; i++) {
        createSubway(subways[i]);
    }
}

function maxx(curr, val) {
    return (curr == null || curr < val) ? val : curr;
}
function minn(curr, val) {
    return (curr == null || curr > val) ? val : curr;
}
function bounding(rect, pt) {
    if (rect == null) {
        return {left:pt.x, right:pt.x, top:pt.y, bottom:pt.y};
    }
    return {
        left: minn(rect.left, pt.x),
        right: maxx(rect.right, pt.x),
        top: minn(rect.top, pt.y),
        bottom: maxx(rect.bottom, pt.y)
    };
}
function dec(n) {
    return Math.round(n * 10) / 10;
}

function createSubway(subway) {
    var xmlns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(xmlns, 'svg');
    var path = document.createElementNS(xmlns, 'path');
    var origin = subway.getBoundingClientRect();

    var lefts = subway.getAttributeNS('', 'data-left-end');
    var rights = subway.getAttributeNS('', 'data-right-end');
    var vertical = lefts != null || rights != null;
    if (vertical) {
        var bounds = null;
        var yLefts = [];
        var yRights = [];

        // right-side spurs
        rights = rights || '';
        rights = rights.split(' ');
        for (var i = 0; i < rights.length; i++) {
            var pt = getAnchor(rights[i], 'left');
            bounds = bounding(bounds, pt);
            yRights.push(dec(pt.y - origin.top));
        }

        // left-side spurs
        lefts = lefts || '';
        lefts = lefts.split(' ');
        for (var i = 0; i < lefts.length; i++) {
            var pt = getAnchor(lefts[i], 'right');
            bounds = bounding(bounds, pt);
            yLefts.push(dec(pt.y - origin.top));
        }

        // rationalize the boundaries
        var shift_left = minn(0, bounds.left - origin.left);
        var left = maxx(0, dec(bounds.left - origin.left - shift_left));
        var right = dec(bounds.right - origin.left - shift_left);

        // belatedly calculate the middle
        var middle = subway.getAttributeNS('', 'data-center-line');
        if (middle.endsWith('%')) {
            middle = dec(parseInt(middle) * (bounds.right - bounds.left) / 100);
        }
        else {
            middle = parseInt(middle);
        }
        
        // Draw the first left to the last right
        var d = 'M' + left + ',' + yLefts[0] 
            + ' L' + middle + ',' + yLefts[0]
            + ' L' + middle + ',' + yRights[yRights.length - 1]
            + ' L' + right + ',' + yRights[yRights.length - 1];
        if (yLefts.length > 0 || yRights.length > 0) {
            // Draw the last left to the first right
            d += 'M' + left + ',' + yLefts[yLefts.length - 1] 
                + ' L' + middle + ',' + yLefts[yLefts.length - 1]
                + ' L' + middle + ',' + yRights[0]
                + ' L' + right + ',' + yRights[0];
        }
        // Add any middle spurs
        for (var i = 1; i < yLefts.length - 1; i++) {
            d += 'M' + left + ',' + yLefts[i] 
                + ' L' + middle + ',' + yLefts[i]
                + ' L' + middle + ',' + yRights[0];
        }
        for (var i = 1; i < yRights.length - 1; i++) {
            d += 'M' + right + ',' + yRights[i] 
                + ' L' + middle + ',' + yRights[i]
                + ' L' + middle + ',' + yLefts[0];
        }

        path.setAttributeNS(null, 'd', d);
        svg.appendChild(path);
        svg.setAttributeNS(null, 'width', dec(bounds.right - origin.left - shift_left) + 2);
        svg.setAttributeNS(null, 'height', dec(bounds.bottom - origin.top) + 2);
        subway.appendChild(svg);

        if (shift_left != 0) {
            subway.style.left = dec(shift_left) + 'px';
        }

    }
}

function getAnchor(id_index, edge) {
    var idx = id_index.split('.');
    var elmt = document.getElementById(idx[0]);
    if (idx.length > 1) {
        var children = elmt.getElementsByClassName('letter-cell');
        elmt = children[parseInt(idx[1]) - 1];  // indexes start at 1
    }
    var rect = elmt.getBoundingClientRect();
    if (edge == 'left') {
        return {x:rect.left, y: rect.top + 1 + rect.height / 2};
    }
    if (edge == 'right') {
        return {x:rect.right, y: rect.top - 1 + rect.height / 2};
    }
    if (edge == 'top') {
        return {x:rect.left + 1 + rect.width / 2, y: rect.top};
    }
    if (edge == 'bottom') {
        return {x:rect.left - 1 + rect.width / 2, y: rect.bottom};
    }
    return null;  // error
}