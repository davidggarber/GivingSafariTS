// Add or remove a class from a classlist, based on a boolean test.
// elmt can be an html element, or an ID of a element
function toggleClass(elmt, cls, bool) {
    if (elmt != null && 'string' == typeof elmt) {
        elmt = document.getElementById(id);
    }
    if (elmt != null && elmt.classList != null) {
        if (bool == undefined) {
            bool = !elmt.classList.contains(cls);
        }
        if (bool) {
            elmt.classList.add(cls);
        }
        else {
            elmt.classList.remove(cls);
        }
    }
}

// Check if an HTML element is tagged with a given CSS class
// elmt can be an html element, or an ID of a element
function hasClass(elmt, cls) {
    if ('string' == typeof elmt) {
        elmt = document.getElementById(elmt);
    }
    return elmt != null 
        && elmt.classList != null
        && elmt.classList.contains(cls);
}

// Treat classes as a space-delimited list of class names
// Apply each one to elmt
function applyAllClasses(elmt, classes) {
    var list = classes.split(' ');
    for (var i = 0; i < list.length; i++) {
        toggleClass(elmt, list[i], true);
    }
}

// Given one element, find the next one in the document that matches the desired class
function findNextOfClass(current, matchClass, skipClass, dir) {
    dir = dir || 1;
    skipClass = skipClass || null;
    var inputs = document.getElementsByClassName(matchClass);
    var found = false;
    for (var i = dir == 1 ? 0 : inputs.length - 1; i >= 0 && i < inputs.length; i += dir) {
        if (skipClass != null && hasClass(inputs[i], skipClass)) {
            continue;
        }
        if (found) {
            return inputs[i];
        }
        found = inputs[i] == current;
    }
    return null;
}

// Find the index of the current element above the siblings under its parent
// parent can be either an element or a class name
function indexInContainer(current, parent, sibClass) {
    if (typeof(parent) == 'string') {
        parent = findParentOfClass(current, parent);
    }
    var sibs = parent.getElementsByClassName(sibClass);
    for (var i = 0; i < sibs.length; i++) {
        if (sibs[i] === current) {
            return i;
        }
    }
    return -1;
}

// Get the index'ed child element within this parent
function childAtIndex(parent, childClass, index) {
    var sibs = parent.getElementsByClassName(childClass);
    if (index < 0) {
        index = sibs.length + index;
    }
    else if (index >= sibs.length) {
        index = sibs.length - 1;
    }
    return sibs[index];
}

/* Given an input in one container, find an input in the next container
 * @param current: the reference element
 * @param matchClass: the class we're looking for
 * @param skipClass: a class we're avoiding
 * @param containerClass: the parent level to go up to, before coming back down
 * @param dir: 1 to go forward, -1 to go back
 */
function findInNextContainer(current, matchClass, skipClass, containerClass, dir) {
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    var nextContainer = findNextOfClass(container, containerClass, null, dir);
    while (nextContainer != null) {
        var child = findFirstChildOfClass(nextContainer, matchClass, skipClass);
        if (child != null) {
            return child;
        }
        // Look further ahead
        nextContainer = findNextOfClass(nextContainer, containerClass, null, dir);
    }
    return null;
}

// Given an input in one container, find an input in the next container
function findEndInContainer(current, matchClass, skipClass, containerClass, dir) {
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    return findFirstChildOfClass(container, matchClass, skipClass, dir);
}

// Find the nearest containing node that contains the desired class.
// Walk up the DOM tree (as far as BODY)
function findParentOfClass(elmt, parentClass) {
    if (parentClass == null || parentClass == undefined) {
        return null;
    }
    while (elmt != null && elmt.tagName != 'BODY') {
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        elmt = elmt.parentNode;
    }
    return null;
}

// Return the first child/descendent of the current element
// Which is tagged with the desired class, and not with the skip class.
function findFirstChildOfClass(elmt, childClass, skipClass, dir) {
    dir = dir || 1;
    var children = elmt.getElementsByClassName(childClass);
    for (var i = dir == 1 ? 0 : children.length - 1; i >= 0 && i < children.length; i += dir) {
        if (skipClass != null && hasClass(children[i], skipClass)) {
            continue;
        }
        return children[i];
    }
    return null;
}

// Move focus to the given input (if not null), and select the entire contents
function moveFocus(input, cursor) {
    if (input != null) {
        input.focus();
        if (input.type != 'number') {
            if (cursor == undefined) {
                input.setSelectionRange(0, input.value.length);
            }
            else {
                input.setSelectionRange(cursor, cursor);
            }
        }
        return true;
    }
    return false;
}
