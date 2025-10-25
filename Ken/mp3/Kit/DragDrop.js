// When found, expand those elements appropriately.
function dragSetup() {
    simpleSetup();
    preprocessDragFunctions();
    indexAllDragDropFields();
    setTimeout(checkLocalStorage, 100);
}

function textAndDragSetup() {
    textSetup(false);
    preprocessDragFunctions();
    indexAllDragDropFields();
    setTimeout(checkLocalStorage, 100);
}

// VOCABULARY
// moveable: any object which can be clicked on to begin a move
// drop-target: a container that can receive a (single) moveable element
// drag-source: a container that can hold a single spare moveable element

// Scan the page for anything marked moveable, drag-source, or drop-target
// Those items get click handlers
function preprocessDragFunctions() {
    var elems = document.getElementsByClassName('moveable');
    for (var i = 0; i < elems.length; i++) {
        preprocessMoveable(elems[i]);
    }

    var elems = document.getElementsByClassName('drop-target');
    for (var i = 0; i < elems.length; i++) {
        elems[i].onmouseup=function(e){onClickDrop(e)};
        elems[i].ondragenter=function(e){onDropAllowed(e)};
        elems[i].ondragover=function(e){onDropAllowed(e)};
    }

    var elems = document.getElementsByClassName('free-drop');
    for (var i = 0; i < elems.length; i++) {
        elems[i].onmousedown=function(e){doFreeDrop(e)};
        elems[i].ondragenter=function(e){onDropAllowed(e)};
        elems[i].ondragover=function(e){onDropAllowed(e)};

        var height = parseInt(elems[i].getBoundingClientRect().height);
        var zUp = hasClass(elems[i], 'z-grow-up');
        var zDown = hasClass(elems[i], 'z-grow-down');
        if (zUp || zDown) {
            var children = elems[i].getElementsByClassName('moveable');
            for (var j = 0; j < children.length; j++) {
                var z = parseInt(children[j].style.top);
                z = zUp ? 1000 + (height - z) : z;
                children[j].style.zIndex = z;
            }
        }
    }
}

function preprocessMoveable(elem) {
    elem.onmousedown=function(e){onClickDrag(e)};
    elem.ondrag=function(e){onDrag(e)};
    elem.ondragend=function(e){onDragDrop(e)};
}

var priorDrag = null;
var dragSelected = null;
var dropHover = null;
var dragPoint = null;

// Pick up an object
function pickUp(obj) {
    priorDrag = dragSelected;
    if (dragSelected != null && dragSelected != obj) {
        toggleClass(dragSelected, 'drag-selected', false);
        dragSelected = null;
    }
    if (obj != null && obj != dragSelected) {
        dragSelected = obj;
        toggleClass(dragSelected, 'displaced', false);  // in case from earlier
        toggleClass(dragSelected, 'placed', false);
        toggleClass(dragSelected, 'drag-selected', true);
    }
}

// Drop the selected drag object onto a destination
// If something else is already there, it gets moved to an empty drag source
// Once complete, nothing is selected.
function doDrop(dest) {
    var src = getDragSource();
    if (dest === src) {
        if (priorDrag !== dragSelected) {
            // Don't treat the first click of a 2-click drag
            // as a 1-click non-move.
            return;
        }
        // 2nd click on src is equivalent to dropping no-op
        dest = null;
    }

    if (dest != null) {
        var other = findFirstChildOfClass(dest, 'moveable', null, 0);
        if (other != null) {
            dest.removeChild(other);
        }
        src.removeChild(dragSelected);
        dest.appendChild(dragSelected);
        saveContainerLocally(dragSelected, dest);
    }

    toggleClass(dragSelected, 'placed', true);
    toggleClass(dragSelected, 'drag-selected', false);
    dragSelected = null;
    dragPoint = null;

    if (dropHover != null) {
        toggleClass(dropHover, 'drop-hover', false);
        dropHover = null;
    }

    if (other != null) {
        // Any element that was previous at dest swaps places
        toggleClass(other, 'placed', false);
        toggleClass(other, 'displaced', true);
        if (!hasClass(src, 'drag-source')) {
            // Don't displace to a destination if an empty source is available
            var src2 = findEmptySource();
            if (src2 != null) {
                src = src2;
            }
        }
        src.appendChild(other);
    }
}

