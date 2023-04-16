"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFocus = exports.getOptionalStyle = exports.findFirstChildOfClass = exports.findParentOfClass = exports.findEndInContainer = exports.findInNextContainer = exports.childAtIndex = exports.indexInContainer = exports.findNextOfClass = exports.applyAllClasses = exports.hasClass = exports.toggleClass = void 0;
/**
 * Add or remove a class from a classlist, based on a boolean test.
 * @param obj - A page element, or id of an element
 * @param cls - A class name to toggle
 * @param bool - If omitted, cls is toggled in the classList; if true, cls is added; if false, cls is removed
 */
function toggleClass(obj, cls, bool) {
    if (bool === void 0) { bool = undefined; }
    var elmt;
    if ('string' === typeof obj) {
        elmt = document.getElementById(obj);
    }
    else {
        elmt = obj;
    }
    if (elmt !== null && elmt.classList !== null) {
        if (bool === undefined) {
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
exports.toggleClass = toggleClass;
/**
 * Check if an HTML element is tagged with a given CSS class
 * @param obj - A page element, or id of an element
 * @param cls - A class name to test
 * @returns true iff the class is in the classList
 */
function hasClass(obj, cls) {
    var elmt;
    if ('string' === typeof obj) {
        elmt = document.getElementById(obj);
    }
    else {
        elmt = obj;
    }
    return elmt !== null
        && elmt.classList !== null
        && elmt.classList.contains(cls);
}
exports.hasClass = hasClass;
/**
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
function applyAllClasses(obj, classes) {
    var list = classes.split(' ');
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var cls = list_1[_i];
        toggleClass(obj, cls, true);
    }
}
exports.applyAllClasses = applyAllClasses;
/**
 * Given one element, find the next one in the document that matches the desired class
 * @param current - An existing element
 * @param matchClass - A class that this element has
 * @param skipClass - [optional] A class of siblings to be skipped
 * @param dir - 1 (default) finds the next sibling, else -1 finds the previous
 * @returns A sibling element, or null if none is found
 */
function findNextOfClass(current, matchClass, skipClass, dir) {
    if (skipClass === void 0) { skipClass = null; }
    if (dir === void 0) { dir = 1; }
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
exports.findNextOfClass = findNextOfClass;
/**
 * Find the index of the current element among the siblings under its parent
 * @param current - An existing element
 * @param parentObj - A parent element (or the class of a parent)
 * @param sibClass - A class name shared by current and siblings
 * @returns - The index, or -1 if current is not found in the specified parent
 */
function indexInContainer(current, parentObj, sibClass) {
    var parent;
    if (typeof (parent) == 'string') {
        parent = findParentOfClass(current, parentObj);
    }
    else {
        parent = parentObj;
    }
    var sibs = parent.getElementsByClassName(sibClass);
    for (var i = 0; i < sibs.length; i++) {
        if (sibs[i] === current) {
            return i;
        }
    }
    return -1;
}
exports.indexInContainer = indexInContainer;
/**
 * Get the index'ed child element within this parent
 * @param parent - An existing element
 * @param childClass - A class of children under parent
 * @param index - The index of the desired child. A negative value counts back from the end
 * @returns The child element, or null if no children
 */
function childAtIndex(parent, childClass, index) {
    var sibs = parent.getElementsByClassName(childClass);
    if (index < 0) {
        index = sibs.length + index;
    }
    else if (index >= sibs.length) {
        index = sibs.length - 1;
    }
    if (index < 0) {
        return null;
    }
    return sibs[index];
}
exports.childAtIndex = childAtIndex;
/**
 * Given an input in one container, find an input in the next container
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
*/
function findInNextContainer(current, matchClass, skipClass, containerClass, dir) {
    if (dir === void 0) { dir = 1; }
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
exports.findInNextContainer = findInNextContainer;
/**
 * Find either the first or last sibling element under a parent
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
* @returns The first or last sibling element, or null if no matches
 */
function findEndInContainer(current, matchClass, skipClass, containerClass, dir) {
    if (skipClass === void 0) { skipClass = null; }
    if (dir === void 0) { dir = 1; }
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    return findFirstChildOfClass(container, matchClass, skipClass, dir);
}
exports.findEndInContainer = findEndInContainer;
/**
 * Find the nearest containing node that contains the desired class.
 * @param elmt - An existing element
 * @param parentClass - A class name of a parent element
 * @returns The nearest matching parent element, up to but not including the body
 */
function findParentOfClass(elmt, parentClass) {
    if (parentClass == null || parentClass == undefined) {
        return null;
    }
    while (elmt !== null && elmt.tagName !== 'body') {
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        elmt = elmt.parentNode;
    }
    return null;
}
exports.findParentOfClass = findParentOfClass;
/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param elmt - A parent element
 * @param childClass - A class name of the desired child
 * @param skipClass - [optional] A class name to avoid
 * @param dir - If positive (default), search forward; else search backward
 * @returns A child element, if a match is found, else null
 */
function findFirstChildOfClass(elmt, childClass, skipClass, dir) {
    if (skipClass === void 0) { skipClass = null; }
    if (dir === void 0) { dir = 1; }
    var children = elmt.getElementsByClassName(childClass);
    for (var i = dir == 1 ? 0 : children.length - 1; i >= 0 && i < children.length; i += dir) {
        if (skipClass !== null && hasClass(children[i], skipClass)) {
            continue;
        }
        return children[i];
    }
    return null;
}
exports.findFirstChildOfClass = findFirstChildOfClass;
/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, BODY)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @param defaultStyle - (optional) The default value, if no tag is found with the attribute. Null if omitted.
 * @param prefix - (optional) - A prefix to apply to the answer
 * @returns The found or default style, optional with prefix added
 */
function getOptionalStyle(elmt, attrName, defaultStyle, prefix) {
    if (defaultStyle === void 0) { defaultStyle = null; }
    if (prefix === void 0) { prefix = ''; }
    var val = elmt.getAttribute(attrName);
    while (val === null) {
        elmt = elmt.parentNode;
        if (elmt === null || elmt.tagName === 'BODY') {
            val = defaultStyle;
            break;
        }
        else {
            val = elmt.getAttribute(attrName);
        }
    }
    return (val === null || prefix === null) ? val : (prefix + val);
}
exports.getOptionalStyle = getOptionalStyle;
/**
 * Move focus to the given input (if not null), and select the entire contents.
 * If input is of type number, do nothing.
 * @param input - A text input element
 * @param caret - The character index where the caret should go
 * @returns true if the input element and caret position are valid, else false
 */
function moveFocus(input, caret) {
    if (caret === void 0) { caret = undefined; }
    if (input !== null) {
        input.focus();
        if (input.type !== 'number') {
            if (caret === undefined) {
                input.setSelectionRange(0, input.value.length);
            }
            else {
                input.setSelectionRange(caret, caret);
            }
        }
        return true;
    }
    return false;
}
exports.moveFocus = moveFocus;
//# sourceMappingURL=classUtil.js.map