function doFreeDrop(event) {
    if (dragPoint != null && event.clientX == dragPoint.x && event.clientY == dragPoint.y && priorDrag == null) {
        // This is the initial click
        return;
    }
    if (dragSelected != null) {
        var dx = event.clientX - dragPoint.x;
        var dy = event.clientY - dragPoint.y;
        var oldLeft = parseInt(dragSelected.style.left);
        var oldTop = parseInt(dragSelected.style.top);
        dragSelected.style.left = (oldLeft + dx) + 'px';
        dragSelected.style.top = (oldTop + dy) + 'px';

        updateZ(dragSelected, oldTop + dy);
        savePositionLocally(dragSelected);
        doDrop(null);
    }
}

function updateZ(elem, y) {
    var dest = findParentOfClass(elem, 'free-drop');
    if (hasClass(dest, 'z-grow-down')) {
        elem.style.zIndex = parseInt(1000 + y);
    }
    else if (hasClass(dest, 'z-grow-up')) {
        var rect = dest.getBoundingClientRect();
        elem.style.zIndex = parseInt(rect.height + 1000 - y);
    }
}

/// The drag-target or drag-source that is the current parent of the dragging item
function getDragSource() {
    if (dragSelected != null) {
        var src = findParentOfClass(dragSelected, 'drop-target');
        if (src == null) {
            src = findParentOfClass(dragSelected, 'drag-source');
        }
        if (src == null) {
            src = findParentOfClass(dragSelected, 'free-drop');
        }
        return src;
    }
    return null;
}

// Initialize a drag with mouse-down
// This may be the beginning of a 1- or 2-click drag action
function onClickDrag(event) {
    if (event.srcElement.tagName == 'INPUT') {
        return;
    }
    var obj = findParentOfClass(event.srcElement, 'moveable');
    if (obj != null) {
        if (dragSelected == null) {
            pickUp(obj);
            dragPoint = {x: event.clientX, y: event.clientY};
        }
        else if (obj == dragSelected) {
            // 2nd click on this object - enable no-op drop
            priorDrag = obj;
        }
    }
}

// Concluide a drag with a 2nd mouse-up
function onClickDrop(event) {
    var obj = event.srcElement;
    if (obj.tagName == 'INPUT') {
        return;
    }
    if (dragSelected != null) {
        dest = findParentOfClass(obj, 'drop-target');
        doDrop(dest);
    }
}

// Conlcude a drag with a single drag-move-release
function onDragDrop(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest != null) {
        doDrop(dest);
    }
    else {
        dest = findParentOfClass(elem, 'free-drop');
        if (dest != null) {
            doFreeDrop(event);
        }
    }
}

// As a drag is happening, highlight the destination
function onDrag(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest != dropHover) {
        toggleClass(dropHover, 'drop-hover', false);

        var src = getDragSource();
        if (dest != src) {
            toggleClass(dest, 'drop-hover', true);
            dropHover = dest;
        }
    }
}

// As a drag is happening, make the cursor show valid or invalid targets
function onDropAllowed(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest == null) {
        dest = findParentOfClass(elem, 'free-drop');
    }
    if (dragSelected != null && dest != null) {
        event.preventDefault();
    }
}

// Find a drag-source that is currently empty
function findEmptySource() {
    var elems = document.getElementsByClassName('drag-source');
    for (var i = 0; i < elems.length; i++) {
        if (findFirstChildOfClass(elems[i], 'moveable', null, 0) == null) {
            return elems[i];
        }
    }
    // All drag sources are occupied
    return null;
}

function quickMove(moveable, destination) {
    if (moveable != null && destination != null) {
        pickUp(moveable);
        doDrop(destination);    
    }
}

function quickFreeMove(moveable, position) {
    if (moveable != null && position != null) {
        moveable.style.left = position.x + 'px';
        moveable.style.top = position.y + 'px';
        updateZ(moveable, position.y);
        toggleClass(moveable, 'placed', true);
    }
}