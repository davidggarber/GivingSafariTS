"use strict";
/*-----------------------------------------------------------
 * _classUtil.ts
 *-----------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexAllDragDropFields = exports.indexAllCheckFields = exports.indexAllNoteFields = exports.indexAllInputFields = exports.mapGlobalIndeces = exports.findGlobalIndex = exports.getGlobalIndex = exports.saveGuessHistory = exports.saveStraightEdge = exports.saveHighlightLocally = exports.saveStampingLocally = exports.savePositionLocally = exports.saveContainerLocally = exports.saveCheckLocally = exports.saveNoteLocally = exports.saveWordLocally = exports.saveLetterLocally = exports.checkLocalStorage = exports.storageKey = exports.toggleDecoder = exports.setupDecoderToggle = exports.toggleHighlight = exports.setupHighlights = exports.setupCrossOffs = exports.toggleNotes = exports.setupNotes = exports.constructSvgStampable = exports.constructSvgImageCell = exports.constructSvgTextCell = exports.svg_xmlns = exports.constructTable = exports.newTR = exports.SortElements = exports.moveFocus = exports.getAllElementsWithAttribute = exports.getOptionalStyle = exports.findFirstChildOfClass = exports.findParentOfTag = exports.isSelfOrParent = exports.findParentOfClass = exports.isTag = exports.findEndInContainer = exports.findInNextContainer = exports.childAtIndex = exports.indexInContainer = exports.findNextOfClass = exports.clearAllClasses = exports.applyAllClasses = exports.hasClass = exports.toggleClass = void 0;
exports.linkCss = exports.addLink = exports.forceReload = exports.isRestart = exports.isIcon = exports.isPrint = exports.isIFrame = exports.isBodyDebug = exports.isDebug = exports.getSafariDetails = exports.initSafariDetails = exports.clearAllStraightEdges = exports.createFromVertexList = exports.EdgeTypes = exports.getStraightEdgeType = exports.preprocessRulerFunctions = exports.distance2 = exports.distance2Mouse = exports.positionFromCenter = exports.doStamp = exports.getStampParent = exports.getCurrentStampToolId = exports.preprocessStampObjects = exports.quickFreeMove = exports.quickMove = exports.initFreeDropZorder = exports.preprocessDragFunctions = exports.positionFromStyle = exports.setupSubways = exports.getLetterStyles = exports.textSetup = exports.autoCompleteWord = exports.onWordChange = exports.onLetterChange = exports.extractWordIndex = exports.updateWordExtraction = exports.onWordKey = exports.afterInputUpdate = exports.onLetterKey = exports.onLetterKeyDown = exports.getCurFileName = exports.resetPuzzleProgress = exports.resetAllPuzzleStatus = exports.listPuzzlesOfStatus = exports.getPuzzleStatus = exports.updatePuzzleList = exports.PuzzleStatus = exports.indexAllVertices = exports.indexAllHighlightableFields = exports.indexAllDrawableFields = void 0;
exports.builtInTemplate = exports.getTemplate = exports.globalContextData = exports.anyFromContext = exports.expandControlTags = exports.theBoilerContext = exports.decodeAndValidate = exports.validateInputReady = exports.setupValidation = exports.theBoiler = void 0;
/**
 * Add or remove a class from a classlist, based on a boolean test.
 * @param obj - A page element, or id of an element
 * @param cls - A class name to toggle (unless null)
 * @param bool - If omitted, cls is toggled in the classList; if true, cls is added; if false, cls is removed
 */
function toggleClass(obj, cls, bool) {
    if (obj === null || obj === undefined || cls === null || cls === undefined) {
        return;
    }
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
    if (obj === null || obj === undefined || cls === undefined) {
        return false;
    }
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
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
function clearAllClasses(obj, classes) {
    var list = classes.split(' ');
    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
        var cls = list_2[_i];
        toggleClass(obj, cls, false);
    }
}
exports.clearAllClasses = clearAllClasses;
/**
 * Given one element, find the next one in the document that matches the desired class
 * @param current - An existing element
 * @param matchClass - A class that this element has
 * @param skipClass - [optional] A class of siblings to be skipped
 * @param dir - 1 (default) finds the next sibling, else -1 finds the previous
 * @returns A sibling element, or null if none is found
 */
function findNextOfClass(current, matchClass, skipClass, dir) {
    if (dir === void 0) { dir = 1; }
    var inputs = document.getElementsByClassName(matchClass);
    var found = false;
    for (var i = dir == 1 ? 0 : inputs.length - 1; i >= 0 && i < inputs.length; i += dir) {
        if (skipClass != undefined && hasClass(inputs[i], skipClass)) {
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
    if (typeof (parentObj) == 'string') {
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
    var nextContainer = findNextOfClass(container, containerClass, undefined, dir);
    while (nextContainer != null) {
        var child = findFirstChildOfClass(nextContainer, matchClass, skipClass);
        if (child != null) {
            return child;
        }
        // Look further ahead
        nextContainer = findNextOfClass(nextContainer, containerClass, undefined, dir);
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
    if (dir === void 0) { dir = 1; }
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    return findFirstChildOfClass(container, matchClass, skipClass, dir);
}
exports.findEndInContainer = findEndInContainer;
/**
 * Determine the tag type, based on the tag name (case-insenstive)
 * @param elmt An HTML element
 * @param tag a tag name, or array of names
 */
function isTag(elmt, tag) {
    var tagName = elmt.tagName.toUpperCase();
    if (typeof (tag) == 'string') {
        return tagName == tag.toUpperCase();
    }
    var tags = tag;
    for (var i = 0; i < tags.length; i++) {
        if (tagName == tags[i].toUpperCase()) {
            return true;
        }
    }
    return false;
}
exports.isTag = isTag;
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
    while (elmt !== null && elmt.tagName !== 'BODY') {
        var name_1 = elmt.tagName;
        if (name_1 == 'BODY') {
            break;
        }
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        elmt = elmt.parentNode;
    }
    return null;
}
exports.findParentOfClass = findParentOfClass;
/**
 * Is the element anywhere underneath parent (including itself)
 * @param elmt An element
 * @param parent An element
 * @returns true if parent is anywhere in elmt's parent chain
 */
function isSelfOrParent(elmt, parent) {
    while (elmt !== null && elmt.tagName !== 'BODY') {
        if (elmt === parent) {
            return true;
        }
        elmt = elmt.parentNode;
    }
    return false;
}
exports.isSelfOrParent = isSelfOrParent;
/**
 * Find the nearest containing node of the specified tag type.
 * @param elmt - An existing element
 * @param parentTag - A tag name of a parent element
 * @returns The nearest matching parent element, up to and including the body
 */
function findParentOfTag(elmt, parentTag) {
    if (parentTag == null || parentTag == undefined) {
        return null;
    }
    parentTag = parentTag.toUpperCase();
    while (elmt !== null) {
        var name_2 = elmt.tagName.toUpperCase();
        if (name_2 === parentTag) {
            return elmt;
        }
        if (name_2 === 'BODY') {
            break;
        }
        elmt = elmt.parentNode;
    }
    return null;
}
exports.findParentOfTag = findParentOfTag;
/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param elmt - A parent element
 * @param childClass - A class name of the desired child
 * @param skipClass - [optional] A class name to avoid
 * @param dir - If positive (default), search forward; else search backward
 * @returns A child element, if a match is found, else null
 */
function findFirstChildOfClass(elmt, childClass, skipClass, dir) {
    if (skipClass === void 0) { skipClass = undefined; }
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
    if (!elmt) {
        return null;
    }
    var val = elmt.getAttribute(attrName);
    while (val === null) {
        elmt = elmt.parentNode;
        if (elmt === null || elmt.tagName === 'BODY') {
            val = defaultStyle || null;
            break;
        }
        else {
            val = elmt.getAttribute(attrName);
        }
    }
    return (val === null || prefix === undefined) ? val : (prefix + val);
}
exports.getOptionalStyle = getOptionalStyle;
/**
 * Loop through all elements in a DOM sub-tree, looking for any elements with an optional tag.
 * Recurse as needed. But once found, don't recurse within the find.
 * @param root The node to look through. Can also be 'document'
 * @param attr The name of an attribute. It must be present and non-empty to count
 * @returns A list of zero or more elements
 */
function getAllElementsWithAttribute(root, attr) {
    var list = [];
    for (var i = 0; i < root.childNodes.length; i++) {
        var child = root.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            var elmt = child;
            if (elmt.getAttribute(attr)) {
                list.push(elmt);
                // once found, don't recurse
            }
            else {
                var recurse = getAllElementsWithAttribute(elmt, attr);
                for (var r = 0; r < recurse.length; r++) {
                    list.push(recurse[r]);
                }
            }
        }
    }
    return list;
}
exports.getAllElementsWithAttribute = getAllElementsWithAttribute;
/**
 * Move focus to the given input (if not null), and select the entire contents.
 * If input is of type number, do nothing.
 * @param input - A text input element
 * @param caret - The character index where the caret should go
 * @returns true if the input element and caret position are valid, else false
 */
function moveFocus(input, caret) {
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
/**
 * Sort a collection of elements into an array
 * @param src A collection of elements, as from document.getElementsByClassName
 * @param sort_attr The name of the optional attribute, by which we'll sort. Attribute values must be numbers.
 * @returns An array of the same elements, either sorted, or else in original document order
 */
function SortElements(src, sort_attr) {
    if (sort_attr === void 0) { sort_attr = 'data-extract-order'; }
    var lookup = {};
    var indeces = [];
    var sorted = [];
    for (var i = 0; i < src.length; i++) {
        var elmt = src[i];
        var order = getOptionalStyle(elmt, sort_attr);
        if (order) {
            // track order values we've seen
            if (!(order in lookup)) {
                indeces.push(parseInt(order));
                lookup[order] = [];
            }
            // make elements findable by their order
            lookup[order].push(elmt);
        }
        else {
            // elements without an explicit order go document order
            sorted.push(elmt);
        }
    }
    // Sort indeces, then build array from them
    indeces.sort();
    for (var i = 0; i < indeces.length; i++) {
        var order = '' + indeces[i];
        var peers = lookup[order];
        for (var p = 0; p < peers.length; p++) {
            sorted.push(peers[p]);
        }
    }
    return sorted;
}
exports.SortElements = SortElements;
/**
 * Create a generic TR tag for each row in a table.
 * Available for TableDetails.onRow where that is all that's needed
 */
function newTR(y) {
    return document.createElement('tr');
}
exports.newTR = newTR;
/**
 * Create a table from details
 * @param details A TableDetails, which can exist in several permutations with optional fields
 */
function constructTable(details) {
    var root = document.getElementById(details.rootId);
    if (details.onRoot) {
        details.onRoot(root);
    }
    var height = (details.data) ? details.data.length : details.height;
    for (var y = 0; y < height; y++) {
        var row = root;
        if (details.onRow) {
            var rr = details.onRow(y);
            if (!rr) {
                continue;
            }
            root === null || root === void 0 ? void 0 : root.appendChild(rr);
            row = rr;
        }
        var width = (details.data) ? details.data[y].length : details.width;
        for (var x = 0; x < width; x++) {
            var val = (details.data) ? details.data[y][x] : '';
            var cc = details.onCell(val, x, y);
            if (cc) {
                row === null || row === void 0 ? void 0 : row.appendChild(cc);
            }
        }
    }
}
exports.constructTable = constructTable;
exports.svg_xmlns = 'http://www.w3.org/2000/svg';
var html_xmlns = 'http://www.w3.org/2000/xmlns';
function constructSvgTextCell(val, dx, dy, cls, stampable) {
    if (val == ' ') {
        return null;
    }
    var vg = document.createElementNS(exports.svg_xmlns, 'g');
    vg.classList.add('vertex-g');
    if (cls) {
        applyAllClasses(vg, cls);
    }
    vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
    var r = document.createElementNS(exports.svg_xmlns, 'rect');
    r.classList.add('vertex');
    var t = document.createElementNS(exports.svg_xmlns, 'text');
    t.appendChild(document.createTextNode(val));
    vg.appendChild(r);
    vg.appendChild(t);
    if (stampable) {
        var fog = document.createElementNS(exports.svg_xmlns, 'g');
        fog.classList.add('fo-stampable');
        var fo = document.createElementNS(exports.svg_xmlns, 'foreignObject');
        var fod = document.createElement('div');
        fod.setAttribute('xmlns', html_xmlns);
        fod.classList.add('stampable');
        fo.appendChild(fod);
        fog.appendChild(fo);
        vg.appendChild(fog);
    }
    return vg;
}
exports.constructSvgTextCell = constructSvgTextCell;
function constructSvgImageCell(img, dx, dy, id, cls) {
    var vg = document.createElementNS(exports.svg_xmlns, 'g');
    if (id) {
        vg.id = id;
    }
    vg.classList.add('vertex-g');
    if (cls) {
        applyAllClasses(vg, cls);
    }
    vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
    var r = document.createElementNS(exports.svg_xmlns, 'rect');
    r.classList.add('vertex');
    var i = document.createElementNS(exports.svg_xmlns, 'image');
    i.setAttributeNS('', 'href', img);
    vg.appendChild(r);
    vg.appendChild(i);
    return vg;
}
exports.constructSvgImageCell = constructSvgImageCell;
function constructSvgStampable() {
    var fo = document.createElementNS(exports.svg_xmlns, 'foreignObject');
    fo.classList.add('fo-stampable');
    var fod = document.createElement('div');
    fod.setAttribute('xmlns', html_xmlns);
    fod.classList.add('stampable');
    fo.appendChild(fod);
    return fo;
}
exports.constructSvgStampable = constructSvgStampable;
/*-----------------------------------------------------------
 * _notes.ts
 *-----------------------------------------------------------*/
/***********************************************************
 * NOTES.TS
 * Utilities for multiple kinds of annotations on a puzzle
 *  - Text fields near objects, to take notes
 *  - Check marks near objects, to show they've been used
 *  - Highlighting of objects
 * Each kind of annotation is optional. It can be turned on
 * in a puzzle's metadata.
 */
/**
 * Define an optional callback.
 * A puzzle document may define a function with this name, and will get called at the end of setup.
 */
var initGuessFunctionality;
function simpleSetup(load) {
    if (typeof initGuessFunctionality === 'function') {
        initGuessFunctionality();
    }
}
/**
 * Look for elements tagged with any of the implemented "notes" classes.
 * Each of these will end up with a notes input area, near the owning element.
 * Note fields are for players to jot down their thoughts, before comitting to an answer.
 */
function setupNotes(margins) {
    var index = 0;
    index = setupNotesCells('notes-above', 'note-above', index);
    index = setupNotesCells('notes-below', 'note-below', index);
    index = setupNotesCells('notes-right', 'note-right', index);
    index = setupNotesCells('notes-left', 'note-left', index);
    // Puzzles can use the generic 'notes' class if they have their own .note-input style
    index = setupNotesCells('notes', undefined, index);
    index = setupNotesCells('notes-abs', undefined, index);
    setupNotesToggle(margins);
    indexAllNoteFields();
    if (isPrint()) {
        setNoteState(NoteState.Disabled);
    }
    else if (isBodyDebug()) {
        setNoteState(NoteState.Visible);
    }
}
exports.setupNotes = setupNotes;
/**
 * Find all objects tagged as needing notes, then create a note cell adjacent.
 * @param findClass The class of the puzzle element that wants notes
 * @param tagInput The class of note to create
 * @param index The inde of the first note
 * @returns The index after the last note
 */
function setupNotesCells(findClass, tagInput, index) {
    var cells = document.getElementsByClassName(findClass);
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.classList.add('note-input');
        if (hasClass(cell, 'numeric')) {
            // Trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*'; // iOS
            inp.inputMode = 'numeric'; // Android
        }
        if (tagInput != undefined) {
            inp.classList.add(tagInput);
        }
        inp.onkeyup = function (e) { onNoteArrowKey(e); };
        inp.onchange = function (e) { onNoteChange(e); };
        cell.appendChild(inp);
    }
    return index;
}
/**
 * Custom nabigation key controls from within notes
 * @param event The key event
 */
function onNoteArrowKey(event) {
    if (event.isComposing || event.currentTarget == null) {
        return; // Don't interfere with IMEs
    }
    var input = event.currentTarget;
    var code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'note-input', undefined, -1));
        return;
    }
    else if (code == 'Enter' || code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'note-input'));
        return;
    }
    noteChangeCallback(input);
}
/**
 * Each time a note is modified, save
 * @param event The change event
 */
function onNoteChange(event) {
    if (event.target == null || (event.type == 'KeyboardEvent' && event.isComposing)) {
        return; // Don't interfere with IMEs
    }
    var input = event.currentTarget;
    var note = findParentOfClass(input, 'note-input');
    saveNoteLocally(note);
    noteChangeCallback(note);
}
/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 */
function noteChangeCallback(inp) {
    var fn = theBoiler().onNoteChange;
    if (fn) {
        fn(inp);
    }
}
/**
 * Notes can be toggled on or off, and when on, can also be lit up to make them easier to see.
 */
var NoteState = {
    Disabled: -1,
    Unmarked: 0,
    Visible: 1,
    Subdued: 2,
    MOD: 3,
};
/**
 * The note visibility state is tracked by a a class in the body tag.
 * @returns a NoteState enum value
 */
function getNoteState() {
    var body = document.getElementsByTagName('body')[0];
    if (hasClass(body, 'show-notes')) {
        return NoteState.Visible;
    }
    if (hasClass(body, 'enable-notes')) {
        return NoteState.Subdued;
    }
    return hasClass(body, 'disabled-notes') ? NoteState.Disabled : NoteState.Unmarked;
}
/**
 * Update the body tag to be the desired visibility state
 * @param state A NoteState enum value
 */
function setNoteState(state) {
    var body = document.getElementsByTagName('body')[0];
    toggleClass(body, 'show-notes', state == NoteState.Visible);
    toggleClass(body, 'enable-notes', state == NoteState.Subdued);
    toggleClass(body, 'disable-notes', state == NoteState.Disabled);
}
/**
 * There is a Notes link in the bottom corner of the page.
 * Set it up such that clicking rotates through the 3 visibility states.
 * @param margins the parent of the toggle UI
 */
function setupNotesToggle(margins) {
    var toggle = document.getElementById('notes-toggle');
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'notes-toggle';
        margins.appendChild(toggle);
    }
    var state = getNoteState();
    if (state == NoteState.Disabled || state == NoteState.Unmarked) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Visible) {
        toggle.innerText = 'Dim Notes';
    }
    else { // state == NoteState.Subdued
        // toggle.innerText = 'Disable Notes';
        toggle.innerText = 'Un-mark Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}
/**
 * Rotate to the next note visibility state.
 */
function toggleNotes() {
    var state = getNoteState();
    setNoteState((state + 1) % NoteState.MOD);
    setupNotesToggle(null);
}
exports.toggleNotes = toggleNotes;
/**
 * Elements tagged with class = 'cross-off' are for puzzles clues that don't indicate where to use it.
 * Any such elements are clickable. When clicked, a check mark is toggled on and off, allowed players to mark some clues as done.
 */
function setupCrossOffs() {
    var cells = document.getElementsByClassName('cross-off');
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        // Place a small text input field in each cell
        cell.onclick = function (e) { onCrossOff(e); };
        var check = document.createElement('span');
        check.classList.add('check');
        //check.innerHTML = '&#x2714;&#xFE0F;' // ✔️;
        cell.appendChild(check);
    }
    indexAllCheckFields();
}
exports.setupCrossOffs = setupCrossOffs;
/**
 * Handler for when an object that can be crossed off is clicked
 * @param event The mouse event
 */
function onCrossOff(event) {
    var obj = event.target;
    if (obj.tagName == 'A' || hasClass(obj, 'note-input') || hasClass(obj, 'letter-input') || hasClass(obj, 'word-input')) {
        return; // Clicking on lines, notes, or inputs should not check anything
    }
    var parent = findParentOfClass(obj, 'cross-off');
    if (parent != null) {
        var newVal = !hasClass(parent, 'crossed-off');
        toggleClass(parent, 'crossed-off', newVal);
        saveCheckLocally(parent, newVal);
    }
}
function setupHighlights() {
    var highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function () { toggleHighlight(); };
    }
    var containers = document.getElementsByClassName('highlight-container');
    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        var rules = getOptionalStyle(container, 'data-highlight-rules');
        if (rules) {
            var list = rules.split(' ');
            for (var r = 0; r < list.length; r++) {
                var rule = list[r];
                if (rule[0] == '.') {
                    var children = container.getElementsByClassName(rule.substring(1));
                    for (var i_1 = 0; i_1 < children.length; i_1++) {
                        toggleClass(children[i_1], 'can-highlight', true);
                    }
                }
                else if (rule[0] == '#') {
                    var child = document.getElementById(rule.substring(1));
                    toggleClass(child, 'can-highlight', true);
                }
                else {
                    var children = container.getElementsByTagName(rule.toLowerCase());
                    for (var i_2 = 0; i_2 < children.length; i_2++) {
                        toggleClass(children[i_2], 'can-highlight', true);
                    }
                }
            }
        }
    }
    var cans = document.getElementsByClassName('can-highlight');
    for (var i = 0; i < cans.length; i++) {
        var can = cans[i];
        can.onclick = function (e) { onClickHighlight(e); };
    }
    // Index will now include all children from above expansion rules
    indexAllHighlightableFields();
}
exports.setupHighlights = setupHighlights;
/**
 * If an element can be highlighted, toggle that highlight on or off
 * @param elmt The element to highlight
 */
function toggleHighlight(elmt) {
    if (elmt == undefined) {
        elmt = document.activeElement; // will be body if no inputs have focus
    }
    var highlight = findParentOfClass(elmt, 'can-highlight');
    if (highlight) {
        toggleClass(highlight, 'highlighted');
        saveHighlightLocally(highlight);
    }
}
exports.toggleHighlight = toggleHighlight;
/**
 * Clicking on highlightable elements can toggle their highlighting.
 * If they are not input elements, a simple click works.
 * If they are inputs, user must ctrl+click.
 * @param evt The mouse event from the click
 */
function onClickHighlight(evt) {
    var elem = document.elementFromPoint(evt.clientX, evt.clientY);
    if (elem) {
        if (elem.tagName != 'INPUT' || evt.ctrlKey) {
            toggleHighlight(elem);
        }
    }
}
/*-----------------------------------------------------------
 * _decoders.ts
 *-----------------------------------------------------------*/
/**
 * The decoder frame is either visible (true), hidden (false), or not present (null)
 * @returns true, false, or null
 */
function getDecoderState() {
    var frame = document.getElementById('decoder-frame');
    if (frame != null) {
        var style = window.getComputedStyle(frame);
        return style.display != 'none';
    }
    return null;
}
/**
 * Update the iframe tag to be the desired visibility state.
 * Also ensure that it points at the correct URL
 * @param state true to show, false to hide
 */
function setDecoderState(state) {
    var frame = document.getElementById('decoder-frame');
    if (frame != null) {
        var src = 'https://www.decrypt.fun/index.html';
        var mode = frame.getAttributeNS('', 'data-decoder-mode');
        if (mode != null) {
            src = 'https://www.decrypt.fun/' + mode + '.html';
        }
        frame.style.display = state ? 'block' : 'none';
        if (frame.src === '' || state) {
            frame.src = src;
        }
    }
}
/**
 * There is a Decoders link in the bottom corner of the page.
 * Set it up such that clicking rotates through the 3 visibility states.
 * @param margins the parent node of the toggle UI
 * @param mode the default decoder mode, if specified
 */
function setupDecoderToggle(margins, mode) {
    var _a;
    var iframe = document.getElementById('decoder-frame');
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = 'decoder-frame';
        iframe.style.display = 'none';
        if (mode != undefined) {
            iframe.setAttributeNS(null, 'data-decoder-mode', mode);
        }
        (_a = document.getElementsByTagName('body')[0]) === null || _a === void 0 ? void 0 : _a.appendChild(iframe);
    }
    var toggle = document.getElementById('decoder-toggle');
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'decoder-toggle';
        margins.appendChild(toggle);
    }
    var visible = getDecoderState();
    if (visible) {
        toggle.innerText = 'Hide Decoders';
    }
    else {
        toggle.innerText = 'Show Decoders';
    }
    toggle.href = 'javascript:toggleDecoder()';
}
exports.setupDecoderToggle = setupDecoderToggle;
/**
 * Rotate to the next note visibility state.
 */
function toggleDecoder() {
    var visible = getDecoderState();
    setDecoderState(!visible);
    setupDecoderToggle(null);
}
exports.toggleDecoder = toggleDecoder;
var localCache = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, stamps: {}, highlights: {}, edges: [], guesses: [], time: null };
////////////////////////////////////////////////////////////////////////
// User interface
//
var checkStorage = null;
/**
 * Saved state uses local storage, keyed off this page's URL
 * minus any parameters
 */
function storageKey() {
    return window.location.origin + window.location.pathname;
}
exports.storageKey = storageKey;
/**
 * If storage exists from a previous visit to this puzzle, offer to reload.
 */
function checkLocalStorage() {
    // Each puzzle is cached within localStorage by its URL
    var key = storageKey();
    if (!isIFrame() && !isRestart() && key in localStorage) {
        var item = localStorage.getItem(key);
        if (item != null) {
            try {
                checkStorage = JSON.parse(item);
            }
            catch (_a) {
                checkStorage = {};
            }
            var empty = true; // It's possible to cache all blanks, which are uninteresting
            for (var key_1 in checkStorage) {
                if (checkStorage[key_1] != null && checkStorage[key_1] != '') {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                var force = forceReload();
                if (force == undefined) {
                    createReloadUI(checkStorage.time);
                }
                else if (force) {
                    doLocalReload(false);
                }
                else {
                    cancelLocalReload(false);
                }
            }
        }
    }
}
exports.checkLocalStorage = checkLocalStorage;
/**
 * Globals for reload UI elements
 */
var reloadDialog;
var reloadButton;
var restartButton;
/**
 * Create a modal dialog, asking the user if they want to reload.
 * @param time The time the cached data was saved (as a string)
 *
 * If a page object can be found, compose a dialog:
 *   +-------------------------------------------+
 *   | Would you like to reload your progress on |
 *   | [title] from earlier? The last change was |
 *   | [## time-units ago].                      |
 *   |                                           |
 *   |       [Reload]     [Start over]           |
 *   +-------------------------------------------+
 * else use the generic javascript confirm prompt.
 */
function createReloadUI(time) {
    reloadDialog = document.createElement('div');
    reloadDialog.id = 'reloadLocalStorage';
    var img = document.createElement('img');
    img.classList.add('icon');
    img.src = getSafariDetails().icon;
    var title = document.createElement('span');
    title.classList.add('title-font');
    title.innerText = document.title;
    var p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('Would you like to reload your progress on '));
    p1.appendChild(title);
    p1.appendChild(document.createTextNode(' from earlier?'));
    var now = new Date();
    var dateTime = new Date(time);
    var delta = now.getTime() - dateTime.getTime();
    var seconds = Math.ceil(delta / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var ago = 'The last change was ';
    if (days >= 2) {
        ago += days + ' days ago.';
    }
    else if (hours >= 2) {
        ago += hours + ' hours ago.';
    }
    else if (minutes >= 2) {
        ago += minutes + ' minutes ago.';
    }
    else {
        ago += seconds + ' seconds ago.';
    }
    var p2 = document.createElement('p');
    p2.innerText = ago;
    reloadButton = document.createElement('button');
    reloadButton.innerText = 'Reload';
    reloadButton.onclick = function () { doLocalReload(true); };
    reloadButton.onkeydown = function (e) { onkeyReload(e); };
    restartButton = document.createElement('button');
    restartButton.innerText = 'Start over';
    restartButton.onclick = function () { cancelLocalReload(true); };
    restartButton.onkeydown = function (e) { onkeyReload(e); };
    var p3 = document.createElement('p');
    p3.appendChild(reloadButton);
    p3.appendChild(restartButton);
    reloadDialog.appendChild(img);
    reloadDialog.appendChild(p1);
    reloadDialog.appendChild(p2);
    reloadDialog.appendChild(p3);
    var page = document.getElementById('page');
    if (page == null) {
        if (confirm("Continue where you left off?")) {
            doLocalReload(false);
        }
        else {
            cancelLocalReload(false);
        }
    }
    else {
        page.appendChild(reloadDialog);
        reloadButton.focus();
    }
}
/**
 * Handle keyboard accelerators while focus is on either reload button
 */
function onkeyReload(e) {
    if (e.code == 'Escape') {
        cancelLocalReload(true);
    }
    else if (e.code.search('Arrow') == 0) {
        if (e.target == reloadButton) {
            restartButton.focus();
        }
        else {
            reloadButton.focus();
        }
    }
}
/**
 * User has confirmed they want to reload
 * @param hide true if called from reloadDialog
 */
function doLocalReload(hide) {
    if (hide) {
        reloadDialog.style.display = 'none';
    }
    loadLocalStorage(checkStorage);
}
/**
 * User has confirmed they want to start over
 * @param hide true if called from reloadDialog
 */
function cancelLocalReload(hide) {
    if (hide) {
        reloadDialog.style.display = 'none';
    }
    // Clear cached storage
    checkStorage = null;
    localStorage.removeItem(storageKey());
}
//////////////////////////////////////////////////////////
// Utilities for saving to local cache
//
/**
 * Overwrite the localStorage with the current cache structure
 */
function saveCache() {
    if (!reloading) {
        localCache.time = new Date();
        localStorage.setItem(storageKey(), JSON.stringify(localCache));
    }
}
/**
 * Update the saved letters object
 * @param element an letter-input element
 */
function saveLetterLocally(input) {
    if (input && input != currently_restoring) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.letters[index] = input.value;
            saveCache();
        }
    }
}
exports.saveLetterLocally = saveLetterLocally;
/**
 * Update the saved words object
 * @param element an word-input element
 */
function saveWordLocally(input) {
    if (input && input != currently_restoring) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.words[index] = input.value;
            saveCache();
        }
    }
}
exports.saveWordLocally = saveWordLocally;
/**
 * Update the saved notes object
 * @param element an note-input element
 */
function saveNoteLocally(input) {
    if (input) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.notes[index] = input.value;
            saveCache();
        }
    }
}
exports.saveNoteLocally = saveNoteLocally;
/**
 * Update the saved checkmark object
 * @param element an element which might contain a checkmark
 */
function saveCheckLocally(element, value) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            localCache.checks[index] = value;
            saveCache();
        }
    }
}
exports.saveCheckLocally = saveCheckLocally;
/**
 * Update the saved containers objects
 * @param element an element which can move between containers
 */
function saveContainerLocally(element, container) {
    if (element && container) {
        var elemIndex = getGlobalIndex(element);
        var destIndex = getGlobalIndex(container);
        if (elemIndex >= 0 && destIndex >= 0) {
            localCache.containers[elemIndex] = destIndex;
            saveCache();
        }
    }
}
exports.saveContainerLocally = saveContainerLocally;
/**
 * Update the saved positions object
 * @param element a moveable element which can free-move in its container
 */
function savePositionLocally(element) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            var pos = positionFromStyle(element);
            localCache.positions[index] = pos;
            saveCache();
        }
    }
}
exports.savePositionLocally = savePositionLocally;
/**
 * Update the saved drawings object
 * @param element an element which might contain a drawn object
 */
function saveStampingLocally(element) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            var parent_1 = getStampParent(element);
            var drawn = findFirstChildOfClass(parent_1, 'stampedObject');
            if (drawn) {
                localCache.stamps[index] = drawn.getAttributeNS('', 'data-template-id');
            }
            else if (hasClass(parent_1, 'stampedObject')) {
                localCache.stamps[index] = parent_1.getAttributeNS('', 'data-template-id');
            }
            else {
                delete localCache.stamps[index];
            }
            saveCache();
        }
    }
}
exports.saveStampingLocally = saveStampingLocally;
/**
 * Update the saved highlights object
 * @param element a highlightable object
 */
function saveHighlightLocally(element) {
    if (element) {
        var index = getGlobalIndex(element, 'ch');
        if (index >= 0) {
            localCache.highlights[index] = hasClass(element, 'highlighted');
            saveCache();
        }
    }
}
exports.saveHighlightLocally = saveHighlightLocally;
/**
 * Update the local cache with this vertex list.
 * @param vertexList A list of vertex global indeces
 * @param add If true, this edge is added to the saved state. If false, it is removed.
 */
function saveStraightEdge(vertexList, add) {
    if (add) {
        localCache.edges.push(vertexList);
    }
    else {
        var i = localCache.edges.indexOf(vertexList);
        if (i >= 0) {
            localCache.edges.splice(i, 1);
        }
    }
    saveCache();
}
exports.saveStraightEdge = saveStraightEdge;
/**
 * Update the local cache with the full set of guesses for this puzzle
 * @param guesses An array of guesses, in time order
 */
function saveGuessHistory(guesses) {
    localCache.guesses = guesses;
    saveCache();
}
exports.saveGuessHistory = saveGuessHistory;
////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//
/**
 * Assign indeces to all of the elements in a group
 * @param elements A list of elements
 * @param suffix A variant name of the index (optional)
 * @param offset A number to shift all indeces (optional) - used when two collections share an index space
 */
function applyGlobalIndeces(elements, suffix, offset) {
    var attr = 'data-globalIndex';
    if (suffix != undefined) {
        attr += '-' + suffix;
    }
    if (!offset) {
        offset = 0;
    }
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttributeNS('', attr, String(i));
    }
}
/**
 * At page initialization, every element that can be cached gets an index attached to it.
 * Possibly more than one, if it can cache multiple traits.
 * Now retrieve that index.
 * @param elmt The element with the index
 * @param suffix The name of the index (optional)
 * @returns The index, or -1 if invalid
 */
function getGlobalIndex(elmt, suffix) {
    if (elmt) {
        var attr = 'data-globalIndex';
        if (suffix != undefined) {
            attr += '-' + suffix;
        }
        var index = elmt.getAttributeNS('', attr);
        if (index) { // not null or empty
            return Number(index);
        }
    }
    return -1;
}
exports.getGlobalIndex = getGlobalIndex;
/**
 * At page initialization, every element that can be cached gets an index attached to it.
 * Possibly more than one, if it can cache multiple traits.
 * Find the element with the desired global index.
 * @param cls A class, to narrow down the set of possible elements
 * @param index The index
 * @param suffix The name of the index (optional)
 * @returns The element
 */
function findGlobalIndex(cls, index, suffix) {
    var elements = document.getElementsByClassName(cls);
    for (var i = 0; i < elements.length; i++) {
        var elmt = elements[i];
        if (index == getGlobalIndex(elmt, suffix)) {
            return elmt;
        }
    }
    return null;
}
exports.findGlobalIndex = findGlobalIndex;
/**
 * Create a dictionary, mapping global indeces to the corresponding elements
 * @param cls the class tag on all applicable elements
 * @param suffix the optional suffix of the global indeces
 */
function mapGlobalIndeces(cls, suffix) {
    var map = {};
    var elements = document.getElementsByClassName(cls);
    for (var i = 0; i < elements.length; i++) {
        var index = getGlobalIndex(elements[i], suffix);
        if (index >= 0) {
            map[index] = elements[String(i)];
        }
    }
    return map;
}
exports.mapGlobalIndeces = mapGlobalIndeces;
/**
 * Assign globalIndeces to every letter- or word- input field
 */
function indexAllInputFields() {
    var inputs = document.getElementsByClassName('letter-input');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('word-input');
    applyGlobalIndeces(inputs);
}
exports.indexAllInputFields = indexAllInputFields;
/**
 * Assign globalIndeces to every note field
 */
function indexAllNoteFields() {
    var inputs = document.getElementsByClassName('note-input');
    applyGlobalIndeces(inputs);
}
exports.indexAllNoteFields = indexAllNoteFields;
/**
 * Assign globalIndeces to every check mark
 */
function indexAllCheckFields() {
    var checks = document.getElementsByClassName('cross-off');
    applyGlobalIndeces(checks);
}
exports.indexAllCheckFields = indexAllCheckFields;
/**
 * Assign globalIndeces to every moveable element and drop target
 */
function indexAllDragDropFields() {
    var inputs = document.getElementsByClassName('moveable');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('drop-target');
    applyGlobalIndeces(inputs);
}
exports.indexAllDragDropFields = indexAllDragDropFields;
/**
 * Assign globalIndeces to every stampable element
 */
function indexAllDrawableFields() {
    var inputs = document.getElementsByClassName('stampable');
    applyGlobalIndeces(inputs);
}
exports.indexAllDrawableFields = indexAllDrawableFields;
/**
 * Assign globalIndeces to every highlightable element
 */
function indexAllHighlightableFields() {
    var inputs = document.getElementsByClassName('can-highlight');
    applyGlobalIndeces(inputs, 'ch');
}
exports.indexAllHighlightableFields = indexAllHighlightableFields;
/**
 * Assign globalIndeces to every vertex
 */
function indexAllVertices() {
    var inputs = document.getElementsByClassName('vertex');
    applyGlobalIndeces(inputs, 'vx');
}
exports.indexAllVertices = indexAllVertices;
////////////////////////////////////////////////////////////////////////
// Load from local storage
//
/**
 * Avoid re-entrancy. Track if we're mid-reload
 */
var reloading = false;
/**
 * Load all structure types from storage
 */
function loadLocalStorage(storage) {
    reloading = true;
    restoreLetters(storage.letters);
    restoreWords(storage.words);
    restoreNotes(storage.notes);
    restoreCrossOffs(storage.checks);
    restoreContainers(storage.containers);
    restorePositions(storage.positions);
    restoreStamps(storage.stamps);
    restoreHighlights(storage.highlights);
    restoreEdges(storage.edges);
    restoreGuesses(storage.guesses);
    reloading = false;
    var fn = theBoiler().onRestore;
    if (fn) {
        fn();
    }
}
var currently_restoring = null;
/**
 * Restore any saved letter input values
 * @param values A dictionary of index=>string
 */
function restoreLetters(values) {
    localCache.letters = values;
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i];
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            afterInputUpdate(input, values[i]);
        }
    }
    currently_restoring = null;
}
/**
 * Restore any saved word input values
 * @param values A dictionary of index=>string
 */
function restoreWords(values) {
    localCache.words = values;
    var inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i];
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            if (value.length > 0) {
                afterInputUpdate(input, value.substring(value.length - 1));
            }
            var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
            if (extractId != null) {
                updateWordExtraction(extractId);
            }
        }
    }
    currently_restoring = null;
    if (inputs.length > 0) {
        updateWordExtraction(null);
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>string
 */
function restoreNotes(values) {
    localCache.notes = values;
    var elements = document.getElementsByClassName('note-input');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var globalIndex = getGlobalIndex(element);
        var value = values[globalIndex];
        if (value != undefined) {
            element.value = value;
        }
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>boolean
 */
function restoreCrossOffs(values) {
    localCache.checks = values;
    var elements = document.getElementsByClassName('cross-off');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var globalIndex = getGlobalIndex(element);
        var value = values[globalIndex];
        if (value != undefined) {
            toggleClass(element, 'crossed-off', value);
        }
    }
}
/**
 * Restore any saved moveable objects to drop targets
 * @param containers A dictionary of moveable-index=>target-index
 */
function restoreContainers(containers) {
    localCache.containers = containers;
    var movers = document.getElementsByClassName('moveable');
    var targets = document.getElementsByClassName('drop-target');
    // Each time an element is moved, the containers structure changes out from under us. So pre-fetch.
    var moving = [];
    for (var key in containers) {
        moving[parseInt(key)] = parseInt(containers[key]);
    }
    for (var key in moving) {
        var mover = findGlobalIndex('moveable', parseInt(key));
        var target = findGlobalIndex('drop-target', moving[key]);
        if (mover && target) {
            quickMove(mover, target);
        }
    }
}
/**
 * Restore any saved moveable objects to free-positions within their targets
 * @param positions A dictionary of index=>Position
 */
function restorePositions(positions) {
    localCache.positions = positions;
    var movers = document.getElementsByClassName('moveable');
    for (var i = 0; i < movers.length; i++) {
        var pos = positions[i];
        if (pos != undefined) {
            quickFreeMove(movers[i], pos);
        }
    }
}
/**
 * Restore any saved note input values
 * @param values A dictionary of index=>string
 */
function restoreStamps(drawings) {
    localCache.stamps = drawings;
    var targets = document.getElementsByClassName('stampable');
    for (var i = 0; i < targets.length; i++) {
        var tool = drawings[i];
        if (tool != undefined) {
            doStamp(targets[i], tool);
        }
    }
}
/**
 * Restore any saved highlight toggle
 * @param highlights A dictionary of index=>boolean
 */
function restoreHighlights(highlights) {
    localCache.highlights = highlights == undefined ? {} : highlights;
    var elements = document.getElementsByClassName('can-highlight');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var globalIndex = getGlobalIndex(element, 'ch');
        var value = highlights[globalIndex];
        if (value != undefined) {
            toggleClass(element, 'highlighted', value);
        }
    }
}
/**
 * Recreate any saved straight-edges and word-selections
 * @param vertexLists A list of strings, where each string is a comma-separated-list of vertices
 */
function restoreEdges(vertexLists) {
    if (!vertexLists) {
        vertexLists = [];
    }
    localCache.edges = vertexLists;
    for (var i = 0; i < vertexLists.length; i++) {
        createFromVertexList(vertexLists[i]);
    }
}
/**
 * Recreate any saved guesses and their responses
 * @param guesses A list of guess structures
 */
function restoreGuesses(guesses) {
    if (!guesses) {
        guesses = [];
    }
    for (var i = 0; i < guesses.length; i++) {
        var src = guesses[i];
        // Rebuild the GuessLog, to convert the string back to a DateTime
        var gl = { field: src.field, guess: src.guess, time: new Date(String(src.time)) };
        decodeAndValidate(gl);
        // Decoding will rebuild the localCache
    }
}
////////////////////////////////////////////////////////////////////////
// Utils for working with the shared puzzle list
//
/**
 * A limited list of meaningful puzzle statuses
 */
exports.PuzzleStatus = {
    Hidden: 'hidden',
    Locked: 'locked',
    Unlocked: 'unlocked',
    Loaded: 'loaded',
    Solved: 'solved', // A puzzle which is fully solved
};
/**
 * Update the master list of puzzles for this event
 * @param puzzle The name of this puzzle (not the filename)
 * @param status One of the statuses in PuzzleStatus
 */
function updatePuzzleList(puzzle, status) {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    var pList = {};
    if (key in localStorage) {
        var item = localStorage.getItem(key);
        if (item) {
            pList = JSON.parse(item);
        }
    }
    if (!pList) {
        pList = {};
    }
    pList[puzzle] = status;
    localStorage.setItem(key, JSON.stringify(pList));
}
exports.updatePuzzleList = updatePuzzleList;
/**
 * Lookup the status of a puzzle
 * @param puzzle The name of a puzzle
 * @param defaultStatus The initial status, before a player updates it
 * @returns The saved status
 */
function getPuzzleStatus(puzzle, defaultStatus) {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    var pList = {};
    if (key in localStorage) {
        var item = localStorage.getItem(key);
        if (item) {
            pList = JSON.parse(item);
            if (pList && puzzle in pList) {
                return pList[puzzle];
            }
        }
    }
    return defaultStatus;
}
exports.getPuzzleStatus = getPuzzleStatus;
/**
 * Return a list of puzzles we are tracking, which currently have the indicated status
 * @param status one of the valid status strings
 */
function listPuzzlesOfStatus(status) {
    var list = [];
    var key = getOtherFileHref('puzzle_list', 0);
    if (key in localStorage) {
        var item = localStorage.getItem(key);
        if (item) {
            var pList = JSON.parse(item);
            if (pList) {
                var names = Object.keys(pList);
                for (var i = 0; i < names.length; i++) {
                    var name_3 = names[i];
                    if (pList[name_3] === status) {
                        list.push(name_3);
                    }
                }
            }
        }
    }
    return list;
}
exports.listPuzzlesOfStatus = listPuzzlesOfStatus;
/**
 * Clear the list of which puzzles have been saved, unlocked, etc.
 */
function resetAllPuzzleStatus() {
    var key = getOtherFileHref('puzzle_list', 0);
    localStorage.setItem(key, JSON.stringify(null));
}
exports.resetAllPuzzleStatus = resetAllPuzzleStatus;
/**
 * Clear any saved progress on this puzzle
 * @param puzzleFile a puzzle filename
 */
function resetPuzzleProgress(puzzleFile) {
    var key = getOtherFileHref(puzzleFile, 0);
    localStorage.setItem(key, JSON.stringify(null));
}
exports.resetPuzzleProgress = resetPuzzleProgress;
////////////////////////////////////////////////////////////////////////
// Utils for sharing data between puzzles
//
/**
 * Save when meta materials have been acquired.
 * @param puzzle The meta-puzzle name
 * @param up Steps up from current folder where meta puzzle is found
 * @param page The meta-clue label (i.e. part 1 or B)
 * @param obj Any meta object structure
 */
function saveMetaMaterials(puzzle, up, page, obj) {
    var key = getOtherFileHref(puzzle, up) + "-" + page;
    localStorage.setItem(key, JSON.stringify(obj));
}
/**
 * Load cached meta materials, if they have been acquired.
 * @param puzzle The meta-puzzle name
 * @param up Steps up from current folder where meta puzzle is found
 * @param page The meta-clue label (i.e. part 1 or B)
 * @returns An object - can be different for each meta type
 */
function loadMetaMaterials(puzzle, up, page) {
    var key = getOtherFileHref(puzzle, up) + "-" + page;
    if (key in localStorage) {
        var item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    }
    return undefined;
}
/**
 * Get the last level of the URL's pathname
 */
function getCurFileName(no_extension) {
    if (no_extension === void 0) { no_extension = true; }
    var key = window.location.pathname;
    var bslash = key.lastIndexOf('\\');
    var fslash = key.lastIndexOf('/');
    var parts = key.split(fslash >= bslash ? '/' : '\\');
    var name = parts[parts.length - 1];
    if (no_extension) {
        var dot = name.split('.');
        if (dot.length > 1) {
            name = name.substring(0, name.length - 1 - dot[dot.length - 1].length);
        }
    }
    return name;
}
exports.getCurFileName = getCurFileName;
// Convert the absolute href of the current window to a relative href
// levels: 1=just this file, 2=parent folder + file, etc.
function getRelFileHref(levels) {
    var key = storageKey();
    var bslash = key.lastIndexOf('\\');
    var fslash = key.lastIndexOf('/');
    var delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }
    var parts = key.split(delim);
    parts.splice(0, parts.length - levels);
    return parts.join(delim);
}
/**
 * Convert the absolute href of the current window to an absolute href of another file
 * @param file name of another file
 * @param up the number of steps up. 0=same folder. 1=parent folder, etc.
 * @param rel if set, only return the last N terms of the relative path
 * @returns a path to the other file
 */
function getOtherFileHref(file, up, rel) {
    var key = storageKey();
    var bslash = key.lastIndexOf('\\');
    var fslash = key.lastIndexOf('/');
    var delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }
    // We'll replace the current filename and potentially some parent folders
    if (!up) {
        up = 1;
    }
    else {
        up += 1;
    }
    var parts = key.split(delim);
    parts.splice(parts.length - up, up, file);
    if (rel) {
        parts.splice(0, parts.length - rel);
    }
    return parts.join(delim);
}
/*-----------------------------------------------------------
 * _textInput.ts
 *-----------------------------------------------------------*/
/**
 * Any event stemming from key in this list should be ignored
 */
var ignoreKeys = [
    'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'OptionLeft', 'OptionRight', 'CapsLock', 'Backspace', 'Escape', 'Delete', 'Insert', 'NumLock', 'ScrollLock', 'Pause', 'PrintScreen',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16',
];
/**
 * The names of the back and forward arrow keys.
 * If RTL, swap these
 */
var ArrowPrior = 'ArrowLeft';
var ArrowNext = 'ArrowRight';
/**
 * The change in horizontal index that happens after a right arrow
 * If RTL, this should be -1
 */
var plusX = 1;
/**
 * todo: DOCUMENT THIS
 */
var priorInputValue = '';
/**
 * The input
 */
var keyDownTarget = null;
/**
 * Callback when a user pressed a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
function onLetterKeyDown(event) {
    var input = event.currentTarget;
    keyDownTarget = input;
    priorInputValue = input.value;
    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key; // Mobile doesn't use code
    }
    var inpClass = hasClass(input, 'word-input') ? 'word-input' : 'letter-input';
    var skipClass;
    if (!findParentOfClass(input, 'navigate-literals')) {
        skipClass = hasClass(input, 'word-input') ? 'word-non-input' : 'letter-non-input';
    }
    var prior = null;
    if (hasClass(input.parentNode, 'multiple-letter') || hasClass(input, 'word-input')) {
        // Multi-character fields still want the ability to arrow between cells.
        // We need to look at the selection prior to the arrow's effect, 
        // to see if we're already at the edge.
        if (code == ArrowNext || code == 'Enter') {
            var s = input.selectionStart;
            var e = input.selectionEnd;
            if (s == e && e == input.value.length) {
                var next = findNextInput(input, plusX, 0, inpClass, skipClass);
                if (next != null) {
                    moveFocus(next, 0);
                }
                event.preventDefault();
            }
        }
        else if (code == ArrowPrior) {
            var s = input.selectionStart;
            var e = input.selectionEnd;
            if (s == e && e == 0) {
                var prior_1 = findNextInput(input, -plusX, 0, inpClass, skipClass);
                if (prior_1 != null) {
                    moveFocus(prior_1, prior_1.value.length);
                }
                event.preventDefault();
            }
        }
    }
    else {
        if (code == 'Backspace' || code == 'Space') {
            if (code == 'Space') {
                // Make sure user isn't just typing a space between words
                prior = findNextOfClass(input, 'letter-input', undefined, -1);
                if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
                    var lit = prior.getAttribute('data-literal');
                    if (lit == ' ' || lit == '¶') { // match any space-like things  (lit == '¤'?)
                        prior = findNextOfClass(prior, 'letter-input', 'literal', -1);
                        if (prior != null && prior.value != '') {
                            // This looks much more like a simple space between words
                            event.preventDefault();
                            return;
                        }
                    }
                }
            }
            // Delete only deletes the current cell
            // Space deletes and moves forward
            prior = null;
            var dxDel = code == 'Backspace' ? -plusX : plusX;
            var dyDel = code == 'Backspace' ? -1 : 1;
            if (priorInputValue.length == 0) {
                var discoverRoot = findParentOfClass(input, 'letter-grid-discover');
                if (discoverRoot != null) {
                    prior = findParentOfClass(input, 'vertical')
                        ? findNextByPosition(discoverRoot, input, 0, dyDel, 'letter-input', 'letter-non-input')
                        : findNextByPosition(discoverRoot, input, dxDel, 0, 'letter-input', 'letter-non-input');
                }
                else {
                    prior = findNextOfClassGroup(input, 'letter-input', 'letter-non-input', 'text-input-group', dxDel);
                    if (!prior) {
                        var loop = findParentOfClass(input, 'loop-navigation');
                        if (loop) {
                            prior = findFirstChildOfClass(loop, 'letter-input', 'letter-non-input', dxDel);
                        }
                    }
                }
                ExtractFromInput(input);
                if (prior !== null) {
                    moveFocus(prior);
                    input = prior; // fall through
                }
            }
            if (input != null && input.value.length > 0) {
                if (!hasClass(input.parentNode, 'multiple-letter')) {
                    // Backspace should clear most cells
                    input.value = '';
                }
                else if (prior != null) {
                    // If backspacing across cells, into a multiple-letter cell, just remove the last character
                    // REVIEW: should this behavior also apply when starting in multi-letter cells?
                    if (dyDel < 0) {
                        input.value = input.value.substring(0, input.value.length - 1);
                    }
                    else {
                        input.value = input.value.substring(1);
                    }
                }
            }
            afterInputUpdate(input, event.key);
            event.preventDefault();
            return;
        }
        if (event.key.length == 1) {
            if (event.key == '`') {
                toggleHighlight(input);
            }
            if (matchInputRules(input, event)) {
                input.value = event.key;
                afterInputUpdate(input, event.key);
            }
            event.preventDefault();
            return;
        }
        // Single-character fields always go to the next field
        if (code == ArrowNext) {
            moveFocus(findNextInput(input, plusX, 0, inpClass, skipClass));
            event.preventDefault();
        }
        else if (code == ArrowPrior) {
            moveFocus(findNextInput(input, -plusX, 0, inpClass, skipClass));
            event.preventDefault();
        }
    }
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextInput(input, 0, -1, inpClass, skipClass));
        event.preventDefault();
        return;
    }
    else if (code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextInput(input, 0, 1, inpClass, skipClass));
        event.preventDefault();
        return;
    }
    if (findParentOfClass(input, 'digit-only')) {
        if (event.key.length == 1 && (event.key >= 'A' && event.key < 'Z' || event.key > 'a' && event.key < 'z')) {
            // Completely disallow (English) alpha characters. Punctuation still ok.
            event.preventDefault();
        }
    }
}
exports.onLetterKeyDown = onLetterKeyDown;
/**
 * Does a typed character match the input rules?
 * @param input
 * @param evt
 * @returns
 */
function matchInputRules(input, evt) {
    if (input.readOnly) {
        return false;
    }
    if (evt.key.length != 1 || evt.ctrlKey || evt.altKey) {
        return false;
    }
    return (input.inputMode === 'numeric')
        ? evt.key.match(/[0-9]/) : evt.key.match(/[a-z0-9]/i);
}
/**
 * Callback when a user releases a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
function onLetterKey(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    if (isDebug()) {
        alert('code:' + event.code + ', key:' + event.key);
    }
    var input = event.currentTarget;
    if (input != keyDownTarget) {
        keyDownTarget = null;
        // key-down likely caused a navigation
        return;
    }
    keyDownTarget = null;
    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key; // Mobile doesn't use code
    }
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'Tab') { // includes shift-Tab
        // Do nothing. User is just passing through
        // TODO: Add special-case exception to wrap around from end back to start
        return;
    }
    else if (code == 'Home') {
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', 1));
        return;
    }
    else if (code == 'End') {
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', -1));
        return;
    }
    else if (code == 'Backquote') {
        return; // Highlight already handled in key down
    }
    if (input.value.length == 0 || ignoreKeys.indexOf(code) >= 0) {
        var multiLetter = hasClass(input.parentNode, 'multiple-letter');
        // Don't move focus if nothing was typed
        if (!multiLetter) {
            return;
        }
    }
    else if (input.value.length === 1 && !input.value.match(/[a-z0-9]/i)) {
        // Spaces and punctuation might be intentional, but if they follow a matching literal, they probably aren't.
        // NOTE: this tends to fail when the punctuation is stylized like smart quotes or minus instead of dash.
        var prior = findNextOfClass(input, 'letter-input', undefined, -1);
        if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
            if (prior.getAttribute('data-literal') == input.value) {
                input.value = ''; // abort this space
                return;
            }
        }
    }
    afterInputUpdate(input, event.key);
}
exports.onLetterKey = onLetterKey;
/**
 * Re-scan for extractions
 * @param input The input which just changed
 * @param key The key from the event that led here
 */
function afterInputUpdate(input, key) {
    var text = input.value;
    if (hasClass(input.parentNode, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (!hasClass(input.parentNode, 'any-case')) {
        text = text.toUpperCase();
    }
    var overflow = '';
    var nextInput = findParentOfClass(input, 'vertical')
        ? findNextInput(input, 0, 1, 'letter-input', 'letter-non-input')
        : findNextInput(input, plusX, 0, 'letter-input', 'letter-non-input');
    var multiLetter = hasClass(input.parentNode, 'multiple-letter');
    var word = multiLetter || hasClass(input.parentNode, 'word-cell') || hasClass(input, 'word-input');
    if (!word && text.length > 1) {
        overflow = text.substring(1);
        text = text.substring(0, 1);
    }
    input.value = text;
    ExtractFromInput(input);
    var showReady = getOptionalStyle(input.parentElement, 'data-show-ready');
    if (showReady) {
        var btn = document.getElementById(showReady);
        if (btn) {
            validateInputReady(btn, key);
        }
    }
    if (!multiLetter) {
        if (nextInput != null) {
            if (overflow.length > 0 && nextInput.value.length == 0) {
                // Insert our overflow into the next cell
                nextInput.value = overflow;
                moveFocus(nextInput);
                // Then do the same post-processing as this cell
                afterInputUpdate(nextInput, key);
            }
            else if (text.length > 0) {
                // Just move the focus
                moveFocus(nextInput);
            }
        }
    }
    else if (!hasClass(input.parentNode, 'getElementsByClassName')) {
        var spacing = (text.length - 1) * 0.05;
        input.style.letterSpacing = -spacing + 'em';
        input.style.paddingRight = (2 * spacing) + 'em';
        //var rotate = text.length <= 2 ? 0 : (text.length * 5);
        //input.style.transform = 'rotate(' + rotate + 'deg)';
    }
    if (word) {
        saveWordLocally(input);
    }
    else {
        saveLetterLocally(input);
    }
    inputChangeCallback(input, key);
}
exports.afterInputUpdate = afterInputUpdate;
/**
 * Extract contents of an extract-flagged input
 * @param input an input field
 */
function ExtractFromInput(input) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    if (findParentOfClass(input, 'extract')) {
        UpdateExtraction(extractedId);
    }
    else if (findParentOfClass(input, 'extractor')) { // can also be numbered
        UpdateExtractionSource(input);
    }
    else if (findParentOfClass(input, 'numbered')) {
        UpdateNumbered(extractedId);
    }
}
/**
 * Update an extraction destination
 * @param extractedId The id of an element that collects extractions
 */
function UpdateExtraction(extractedId) {
    var extracted = document.getElementById(extractedId || 'extracted');
    if (extracted == null) {
        return;
    }
    var join = getOptionalStyle(extracted, 'data-extract-join') || '';
    if (extracted.getAttribute('data-extraction-source') != 'data'
        && (extracted.getAttribute('data-number-pattern') != null || extracted.getAttribute('data-letter-pattern') != null)) {
        UpdateNumbered(extractedId);
        return;
    }
    var delayLiterals = DelayLiterals(extractedId);
    var inputs = document.getElementsByClassName('extract-input');
    var sorted_inputs = SortElements(inputs);
    var extraction = '';
    var ready = true;
    for (var i = 0; i < sorted_inputs.length; i++) {
        var input = sorted_inputs[i];
        if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        var letter = '';
        if (hasClass(input, 'extract-literal')) {
            // Several ways to extract literals:
            var de = getOptionalStyle(input, 'data-extract-delay'); // placeholder value to extract, until player has finished other work
            var ev = getOptionalStyle(input, 'data-extract-value'); // always extract this value
            var ec = getOptionalStyle(input, 'data-extract-copy'); // this extraction is a copy of another
            if (delayLiterals && de) {
                letter = de;
            }
            else if (ec) {
                letter = extraction[parseInt(ec) - 1];
            }
            else {
                letter = ev || '';
            }
        }
        else {
            var inp = input;
            letter = inp.value || '';
            letter = letter.trim();
        }
        if (extraction.length > 0) {
            extraction += join;
        }
        if (letter.length == 0) {
            extraction += '_';
            ready = false;
        }
        else {
            extraction += letter;
        }
    }
    if (extracted.getAttribute('data-letter-pattern') != null) {
        var inps = extracted.getElementsByClassName('extractor-input');
        if (inps.length > extraction.length) {
            extraction += Array(1 + inps.length - extraction.length).join('_');
        }
        var ready_1 = true;
        for (var i = 0; i < inps.length; i++) {
            var inp = inps[i];
            if (extraction[i] != '_') {
                inp.value = extraction.substring(i, i + 1);
            }
            else {
                inp.value = '';
                ready_1 = false;
            }
        }
        updateExtractionData(extracted, extraction, ready_1);
    }
    else {
        ApplyExtraction(extraction, extracted, ready);
    }
}
/**
 * Cause a value to be extracted directly from data- attributes, rather than from inputs.
 * @param elmt Any element - probably not an input
 * @param value Any text, or null to revert
 * @param extractedId The id of an element that collects extractions
 */
function ExtractViaData(elmt, value, extractedId) {
    if (value == null) {
        elmt.removeAttribute('data-extract-value');
        toggleClass(elmt, 'extract-input', false);
        toggleClass(elmt, 'extract-literal', false);
    }
    else {
        elmt.setAttribute('data-extract-value', value);
        toggleClass(elmt, 'extract-literal', true);
        toggleClass(elmt, 'extract-input', true);
    }
    UpdateExtraction(extractedId);
}
/**
 * Puzzles can specify delayed literals within their extraction,
 * which only show up if all non-literal cells are filled in.
 * @param extractedId The id of an element that collects extractions
 * @returns true if this puzzle uses this technique, and the non-literals are not yet done
 */
function DelayLiterals(extractedId) {
    var delayedLiterals = false;
    var isComplete = true;
    var inputs = document.getElementsByClassName('extract-input');
    var sorted_inputs = SortElements(inputs);
    for (var i = 0; i < sorted_inputs.length; i++) {
        var input = sorted_inputs[i];
        if (extractedId != null && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        if (hasClass(input, 'extract-literal')) {
            if (getOptionalStyle(input, 'data-extract-delay')) {
                delayedLiterals = true;
            }
        }
        else {
            var inp = input;
            var letter = inp.value || '';
            letter = letter.trim();
            if (letter.length == 0) {
                isComplete = false;
            }
        }
    }
    return delayedLiterals && !isComplete;
}
/**
 * Check whether a collection of extracted text is more than blanks and underlines
 * @param text Generated extraction, which may still contain underlines for missing parts
 * @returns true if text contains anything other than spaces and underlines
 */
function ExtractionIsInteresting(text) {
    if (text == undefined) {
        return false;
    }
    return text.length > 0 && text.match(/[^_]/) != null;
}
/**
 * Update an extraction area with new text
 * @param text The current extraction
 * @param dest The container for the extraction. Can be a div or an input
 */
function ApplyExtraction(text, dest, ready) {
    if (hasClass(dest, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (hasClass(dest, 'all-caps')) {
        text = text.toLocaleUpperCase();
    }
    var destInp = isTag(dest, 'INPUT') ? dest : null;
    var destText = isTag(dest, 'TEXT') ? dest : null;
    var current = (destInp !== null) ? destInp.value : (destText !== null) ? destText.innerHTML : dest.innerText;
    if (!ExtractionIsInteresting(text) && !ExtractionIsInteresting(current)) {
        return;
    }
    if (!ExtractionIsInteresting(text) && ExtractionIsInteresting(current)) {
        text = '';
    }
    if (destInp) {
        destInp.value = text;
    }
    else if (destText) {
        destText.innerHTML = '';
        destText.appendChild(document.createTextNode(text));
    }
    else {
        dest.innerText = text;
    }
    updateExtractionData(dest, text, ready);
}
/**
 * Update an extraction that uses numbered indicators
 * @param extractedId The id of an extraction area
 */
function UpdateNumbered(extractedId) {
    extractedId = extractedId || 'extracted';
    var div = document.getElementById(extractedId);
    var outputs = div === null || div === void 0 ? void 0 : div.getElementsByTagName('input');
    var inputs = document.getElementsByClassName('extract-input');
    var sorted_inputs = SortElements(inputs);
    var concat = '';
    for (var i = 0; i < sorted_inputs.length; i++) {
        var input = sorted_inputs[i];
        var inp = input;
        var index = input.getAttribute('data-number');
        var output = document.getElementById('extractor-' + index);
        if (!output && outputs) {
            output = outputs[i];
        }
        var letter = inp.value || '';
        letter = letter.trim();
        if (letter.length > 0 || output.value.length > 0) {
            output.value = letter;
        }
        concat += letter;
    }
    if (div) {
        updateExtractionData(extractedId, concat, concat.length == inputs.length);
    }
}
/**
 *
 * @param input
 * @returns
 */
function UpdateExtractionSource(input) {
    //var extractedId = getOptionalStyle(input, 'data-extracted-id', null, 'extracted-');
    var extractors = document.getElementsByClassName('extractor-input');
    var index = getOptionalStyle(input.parentNode, 'data-number');
    if (index === null) {
        for (var i = 0; i < extractors.length; i++) {
            if (extractors[i] == input) {
                index = "" + (i + 1); // start at 1
                break;
            }
        }
    }
    if (index === null) {
        return;
    }
    var sources = document.getElementsByClassName('extract-input');
    var extractId;
    var extraction = [];
    for (var i = 0; i < sources.length; i++) {
        var src = sources[i];
        var dataNumber = getOptionalStyle(src, 'data-number');
        if (dataNumber != null) {
            if (dataNumber == index) {
                src.value = input.value;
                extractId = getOptionalStyle(src, 'data-extracted-id', undefined, 'extracted-');
            }
            extraction[parseInt(dataNumber)] = src.value;
        }
    }
    // Update data-extraction when the user type directly into an extraction element
    var extractionText = extraction.join('');
    updateExtractionData(extractId, extractionText, extractionText.length == sources.length);
}
function updateExtractionData(extracted, value, ready) {
    var container = !extracted
        ? document.getElementById('extracted')
        : (typeof extracted === "string")
            ? document.getElementById(extracted)
            : extracted;
    if (container) {
        container.setAttribute('data-extraction', value);
        var btnId = container.getAttribute('data-show-ready');
        if (btnId) {
            var btn = document.getElementById(btnId);
            toggleClass(btn, 'ready', ready);
        }
        else {
            btnId = getOptionalStyle(container, 'data-show-ready');
            if (btnId) {
                var btn = document.getElementById(btnId);
                validateInputReady(btn, value);
            }
        }
    }
}
/**
 * User has typed in a word-entry field
 * @param event A Keyboard event
 */
function onWordKey(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    var input = event.currentTarget;
    inputChangeCallback(input, event.key);
    if (getOptionalStyle(input, 'data-extract-index') != null) {
        var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
        updateWordExtraction(extractId);
    }
    var code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'word-input', undefined, -1));
        return;
    }
    else if (code == 'Enter' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'word-input'));
        return;
    }
}
exports.onWordKey = onWordKey;
/**
 * Update extractions that come from word input
 * @param extractedId The ID of an extraction area
 */
function updateWordExtraction(extractedId) {
    var extracted = document.getElementById(extractedId || 'extracted');
    if (extracted == null) {
        return;
    }
    var inputs = document.getElementsByClassName('word-input');
    var sorted_inputs = SortElements(inputs);
    var extraction = '';
    var hasWordExtraction = false;
    var partial = false;
    for (var i = 0; i < sorted_inputs.length; i++) {
        var input = sorted_inputs[i];
        if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        var index = getOptionalStyle(input, 'data-extract-index', '');
        if (index === null) {
            continue;
        }
        hasWordExtraction = true;
        var indeces = index.split(' ');
        for (var j = 0; j < indeces.length; j++) {
            var inp = input;
            var letter = extractWordIndex(inp.value, indeces[j]);
            if (letter) {
                extraction += letter;
                partial = partial || (letter != '_');
            }
        }
    }
    if (hasWordExtraction) {
        ApplyExtraction(extraction, extracted, !partial);
    }
}
exports.updateWordExtraction = updateWordExtraction;
/**
 * Extract a single letter from an input. Either using an absolute index, or else a word.letter index.
 * @param input User's input string
 * @param index Index rule: either one number (absolute index, starting at 1), or a decimal number (word.letter, each starting at 1)
 */
function extractWordIndex(input, index) {
    var dot = index.split('.');
    var letter_index;
    if (dot.length == 2) {
        var word_index = parseInt(dot[0]);
        letter_index = parseInt(dot[1]) - 1;
        var words = input.split(' ');
        input = '';
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (words[i].length > 0) {
                if (--word_index == 0) {
                    input = word;
                    break;
                }
            }
        }
    }
    else {
        letter_index = parseInt(index) - 1;
    }
    if (letter_index < 0) {
        return null; // bogus index
    }
    if (letter_index < input.length) {
        return input[letter_index];
    }
    return '_';
}
exports.extractWordIndex = extractWordIndex;
/**
 * Callback when user has changed the text in a letter-input
 * @param event A keyboard event
 */
function onLetterChange(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    var input = findParentOfClass(event.currentTarget, 'letter-input');
    saveLetterLocally(input);
    inputChangeCallback(input, event.key);
}
exports.onLetterChange = onLetterChange;
/**
 * Callback when user has changed the text in a word-input
 * @param event A keyboard event
 */
function onWordChange(event) {
    if (event.isComposing) {
        return; // Don't interfere with IMEs
    }
    var input = findParentOfClass(event.currentTarget, 'word-input');
    inputChangeCallback(input, event.key);
    saveWordLocally(input);
}
exports.onWordChange = onWordChange;
/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 * @param key The key from the event that led here
 */
function inputChangeCallback(inp, key) {
    var fn = theBoiler().onInputChange;
    if (fn) {
        fn(inp);
    }
    var doc = getOptionalStyle(inp, 'data-onchange');
    if (doc) {
        var func = window[doc];
        if (func) {
            func(inp, key);
        }
    }
}
/**
 * Find the input that the user likely means when navigating from start in a given x,y direction
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns
 */
function findNextInput(start, dx, dy, cls, clsSkip) {
    var root2d = findParentOfClass(start, 'letter-grid-2d');
    var loop = findParentOfClass(start, 'loop-navigation');
    var find = null;
    if (root2d != null) {
        find = findNext2dInput(root2d, start, dx, dy, cls, clsSkip);
        if (find != null) {
            return find;
        }
    }
    var discoverRoot = findParentOfClass(start, 'letter-grid-discover');
    if (discoverRoot != null) {
        find = findNextDiscover(discoverRoot, start, dx, dy, cls, clsSkip);
        if (find != null) {
            return find;
        }
        find = findNextByPosition(discoverRoot, start, dx, dy, cls, clsSkip);
        if (find != null) {
            return find;
        }
    }
    if (dy < 0) {
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block', -1);
        if (find != null) {
            return find;
        }
    }
    if (dy > 0) {
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block');
        if (find != null) {
            return find;
        }
    }
    var back = dx == -plusX || dy < 0;
    var next = findNextOfClassGroup(start, cls, clsSkip, 'text-input-group', back ? -1 : 1);
    if (loop != null && findParentOfClass(next, 'loop-navigation') != loop) {
        find = findFirstChildOfClass(loop, cls, clsSkip, back ? -1 : 1);
        if (find) {
            return find;
        }
    }
    return next;
}
/**
 * Find the next element with a desired class, within a parent defined by its class.
 * @param start - The current element
 * @param cls - The class of siblings
 * @param clsSkip - (optional) Another class to avoid
 * @param clsGroup - The class of the containing ancestor
 * @param dir - 1 (default) to look forward, or -1 to look backward
 * @returns Another element, or null if none
 */
function findNextOfClassGroup(start, cls, clsSkip, clsGroup, dir) {
    if (dir === void 0) { dir = 1; }
    var group = findParentOfClass(start, clsGroup);
    var next = findNextOfClass(start, cls, clsSkip, dir);
    if (group != null && (next == null || findParentOfClass(next, clsGroup) != group)) {
        next = findFirstChildOfClass(group, cls, clsSkip, dir);
    }
    return next;
}
/**
 * Find the input that the user likely means when navigating through a well-formed 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNext2dInput(root, start, dx, dy, cls, clsSkip) {
    // TODO: root
    if (dy != 0) {
        // In a 2D grid, up/down keep their relative horizontal positions
        var parent = findParentOfClass(start, 'letter-cell-block');
        var index = indexInContainer(start, parent, cls);
        var nextParent = findNextOfClass(parent, 'letter-cell-block', 'letter-grid-2d', dy);
        while (nextParent != null) {
            var dest = childAtIndex(nextParent, cls, index);
            if (dest != null && !hasClass(dest, clsSkip)) {
                return dest;
            }
            nextParent = findNextOfClass(nextParent, 'letter-cell-block', 'letter-grid-2d', dy);
        }
        dx = dy;
    }
    return findNextOfClass(start, cls, clsSkip, dx);
}
/**
 * Find the input that the user likely means when navigating through a jumbled 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNextByPosition(root, start, dx, dy, cls, clsSkip) {
    var rect = start.getBoundingClientRect();
    var pos = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    var elements = document.getElementsByClassName(cls);
    var distance = 0;
    var nearest = null;
    for (var i = 0; i < elements.length; i++) {
        var elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        rect = elmt.getBoundingClientRect();
        if (dx != 0) {
            // Look for inputs in the same row
            if (pos.y >= rect.y && pos.y < rect.y + rect.height) {
                // Measure distance in the dx direction
                var d = (rect.x + rect.width / 2 - pos.x) / dx;
                // Keep the nearest
                if (d > 0 && (nearest == null || d < distance)) {
                    distance = d;
                    nearest = elmt;
                }
            }
        }
        else if (dy != 0) {
            // Look for inputs in the same column
            if (pos.x >= rect.x && pos.x < rect.x + rect.width) {
                // Measure distance in the dy direction
                var d = (rect.y + rect.height / 2 - pos.y) / dy;
                if (d > 0 && (nearest == null || d < distance)) {
                    // Keep the nearest
                    distance = d;
                    nearest = elmt;
                }
            }
        }
    }
    if (nearest != null) {
        return nearest;
    }
    // Try again, but look in the next row/column
    rect = start.getBoundingClientRect();
    pos = plusX > 0 ? { x: rect.x + (dy > 0 ? rect.width - 1 : 1), y: rect.y + (dx > 0 ? rect.height - 1 : 1) }
        : { x: rect.x + (dy < 0 ? rect.width - 1 : 1), y: rect.y + (dx < 0 ? rect.height - 1 : 1) };
    var distance2 = 0;
    var wrap = null;
    for (var i = 0; i < elements.length; i++) {
        var elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        // Remember the first element (if dx/dy is positive), or else the last
        if (wrap == null || (dx < 0 || dy < 0)) {
            wrap = elmt;
        }
        rect = elmt.getBoundingClientRect();
        // d measures direction in continuing perpendicular direction
        // d2 measures relative position within original direction
        var d = 0, d2 = 0;
        if (dx != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.y + rect.height / 2 - pos.y) / (dx * plusX);
            d2 = rect.x / dx;
        }
        else if (dy != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.x + rect.width / 2 - pos.x) / (dy * plusX);
            d2 = rect.y / dy;
        }
        // Remember the earliest (d2) element in nearest next row (d)
        if (d > 0 && (nearest == null || d < distance || (d == distance && d2 < distance2))) {
            distance = d;
            distance2 = d2;
            nearest = elmt;
        }
    }
    return nearest != null ? nearest : wrap;
}
/**
 * Smallest rectangle that bounds both inputs
 */
function union(rect1, rect2) {
    var left = Math.min(rect1.left, rect2.left);
    var right = Math.max(rect1.right, rect2.right);
    var top = Math.min(rect1.top, rect2.top);
    var bottom = Math.max(rect1.bottom, rect2.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
}
/**
 * Distort a distance by a sympathetic factor
 * @param delta An actual distance (either horizontal or vertical)
 * @param bias A desired direction of travel, within that axis
 * @returns Shrinks delta, when it aligns with bias, stretches when orthogonal, and -1 when in the wrong direction
 */
function bias(delta, bias) {
    if (bias != 0) {
        if (delta * bias > 0) {
            return Math.abs(delta * 0.8); // sympathetic bias shrinks distance
        }
        else {
            return -1; // anti-bias invalidates distance
        }
    }
    return Math.abs(delta) * 1.2; // orthogonal bias stretches distance
}
/**
 * Measure the distance from one point to another, given a biased travel direction
 * @param from the starting point
 * @param toward the destination point
 * @param bx the desired x movement
 * @param by the desired y movement
 * @returns a skewed distance, where some objects seem nearer and some farther.
 * A negative distance indicates an object in the wrong direction.
 */
function biasedDistance(from, toward, bx, by) {
    var dx = bias(toward.x - from.x, bx);
    var dy = bias(toward.y - from.y, by);
    if (dx < 0 || dy < 0) {
        return -1; // Invalid target
    }
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * When moving off the edge of a world, what is a position on the far side, where we might resume?
 * @param world the boundary rectangle of the world
 * @param pos the starting point
 * @param dx the movement of x travel
 * @param dy the movement of y travel
 * @returns A position aligned with pos, but on the side away from dx,dy
 */
function wrapAround(world, pos, dx, dy) {
    if (dx > 0) { // wrap around right to far left
        return new DOMPoint(world.left - dx, pos.y);
    }
    if (dx < 0) { // wrap around left to far right
        return new DOMPoint(world.right - dx, pos.y);
    }
    if (dy > 0) { // wrap around bottom to far top
        return new DOMPoint(pos.x, world.top - dy);
    }
    if (dy < 0) { // wrap around top to far bottom
        return new DOMPoint(pos.x, world.bottom - dy);
    }
    return pos;
}
/**
 * Find the input that the user likely means when navigating through a jumbled 2d grid
 * @param root - The root ancestor of the entire grid
 * @param start - The current input
 * @param dx - A horizontal direction to look
 * @param dy - A vertical direction to look
 * @param cls - a class to look for
 * @param clsSkip - a class to skip
 * @returns Another input within the grid
 */
function findNextDiscover(root, start, dx, dy, cls, clsSkip) {
    var rect = start.getBoundingClientRect();
    var bounds = rect;
    var pos = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    var elements = document.getElementsByClassName(cls);
    var distance = -1;
    var nearest = null;
    for (var i = 0; i < elements.length; i++) {
        var elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        rect = elmt.getBoundingClientRect();
        bounds = union(bounds, rect);
        var center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        var d2 = biasedDistance(pos, center, dx, dy);
        if (d2 > 0 && (nearest == null || d2 < distance)) {
            nearest = elmt;
            distance = d2;
        }
    }
    if (nearest == null) {
        // Wrap around
        pos = wrapAround(bounds, pos, dx, dy);
        for (var i = 0; i < elements.length; i++) {
            var elmt = elements[i];
            if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
                continue;
            }
            if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
                continue;
            }
            rect = elmt.getBoundingClientRect();
            var center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
            var d2 = biasedDistance(pos, center, dx, dy);
            if (d2 > 0 && (nearest == null || d2 < distance)) {
                nearest = elmt;
                distance = d2;
            }
        }
    }
    return nearest;
}
/**
 * Autocomplete the contents of a multi-letter input from a restricted list of options.
 * Existing text must match the beginning of exactly one option (case-insensitive).
 * @param input a text <input> or <textarea>
 * @param list a list of potential values to complete to
 * @returns true if a single match was found, else false for 0 or multiple matches
 */
function autoCompleteWord(input, list) {
    var value = input.value.toLowerCase();
    var match = null;
    for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
        var i = list_3[_i];
        if (i.toLowerCase().indexOf(value) == 0) {
            if (match) {
                return false; // multiple matches
            }
            match = i;
        }
    }
    if (match) {
        var len = input.value.length;
        input.value = match;
        input.setSelectionRange(len, match.length); // Select the remainder of the word
        return true;
    }
    return false; // no matches
}
exports.autoCompleteWord = autoCompleteWord;
/*-----------------------------------------------------------
 * _textSetup.ts
 *-----------------------------------------------------------*/
/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
function textSetup() {
    setupLetterPatterns();
    setupExtractPattern();
    setupLetterCells();
    setupLetterInputs();
    setupWordCells();
    indexAllInputFields();
}
exports.textSetup = textSetup;
/**
 * Look for elements of class 'create-from-pattern'.
 * When found, use the pattern, as well as other inputs, to build out a sequence of text inputs inside that element.
 * Secondary attributes:
 *   letter-cell-table: A table with this class will expect every cell
 *   data-letter-pattern: A string specifying the number of input, and any decorative text.
 *                        Example: "2-2-4" would create _ _ - _ _ - _ _ _ _
 *                        Special case: The character '¤' is reserved for a solid block, like you might see in a crossword.
 *   data-extract-indeces: A string specifying which of these inputs should be auto-extracted.
 *                         The input indeces start at 1. To use more than one, separate by spaces.
 *                         Example: "1 8" would auto-extract the first and last characters from the above pattern.
 *   data-number-assignments: An alternate way of specifying which inputs to auto-extract.
 *                            Use this when the destination of the extracted characters is not in reading order.
 *                            Example: "1=4 8=5" would auto-extract the first and last characters from the above pattern,
 *                            and those characters would become the 4th and 5th characters in the extracted answer.
 *   data-input-style: Specifies the look of each input field (not those tagged for extraction).
 *                     Values implemented so far:
 *                     - underline (the default): renders each input as an underline, with padding between inputs
 *                     - box: renders each input as a box, with padding between inputs
 *                     - grid: renders each input as a box in a contiguous grid of boxes (no padding)
 *   data-literal-style: Specifies the look of characters that are mixed among the inputs (such as the dashes the in pattern above)
 *                       Values implemented so far:
 *                       - none (the default): no special decoration. The spacing will still stay even with inputs.
 *                       - box: renders each character in a box that is sized equal to a simple underline input.
 *   data-extract-style: Specifies the look of those input field that are tagged for extraction.
 *                       Values implemented so far:
 *                       - box: renders each input as a box, using the same spacing as underlines
 *   data-extract-image: Specifies an image to be rendered behind extractable inputs.
 *                       Example: "Icons/Circle.png" will render a circle behind the input, in addition to any other extract styles
 *
 *   NOTE: the -style and -image fields can be placed on the affected pattern tag, or on any parent below the <BODY>.
 *
 * ---- STYLES ----
 *   letter-grid-2d:       Simple arrow navigation in all directions. At left/right edges, wrap
 *   letter-grid-discover: Subtler arrow navigation, accounts for offsets by finding nearest likely target
 *   loop-navigation:      When set, arrowing off top or bottom loops around
 *   navigate-literals:    A table with this class will allow the cursor to land on literals, but not over-type them.
 */
function setupLetterPatterns() {
    var tables = document.getElementsByClassName('letter-cell-table');
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        var navLiterals = findParentOfClass(table, 'navigate-literals') != null;
        var cells = table.getElementsByTagName('td');
        for (var j = 0; j < cells.length; j++) {
            var td = cells[j];
            // Skip cells with existing contents
            if (hasClass(td, 'no-cell')) {
                continue;
            }
            if (td.innerHTML == '') {
                toggleClass(td, 'create-from-pattern', true);
                if (!getOptionalStyle(td, 'data-letter-pattern')) {
                    td.setAttributeNS(null, 'data-letter-pattern', '1');
                }
                // Make sure every row that contains any cells with inputs is tagged as a block
                var tr = td.parentNode;
                toggleClass(tr, 'letter-cell-block', true);
                // Any cells tagged extract need to clarify what to extract
                if (hasClass(td, 'extract')) {
                    td.setAttributeNS(null, 'data-extract-indeces', '1');
                }
            }
            else {
                toggleClass(td, 'literal', true);
                // Any cells tagged extract need to clarify what to extract
                if (hasClass(td, 'extract')) {
                    toggleClass(td, 'extract-input', true);
                    toggleClass(td, 'extract-literal', true);
                    td.setAttributeNS(null, 'data-extract-value', td.innerText);
                }
                if (navLiterals) {
                    var span = document.createElement('span');
                    toggleClass(span, 'letter-cell', true);
                    toggleClass(span, 'literal', true);
                    toggleClass(span, 'read-only-overlay', true);
                    // Don't copy contents into span. Only used for cursor position
                    td.appendChild(span);
                }
            }
        }
    }
    var patterns = document.getElementsByClassName('create-from-pattern');
    for (var i = 0; i < patterns.length; i++) {
        var parent = patterns[i];
        var pattern = parseNumberPattern(parent, 'data-letter-pattern');
        var extractPattern = parsePattern(parent, 'data-extract-indeces');
        var numberedPattern = parsePattern2(parent, 'data-number-assignments');
        var vertical = hasClass(parent, 'vertical');
        var numeric = hasClass(parent, 'numeric');
        var styles = getLetterStyles(parent, 'underline', '', numberedPattern == null ? 'box' : 'numbered');
        if (pattern != null && pattern.length > 0) { //if (parent.classList.contains('letter-cell-block')) {
            var prevCount = 0;
            for (var pi = 0; pi < pattern.length; pi++) {
                if (pattern[pi]['count']) {
                    var count = pattern[pi]['count'];
                    for (var ci = 1; ci <= count; ci++) {
                        var span = document.createElement('span');
                        toggleClass(span, 'letter-cell', true);
                        applyAllClasses(span, styles.letter);
                        toggleClass(span, 'numeric', numeric);
                        var index = prevCount + ci;
                        //Highlight and Extract patterns MUST be in ascending order
                        if (extractPattern.indexOf(index) >= 0) {
                            toggleClass(span, 'extract', true);
                            applyAllClasses(span, styles.extract);
                        }
                        if (numberedPattern[index] !== undefined) {
                            toggleClass(span, 'extract', true);
                            toggleClass(span, 'numbered', true); // indicates numbers used in extraction
                            applyAllClasses(span, styles.extract); // 'extract-numbered' indicates the visual appearance
                            var number = document.createElement('span');
                            toggleClass(number, 'under-number');
                            number.innerText = numberedPattern[index];
                            span.setAttribute('data-number', numberedPattern[index]);
                            span.appendChild(number);
                        }
                        parent.appendChild(span);
                        if (vertical && (ci < count || pi < pattern.length - 1)) {
                            parent.appendChild(document.createElement('br'));
                        }
                    }
                    prevCount += count;
                }
                else if (pattern[pi]['char'] !== null) {
                    var lit = pattern[pi]['char'];
                    var span = createLetterLiteral(lit);
                    toggleClass(span, styles.literal, true);
                    parent.appendChild(span);
                    if (vertical && (pi < pattern.length - 1)) {
                        parent.appendChild(document.createElement('br'));
                    }
                }
            }
        }
    }
}
/**
 * Look for the standard styles in the current tag, and all parents
 * @param elmt - A page element
 * @param defLetter - A default letter style
 * @param defLiteral - A default literal style
 * @param defExtract - A default extraction style
 * @returns An object with a style name for each role
 */
function getLetterStyles(elmt, defLetter, defLiteral, defExtract) {
    var letter = getOptionalStyle(elmt, 'data-input-style', defLetter, 'letter-');
    var literal = getOptionalStyle(elmt, 'data-literal-style', defLiteral);
    literal = (literal != null) ? ('literal-' + literal) : letter;
    var extract = getOptionalStyle(elmt, 'data-extract-style', defExtract, 'extract-');
    return {
        'letter': letter,
        'extract': extract,
        'literal': literal
    };
}
exports.getLetterStyles = getLetterStyles;
/**
 * Create a span block for a literal character, which can be a sibling of text input fields.
 * It should occupy the same space, although may not have the same decorations such as underline.
 * The trick is to create an empty, disabled input (to hold the size), and then render plain text in front of it.
 * @param char - Literal text for a single character. Special case the paragraphs as <br>
 * @returns The generated <span> element
 */
function createLetterLiteral(char) {
    if (char == '¶') {
        // Paragraph markers could be formatting, but just as likely are really spaces
        var br = document.createElement('br');
        br.classList.add('letter-input');
        br.classList.add('letter-non-input');
        br.setAttributeNS(null, 'data-literal', '¶');
        return br;
    }
    var span = document.createElement('span');
    span.classList.add('letter-cell');
    span.classList.add('literal');
    initLiteralLetter(span, char);
    return span;
}
/**
 * Helper for createLetterLiteral
 * @param span - The span being created
 * @param char - A character to show. Spaces are converted to nbsp
 */
function initLiteralLetter(span, char) {
    if (char == ' ') {
        span.innerText = '\xa0';
    }
    else if (char == '¤') {
        span.innerText = '\xa0';
        span.classList.add('block');
    }
    else {
        span.innerText = char;
    }
}
/**
 * Parse a pattern with numbers embedded in arbitrary text.
 * Each number can be multiple digits.
 * @example '$3.2' would return a list with 4 elements:
 *    {'type':'text', 'char':'$'}
 *    {'type':'number', 'count':'3'}
 *    {'type':'text', 'char':'.'}
 *    {'type':'number', 'count':'2'}
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @returns An array of pattern tokens
 */
function parseNumberPattern(elmt, patternAttr) {
    var list = [];
    var pattern = elmt.getAttributeNS('', patternAttr);
    if (pattern == null) {
        return list;
    }
    for (var pi = 0; pi < pattern.length; pi++) {
        var count = 0;
        while (pi < pattern.length && pattern[pi] >= '0' && pattern[pi] <= '9') {
            count = count * 10 + (pattern.charCodeAt(pi) - 48);
            pi++;
        }
        if (count > 0) {
            list.push({ count: count });
        }
        if (pi < pattern.length) {
            list.push({ char: pattern[pi] });
        }
    }
    return list;
}
/**
 * Parse a pattern with numbers separated by spaces.
 * @example '12 3' would return a list with 2 elements: [12, 3]
 * If offset is specified, each number is shifted accordingly
 * @example '12 3' with offset -1 would return a list : [11, 2]
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @param offset - (optional) An offset to apply to each number
 * @returns An array of numbers
 */
function parsePattern(elmt, patternAttr, offset) {
    if (offset === void 0) { offset = 0; }
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = [];
    if (pattern != null) {
        var array = pattern.split(' ');
        for (var i = 0; i < array.length; i++) {
            set.push(parseInt(array[i]) + offset);
        }
    }
    return set;
}
/**
 * Parse a pattern with assignments separated by spaces.
 * Each assignment is in turn a number and a value, separated by an equal sign.
 * @example '2=abc 34=5' would return a dictionary with 2 elements: {'2':'abc', '34':'5'}
 * If offset is specified, each key number is shifted accordingly. But values are not shifted.
 * @example '2=abc 34=5' with offset -1 would return {'1':'abc', '33':'5'}
 * @param elmt - An element which may contain a pattern attribute
 * @param patternAttr - The pattern attribute
 * @param offset - (optional) An offset to apply to each number
 * @returns A generic object of names and values
 */
function parsePattern2(elmt, patternAttr, offset) {
    if (offset === void 0) { offset = 0; }
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = {};
    if (pattern != null) {
        var array = pattern.split(' ');
        for (var i = 0; i < array.length; i++) {
            var equals = array[i].split('=');
            set[parseInt(equals[0]) + offset] = equals[1];
        }
    }
    return set;
}
/**
 * Once elements are created and tagged with letter-cell,
 * (which happens automatically when containers are tagged with create-from-pattern)
 * add input areas inside each cell.
 * If the cell is tagged for extraction, or numbering, add appropriate tags and other child nodes.
 * @example <div class="letter-cell"/> becomes:
 *   <div><input type='text' class="letter-input" /></div>  // for simple text input
 * If the cell had other attributes, those are either mirrored to the text input,
 * or trigger secondary attributes.
 * For example, letter-cells that also have class:
 *   "numeric" - format the input for numbers only
 *   "numbered" - label that cell for re-ordered extraction to a final answer
 *   "extract" - format that cell for in-order extraction to a final answer
 *   "extractor" - format that cell as the destination of extraction
 *   "literal" - format that cell as read-only, and overlay the literal text or whitespace
 */
function setupLetterCells() {
    var cells = document.getElementsByClassName('letter-cell');
    var extracteeIndex = 1;
    var extractorIndex = 1;
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var navLiterals = findParentOfClass(cell, 'navigate-literals') != null;
        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        if (hasClass(cell, 'numeric')) {
            // We never submit, so this doesn't have to be exact. But it should trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*'; // iOS
            inp.inputMode = 'numeric'; // Android
        }
        toggleClass(inp, 'letter-input');
        if (hasClass(cell, 'extract')) {
            toggleClass(inp, 'extract-input');
            var extractImg = getOptionalStyle(cell, 'data-extract-image');
            if (extractImg != null) {
                var img = document.createElement('img');
                img.src = extractImg;
                img.classList.add('extract-image');
                cell.appendChild(img);
            }
            if (hasClass(cell, 'numbered')) {
                toggleClass(inp, 'numbered-input');
                var dataNumber = cell.getAttribute('data-number');
                if (dataNumber != null) {
                    inp.setAttribute('data-number', dataNumber);
                }
            }
            else {
                // Implicit number based on reading order
                inp.setAttribute('data-number', "" + extracteeIndex++);
            }
        }
        if (hasClass(cell, 'extractor')) {
            toggleClass(inp, 'extractor-input');
            inp.id = 'extractor-' + extractorIndex++;
        }
        if (hasClass(cell, 'literal')) {
            toggleClass(inp, 'letter-non-input');
            var val = cell.innerText || cell.innerHTML;
            cell.innerHTML = '';
            inp.setAttribute('data-literal', val == '\xa0' ? ' ' : val);
            if (navLiterals) {
                inp.setAttribute('readonly', '');
                inp.value = val;
            }
            else {
                inp.setAttribute('disabled', '');
                var span = document.createElement('span');
                toggleClass(span, 'letter-literal');
                span.innerText = val;
                cell.appendChild(span);
            }
        }
        cell.appendChild(inp);
    }
}
/**
 * Every input tagged as a letter-input should be hooked up to our all-purpose text input handler
 * @example, each <input type="text" class="letter-input" />
 *   has keyup/down/change event handlers added.
 */
function setupLetterInputs() {
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        inp.onkeydown = function (e) { onLetterKeyDown(e); };
        inp.onkeyup = function (e) { onLetterKey(e); };
        inp.onchange = function (e) { onLetterChange(e); };
    }
}
/**
 * Once elements are created and tagged with word-cell, add input areas inside each cell.
 * @example <div class="word-cell"/> becomes:
 *   <div><input type='text' class="word-input" /></div>  // for simple multi-letter text input
 */
function setupWordCells() {
    var cells = document.getElementsByClassName('word-cell');
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var inpStyle = getOptionalStyle(cell, 'data-word-style', 'underline', 'word-');
        // Place a small text input field in each cell
        var inp = document.createElement('input');
        inp.type = 'text';
        toggleClass(inp, 'word-input');
        if (inpStyle != null) {
            toggleClass(inp, inpStyle);
        }
        if (hasClass(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            toggleClass(inp, 'word-non-input');
            var span = document.createElement('span');
            toggleClass(span, 'word-literal');
            span.innerText = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(span);
        }
        else {
            inp.onkeydown = function (e) { onLetterKeyDown(e); };
            inp.onkeyup = function (e) { onWordKey(e); };
            inp.onchange = function (e) { onWordChange(e); };
        }
        cell.appendChild(inp);
    }
}
/**
 * Expand any tag with class="extracted" to create the landing point for extracted answers
 * The area may be further annotated with data-number-pattern="..." and optionally
 * data-indexed-by-letter="true" to create sequences of numbered/lettered destination points.
 *
 * @todo: clarify the difference between "extracted" and "extractor"
 */
function setupExtractPattern() {
    var extracted = document.getElementById('extracted');
    if (extracted === null) {
        return;
    }
    var numbered = true;
    // Special case: if extracted root is tagged data-indexed-by-letter, 
    // then the indeces that lead here are letters rather than the usual numbers.
    var lettered = extracted.getAttributeNS('', 'data-indexed-by-letter') != null;
    // Get the style to use for each extracted value. Default: "letter-underline"
    var extractorStyle = getOptionalStyle(extracted, 'data-extractor-style', 'underline', 'letter-');
    var numPattern = parseNumberPattern(extracted, 'data-number-pattern');
    if (numPattern === null || numPattern.length === 0) {
        numbered = false;
        numPattern = parseNumberPattern(extracted, 'data-letter-pattern');
    }
    if (numPattern != null) {
        var nextNumber = 1;
        for (var pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count']) {
                var count = numPattern[pi]['count'];
                for (var ci = 1; ci <= count; ci++) {
                    var span_1 = document.createElement('span');
                    toggleClass(span_1, 'letter-cell', true);
                    toggleClass(span_1, 'extractor', true);
                    toggleClass(span_1, extractorStyle, true);
                    extracted.appendChild(span_1);
                    if (numbered) {
                        toggleClass(span_1, 'numbered');
                        var number = document.createElement('span');
                        toggleClass(number, 'under-number');
                        number.innerText = lettered ? String.fromCharCode(64 + nextNumber) : ("" + nextNumber);
                        span_1.setAttribute('data-number', "" + nextNumber);
                        span_1.appendChild(number);
                        nextNumber++;
                    }
                }
            }
            else if (numPattern[pi]['char'] !== null) {
                var span = createLetterLiteral(numPattern[pi]['char']);
                extracted.appendChild(span);
            }
        }
    }
}
/**
 * Has the user started inputing an answer?
 * @param event - Any user action that led here
 * @returns true if any letter-input or word-input fields have user values
 */
function hasProgress(event) {
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (inp.value != '') {
            return true;
        }
    }
    return false;
}
/*-----------------------------------------------------------
 * _subway.ts
 *-----------------------------------------------------------*/
/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
function setupSubways() {
    var subways = document.getElementsByClassName('subway');
    for (var i = 0; i < subways.length; i++) {
        createSubway(subways[i]);
    }
}
exports.setupSubways = setupSubways;
/**
 * Maximum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current max value, which can be null
 * @returns The max
 */
function maxx(val, curr) {
    return (!curr || curr < val) ? val : curr;
}
/**
 * Minimum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current min value, which can be null
 * @returns The min
 */
function minn(val, curr) {
    return (!curr || curr > val) ? val : curr;
}
function bounding(pt, rect) {
    if (!rect) {
        return new DOMRect(pt.x, pt.y, 0, 0);
    }
    var left = minn(rect.left, pt.x);
    var right = maxx(rect.right, pt.x);
    var top = minn(rect.top, pt.y);
    var bottom = maxx(rect.bottom, pt.y);
    return new DOMRect(left, top, right - left, bottom - top);
}
/**
 * Round a value to the nearest 0.1
 * @param n Any number
 * @returns A number with no significant digits smaller than a tenth
 */
function dec(n) {
    return Math.round(n * 10) / 10;
}
/**
 * Create an SVG inside a <div class='subway'>, to connect input cells.
 * @param subway
 */
function createSubway(subway) {
    var details = verticalSubway(subway);
    if (!details) {
        details = horizontalSubway(subway);
    }
    if (details) {
        var xmlns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(xmlns, 'svg');
        var path = document.createElementNS(xmlns, 'path');
        path.setAttributeNS(null, 'd', details.path_d);
        svg.appendChild(path);
        svg.setAttributeNS(null, 'width', dec(details.bounds.right - details.origin.x - details.shift.x + 2) + 'px');
        svg.setAttributeNS(null, 'height', dec(details.bounds.bottom - details.origin.y - details.shift.y + 2) + 'px');
        subway.appendChild(svg);
        if (details.shift.x != 0) {
            subway.style.left = dec(details.shift.x) + 'px';
        }
        if (details.shift.y != 0) {
            subway.style.top = dec(details.shift.y) + 'px';
        }
    }
}
/**
 * Build the paths of a vertically-oriented subway
 * @param subway The <div class='subway' with coordinate info
 * @returns Details for the SVG and PATH to be created, or undefined if the div does not indicate vertical
 */
function verticalSubway(subway) {
    var origin = subway.getBoundingClientRect();
    var sLefts = subway.getAttributeNS('', 'data-left-end') || '';
    var sRights = subway.getAttributeNS('', 'data-right-end') || '';
    if (sLefts.length == 0 && sRights.length == 0) {
        return undefined;
    }
    var leftId = subway.getAttributeNS('', 'data-left-id');
    var rightId = subway.getAttributeNS('', 'data-right-id');
    sLefts = joinIds(leftId, sLefts);
    sRights = joinIds(rightId, sRights);
    var bounds;
    var yLefts = [];
    var yRights = [];
    // right-side spurs
    var rights = sRights.split(' ');
    for (var i = 0; i < rights.length; i++) {
        var pt = getAnchor(rights[i], 'left');
        bounds = bounding(pt, bounds);
        yRights.push(dec(pt.y - origin.top));
    }
    // left-side spurs
    var lefts = sLefts.split(' ');
    for (var i = 0; i < lefts.length; i++) {
        var pt = getAnchor(lefts[i], 'right');
        bounds = bounding(pt, bounds);
        yLefts.push(dec(pt.y - origin.top));
    }
    if (!bounds) {
        return; // ERROR
    }
    // rationalize the boundaries
    var shift_left = minn(0, bounds.left - origin.left);
    var left = maxx(0, dec(bounds.left - origin.left - shift_left));
    var right = dec(bounds.left + bounds.width - origin.left - shift_left);
    // belatedly calculate the middle
    var sMiddle = subway.getAttributeNS('', 'data-center-line');
    var middle;
    if (!sMiddle) {
        middle = bounds.width / 2;
    }
    else if (sMiddle.indexOf('%') == sMiddle.length - 1) {
        middle = dec(parseInt(sMiddle) * bounds.width / 100);
    }
    else {
        middle = parseInt(sMiddle);
    }
    var d = '';
    if (bounds.height <= 2.5 && yLefts.length == 1 && yRights.length == 1) {
        d = 'M' + left + ',' + yLefts[0]
            + ' L' + right + yRights[0];
    }
    else {
        // Draw the first left to the last right
        var d_1 = 'M' + left + ',' + yLefts[0]
            + ' L' + middle + ',' + yLefts[0]
            + ' L' + middle + ',' + yRights[yRights.length - 1]
            + ' L' + right + ',' + yRights[yRights.length - 1];
        if (yLefts.length > 0 || yRights.length > 0) {
            // Draw the last left to the first right
            d_1 += 'M' + left + ',' + yLefts[yLefts.length - 1]
                + ' L' + middle + ',' + yLefts[yLefts.length - 1]
                + ' L' + middle + ',' + yRights[0]
                + ' L' + right + ',' + yRights[0];
        }
        // Add any middle spurs
        for (var i = 1; i < yLefts.length - 1; i++) {
            d_1 += 'M' + left + ',' + yLefts[i]
                + ' L' + middle + ',' + yLefts[i]
                + ' L' + middle + ',' + yRights[0];
        }
        for (var i = 1; i < yRights.length - 1; i++) {
            d_1 += 'M' + right + ',' + yRights[i]
                + ' L' + middle + ',' + yRights[i]
                + ' L' + middle + ',' + yLefts[0];
        }
    }
    return {
        origin: origin,
        path_d: d,
        bounds: bounds,
        shift: new DOMPoint(shift_left, 0)
    };
}
function joinIds(id, indeces) {
    if (!id || !indeces) {
        return indeces;
    }
    var list = indeces.split(' ').map(function (i) { return id + '.' + i; });
    return list.join(' ');
}
/**
 * Build the paths of a horizontally-oriented subway
 * @param subway The <div class='subway' with coordinate info
 * @returns Details for the SVG and PATH to be created, or undefined if the div does not indicate horizontal
 */
function horizontalSubway(subway) {
    var origin = subway.getBoundingClientRect();
    var sTops = subway.getAttributeNS('', 'data-top-end') || '';
    var sBottoms = subway.getAttributeNS('', 'data-bottom-end') || '';
    if (sTops.length == 0 && sBottoms.length == 0) {
        return undefined;
    }
    var topId = subway.getAttributeNS('', 'data-top-id');
    var bottomId = subway.getAttributeNS('', 'data-bottom-id');
    sTops = joinIds(topId, sTops);
    sBottoms = joinIds(bottomId, sBottoms);
    var bounds;
    var xTops = [];
    var xBottoms = [];
    // top-side spurs
    if (sBottoms.length > 0) {
        var bottoms = sBottoms.split(' ');
        for (var i = 0; i < bottoms.length; i++) {
            var pt = getAnchor(bottoms[i], 'top');
            bounds = bounding(pt, bounds);
            xBottoms.push(dec(pt.x - origin.left));
        }
    }
    // bottom-side spurs
    if (sTops.length > 0) {
        var tops = sTops.split(' ');
        for (var i = 0; i < tops.length; i++) {
            var pt = getAnchor(tops[i], 'bottom');
            bounds = bounding(pt, bounds);
            xTops.push(dec(pt.x - origin.left));
        }
    }
    if (!bounds) {
        return; // ERROR
    }
    // belatedly calculate the middle
    var sMiddle = subway.getAttributeNS('', 'data-center-line');
    var middle;
    if (!sMiddle) {
        middle = bounds.height / 2;
    }
    else if (sMiddle.indexOf('%') == sMiddle.length - 1) {
        middle = dec(parseInt(sMiddle) * bounds.height / 100);
    }
    else {
        middle = parseInt(sMiddle);
        if (bounds.height <= middle) {
            if (xTops.length == 0) {
                bounds.y -= middle + 1;
            }
            bounds.height = middle + 1;
        }
    }
    // align the boundaries
    var shift_top = minn(0, bounds.top - origin.top); // zero or negative
    var top = maxx(0, dec(bounds.top - origin.top - shift_top));
    var bottom = dec(bounds.top + bounds.height - origin.top - shift_top);
    var d = '';
    if (bounds.width <= 2.5 && xTops.length == 1 && xBottoms.length == 1) {
        // Special case (nearly) vertical connectors
        d = 'M' + xTops[0] + ',' + top
            + ' L' + xBottoms[0] + ',' + bottom;
    }
    else {
        // Draw the horizontal bar
        d = 'M' + dec(bounds.left - origin.left) + ',' + middle
            + ' h' + dec(bounds.width);
        // Draw all up-facing spurs
        for (var i = 0; i < xTops.length; i++) {
            d += ' M' + xTops[i] + ',' + middle
                + ' v' + -middle;
        }
        // Draw all down-facing spurs
        for (var i = 0; i < xBottoms.length; i++) {
            d += ' M' + xBottoms[i] + ',' + middle
                + ' v' + dec(bounds.height - middle);
        }
    }
    return {
        origin: origin,
        path_d: d,
        bounds: bounds,
        shift: new DOMPoint(0, shift_top)
    };
}
/**
 * Find a point on the perimeter of a specific subway cell
 * @param id_index A cell identity in the form "col1.4", where col1 is a letter-cell-block and .4 is the 4th cell in that block
 * @param edge One of {left|right|top|bottom}. The point is the midpoint of that edge of the cell
 * @returns A point on the page in client coordinates
 */
function getAnchor(id_index, edge) {
    var idx = id_index.split('.');
    var elmt = document.getElementById(idx[0]);
    if (idx.length > 1) {
        var children = elmt.getElementsByClassName('letter-cell');
        elmt = children[parseInt(idx[1]) - 1]; // indexes start at 1
    }
    var rect = elmt.getBoundingClientRect();
    if (edge == 'left') {
        return new DOMPoint(rect.left, rect.top + 1 + rect.height / 2);
    }
    if (edge == 'right') {
        return new DOMPoint(rect.right, rect.top - 1 + rect.height / 2);
    }
    if (edge == 'top') {
        return new DOMPoint(rect.left + 1 + rect.width / 2, rect.top);
    }
    if (edge == 'bottom') {
        return new DOMPoint(rect.left - 1 + rect.width / 2, rect.bottom);
    }
    // error: return middle
    return new DOMPoint(rect.left - 1 + rect.width / 2, rect.top - 1 + rect.height / 2);
}
/**
 * Convert an element's left/top style to a position
 * @param elmt Any element with a style
 * @returns A position
 */
function positionFromStyle(elmt) {
    return { x: parseInt(elmt.style.left), y: parseInt(elmt.style.top) };
}
exports.positionFromStyle = positionFromStyle;
// VOCABULARY
// moveable: any object which can be clicked on to begin a move
// drop-target: a container that can receive a (single) moveable element
// drag-source: a container that can hold a single spare moveable element
/**
 * Scan the page for anything marked moveable, drag-source, or drop-target
 * Those items get click handlers
 */
function preprocessDragFunctions() {
    var elems = document.getElementsByClassName('moveable');
    for (var i = 0; i < elems.length; i++) {
        preprocessMoveable(elems[i]);
    }
    elems = document.getElementsByClassName('drop-target');
    for (var i = 0; i < elems.length; i++) {
        preprocessDropTarget(elems[i]);
    }
    elems = document.getElementsByClassName('free-drop');
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        preprocessFreeDrop(elem);
        // backward-compatible
        if (hasClass(elem, 'z-grow-up')) {
            elem.setAttributeNS('', 'data-z-grow', 'up');
        }
        else if (hasClass(elem, 'z-grow-down')) {
            elem.setAttributeNS('', 'data-z-grow', 'down');
        }
        initFreeDropZorder(elem);
    }
}
exports.preprocessDragFunctions = preprocessDragFunctions;
/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessMoveable(elem) {
    elem.setAttribute('draggable', 'true');
    elem.onpointerdown = function (e) { onClickDrag(e); };
    elem.ondrag = function (e) { onDrag(e); };
    elem.ondragend = function (e) { onDragDrop(e); };
}
/**
 * Hook up the necessary mouse events to each drop target
 * @param elem a drop-target element
 */
function preprocessDropTarget(elem) {
    elem.onpointerup = function (e) { onClickDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
    elem.onpointermove = function (e) { onTouchDrag(e); };
}
/**
 * Hook up the necessary mouse events to each free drop target
 * @param elem a free-drop element
 */
function preprocessFreeDrop(elem) {
    elem.onpointerdown = function (e) { doFreeDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
}
/**
 * Assign z-index values to all moveable objects within a container.
 * Objects' z index is a function of their y-axis, and can extend up or down.
 * @param container The free-drop container, which can contain a data-z-grow attribute
 */
function initFreeDropZorder(container) {
    var _a;
    var zGrow = (_a = container.getAttributeNS('', 'data-z-grow')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!zGrow || (zGrow != 'up' && zGrow != 'down')) {
        return;
    }
    var zUp = zGrow == 'up';
    var height = container.getBoundingClientRect().height;
    var children = container.getElementsByClassName('moveable');
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var z = parseInt(child.style.top); // will always be in pixels, relative to the container
        z = 1000 + (zUp ? (height - z) : z);
        child.style.zIndex = String(z);
    }
}
exports.initFreeDropZorder = initFreeDropZorder;
/**
 * The most recent object to be moved
 */
var _priorDrag = null;
/**
 * The object that is selected, if any
 */
var _dragSelected = null;
/**
 * The drop-target over which we are dragging
 */
var _dropHover = null;
/**
 * The position within its container that a dragged object was in before dragging started
 */
var _dragPoint = null;
/**
 * Pick up an object
 * @param obj A moveable object
 */
function pickUp(obj) {
    _priorDrag = _dragSelected;
    if (_dragSelected != null && _dragSelected != obj) {
        toggleClass(_dragSelected, 'drag-selected', false);
        _dragSelected = null;
    }
    if (obj != null && obj != _dragSelected) {
        _dragSelected = obj;
        toggleClass(_dragSelected, 'displaced', false); // in case from earlier
        toggleClass(_dragSelected, 'placed', false);
        toggleClass(_dragSelected, 'drag-selected', true);
    }
}
/**
 * Drop the selected drag object onto a destination
 * If something else is already there, it gets moved to an empty drag source
 * Once complete, nothing is selected.
 * @param dest The target of this drag action
 */
function doDrop(dest) {
    if (!_dragSelected) {
        return;
    }
    var src = getDragSource();
    if (dest === src) {
        if (_priorDrag !== _dragSelected) {
            // Don't treat the first click of a 2-click drag
            // as a 1-click non-move.
            return;
        }
        // 2nd click on src is equivalent to dropping no-op
        dest = null;
    }
    var other = null;
    if (dest != null) {
        other = findFirstChildOfClass(dest, 'moveable', undefined, 0);
        if (other != null) {
            dest.removeChild(other);
        }
        src === null || src === void 0 ? void 0 : src.removeChild(_dragSelected);
        dest.appendChild(_dragSelected);
        saveContainerLocally(_dragSelected, dest);
    }
    toggleClass(_dragSelected, 'placed', true);
    toggleClass(_dragSelected, 'drag-selected', false);
    _dragSelected = null;
    _dragPoint = null;
    if (_dropHover != null) {
        toggleClass(_dropHover, 'drop-hover', false);
        _dropHover = null;
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
        src === null || src === void 0 ? void 0 : src.appendChild(other);
        saveContainerLocally(other, src);
    }
}
/**
 * Drag the selected object on a region with flexible placement.
 * @param event The drop event
 */
function doFreeDrop(event) {
    if (_dragPoint == null
        || (event.clientX == _dragPoint.x && event.clientY == _dragPoint.y && _priorDrag == null)) {
        // This is the initial click
        return;
    }
    if (_dragSelected != null) {
        var dx = event.clientX - _dragPoint.x;
        var dy = event.clientY - _dragPoint.y;
        var oldLeft = parseInt(_dragSelected.style.left);
        var oldTop = parseInt(_dragSelected.style.top);
        _dragSelected.style.left = (oldLeft + dx) + 'px';
        _dragSelected.style.top = (oldTop + dy) + 'px';
        updateZ(_dragSelected, oldTop + dy);
        savePositionLocally(_dragSelected);
        doDrop(null);
    }
}
/**
 * When an object is dragged in a container that holds multiple items,
 * the z-order can change. Use the relative y position to set z-index.
 * @param elem The element whose position just changed
 * @param y The y-offset of that element, within its free-drop container
 */
function updateZ(elem, y) {
    var _a;
    var dest = findParentOfClass(elem, 'free-drop');
    var zGrow = (_a = dest === null || dest === void 0 ? void 0 : dest.getAttributeNS('', 'data-z-grow')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (zGrow == 'down') {
        elem.style.zIndex = String(1000 + y);
    }
    else if (zGrow == 'up') {
        var rect = dest.getBoundingClientRect();
        elem.style.zIndex = String(1000 + rect.height - y);
    }
}
/**
 * The drag-target or drag-source that is the current parent of the dragging item
 * @returns
 */
function getDragSource() {
    if (_dragSelected != null) {
        var src = findParentOfClass(_dragSelected, 'drop-target');
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'drag-source');
        }
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'free-drop');
        }
        return src;
    }
    return null;
}
/**
 * Initialize a drag with mouse-down
 * This may be the beginning of a 1- or 2-click drag action
 * @param event The mouse down event
 */
function onClickDrag(event) {
    var target = event.target;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    var obj = findParentOfClass(target, 'moveable');
    if (obj != null) {
        if (_dragSelected == null) {
            pickUp(obj);
            _dragPoint = { x: event.clientX, y: event.clientY };
        }
        else if (obj == _dragSelected) {
            // 2nd click on this object - enable no-op drop
            _priorDrag = obj;
        }
    }
}
/**
 * Conclude a drag with the mouse up
 * @param event A mouse up event
 */
function onClickDrop(event) {
    var target = event.target;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    if (_dragSelected != null) {
        var dest = findParentOfClass(target, 'drop-target');
        if (event.pointerType == 'touch') {
            // Touch events' target is really the source. Need to find target
            var pos = document.elementFromPoint(event.clientX, event.clientY);
            if (pos) {
                pos = findParentOfClass(pos, 'drop-target');
                if (pos) {
                    dest = pos;
                }
            }
        }
        doDrop(dest);
    }
}
/**
 * Conlcude a drag with a single drag-move-release.
 * We we released over a drop-target or free-drop element, make the move.
 * @param event The mouse drag end event
 */
function onDragDrop(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest) {
        doDrop(dest);
    }
    else {
        dest = findParentOfClass(elem, 'free-drop');
        if (dest) {
            doFreeDrop(event);
        }
    }
}
/**
 * As a drag is happening, highlight the destination
 * @param event The mouse drag start event
 */
function onDrag(event) {
    if (event.screenX == 0 && event.screenY == 0) {
        return; // not a real event; some extra fire on drop
    }
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest != _dropHover) {
        toggleClass(_dropHover, 'drop-hover', false);
        var src = getDragSource();
        if (dest != src) {
            toggleClass(dest, 'drop-hover', true);
            _dropHover = dest;
        }
    }
}
/**
 * Touch move events should behave like drag.
 * @param event Any pointer move, but since we filter to touch, they must be dragging
 */
function onTouchDrag(event) {
    if (event.pointerType == 'touch') {
        console.log('touch-drag to ' + event.x + ',' + event.y);
        onDrag(event);
    }
}
/**
 * As a drag is happening, make the cursor show valid or invalid targets
 * @param event A mouse hover event
 */
function onDropAllowed(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    var dest = findParentOfClass(elem, 'drop-target');
    if (dest == null) {
        dest = findParentOfClass(elem, 'free-drop');
    }
    if (_dragSelected != null && dest != null) {
        event.preventDefault();
    }
}
/**
 * Find a drag-source that is currently empty.
 * Called when a moved object needs to eject another occupant.
 * @returns An un-occuped drag-source, if one can be found
 */
function findEmptySource() {
    var elems = document.getElementsByClassName('drag-source');
    for (var i = 0; i < elems.length; i++) {
        if (findFirstChildOfClass(elems[i], 'moveable', undefined, 0) == null) {
            return elems[i];
        }
    }
    // All drag sources are occupied
    return null;
}
/**
 * Move an object to a destination.
 * @param moveable The object to move
 * @param destination The container to place it in
 */
function quickMove(moveable, destination) {
    if (moveable != null && destination != null && !isSelfOrParent(moveable, destination)) {
        pickUp(moveable);
        doDrop(destination);
    }
}
exports.quickMove = quickMove;
/**
 * Move an object within a free-move container
 * @param moveable The object to move
 * @param position The destination position within the container
 */
function quickFreeMove(moveable, position) {
    if (moveable != null && position != null) {
        moveable.style.left = position.x + 'px';
        moveable.style.top = position.y + 'px';
        updateZ(moveable, position.y);
        toggleClass(moveable, 'placed', true);
    }
}
exports.quickFreeMove = quickFreeMove;
/*-----------------------------------------------------------
 * _stampTools.ts
 *-----------------------------------------------------------*/
// VOCABULARY
// stampable: any object which can be clicked on to draw an icon
// stampPalette: the toolbar from which a user can see and select the draw tools
// stampTool: a UI control to make one or another draw mode the default
// selected: when a stampTool is primary, and will draw when clicking in an active area
// stampToolTemplates: a hidden container of objects that are cloned when drawn
// stampedObject: templates for cloning when drawn
/**
 * The tools in the palette.
 */
var _stampTools = [];
/**
 * The currently selected tool from the palette.
 */
var _selectedTool = null;
/**
 * The tool name to cycle to first.
 */
var _firstTool = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
var _extractorTool = null;
/**
 * The tool name that would erase things.
 */
var _eraseTool = null;
/**
 * Scan the page for anything marked stampable or a draw tool
 */
function preprocessStampObjects() {
    var containers = document.getElementsByClassName('stampable-container');
    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        var rules = getOptionalStyle(container, 'data-stampable-rules');
        if (rules) {
            var list = rules.split(' ');
            for (var r = 0; r < list.length; r++) {
                var rule = list[r];
                if (rule[0] == '.') {
                    var children = container.getElementsByClassName(rule.substring(1));
                    for (var i_3 = 0; i_3 < children.length; i_3++) {
                        toggleClass(children[i_3], 'stampable', true);
                    }
                }
                else if (rule[0] == '#') {
                    var child = document.getElementById(rule.substring(1));
                    toggleClass(child, 'stampable', true);
                }
                else {
                    var children = container.getElementsByTagName(rule.toLowerCase());
                    for (var i_4 = 0; i_4 < children.length; i_4++) {
                        toggleClass(children[i_4], 'stampable', true);
                    }
                }
            }
        }
    }
    var elems = document.getElementsByClassName('stampable');
    for (var i = 0; i < elems.length; i++) {
        var elmt = elems[i];
        elmt.onpointerdown = function (e) { onClickStamp(e); };
        //elmt.ondrag=function(e){onMoveStamp(e)};
        elmt.onpointerenter = function (e) { onMoveStamp(e); };
        elmt.onpointerleave = function (e) { preMoveStamp(e); };
    }
    elems = document.getElementsByClassName('stampTool');
    for (var i = 0; i < elems.length; i++) {
        var elmt = elems[i];
        _stampTools.push(elmt);
        elmt.onclick = function (e) { onSelectStampTool(e); };
    }
    var palette = document.getElementById('stampPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
        _firstTool = palette.getAttributeNS('', 'data-tool-first');
    }
    if (!_firstTool) {
        _firstTool = _stampTools[0].getAttributeNS('', 'data-template-id');
    }
}
exports.preprocessStampObjects = preprocessStampObjects;
/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectStampTool(event) {
    var tool = findParentOfClass(event.target, 'stampTool');
    var prevToolId = getCurrentStampToolId();
    if (tool != null) {
        for (var i = 0; i < _stampTools.length; i++) {
            toggleClass(_stampTools[i], 'selected', false);
        }
        if (tool != _selectedTool) {
            toggleClass(tool, 'selected', true);
            _selectedTool = tool;
        }
        else {
            _selectedTool = null;
        }
    }
    var fn = theBoiler().onStampChange;
    if (fn) {
        fn(getCurrentStampToolId(), prevToolId);
    }
}
/**
 * If the user has any shift key pressed, that trumps all other modes.
 * Else if we have a special erase override, use that.
 * Else if the user selected a drawing tool, then use that.
 * Else use the first tool (presumed default).
 * @param event The click event
 * @param toolFromErase An override because we're erasing/rotating
 * @returns the name of a draw tool
 */
function getStampTool(event, toolFromErase) {
    // Shift keys always win
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (var i = 0; i < _stampTools.length; i++) {
            var mods = _stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                && event.shiftKey == (mods.indexOf('shift') >= 0)
                && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _stampTools[i].getAttributeNS('', 'data-template-id');
            }
        }
    }
    // toolFromErase is set by how the stamping began.
    // If it begins on a pre-stamped cell, shift to the next stamp.
    // After the first click, subsequent dragging keeps the same tool.
    if (toolFromErase != null) {
        return toolFromErase;
    }
    // Lacking other inputs, use the selected tool.
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }
    // If no selection, the first tool is the default
    return _firstTool;
}
/**
 * Expose current stamp tool, in case other features want to react
 */
function getCurrentStampToolId() {
    if (_selectedTool == null) {
        return '';
    }
    var id = _selectedTool.getAttributeNS('', 'data-template-id');
    return id || '';
}
exports.getCurrentStampToolId = getCurrentStampToolId;
/**
 * A stampable element can be the eventual container of the stamp. (example: TD)
 * Or it can assign another element to be the stamp container, with the data-stamp-parent attribute.
 * If present, that field specifies the ID of an element.
 * @param target An element with class="stampable"
 * @returns
 */
function getStampParent(target) {
    var parentId = getOptionalStyle(target, 'data-stamp-parent');
    if (parentId) {
        return document.getElementById(parentId);
    }
    return target;
}
exports.getStampParent = getStampParent;
/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a stampable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseStamp(target) {
    if (target == null) {
        return null;
    }
    var parent = getStampParent(target);
    var cur = findFirstChildOfClass(parent, 'stampedObject');
    var curId;
    var nextId = '';
    if (cur != null) {
        curId = cur.getAttributeNS('', 'data-template-id');
        toggleClass(target, curId, false);
        parent.removeChild(cur);
        if (_extractorTool != null) {
            updateStampExtraction();
        }
        nextId = cur.getAttributeNS('', 'data-next-template-id');
    }
    else if (hasClass(target, 'stampedObject')) {
        // Template is a class on the container itself
        curId = target.getAttributeNS('', 'data-template-id');
        toggleClass(target, 'stampedObject', false);
        toggleClass(target, curId, false);
        target.removeAttributeNS('', 'data-template-id');
        if (_extractorTool != null) {
            updateStampExtraction();
        }
    }
    else {
        return null; // This cell is currently blank
    }
    if (_selectedTool == null) {
        // rotate through the tools
        if (!nextId && curId) {
            var stampTool = findStampTool(curId);
            nextId = stampTool.getAttributeNS('', 'data-next-template-id');
        }
        if (nextId) {
            return nextId;
        }
    }
    if (_selectedTool && _selectedTool.getAttributeNS('', 'data-template-id') == curId) {
        // When a tool is explicitly selected, clicking on that type toggles it back off
        return _eraseTool;
    }
    // No guidance on what to replace this cell with
    return null;
}
/**
 * Given a stamp ID from a stamped element, find the tool that applied it.
 * @param templateId A string that must match a stampTool in this document.
 * @returns The stampTool element.
 */
function findStampTool(templateId) {
    var tools = document.getElementsByClassName('stampTool');
    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.getAttributeNS('', 'data-template-id') == templateId) {
            return tool;
        }
    }
    throw new Error('Unrecognized stamp tool: ' + templateId);
}
/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The name of a tool template
 */
function doStamp(target, tool) {
    var parent = getStampParent(target);
    // Template can be null if tool removes drawn objects
    var template = document.getElementById(tool);
    if (template != null) {
        // Inject the template into the stampable container
        var clone = template.content.cloneNode(true);
        parent.appendChild(clone);
    }
    else if (tool) {
        // Apply the template ID as a style. The container is itself the stamped object
        toggleClass(target, 'stampedObject', true);
        target.setAttributeNS('', 'data-template-id', tool);
    }
    toggleClass(target, tool, true);
    if (_extractorTool != null) {
        updateStampExtraction();
    }
    saveStampingLocally(target);
    var fn = theBoiler().onStamp;
    if (fn) {
        fn(target);
    }
}
exports.doStamp = doStamp;
var _dragDrawTool = null;
var _lastDrawTool = null;
/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(event) {
    var target = findParentOfClass(event.target, 'stampable');
    var nextTool = eraseStamp(target);
    nextTool = getStampTool(event, nextTool);
    if (nextTool) {
        doStamp(target, nextTool);
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}
/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveStamp(event) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        var target = findParentOfClass(event.target, 'stampable');
        eraseStamp(target);
        doStamp(target, _dragDrawTool);
        _dragDrawTool = null;
    }
}
/**
 * When dragging a drawing around, copy each cell's drawing to the next one.
 * As the mouse leaves one surface, note which tool is used there.
 * If dragging unrelated to drawing, flag the coming onMoveStamp to do nothing.
 * @param event The mouse leave event
 */
function preMoveStamp(event) {
    if (event.buttons == 1) {
        var target = findParentOfClass(event.target, 'stampable');
        if (target != null) {
            var cur = findFirstChildOfClass(target, 'stampedObject');
            if (cur != null) {
                _dragDrawTool = cur.getAttributeNS('', 'data-template-id');
            }
            else {
                _dragDrawTool = _lastDrawTool;
            }
        }
        else {
            _dragDrawTool = null;
        }
    }
}
/**
 * Drawing tools can be flagged to do extraction.
 */
function updateStampExtraction() {
    var extracted = document.getElementById('extracted');
    if (extracted != null) {
        var drawnObjects = document.getElementsByClassName('stampedObject');
        var extraction = '';
        for (var i = 0; i < drawnObjects.length; i++) {
            var tool = drawnObjects[i].getAttributeNS('', 'data-template-id');
            if (tool == _extractorTool) {
                var drawn = drawnObjects[i];
                var extract = findFirstChildOfClass(drawn, 'extract');
                if (extract) {
                    extraction += extract.innerText;
                }
            }
        }
        if (extracted.tagName != 'INPUT') {
            extracted.innerText = extraction;
        }
        else {
            var inp = extracted;
            inp.value = extraction;
        }
    }
}
/*-----------------------------------------------------------
 * _straightEdge.ts
 *-----------------------------------------------------------*/
/**
 * Find the center of an element, in client coordinates
 * @param elmt Any element
 * @returns A position
 */
function positionFromCenter(elmt) {
    var rect = elmt.getBoundingClientRect();
    return new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}
exports.positionFromCenter = positionFromCenter;
/**
 * Find the square of the distance between a point and the mouse
 * @param elmt A position, in screen coordinates
 * @param evt A mouse event
 * @returns The distance, squared
 */
function distance2Mouse(pos, evt) {
    var dx = pos.x - evt.x;
    var dy = pos.y - evt.y;
    return dx * dx + dy * dy;
}
exports.distance2Mouse = distance2Mouse;
function distance2(pos, pos2) {
    var dx = pos.x - pos2.x;
    var dy = pos.y - pos2.y;
    return dx * dx + dy * dy;
}
exports.distance2 = distance2;
// VOCABULARY
// vertex: any point that can anchor a straight edge
// straight-edge-area: the potential drag range
// ruler-path: a drawn line connecting one or more vertices.
// 
// Ruler ranges can have styles and rules.
// Styles shape the straight edge, which can also be an outline
// Rules dictate drop restrictions and the snap range
/**
 * Scan the page for anything marked vertex or straight-edge-area
 * Those items get click handlers
 * @param areaCls the class name of the root SVG for drawing straight edges
 */
function preprocessRulerFunctions(mode, fill) {
    selector_class = mode;
    area_class = mode + '-area';
    selector_fill_class = fill ? (selector_class + '-fill') : null;
    var elems = document.getElementsByClassName(area_class);
    for (var i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i]);
    }
    indexAllVertices();
    // TODO: make lines editable
}
exports.preprocessRulerFunctions = preprocessRulerFunctions;
/**
 * Identified which type of selector is enabled for this page
 * @returns either 'straight-edge' or 'word-select'
 */
function getStraightEdgeType() {
    return selector_class;
}
exports.getStraightEdgeType = getStraightEdgeType;
/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessEndpoint(elem) {
}
/**
 * Hook up the necessary mouse events to the background region for a ruler
 * @param elem a moveable element
 */
function preprocessRulerRange(elem) {
    elem.onpointermove = function (e) { onRulerHover(e); };
    elem.onpointerdown = function (e) { onLineStart(e); };
    elem.onpointerup = function (e) { onLineUp(e); };
}
/**
 * Supported kinds of straight edges.
 */
exports.EdgeTypes = {
    straightEdge: 'straight-edge',
    wordSelect: 'word-select'
};
/**
 * Which class are we looking for: should be one of the EdgeTypes
 */
var selector_class;
/**
 * A second class, which can overlay the first as a fill
 */
var selector_fill_class;
/**
 * What is the class of the container: straight-edge-are or word-select-area
 */
var area_class;
/**
 * Looks up the containing area, and any optional settings
 * @param evt A mouse event within the area
 * @returns A RulerEventData
 */
function getRulerData(evt) {
    var range = findParentOfClass(evt.target, area_class);
    var svg = findParentOfTag(range, 'SVG');
    var containers = svg.getElementsByClassName(selector_class + '-container');
    var bounds = svg.getBoundingClientRect();
    var max_points = range.getAttributeNS('', 'data-max-points');
    var maxPoints = max_points ? parseInt(max_points) : 2;
    var canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    var canCrossSelf = range.getAttributeNS('', 'data-can-cross-self');
    var hoverRange = range.getAttributeNS('', 'data-hover-range');
    var angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    var showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    var pos = new DOMPoint(evt.x, evt.y);
    var spt = svg.createSVGPoint();
    spt.x = pos.x - bounds.left;
    spt.y = pos.y - bounds.top;
    var angleConstraints2 = angleConstraints ? (angleConstraints + '+0').split('+').map(function (c) { return parseInt(c); }) : undefined;
    var data = {
        svg: svg,
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints2 ? angleConstraints2[0] : undefined,
        angleConstraintsOffset: angleConstraints2 ? angleConstraints2[1] : 0,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: pos,
        evtPoint: spt,
    };
    var near = findNearestVertex(data);
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}
/**
 * Get ruler data as if a user had clicked on a specific vertex
 * @param vertex Any vertex element
 * @returns a RulerEventData
 */
function getRulerDataFromVertex(vertex) {
    var range = findParentOfClass(vertex, area_class);
    var svg = findParentOfTag(range, 'SVG');
    var containers = svg.getElementsByClassName(selector_class + '-container');
    var bounds = svg.getBoundingClientRect();
    var max_points = range.getAttributeNS('', 'data-max-points');
    var maxPoints = max_points ? parseInt(max_points) : 2;
    var canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    var canCrossSelf = range.getAttributeNS('', 'data-can-cross-self');
    var hoverRange = range.getAttributeNS('', 'data-hover-range');
    var angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    var showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    var vBounds = vertex.getBoundingClientRect();
    var pos = new DOMPoint(vBounds.x + vBounds.width / 2, vBounds.y + vBounds.height / 2);
    var spt = svg.createSVGPoint();
    spt.x = pos.x - bounds.left;
    spt.y = pos.y - bounds.top;
    var angleConstraints2 = angleConstraints ? (angleConstraints + '+0').split('+').map(function (c) { return parseInt(c); }) : undefined;
    var data = {
        svg: svg,
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints2 ? angleConstraints2[0] : undefined,
        angleConstraintsOffset: angleConstraints2 ? angleConstraints2[1] : 0,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: pos,
        evtPoint: spt,
    };
    var near = findNearestVertex(data);
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}
/**
 * Constructs a vertex data from a vertex
 * @param ruler the containing RulerEventData
 * @param vert a vertex
 * @returns a VertexData
 */
function getVertexData(ruler, vert) {
    var data = {
        vertex: vert,
        index: getGlobalIndex(vert, 'vx'),
        group: findParentOfClass(vert, 'vertex-g') || vert,
        centerPos: positionFromCenter(vert),
        centerPoint: ruler.svg.createSVGPoint()
    };
    data.centerPoint.x = data.centerPos.x - ruler.bounds.left;
    data.centerPoint.y = data.centerPos.y - ruler.bounds.top;
    return data;
}
/**
 * All straight edges on the page, except for the one under construction
 */
var _straightEdges = [];
/**
 * The nearest vertex, if being affected by hover
 */
var _hoverEndpoint = null;
/**
 * A straight edge under construction
 */
var _straightEdgeBuilder = null;
/**
 * The vertices that are part of the straight edge under construction
 */
var _straightEdgeVertices = [];
/**
 * Handler for both mouse moves and mouse drag
 * @param evt The mouse move event
 */
function onRulerHover(evt) {
    var _a, _b, _c;
    var ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    var inLineIndex = ruler.nearest ? indexInLine(ruler.nearest.vertex) : -1;
    if (_straightEdgeBuilder && inLineIndex >= 0) {
        if (inLineIndex == _straightEdgeVertices.length - 2) {
            // Dragging back to the start contracts the line
            _straightEdgeBuilder.points.removeItem(inLineIndex + 1);
            toggleClass(_straightEdgeVertices[inLineIndex + 1], 'building', false);
            _straightEdgeVertices.splice(inLineIndex + 1, 1);
        }
        // Hoving near any other index is ignored
        return;
    }
    if (_straightEdgeBuilder) {
        // Extending a straight-edge that we've already started
        if (ruler.nearest || ruler.showOpenDrag) {
            var extendLast = extendsLastSegment(ruler.nearest);
            var updateOpen = _straightEdgeBuilder.points.length > _straightEdgeVertices.length;
            if (extendLast || _straightEdgeBuilder.points.length >= ruler.maxPoints) {
                if (updateOpen) {
                    _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
                }
                if (extendLast || !updateOpen) {
                    toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
                    _straightEdgeVertices.splice(_straightEdgeVertices.length - 1, 1);
                    _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
                }
            }
            else if (_straightEdgeVertices.length < _straightEdgeBuilder.points.length) {
                // Always remove the last open end
                _straightEdgeBuilder.points.removeItem(_straightEdgeBuilder.points.length - 1);
            }
        }
        if (_straightEdgeVertices.length < ruler.maxPoints) {
            if (ruler.nearest && isReachable(ruler, ruler.nearest)) {
                // Extend to new point
                snapStraightLineTo(ruler, ruler.nearest);
            }
            else if (ruler.showOpenDrag) {
                openStraightLineTo(ruler);
            }
        }
    }
    else {
        // Hovering near a point
        if (((_a = ruler.nearest) === null || _a === void 0 ? void 0 : _a.group) != _hoverEndpoint) {
            toggleClass(_hoverEndpoint, 'hover', false);
            toggleClass((_b = ruler.nearest) === null || _b === void 0 ? void 0 : _b.group, 'hover', true);
            _hoverEndpoint = ((_c = ruler.nearest) === null || _c === void 0 ? void 0 : _c.group) || null;
        }
    }
}
/**
 * Starts a drag from the nearest vertex to the mouse
 * @param evt Mouse down event
 */
function onLineStart(evt) {
    var ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }
    if (!ruler.canShareVertices && hasClass(ruler.nearest.vertex, 'has-line')) {
        // User has clicked a point that already has a line
        // Either re-select it or delete it
        var edge = findStraightEdgeFromVertex(ruler.nearest.index);
        if (edge) {
            var vertices = findStraightEdgeVertices(edge);
            // Always delete the existing edge
            deleteStraightEdge(edge);
            if (vertices.length == 2) {
                // Restart line
                if (vertices[0] == ruler.nearest.vertex) {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[1]));
                }
                else {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[0]));
                }
                snapStraightLineTo(ruler, ruler.nearest);
            }
            return;
        }
    }
    createStraightLineFrom(ruler, ruler.nearest);
}
/**
 * Ends a straight-edge creation on mouse up
 * @param evt Mouse up event
 */
function onLineUp(evt) {
    var ruler = getRulerData(evt);
    if (!ruler || !_straightEdgeBuilder) {
        return;
    }
    // Clean up classes that track active construction
    var indeces = [];
    for (var i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }
    var vertexList = ',' + indeces.join(',') + ',';
    completeStraightLine(ruler, vertexList);
}
/**
 * Create a new straight-edge, starting at one vertex
 * @param ruler The containing area and rules
 * @param start The first vertex (can equal ruler.nearest, which is otherwise ignored)
 */
function createStraightLineFrom(ruler, start) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);
    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    toggleClass(_straightEdgeBuilder, selector_class, true);
    toggleClass(_straightEdgeBuilder, 'building', true);
    toggleClass(start.vertex, 'building', true);
    _straightEdgeBuilder.points.appendItem(start.centerPoint);
    ruler.container.appendChild(_straightEdgeBuilder);
    toggleClass(_hoverEndpoint, 'hover', false);
    _hoverEndpoint = null;
}
/**
 * Extend a straight-edge being built to a new vertex
 * @param ruler The containing area and rules
 * @param next A new vertex
 */
function snapStraightLineTo(ruler, next) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder === null || _straightEdgeBuilder === void 0 ? void 0 : _straightEdgeBuilder.points.appendItem(next.centerPoint);
    toggleClass(_straightEdgeBuilder, 'open-ended', false);
    toggleClass(next.vertex, 'building', true);
}
/**
 * Extend a straight-edge into open space
 * @param ruler The containing area and rules, including the latest event coordinates
 */
function openStraightLineTo(ruler) {
    toggleClass(_straightEdgeBuilder, 'open-ended', true);
    _straightEdgeBuilder === null || _straightEdgeBuilder === void 0 ? void 0 : _straightEdgeBuilder.points.appendItem(ruler.evtPoint);
}
/**
 * Convert the straight line being built to a finished line
 * @param ruler The containing area and rules
 * @param vertexList A string join of all the vertex indeces
 * @param save Determines whether this edge is saved. It should be false when loading from a save.
 */
function completeStraightLine(ruler, vertexList, save) {
    if (save === void 0) { save = true; }
    if (!_straightEdgeBuilder) {
        return;
    }
    if (_straightEdgeVertices.length < 2) {
        // Incomplete without at least two snapped ends. Abandon
        ruler.container.removeChild(_straightEdgeBuilder);
        _straightEdgeBuilder = null;
    }
    else if (_straightEdgeBuilder.points.length > _straightEdgeVertices.length) {
        // Remove open-end
        _straightEdgeBuilder.points.removeItem(_straightEdgeVertices.length);
        toggleClass(_straightEdgeBuilder, 'open-ended', false);
    }
    if (_straightEdgeBuilder) {
        toggleClass(_straightEdgeBuilder, 'building', false);
        _straightEdgeBuilder.setAttributeNS('', 'data-vertices', vertexList);
        _straightEdges.push(_straightEdgeBuilder);
        if (selector_fill_class) {
            var fill = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            toggleClass(fill, selector_fill_class, true);
            for (var i = 0; i < _straightEdgeBuilder.points.length; i++) {
                fill.points.appendItem(_straightEdgeBuilder.points[i]);
            }
            ruler.container.appendChild(fill); // will always be after the original
        }
        if (save) {
            saveStraightEdge(vertexList, true);
        }
    }
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}
/**
 * Checks to see if an vertex is already in the current straightline
 * @param end an vertex
 * @returns The index of this element in the straight edge
 */
function indexInLine(end) {
    if (!_straightEdgeVertices || !end) {
        return -1;
    }
    for (var i = 0; i < _straightEdgeVertices.length; i++) {
        if (_straightEdgeVertices[i] == end) {
            return i;
        }
    }
    return -1;
}
/**
 * Does a proposed vertex extend the last segment in the straight-edge under construction?
 * @param vert A new vertex
 * @returns true if this vertex is in the same direction as the last segment, either shorter or longer
 */
function extendsLastSegment(vert) {
    if (!vert || !_straightEdgeBuilder || _straightEdgeVertices.length < 2) {
        return false;
    }
    var last = _straightEdgeBuilder.points[_straightEdgeVertices.length - 1];
    var prev = _straightEdgeBuilder.points[_straightEdgeVertices.length - 2];
    var angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    var err = Math.atan2(vert.centerPoint.y - prev.y, vert.centerPoint.x - prev.x) - angle;
    return Math.abs(err * 180 / Math.PI) < 1;
}
/**
 * Uses a form a dot-product to detect if the sweep from segment AB to AC is counter-clockwise
 * @param a Start of both segments
 * @param b First endpoint
 * @param c Second endpoint
 * @returns true if sweep is to the left (counter-clockwise)
 */
function segmentPointCCW(a, b, c) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}
/**
 * A point is on a line if the slope is the same, and the distance
 * is a fraction of the segment's between 0 and 1
 * @param pt Point to test
 * @param a Start of segments
 * @param b End of endpoint
 * @returns true if point lies on the segment between a and b
 */
function pointOnSegment(pt, a, b) {
    if (pt == a || pt == b) {
        return true;
    }
    if (a.x == b.x) {
        return pt.x == a.x && pt.y >= Math.min(a.y, b.y) && pt.y <= Math.max(a.y, b.y);
    }
    if (a.y == b.y) {
        return pt.y == a.y && pt.x >= Math.min(a.x, b.x) && pt.x <= Math.max(a.x, b.x);
    }
    var dxS = b.x - a.x;
    var dyS = b.y - a.y;
    var dxP = pt.x - a.x;
    var dyP = pt.y - a.y;
    var pctX = dxP / dxS;
    var pctY = dyP / dyS;
    return pctX == pctY && pctX > 0 && pctY < 1;
}
/**
 * Sweep algorithm to determine if two segments intersect
 * @param a Start of first segment
 * @param b End of first segment
 * @param c Start of second segment
 * @param d End of second segment
 * @returns true if they intersect along both segments
 */
function segmentsIntersect(a, b, c, d) {
    return (segmentPointCCW(a, c, d) != segmentPointCCW(b, c, d)
        && segmentPointCCW(a, b, c) != segmentPointCCW(a, b, d))
        || (pointOnSegment(c, a, b) || pointOnSegment(d, a, b)
            || pointOnSegment(a, c, d) || pointOnSegment(b, c, d));
}
/**
 * Detect if extending a polyline would cause an intersection with itself
 * @param pt Candidate point to add to polyline
 * @param points Points from a polyline
 * @returns True
 */
function polylineSelfIntersection(pt, points) {
    if (points.length <= 1) {
        return false;
    }
    var p0 = points[points.length - 1];
    for (var i = 1; i < points.length - 1; i++) {
        if (segmentsIntersect(p0, pt, points[i - 1], points[i])) {
            segmentsIntersect(p0, pt, points[i - 1], points[i]);
            return true;
        }
    }
    return false;
}
/**
 * Enforces vertex angle constraints
 * @param data The containing area and rules
 * @param vert A new vertex
 * @returns
 */
function isReachable(data, vert) {
    if (!_straightEdgeBuilder || _straightEdgeVertices.length < 1) {
        return false;
    }
    if (!data.canCrossSelf && polylineSelfIntersection(vert.centerPoint, _straightEdgeBuilder.points)) {
        return false;
    }
    //if (indexInLine(vert.vertex) >= 0) return false;
    var prev = getVertexData(data, _straightEdgeVertices[_straightEdgeVertices.length - 1]);
    var dx = vert.centerPos.x - prev.centerPos.x;
    var dy = vert.centerPos.y - prev.centerPos.y;
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return false; // Can't re-select the previous point
    }
    else if (data.angleConstraints == undefined) {
        return true; // Any other point is valid
    }
    var degrees = Math.atan2(dy, dx) * 180 / Math.PI + 360;
    var mod = Math.abs((degrees + data.angleConstraintsOffset) % data.angleConstraints);
    if (mod > data.angleConstraints / 2) {
        mod = data.angleConstraints - mod;
    }
    return mod < 1; // Within 1 degree of constraint angle pattern
}
/**
 * Delete an existing straight-edge
 * @param edge The edge to remove
 */
function deleteStraightEdge(edge) {
    var _a, _b;
    for (var i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }
    // See if there's a duplicate straight-edge, of class word-select2
    if (selector_fill_class) {
        var points = edge.getAttributeNS('', 'points');
        var second = document.getElementsByClassName(selector_fill_class);
        for (var i = 0; i < second.length; i++) {
            var sec = second[i];
            if (sec.getAttributeNS('', 'points') === points) {
                (_a = edge.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(sec);
                break;
            }
        }
    }
    var indexList = edge.getAttributeNS('', 'data-vertices');
    saveStraightEdge(indexList, false); // Deletes from the saved list
    (_b = edge.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(edge);
}
/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns A vertex data, or null if none close enough
 */
function findNearestVertex(data) {
    var min = data.hoverRange * data.hoverRange;
    var vertices = data.svg.getElementsByClassName('vertex');
    var nearest = null;
    for (var i = 0; i < vertices.length; i++) {
        var end = vertices[i];
        var center = positionFromCenter(end);
        var dist = distance2(center, data.evtPos);
        if (min < 0 || dist < min) {
            min = dist;
            nearest = end;
        }
    }
    return nearest;
}
/**
 * Find the first straight-edge which includes the specified vertex
 * @param index The global index of a vertex
 * @returns A straight edge, or null if none match
 */
function findStraightEdgeFromVertex(index) {
    var pat = ',' + String(index) + ',';
    var edges = document.getElementsByClassName(selector_class);
    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        var indexList = edge.getAttributeNS('', 'data-vertices');
        if (indexList && indexList.search(pat) >= 0) {
            return edge;
        }
        ;
    }
    return null;
}
/**
 * Given a straight edge, enumerate the vertices that it passes through
 * @param edge A straight-edge
 * @returns An array of zero or more vertices
 */
function findStraightEdgeVertices(edge) {
    var indexList = edge.getAttributeNS('', 'data-vertices');
    var vertices = [];
    var indeces = indexList === null || indexList === void 0 ? void 0 : indexList.split(',');
    if (indeces) {
        var map = mapGlobalIndeces('vertex', 'vx');
        for (var i = 0; i < indeces.length; i++) {
            if (indeces[i]) {
                var vertex = map[indeces[i]];
                vertices.push(vertex);
            }
        }
    }
    return vertices;
}
/**
 * Create a straight-edge from a list of vertices
 * Called while restoring from a save, so does not redundantly save progress.
 * @param vertexList A joined list of vertex global-indeces, delimeted by commas
 */
function createFromVertexList(vertexList) {
    var map = mapGlobalIndeces('vertex', 'vx');
    var vertices = vertexList.split(',');
    var ruler = null;
    for (var i = 0; i < vertices.length; i++) {
        if (vertices[i].length > 0) {
            var id = parseInt(vertices[i]);
            var vert = map[id];
            if (vert) {
                if (ruler == null) {
                    ruler = getRulerDataFromVertex(vert);
                    createStraightLineFrom(ruler, ruler.nearest);
                }
                else {
                    snapStraightLineTo(ruler, getVertexData(ruler, vert));
                }
                // Both of the above set 'building', but complete does not clear it
                toggleClass(vert, 'building', false);
            }
        }
    }
    if (ruler) {
        completeStraightLine(ruler, vertexList, false /*no save while restoring*/);
    }
}
exports.createFromVertexList = createFromVertexList;
function clearAllStraightEdges(id) {
    var _a;
    var svg = document.getElementById(id);
    if (!svg) {
        return;
    }
    var edges = svg.getElementsByClassName(selector_class);
    for (var i = edges.length - 1; i >= 0; i--) {
        var edge = edges[i];
        (_a = edge.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(edge);
    }
    // Remove styles from all vertices
    var vertices = svg.getElementsByClassName('vertex');
    for (var i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(vertices[i], 'building', false);
        toggleClass(vertices[i], 'has-line', false);
    }
    // Remove builder
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}
exports.clearAllStraightEdges = clearAllStraightEdges;
var safariSingleDetails = {
    'title': 'Puzzle',
    'logo': './Images/Sample_Logo.png',
    'icon': './Images/Sample_Icon.png',
    'puzzleList': '',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat',
    'links': [
    //        { rel:'preconnect', href:'https://fonts.googleapis.com' },
    //        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
    ]
};
var safariSampleDetails = {
    'title': 'Puzzle Safari',
    'logo': './Images/Sample_Logo.png',
    'icon': './Images/Sample_Icon.png',
    'puzzleList': './index.html',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat',
    'links': []
};
var safari20Details = {
    'title': 'Safari Labs',
    'logo': './Images/PS20 logo.png',
    'icon': './Images/Beaker_icon.png',
    'puzzleList': './safari.html',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts20.css',
    'googleFonts': 'Architects+Daughter,Caveat',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/23/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/' },
    // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
};
var safari24Details = {
    'title': 'Game Night',
    // 'logo': './Images/PS24 logo.png',
    'icon': '../24/Images/Sample_Icon.png',
    // 'puzzleList': './safari.html',
    'cssRoot': '../Css/',
    'fontCss': '../24/Css/Fonts24.css',
    'googleFonts': 'Goblin+One,Caveat',
    'links': [],
    // 'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
    //    'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
    // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
};
var safariDggDetails = {
    'title': 'David’s Puzzles',
    'logo': './Images/octopus_watermark.png',
    'icon': './Images/octopus_icon.png',
    'puzzleList': './indexx.html',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css',
    'googleFonts': 'Caveat,Righteous,Cormorant+Upright',
    'links': [],
    'qr_folders': { 'https://www.puzzyl.net/Dgg/': './Qr/puzzyl/',
        'file:///D:/git/GivingSafariTS/Dgg/': './Qr/puzzyl/' },
    // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
};
// Event for the PuzzylSafariTeam branch
var puzzylSafariTeamDetails = {
    'title': 'Game Night',
    // 'logo': './Images/Sample_Logo.png',
    'icon': '24/favicon.png',
    'puzzleList': '',
    'cssRoot': 'Css/',
    'fontCss': '24/Fonts24.css',
    'googleFonts': 'Goblin+One,Caveat',
    'links': [
    //        { rel:'preconnect', href:'https://fonts.googleapis.com' },
    //        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
    ]
};
var pastSafaris = {
    'Sample': safariSampleDetails,
    'Single': safariSingleDetails,
    '20': safari20Details,
    'Dgg': safariDggDetails,
    '24': safari24Details,
    'team': puzzylSafariTeamDetails,
};
var safariDetails;
/**
* Initialize a global reference to Safari event details
*/
function initSafariDetails(safariId) {
    if (!(safariId in pastSafaris)) {
        throw new Error('Unrecognized Safari Event ID: ' + safariId);
    }
    safariDetails = pastSafaris[safariId];
    return safariDetails;
}
exports.initSafariDetails = initSafariDetails;
/**
* Return the details of this puzzle event
*/
function getSafariDetails() {
    return safariDetails;
}
exports.getSafariDetails = getSafariDetails;
/*-----------------------------------------------------------
 * _boilerplate.ts
 *-----------------------------------------------------------*/
/**
 * Cache the URL parameneters as a dictionary.
 * Arguments that don't specify a value receive a default value of true
 */
var urlArgs = {};
/**
 * Scan the url for special arguments.
 */
function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1); // trim leading ?
        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true; // e.g. present
            }
        }
    }
    if (urlArgs['body-debug'] != undefined && urlArgs['body-debug'] !== false) {
        toggleClass(document.getElementsByTagName('body')[0], 'debug', true);
    }
}
/**
 * Determines if the caller has specified <i>debug</i> in the URL
 * @returns true if set, unless explictly set to false
 */
function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}
exports.isDebug = isDebug;
/**
 * Determines if the caller has specified <i>body-debug</i> in the URL,
 * or else if the puzzle explictly has set class='debug' on the body.
 * @returns true if set, unless explictly set to false
 */
function isBodyDebug() {
    return hasClass(document.getElementsByTagName('body')[0], 'debug');
}
exports.isBodyDebug = isBodyDebug;
/**
 * Determines if this document is being loaded inside an iframe.
 * While any document could in theory be in an iframe, this library tags such pages with a url argument.
 * @returns true if this page's URL contains an iframe argument (other than false)
 */
function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}
exports.isIFrame = isIFrame;
/**
 * Determines if this document's URL was tagged with ?print
 * This is intended to as an alternative way to get a print-look, other than CSS's @media print
 * @returns true if this page's URL contains a print argument (other than false)
 */
function isPrint() {
    return urlArgs['print'] != undefined && urlArgs['print'] !== false;
}
exports.isPrint = isPrint;
/**
 * Determines if this document's URL was tagged with ?icon
 * This is intended to as an alternative way to generate icons for each puzzle
 * @returns true if this page's URL contains a print argument (other than false)
 */
function isIcon() {
    return urlArgs['icon'] != undefined && urlArgs['icon'] !== false;
}
exports.isIcon = isIcon;
/**
 * Special url arg to override any cached storage. Always restarts.
 * @returns true if this page's URL contains a restart argument (other than =false)
 */
function isRestart() {
    return urlArgs['restart'] != undefined && urlArgs['restart'] !== false;
}
exports.isRestart = isRestart;
/**
 * Do we want to skip the UI that offers to reload?
 * @returns
 */
function forceReload() {
    if (urlArgs['reload'] != undefined) {
        return urlArgs['reload'] !== false;
    }
    return undefined;
}
exports.forceReload = forceReload;
/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp
 */
function preSetup(bp) {
    var safariDetails = initSafariDetails(bp.safari);
    debugSetup();
    var bodies = document.getElementsByTagName('BODY');
    if (isIFrame()) {
        bodies[0].classList.add('iframe');
    }
    if (isPrint()) {
        bodies[0].classList.add('print');
    }
    if (isIcon()) {
        bodies[0].classList.add('icon');
    }
    if (bp.pathToRoot) {
        if (safariDetails.logo) {
            safariDetails.logo = bp.pathToRoot + '/' + safariDetails.logo;
        }
        if (safariDetails.icon) {
            safariDetails.icon = bp.pathToRoot + '/' + safariDetails.icon;
        }
        if (safariDetails.puzzleList) {
            safariDetails.puzzleList = bp.pathToRoot + '/' + safariDetails.puzzleList;
        }
    }
}
function createSimpleDiv(_a) {
    var id = _a.id, cls = _a.cls, html = _a.html;
    var div = document.createElement('DIV');
    if (id !== undefined) {
        div.id = id;
    }
    if (cls !== undefined) {
        div.classList.add(cls);
    }
    if (html !== undefined) {
        div.innerHTML = html;
    }
    return div;
}
function createSimpleA(_a) {
    var id = _a.id, cls = _a.cls, friendly = _a.friendly, href = _a.href, target = _a.target;
    var a = document.createElement('A');
    if (id !== undefined) {
        a.id = id;
    }
    if (cls !== undefined) {
        a.classList.add(cls);
    }
    a.innerHTML = friendly;
    a.href = href;
    a.target = target || '_blank';
    return a;
}
/**
 * Map puzzle types to alt text
 */
var iconTypeAltText = {
    'Word': 'Word puzzle',
    'Math': 'Math puzzle',
    'Rebus': 'Rebus puzzle',
    'Code': 'Features encodings',
    'Trivia': 'Trivia puzzle',
    'Meta': 'Meta puzzle',
    'Reassemble': 'Assembly'
};
/**
 * Create an icon appropriate for this puzzle type
 * @param data Base64 image data
 * @returns An img element, with inline base-64 data
 */
function createPrintQrBase64(data) {
    var qr = document.createElement('img');
    qr.id = 'qr';
    qr.src = 'data:image/png;base64,' + data;
    qr.alt = 'QR code to online page';
    return qr;
}
function getQrPath() {
    var safariDetails = getSafariDetails();
    if (safariDetails.qr_folders) {
        var url = window.location.href;
        for (var _i = 0, _a = Object.keys(safariDetails.qr_folders); _i < _a.length; _i++) {
            var key = _a[_i];
            if (url.indexOf(key) == 0) {
                var folder = safariDetails.qr_folders[key];
                var names = window.location.pathname.split('/'); // trim off path before last slash
                var name_4 = names[names.length - 1].split('.')[0]; // trim off extension
                return folder + '/' + name_4 + '.png';
            }
        }
    }
    return undefined;
}
function createPrintQr() {
    // Find relevant folder:
    var path = getQrPath();
    if (path) {
        var qr = document.createElement('img');
        qr.id = 'qr';
        qr.src = path;
        qr.alt = 'QR code to online page';
        return qr;
    }
    return null;
}
/**
 * Create an icon appropriate for this puzzle type
 * @param puzzleType the name of the puzzle type
 * @param icon_use the purpose of the icon
 * @returns A div element, to be appended to the pageWithinMargins
 */
function createTypeIcon(puzzleType, icon_use) {
    if (icon_use === void 0) { icon_use = ''; }
    if (!icon_use) {
        icon_use = 'puzzle';
    }
    var iconDiv = document.createElement('div');
    iconDiv.id = 'icons';
    var icon = document.createElement('img');
    icon.id = 'icons-' + iconDiv.childNodes.length;
    icon.src = './Icons/' + puzzleType.toLocaleLowerCase() + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' ' + icon_use);
    iconDiv.appendChild(icon);
    return iconDiv;
}
function boilerplate(bp) {
    if (!bp) {
        return;
    }
    preSetup(bp);
    /* A puzzle doc must have this shape:
     *   <html>
     *    <head>
     *     <script>
     *      const boiler = { ... };        // Most fields are optional
     *     </script>
     *    </head>
     *    <body>
     *     <div id='pageBody'>
     *      // All page contents
     *     </div>
     *    </body>
     *   </html>
     *
     * Several new objects and attibutes are inserted.
     * Some are univeral; some depend on boiler plate data fields.
     *   <html>
     *    <head></head>
     *    <body class='letter portrait'>            // new classes
     *     <div id='page' class='printedPage'>      // new layer
     *      <div id='pageWithinMargins'>            // new layer
     *       <div id='pageBody'>
     *        // All page contents
     *       </div>
     *       <div id='title'>[title]</div>          // new element
     *       <div id='copyright'>[copyright]</div>  // new element
     *       <a id='backlink'>Puzzle List</a>       // new element
     *      </div>
     *     </div>
     *    </body>
     *   </html>
     */
    if (bp.reactiveBuilder) {
        expandControlTags();
    }
    if (bp.tableBuilder) {
        constructTable(bp.tableBuilder);
    }
    var html = document.getElementsByTagName('HTML')[0];
    var head = document.getElementsByTagName('HEAD')[0];
    var body = document.getElementsByTagName('BODY')[0];
    var pageBody = document.getElementById('pageBody');
    document.title = bp.title;
    html.lang = bp.lang || 'en-us';
    var safariDetails = getSafariDetails();
    for (var i = 0; i < safariDetails.links.length; i++) {
        addLink(head, safariDetails.links[i]);
    }
    var viewport = document.createElement('META');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    head.appendChild(viewport);
    if (safariDetails.fontCss) {
        linkCss(safariDetails.fontCss);
    }
    var gFonts = bp.googleFonts;
    if (safariDetails.googleFonts) {
        gFonts = safariDetails.googleFonts + (gFonts ? (',' + gFonts) : '');
    }
    if (gFonts) {
        //<link rel="preconnect" href="https://fonts.googleapis.com">
        var gapis = {
            'rel': 'preconnect',
            'href': 'https://fonts.googleapis.com'
        };
        addLink(head, gapis);
        //<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        var gstatic = {
            'rel': 'preconnect',
            'href': 'https://fonts.gstatic.com',
            'crossorigin': ''
        };
        addLink(head, gstatic);
        var fonts = gFonts.split(',');
        var link = {
            'href': 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=') + '&display=swap',
            'rel': 'stylesheet'
        };
        addLink(head, link);
    }
    linkCss(safariDetails.cssRoot + 'PageSizes.css');
    linkCss(safariDetails.cssRoot + 'TextInput.css');
    if (!bp.paperSize) {
        bp.paperSize = 'letter';
    }
    if (!bp.orientation) {
        bp.orientation = 'portrait';
    }
    if (bp.paperSize.indexOf('|') > 0) {
        var ps = bp.paperSize.split('|');
        bp.paperSize = isPrint() ? ps[1] : ps[0];
    }
    toggleClass(body, bp.paperSize);
    toggleClass(body, bp.orientation);
    toggleClass(body, '_' + bp.safari); // So event fonts can trump defaults
    var page = createSimpleDiv({ id: 'page', cls: 'printedPage' });
    var margins = createSimpleDiv({ cls: 'pageWithinMargins' });
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({ cls: 'title', html: bp.title }));
    margins.appendChild(createSimpleDiv({ id: 'copyright', html: '&copy; ' + bp.copyright + ' ' + bp.author }));
    if (safariDetails.puzzleList) {
        margins.appendChild(createSimpleA({ id: 'backlink', href: safariDetails.puzzleList, friendly: 'Puzzle list' }));
    }
    // Set tab icon for safari event
    var tabIcon = document.createElement('link');
    tabIcon.rel = 'shortcut icon';
    tabIcon.type = 'image/png';
    tabIcon.href = safariDetails.icon;
    head.appendChild(tabIcon);
    if (bp.qr_base64) {
        margins.appendChild(createPrintQrBase64(bp.qr_base64));
    }
    else if (bp.print_qr) {
        var qrImg = createPrintQr();
        if (qrImg) {
            margins.appendChild(qrImg);
        }
    }
    if (bp.type) {
        margins.appendChild(createTypeIcon(bp.type));
    }
    if (bp.feeder) {
        margins.appendChild(createTypeIcon(bp.feeder, 'feeder'));
    }
    // If the puzzle has a pre-setup method they'd like to run before abilities and contents are processed, do so now
    if (bp.preSetup) {
        bp.preSetup();
    }
    if (bp.textInput) {
        textSetup();
    }
    setupAbilities(head, margins, bp.abilities || {});
    if (bp.validation) {
        linkCss(safariDetails.cssRoot + 'Guesses.css');
        setupValidation();
    }
    if (!isIFrame()) {
        setTimeout(checkLocalStorage, 100);
    }
}
function theHead() {
    return document.getElementsByTagName('HEAD')[0];
}
/**
 * Count-down before we know all delay-linked CSS have been loaded
 */
var cssToLoad = 1;
/**
 * Append any link tag to the header
 * @param head the head tag
 * @param det the attributes of the link tag
 */
function addLink(head, det) {
    head = head || theHead();
    var link = document.createElement('link');
    link.href = det.href;
    link.rel = det.rel;
    if (det.type) {
        link.type = det.type;
    }
    if (det.crossorigin != undefined) {
        link.crossOrigin = det.crossorigin;
    }
    if (det.rel.toLowerCase() == "stylesheet") {
        link.onload = function () { cssLoaded(); };
        cssToLoad++;
    }
    head.appendChild(link);
}
exports.addLink = addLink;
var linkedCss = {};
/**
 * Append a CSS link to the header
 * @param relPath The contents of the link's href
 * @param head the head tag
 */
function linkCss(relPath, head) {
    if (relPath in linkedCss) {
        return; // Don't re-add
    }
    linkedCss[relPath] = true;
    head = head || theHead();
    var link = document.createElement('link');
    link.href = relPath;
    link.rel = "Stylesheet";
    link.type = "text/css";
    link.onload = function () { cssLoaded(); };
    cssToLoad++;
    head.appendChild(link);
}
exports.linkCss = linkCss;
/**
 * Each CSS file that is delay-linked needs time to load.
 * Decrement the count after each one.
 * When complete, call final setup step.
 */
function cssLoaded() {
    if (--cssToLoad == 0) {
        setupAfterCss(boiler);
    }
}
/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head, margins, data) {
    var safariDetails = getSafariDetails();
    var ability = document.getElementById('ability');
    if (ability != null) {
        var text = ability.innerText;
        if (text.search('✔️') >= 0) {
            data.checkMarks = true;
        }
        if (text.search('💡') >= 0) {
            data.highlights = true;
        }
        if (text.search('👈') >= 0) {
            data.dragDrop = true;
        }
        if (text.search('✒️') >= 0) {
            data.stamping = true;
        }
    }
    else {
        ability = document.createElement('div');
        ability.id = 'ability';
        margins.appendChild(ability);
    }
    var fancy = '';
    var count = 0;
    if (data.checkMarks) {
        setupCrossOffs();
        fancy += '<span id="check-ability" title="Click items to check them off">✔️</span>';
        count++;
    }
    if (data.highlights) {
        var instructions = "Ctrl+click to highlight cells";
        if (boiler === null || boiler === void 0 ? void 0 : boiler.textInput) {
            instructions = "Type ` or ctrl+click to highlight cells";
        }
        fancy += '<span id="highlight-ability" title="' + instructions + '" style="text-shadow: 0 0 3px black;">💡</span>';
        setupHighlights();
        count++;
    }
    if (data.dragDrop) {
        fancy += '<span id="drag-ability" title="Drag & drop enabled" style="text-shadow: 0 0 3px black;">👈</span>';
        preprocessDragFunctions();
        indexAllDragDropFields();
        linkCss(safariDetails.cssRoot + 'DragDrop.css');
        count++;
    }
    if (data.stamping) {
        preprocessStampObjects();
        indexAllDrawableFields();
        linkCss(safariDetails.cssRoot + 'StampTools.css');
        // No ability icon
    }
    if (data.straightEdge) {
        fancy += '<span id="drag-ability" title="Line-drawing enabled" style="text-shadow: 0 0 3px black;">📐</span>';
        preprocessRulerFunctions(exports.EdgeTypes.straightEdge, false);
        linkCss(safariDetails.cssRoot + 'StraightEdge.css');
        //indexAllVertices();
    }
    if (data.wordSearch) {
        fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">💊</span>';
        preprocessRulerFunctions(exports.EdgeTypes.wordSelect, true);
        linkCss(safariDetails.cssRoot + 'WordSearch.css');
        //indexAllVertices();
    }
    if (data.subway) {
        linkCss(safariDetails.cssRoot + 'Subway.css');
        // Don't setupSubways() until all styles have applied, so CSS-derived locations are final
    }
    if (data.notes) {
        setupNotes(margins);
        // no ability icon
    }
    if (data.decoder) {
        setupDecoderToggle(margins, data.decoderMode);
    }
    ability.innerHTML = fancy;
    ability.style.bottom = data.decoder ? '-32pt' : '-16pt';
    if (count == 2) {
        ability.style.right = '0.1in';
    }
    // Release our lock on css loading
    cssLoaded();
}
/**
 * All delay-linked CSS files are now loaded. Layout should be complete.
 * @param bp The global boilerplate
 */
function setupAfterCss(bp) {
    if (bp.abilities) {
        if (bp.abilities.subway) {
            setupSubways();
        }
    }
    // If the puzzle has a post-setup method they'd like to run after all abilities and contents are processed, do so now
    if (bp.postSetup) {
        bp.postSetup();
    }
}
/**
 * Expose the boilerplate as an export
 * Only called by code which is triggered by a boilerplate, so safely not null
 */
function theBoiler() {
    return boiler;
}
exports.theBoiler = theBoiler;
window.onload = function () { boilerplate(boiler); }; // error if boiler still undefined
/*-----------------------------------------------------------
 * _confirmation.ts
 *-----------------------------------------------------------*/
/**
 * Response codes for different kinds of responses
 */
var ResponseType = {
    Error: 0,
    Correct: 1,
    Confirm: 2,
    KeepGoing: 3,
    Unlock: 4,
    Load: 5,
    Show: 6, // cause another cell to show
    //    Save: 7,     // write a key/value directly to storage
};
/**
 * CSS classes for each response type
 */
var ResponseTypeClasses = [
    'rt-error',
    'rt-correct',
    'rt-confirm',
    'rt-keepgoing',
    'rt-unlock',
    'rt-load',
    //    'rt-save',
];
/**
 * The generic response for unknown submissions
 */
var no_match_response = "0";
/**
 * Default response text, if the validation block only specifies a type
 */
var default_responses = [
    "Incorrect",
    "Correct!",
    "Confirmed",
    "Keep going", // Keep Going
];
/**
 * img src= URLs for icons to further indicate whether guesses were correct or not
 */
var response_img = [
    "../Icons/X.png",
    "../Icons/Check.png",
    "../Icons/Thumb.png",
    "../Icons/Thinking.png",
    "../Icons/Unlocked.png", // Unlock
];
/**
 * The full history of guesses on the current puzzle
 */
var guess_history = [];
/**
 * This puzzle has a validation block, so there must be either a place for the
 * player to propose an answer, or an automatic extraction for other elements.
 */
function setupValidation() {
    var _a;
    var buttons = document.getElementsByClassName('validater');
    if (buttons.length > 0) {
        var hist = getHistoryDiv('');
        if (!hist) {
            // Create a standard <div id="guess-log"> to track the all guesses
            var log = document.createElement('div');
            log.id = 'guess-log';
            var div = document.createElement('div');
            div.id = 'guess-history';
            var span = document.createElement('span');
            span.id = 'guess-titlebar';
            span.appendChild(document.createTextNode('Guesses'));
            log.appendChild(span);
            log.appendChild(div);
            (_a = document.getElementById('pageBody')) === null || _a === void 0 ? void 0 : _a.appendChild(log);
        }
    }
    var _loop_1 = function (i) {
        var btn = buttons[i];
        if (isTag(btn, 'button')) {
            btn.onclick = function (e) { clickValidationButton(e.target); };
            var srcId = getOptionalStyle(btn, 'data-extracted-id') || 'extracted';
            var src = document.getElementById(srcId);
            // If button is connected to a text field, hook up ENTER to submit
            if (src && ((isTag(src, 'input') && src.type == 'text')
                || isTag(src, 'textarea'))) { // TODO: not multiline
                src.onkeyup = function (e) { validateInputReady(btn, e.key); };
            }
        }
    };
    for (var i = 0; i < buttons.length; i++) {
        _loop_1(i);
    }
}
exports.setupValidation = setupValidation;
function calculateTextExtents(src, value) {
    var fe = document.getElementById('fontExtents');
    if (!fe) {
        fe = document.createElement('span');
        fe.id = 'fontExtents';
        fe.style.position = 'absolute';
        document.getElementsByTagName('body')[0].appendChild(fe);
    }
    fe.innerText = value;
    var styles = window.getComputedStyle(src, null);
    fe.style.fontFamily = styles.getPropertyValue('font-family');
    fe.style.fontSize = styles.getPropertyValue('font-size');
    fe.style.fontWeight = styles.getPropertyValue('font-weight');
    fe.style.fontStretch = styles.getPropertyValue('font-stretch');
    fe.style.textTransform = styles.getPropertyValue('text-transform');
    //    fe.style.transform = styles.getPropertyValue('transform');
    return fe.scrollWidth;
}
/**
 * When a user types an over-long value into an input, shrink the font
 * @param input An input or textarea element
 * @param value The current text
 */
function horzScaleToFit(input, value) {
    var widthPx = parseFloat(input.getAttribute('data-original-width') || '');
    if (!widthPx) {
        widthPx = calcPxStyle(input, 'width');
        input.setAttribute('data-original-width', '' + widthPx);
    }
    if (value.length == 0) {
        input.style.transform = 'scale(100%, 100%)';
        input.style.width = widthPx + 'px';
    }
    var curScale = calcTransform(input, 'scale', matrix.scaleX, 1);
    var needPx = calculateTextExtents(input, value + '|'); // account for borders
    if (needPx * curScale > widthPx) {
        var wantPx = calculateTextExtents(input, value + ' 12345678'); // one more word
        var newScalePct = Math.floor(widthPx * 100 / wantPx);
        if (newScalePct > 33) { // Maximum compression before unreadable
            input.style.transformOrigin = 'left';
            input.style.transform = 'scale(' + newScalePct + '%, 100%)';
            input.style.width = Math.floor(widthPx * 100 / newScalePct) + 'px';
        }
        var test = calculateTextExtents(input, value);
    }
}
function calcPxStyle(elmt, prop) {
    var val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 2)); // px
}
function calcPctStyle(elmt, prop) {
    var val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 1)); // %
}
var matrix = {
    scaleX: 0,
    rotX: 1,
    rotY: 2,
    scaleY: 3,
    translateX: 4,
    translateY: 5
};
function calcTransform(elmt, prop, index, defValue) {
    var trans = window.getComputedStyle(elmt, null).getPropertyValue('transform');
    var matrix = '1, 0, 0, 0, 1, 0'; // unit transform
    if (trans && trans.substring(0, 7) == 'matrix(') {
        matrix = trans.substring(7, trans.length - 8);
    }
    var split = matrix.split(',');
    if (index < split.length) {
        var val = split[index];
        if (val.substring(val.length - 1) == '%') {
            return parseFloat(val.substring(0, val.length - 1)) * 0.01;
        }
        else if (val.substring(val.length - 2) == 'px') {
            return parseFloat(val.substring(0, val.length - 2));
        }
        else
            return parseFloat(val);
    }
    return defValue;
}
/**
 * When typing in an input connect to a validate button,
 * Any non-empty string indicates ready (TODO: add other rules)
 * and ENTER triggers a button click
 * @param btn The button to enable/disable as ready
 * @param key What key was just typed, if any
 */
function validateInputReady(btn, key) {
    var id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    var ext = id ? document.getElementById(id) : null;
    if (!ext) {
        return;
    }
    var value = getValueToValidate(ext);
    var ready = isValueReady(btn, value);
    toggleClass(btn, 'ready', ready);
    if (ready && key == 'Enter') {
        clickValidationButton(btn);
    }
    else if (isTag(ext, 'input') || isTag(ext, 'textarea')) {
        horzScaleToFit(ext, value);
    }
}
exports.validateInputReady = validateInputReady;
/**
 * Submit buttons can be associated with various constructs.
 * Extract an appropriate value to submit
 * @param container The container of the value to submit.
 * @returns The value, or concatenation of values.
 */
function getValueToValidate(container) {
    // If the extraction has alredy been cached, use it
    var cached = container.getAttribute('data-extraction');
    if (cached) {
        return cached;
    }
    // If container is an input, get its value
    if (isTag(container, 'input')) {
        return container.value;
    }
    if (isTag(container, 'textarea')) {
        return container.value;
    }
    // If we contain multiple inputs, concat them
    var inputs = container.getElementsByClassName('letter-input');
    if (inputs.length > 0) {
        var value = '';
        for (var i = 0; i < inputs.length; i++) {
            value += inputs[i].value;
        }
        return value;
    }
    // If we contain multiple other extractions, concat them
    var datas = getAllElementsWithAttribute(container, 'data-extraction');
    if (datas.length > 0) {
        var value = '';
        for (var i = 0; i < datas.length; i++) {
            value += datas[i].getAttribute('data-extraction');
        }
        return value;
    }
    // No recognized combo
    console.error('Unrecognized value container: ' + container);
    return '';
}
/**
 * Is this value complete, such that submitting is possible?
 * @param btn The button to submit
 * @param value The value to submit
 * @returns true if the value is long enough and contains no blanks
 */
function isValueReady(btn, value) {
    if (!value) {
        return false;
    }
    if (value.indexOf('_') >= 0) {
        return false;
    }
    var minLength = getOptionalStyle(btn, 'data-min-length');
    if (minLength) {
        return value.length >= parseInt(minLength);
    }
    return value.length > 0;
}
/**
 * There should be a singleton guess history, which we likely created above
 * @param id The ID, or 'guess-history' by default
 */
function getHistoryDiv(id) {
    return document.getElementById('guess-history');
}
/**
 * The user has clicked a "Submit" button next to their answer.
 * @param btn The target of the click event
 * The button can have parameters pointing to the extraction.
 */
function clickValidationButton(btn) {
    var id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    if (!id) {
        return;
    }
    var ext = document.getElementById(id);
    if (!ext) {
        return;
    }
    var value = getValueToValidate(ext);
    var ready = isValueReady(btn, value);
    if (ready) {
        var now = new Date();
        var gl = { field: id, guess: value, time: now };
        decodeAndValidate(gl);
    }
}
/**
 * Validate a user's input against the encoded set of validations
 * @param gl the guess information, but not the response
 */
function decodeAndValidate(gl) {
    var validation = theBoiler().validation;
    if (validation && gl.field in validation) {
        var obj = validation[gl.field];
        // Normalize guesses
        // TODO: make this optional, in theBoiler, if a puzzle needs
        gl.guess = gl.guess.toUpperCase(); // All caps (permanent)
        var guess = gl.guess.replace(/ /g, ''); // Remove spaces for hashing - keep in UI
        // Keep all other punctuation
        var hash = rot13(guess); // TODO: more complicated hashing
        var block = appendGuess(gl);
        if (hash in obj) {
            var encoded = obj[hash];
            // Guess was expected. It may have multiple responses.
            var multi = encoded.split('|');
            for (var i = 0; i < multi.length; i++) {
                appendResponse(block, multi[i]);
            }
        }
        else {
            // Guess does not match any hashes
            appendResponse(block, no_match_response);
        }
    }
    else {
        console.error('Unrecognized validation field: ' + gl.field);
    }
}
exports.decodeAndValidate = decodeAndValidate;
/**
 * Build a guess/response block, initialized with the guess
 * @param gl The user's guess info
 * @returns The block, to which responses can be appended
 */
function appendGuess(gl) {
    // Save
    guess_history.push(gl);
    saveGuessHistory(guess_history);
    // Build a block for the guess and any connected responses
    var hist = getHistoryDiv(gl.field);
    var block = document.createElement('div');
    block.classList.add('rt-block');
    var div = document.createElement('div');
    div.classList.add('rt-guess');
    div.appendChild(document.createTextNode(gl.guess));
    var now = gl.time;
    var time = now.getHours() + ":"
        + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes() + ":"
        + (now.getSeconds() < 10 ? "0" : "") + now.getSeconds();
    var span = document.createElement('span');
    span.classList.add('rt-time');
    span.appendChild(document.createTextNode(time));
    div.appendChild(span);
    block.appendChild(div);
    // Newer guesses are inserted at the top
    hist.insertAdjacentElement('afterbegin', block);
    return block;
}
/**
 * Append a response to a guess block.
 * @param block The div containing the guess, and any other responses to the same guess
 * @param response The response, prefixed with the response type
 * The type is pulled off, and dictates the formatting.
 * Some types have side-effects, in addition to text.
 * If the response is only the type, pre-canned text is used instead.
 */
function appendResponse(block, response) {
    var type = parseInt(response[0]);
    response = response.substring(1);
    if (response.length == 0 && type < default_responses.length) {
        response = default_responses[type];
    }
    else {
        response = rot13(response);
    }
    var div = document.createElement('div');
    div.classList.add('response');
    div.classList.add(ResponseTypeClasses[type]);
    if (type == ResponseType.Unlock) {
        // Create a link to a newly unlocked page.
        // The (decrypted) response is either just a URL, 
        // or else URL^Friendly (separated by a caret)
        var caret = response.indexOf('^');
        var friendly = caret < 0 ? response : response.substring(caret + 1);
        if (caret >= 0) {
            response = response.substring(0, caret);
        }
        var parts = response.split('^'); // caret not allowed in a URL
        div.appendChild(document.createTextNode('You have unlocked '));
        var link = document.createElement('a');
        link.href = response;
        link.target = '_blank';
        link.appendChild(document.createTextNode(friendly));
        div.appendChild(link);
    }
    else if (type == ResponseType.Load) {
        // Use an iframe to navigate immediately to the response URL.
        // The iframe will be hidden, but any scripts will run immediately.
        var iframe = document.createElement('iframe');
        iframe.src = response;
        div.appendChild(iframe);
    }
    else if (type == ResponseType.Show) {
        var parts = response.split('^'); // caret not allowed in a URL
        var elmt = document.getElementById(parts[0]);
        if (elmt) {
            if (parts.length > 1) {
                toggleClass(elmt, parts[1]);
            }
            else {
                elmt.style.display = 'block';
            }
        }
    }
    else {
        // The response (which may be canned) is displayed verbatim.
        div.appendChild(document.createTextNode(response));
    }
    if (type < response_img.length) {
        var img = document.createElement('img');
        img.classList.add('rt-img');
        img.src = response_img[type];
        div.appendChild(img);
    }
    block.appendChild(div);
    if (type == ResponseType.Correct) {
        // Tag this puzzle as solved
        toggleClass(document.getElementsByTagName('body')[0], 'solved', true);
        // Cache that the puzzle is solved, to be indicated in tables of contents
        updatePuzzleList(getCurFileName(), exports.PuzzleStatus.Solved);
    }
}
/**
 * Rot-13 cipher, maintaining case.
 * Chars other than A-Z are preserved as-is
 * @param source Text to be encoded, or encoded text to be decoded
 */
function rot13(source) {
    var rot = '';
    for (var i = 0; i < source.length; i++) {
        var ch = source[i];
        var r = ch;
        if (ch >= 'A' && ch <= 'Z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 52) % 26) + 65);
        }
        else if (ch >= 'a' && ch <= 'z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 84) % 26) + 97);
        }
        rot += r;
    }
    return rot;
}
/**
 * Calculate the 256-bit (32-byte) SHA hash of any input string
 * @param source An input string
 * @returns A 32-character string
 */
// async function sha256(source) {
//     const sourceBytes = new TextEncoder().encode(source);
//     const digest = await window.crypto.subtle.digest("SHA-256", sourceBytes);
//     const resultBytes = [...new Uint8Array(digest)];
//     return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
// }
/*-----------------------------------------------------------
 * _builder.ts
 *-----------------------------------------------------------*/
/****************************************************************************
 *          BUILDER
 *
 * Buider HTML is loosely inspired by React.
 * It defines the data first.
 * Then the HTML supports special tags for loops and conditionals,
 * and the text and attributes support lookups into the data.
 *
 * Data initialization:
 *    In the script block of the page, add two values to the boilerplate:
 *        const boiler = {
 *          ...
 *          'reactiveBuilder': true,  // required
 *          'builderLookup': {        // free-form, for example...
 *            magic: 123,
 *            line: { start: {x:1, y:2}, end: {x:3, y:4} },
 *            fonts: [ 'bold', 'italic' ],
 *            grid: [
 *              [1, 2, 3],
 *              [4, 5, 6]
 *            ]
 *          }
 *        };
 *
 * Data lookup:
 *    In text or attribute values, use curly-brace syntax to inject named values:
 *    Examples in text:
 *      {magic}             =>  123
 *      {line.end.x}        =>  3
 *      {grid.0.1}          =>  2   // note that .0 and .1 are indeces
 *
 *    Examples in attributes:
 *      <div id="{magic}" class="{fonts.0} {fonts.1}">
 *                          =>  <div id="123" class="bold italic">
 *
*    There is a special rule for tags and attributes prefixed with _
 *    when you need to avoid the pre-processed tags/attributes being acted upon by the DOM.
 *      <_img _src="{fonts.0}Icon.png">
 *                          =>  <img src="boldIcon.png">
 *
 *   Parameterized lookups allow one lookup to be used to name the child of another.
 *   Any nested pair of [brackets] restarts the lookup context at the root.
 *      {grid.[line.start.x].[line.start.y]}
 *                          ==  {grid.1.2}      =>  5
 *
 * <for> Loops:
 *    Use the new <for> tag to loop over a set of values,
 *    cloning and re-evaluating the contents of the loop for each.
 *
 *    The targets of loops are implicitly lookups, so the {curly} syntax is not needed.
 *    As they expand, new nested values are dynamically added to the lookup table, to reflect the loop state.
 *
 *    Loop over elements in a list:
 *      <for each="font" in="fonts">{font#}:{font} </for>
 *                          =>  0:bold 1:italic
 *        Note: in="fonts" could have been in="{fonts}"
 *        Inside the <for> tags, new temporary named values exist based on the name specified in each=""
 *          {font} for each value in the list,
 *          and {font#} for the index of that item (starting at 0)
 *
 *    Loop over fields in an object:
 *      <for key="a" in="line.start">{a#}:{a}={a!} </for>
 *                          =>  0:x=1 1:y=2
 *        Inside the <for> tags, an additional temporary:
 *          {a} for each key in the object, {a#} for the index of that key,
 *          and {a!} for the value corresponding to that key.
 *
 *    Loop over characters in text:
 *      <for char="ch" in="fonts.0">{ch} </for>
 *                          =>  b o l d
 *      <for char="ch" in="other">{ch} </for>
 *                          =>  o t h e r
 *
 *        Note that the in="value" can be a literal.
 *
 *    Loop over words in text:
 *      <for char="w" in="Hello World!">{w}-{w}</for>
 *                          =>  Hello-HelloWorld!-World!
 *
 *        Word is really anything delimited by spaces.
 *
 *    Loop over a range of values:
 *      <for range="i" from="1" to="3">{i}</for>
 *                          =>  123
 *      <for range="i" from="1" until="3">{i}</for>
 *                          =>  12
 *      <for range="i" from="5" to="0" step="-2">{i}</for>
 *                          =>  531
 *
 *        from=""   specifies the start value
 *        to=""     specifies the last value (inclusive)
 *        until=""  specifies a stop value (exclusive)
 *        step=""   specifies a step value, if not 1
 *
 *    Use ranges to in compound lookups:
 *      <for range="row" from="0" to="1">
 *        <for range="col" from="0" to="2">
 *          {grid.[row].[col]}
 *      </for>,</for>
 *                          =>  1 2 3 , 4 5 6
 *
 *  <if> conditionals
 *    Use the new <if> tag to check a lookup against various states.
 *    The checked values are implicitly lookups, so the {curly} syntax is not needed.
 *    No new temporary values are generated by ifs.
 *
 *    Note: there is no else syntax. Instead, concatenate multiple ifs.
 *      As such, be careful not to nest, unless intended.
 *
 *    <if test="magic" eq="123">Magic!</if>
 *    <if test="magic" ne="123">Lame.</if>
 *                          =>  Magic!
 *    <if test="magic" ge="100">Big!
 *    <if test="magic" ge="120">Bigger!</if>
 *    </if>
 *                          =>  Big!Bigger!
 *
 *        Relative operators:
 *          eq=""       Equality (case-sensitive, in all cases)
 *          ne=""       Not-equals
 *          gt=""       Greater than
 *          lt=""       Less than
 *          ge=""       Greater than or equals
 *          le=""       Less than or equals
 *        Containment operators:
 *          in="super"  Test value is IN (a substring of) "super"
 *          ni="super"  Test value is NOT IN (not a substring of) "super"
 *        There is no NOT modifier. Instead, use the converse operator.
 *
 *
 *  Loops and Tables:
 *    It is tempting to use loops inside <table> tags.
 *    However, the DOM will likely refactor them if found inside a <table> but not inside <td>.
 *
 *    Two options: _prefix and CSS
 *      <_table>
 *        <for ...>
 *          <_tr>
 *            <if eq ...><_th></_th></if>
 *            <if ne ...><_td></_td></if>
 *          </_tr>
 *        </for>
 *      </_table>
 *
 *      <div style="display:table">
 *        <for ...>
 *          <div style="display:table-row">
 *            <if eq ...><div style="display:table-header"></div></if>
 *            <if ne ...><div style="display:table-cell"></div></if>
 *          </div>
 *        </for>
 *      </div>
 */
var builder_tags = [
    'build', 'use', 'for', 'if'
];
function identifyBuilders() {
    for (var _i = 0, builder_tags_1 = builder_tags; _i < builder_tags_1.length; _i++) {
        var t = builder_tags_1[_i];
        var tags = document.getElementsByTagName(t);
        for (var i = 0; i < tags.length; i++) {
            toggleClass(tags[i], 'builder_control', true);
        }
    }
}
/**
 * The root context for all builder functions
 * @returns the builderLookup object on the boiler.
 */
function theBoilerContext() {
    return theBoiler().builderLookup || {};
}
exports.theBoilerContext = theBoilerContext;
/**
 * See if we are inside an existing <svg> tag. Or multiple!
 * @param elmt Any element
 * @returns How many <svg> tags are in its parent chain
 */
function getSvgDepth(elmt) {
    var s = 0;
    var parent = findParentOfTag(elmt, 'SVG');
    while (parent) {
        s++;
        parent = parent.parentElement ? findParentOfTag(parent.parentElement, 'SVG') : null;
    }
    return s;
}
/**
 * Look for control tags like for loops and if branches.
 */
function expandControlTags() {
    identifyBuilders();
    var context = theBoilerContext();
    var inSvg = context['svg-depth'];
    var controls = document.getElementsByClassName('builder_control');
    while (controls.length > 0) {
        var src = controls[0];
        context['svg-depth'] = getSvgDepth(src);
        var dest = [];
        if (isTag(src, 'build')) {
            dest = expandContents(src, context);
        }
        else if (isTag(src, 'for')) {
            dest = startForLoop(src, context);
        }
        else if (isTag(src, 'if')) {
            dest = startIfBlock(src, context);
        }
        else if (isTag(src, 'use')) {
            dest = useTemplate(src, context);
        }
        var parent_2 = src.parentNode;
        for (var d = 0; d < dest.length; d++) {
            var node = dest[d];
            parent_2 === null || parent_2 === void 0 ? void 0 : parent_2.insertBefore(node, src);
        }
        parent_2 === null || parent_2 === void 0 ? void 0 : parent_2.removeChild(src);
        // See if there are more
        controls = document.getElementsByClassName('builder_control');
        context['svg-depth'] = inSvg; // restore
    }
    // Call any post-builder method
    var fn = theBoiler().postBuild;
    if (fn) {
        fn();
    }
}
exports.expandControlTags = expandControlTags;
/**
 * Concatenate one list onto another
 * @param list The list to modified
 * @param add The list to add to the end
 */
function pushRange(list, add) {
    for (var i = 0; i < add.length; i++) {
        list.push(add[i]);
    }
}
/**
 * Append more than one child node to the end of a parent's child list
 * @param parent The parent node
 * @param add A list of new children
 */
function appendRange(parent, add) {
    for (var i = 0; i < add.length; i++) {
        parent.insertBefore(add[i], null);
    }
}
/**
 * Potentially several kinds of for loops:
 * for each: <for each="var" in="list">  // ideas for optional args: first, last, skip
 * for char: <for char="var" in="text">  // every character in a string
 * for word: <for word="var" in="text">  // space-delimited substrings
 * for range: <for range="var" from="first" to="last" or until="after">
 * for key: <for key="var" in="object">  // idea for optional arg: sort
 * @param src the <for> element
 * @param context the set of values that might get used by the for loop
 * @returns a list of nodes, which will replace this <for> element
 */
function startForLoop(src, context) {
    var dest = [];
    var iter = null;
    var list = [];
    var vals = []; // not always used
    // <for each="variable_name" in="list">
    iter = src.getAttributeNS('', 'each');
    if (iter) {
        list = parseForEach(src, context);
    }
    else {
        iter = src.getAttributeNS('', 'char');
        if (iter) {
            list = parseForText(src, context, '');
        }
        else {
            iter = src.getAttributeNS('', 'word');
            if (iter) {
                list = parseForText(src, context, ' ');
            }
            else {
                iter = src.getAttributeNS('', 'key');
                if (iter) {
                    list = parseForKey(src, context);
                    vals = list[1];
                    list = list[0];
                }
                else {
                    iter = src.getAttributeNS('', 'range');
                    if (iter) {
                        list = parseForRange(src, context);
                    }
                    else {
                        throw new Error('Unrecognized <for> tag type: ' + src);
                    }
                }
            }
        }
    }
    if (!list) {
        throw new Error('Unable to resolve from context: ' + src.outerHTML);
    }
    var iter_index = iter + '#';
    for (var i = 0; i < list.length; i++) {
        context[iter_index] = i;
        context[iter] = list[i];
        if (vals.length > 0) {
            context[iter + '!'] = vals[i];
        }
        pushRange(dest, expandContents(src, context));
    }
    context[iter_index] = undefined;
    context[iter] = undefined;
    return dest;
}
/**
 * Syntax: <for each="var" in="list">
 * @param src
 * @param context
 * @returns a list of elements
 */
function parseForEach(src, context) {
    var list_name = src.getAttributeNS('', 'in');
    if (!list_name) {
        throw new Error('for each requires "in" attribute');
    }
    return anyFromContext(list_name, context);
}
function parseForText(src, context, delim) {
    var list_name = src.getAttributeNS('', 'in');
    if (!list_name) {
        throw new Error('for char requires "in" attribute');
    }
    // The list_name can just be a literal string
    var list = (list_name in context) ? context[list_name] : list_name;
    if (!list) {
        throw new Error('unresolved context: ' + list_name);
    }
    return list.split(delim);
}
function parseForRange(src, context) {
    var from = src.getAttributeNS('', 'in');
    var until = src.getAttributeNS('', 'until');
    var last = src.getAttributeNS('', 'to');
    var length = src.getAttributeNS('', 'len');
    var step = src.getAttributeNS('', 'step');
    var start = from ? parseInt(textFromContext(from, context)) : 0;
    var end = until ? parseInt(textFromContext(until, context))
        : last ? (parseInt(textFromContext(last, context)) + 1)
            : length ? (anyFromContext(length, context).length)
                : start;
    var inc = step ? parseInt(textFromContext(step, context)) : 1;
    if (!until && inc < 0) {
        end -= 2; // from 5 to 1 step -1 means i >= 0
    }
    var list = [];
    for (var i = start; inc > 0 ? (i < end) : (i > end); i += inc) {
        list.push(i);
    }
    return list;
}
function parseForKey(src, context) {
    var obj_name = src.getAttributeNS('', 'in');
    if (!obj_name) {
        throw new Error('for each requires "in" attribute');
    }
    var obj = anyFromContext(obj_name, context);
    if (!obj) {
        throw new Error('unresolved list context: ' + obj_name);
    }
    var keys = Object.keys(obj);
    var vals = keys.map(function (k) { return obj[k]; });
    return [keys, vals];
}
/**
 * Potentially several kinds of if expressions:
 *   equality: <if test="var" eq="value">
 *   not-equality: <if test="var" ne="value">
 *   less-than: <if test="var" lt="value">
 *   less-or-equal: <if test="var" le="value">
 *   greater-than: <if test="var" gt="value">
 *   greater-or-equal: <if test="var" ge="value">
 *   contains: <if test="var" in="value">
 *   not-contains: <if test="var" ni="value">
 *   boolean: <if test="var">
 * Note there is no else or else-if block, because there are no scoping blocks
 * @param src the <if> element
 * @param context the set of values that might get used by or inside the if block
 * @returns a list of nodes, which will replace this <if> element
 */
function startIfBlock(src, context) {
    var test = src.getAttributeNS('', 'test');
    if (!test) {
        throw new Error('<if> tags must have a test attribute');
    }
    test = textFromContext(test, context);
    var pass = false;
    var value;
    if (value = src.getAttributeNS('', 'eq')) { // equality
        pass = test == textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'ne')) { // not-equals
        pass = test != textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'lt')) { // less-than
        pass = test < textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'le')) { // less-than or equals
        pass = test <= textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'gt')) { // greater-than
        pass = test > textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'ge')) { // greater-than or equals
        pass = test >= textFromContext(value, context);
    }
    else if (value = src.getAttributeNS('', 'in')) { // string contains
        pass = textFromContext(value, context).indexOf(test) >= 0;
    }
    else if (value = src.getAttributeNS('', 'ni')) { // string doesn't contain
        pass = textFromContext(value, context).indexOf(test) >= 0;
    }
    else { // simple boolean
        pass = test === 'true';
    }
    if (pass) {
        // No change in context from the if
        return expandContents(src, context);
    }
    return [];
}
var inputAreaTagNames = [
    'letter', 'letters', 'literal', 'number', 'numbers', 'pattern', 'word'
];
/**
 * Shortcut tags for text input. These include:
 *  letter: any single character
 *  letters: a few characters, in a single input
 *  literal: readonly single character
 *  number: any numeric digit
 *  numbers: a few numeric digits
 *  word: full multi-character
 *  pattern: multiple inputs, generated from a pattern
 * @param src One of the input shortcut tags
 * @param context A dictionary of all values that can be looked up
 * @returns a node array containing a single <span>
 */
function startInputArea(src, context) {
    var span = document.createElement('span');
    // Copy most attributes. 
    // Special-cased ones are harmless - no meaning in generic spans
    cloneAttributes(src, span, context);
    var cloneContents = false;
    var literal = null;
    var extract = src.getAttributeNS('', 'extract');
    var styles = getLetterStyles(src, 'underline', '', 'box');
    // Convert special attributes to data-* attributes for later text setup
    var attr;
    if (isTag(src, 'letter')) { // 1 input cell for (usually) one character
        toggleClass(span, 'letter-cell', true);
        literal = src.getAttributeNS('', 'literal'); // converts letter to letter-literal
    }
    else if (isTag(src, 'letters')) { // 1 input cell for a few characters
        toggleClass(span, 'letter-cell', true);
        toggleClass(span, 'multiple-letter', true);
        literal = src.getAttributeNS('', 'literal'); // converts letter to letter-literal
    }
    else if (isTag(src, 'literal')) { // 1 input cell for (usually) one character
        toggleClass(span, 'letter-cell', true);
        toggleClass(span, 'literal', true);
        cloneContents = true; // literal value
    }
    else if (isTag(src, 'number')) { // 1 input cell for one numeric character
        toggleClass(span, 'letter-cell', true);
        toggleClass(span, 'numeric', true);
        literal = src.getAttributeNS('', 'literal'); // converts letter to letter-literal
    }
    else if (isTag(src, 'numbers')) { // 1 input cell for multiple numeric digits
        toggleClass(span, 'letter-cell', true);
        toggleClass(span, 'multiple-letter', true);
        toggleClass(span, 'numeric', true);
        // To support longer (or negative) numbers, set class = 'multiple-letter'
        literal = src.getAttributeNS('', 'literal'); // converts letter to letter-literal
    }
    else if (isTag(src, 'word')) { // 1 input cell for (usually) one character
        toggleClass(span, 'word-cell', true);
    }
    else if (isTag(src, 'pattern')) { // multiple input cells for (usually) one character each
        toggleClass(span, 'create-from-pattern', true);
        if (attr = src.getAttributeNS('', 'pattern')) {
            span.setAttributeNS('', 'data-letter-pattern', textFromContext(attr, context));
        }
        if (attr = src.getAttributeNS('', 'extract')) {
            span.setAttributeNS('', 'data-extract-indeces', textFromContext(attr, context));
        }
        if (attr = src.getAttributeNS('', 'numbers')) {
            span.setAttributeNS('', 'data-number-assignments', textFromContext(attr, context));
        }
    }
    else {
        return [src]; // Unknown tag. NYI?
    }
    if (literal) {
        span.innerText = textFromContext(literal, context);
        applyAllClasses(span, styles.literal);
    }
    else if (!isTag(src, 'pattern')) {
        applyAllClasses(span, styles.letter);
        if (extract != null) {
            applyAllClasses(span, styles.extract);
        }
    }
    if (cloneContents) {
        appendRange(span, expandContents(src, context));
    }
    return [span];
}
/**
 * Clone every node inside a parent element.
 * Any occurence of {curly} braces is in fact a lookup.
 * It can be in body text or an element attribute value
 * @param src The containing element
 * @param context A dictionary of all values that can be looked up
 * @returns A list of nodes
 */
function expandContents(src, context) {
    var dest = [];
    for (var i = 0; i < src.childNodes.length; i++) {
        var child = src.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            var child_elmt = child;
            if (isTag(child_elmt, 'for')) {
                pushRange(dest, startForLoop(child_elmt, context));
            }
            else if (isTag(child_elmt, 'if')) {
                pushRange(dest, startIfBlock(child_elmt, context));
            }
            else if (isTag(child_elmt, 'use')) {
                pushRange(dest, useTemplate(child_elmt, context));
            }
            else if (isTag(child_elmt, inputAreaTagNames)) {
                pushRange(dest, startInputArea(child_elmt, context));
            }
            else {
                dest.push(cloneWithContext(child_elmt, context));
            }
        }
        else if (child.nodeType == Node.TEXT_NODE) {
            pushRange(dest, cloneTextNode(child, context));
        }
        else {
            dest.push(cloneNode(child));
        }
    }
    return dest;
}
/**
 * Some HTML elements and attributes are immediately acted upon by the DOM.
 * To delay that until after builds (especially <for> and <if>),
 * use _prefx or suffix_, and the tag or attribute will be renamed when cloned.
 * @param name Any tag or attribute name
 * @returns The name, or the the name without the _
 */
function normalizeName(name) {
    if (name.substring(0, 1) == '_') {
        return name.substring(1);
    }
    if (name.substring(name.length - 1) == '_') {
        return name.substring(0, name.length - 1);
    }
    // Any other interior underscores are kept
    return name;
}
var nameSpaces = {
    '': '',
    'svg': exports.svg_xmlns,
    's': exports.svg_xmlns,
    'html': null,
    'h': null,
};
/**
 * Deep-clone an HTML element
 * Note that element and attribute names with _prefix will be renamed without _
 * @param elmt The original element
 * @param context A dictionary of all accessible values
 * @returns A cloned element
 */
function cloneWithContext(elmt, context) {
    var tagName = normalizeName(elmt.localName);
    var clone;
    if (context['svg-depth'] > 0) {
        clone = document.createElementNS(exports.svg_xmlns, tagName);
    }
    else {
        clone = document.createElement(tagName);
    }
    cloneAttributes(elmt, clone, context);
    if (elmt.tagName == 'SVG') {
        context['svg-depth']++;
    }
    for (var i = 0; i < elmt.childNodes.length; i++) {
        var child = elmt.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            var child_elmt = child;
            if (isTag(child_elmt, 'for')) {
                appendRange(clone, startForLoop(child_elmt, context));
            }
            else if (isTag(child_elmt, 'if')) {
                appendRange(clone, startIfBlock(child_elmt, context));
            }
            else if (isTag(child_elmt, 'use')) {
                appendRange(clone, useTemplate(child_elmt, context));
            }
            else if (isTag(child_elmt, inputAreaTagNames)) {
                appendRange(clone, startInputArea(child_elmt, context));
            }
            else {
                clone.appendChild(cloneWithContext(child_elmt, context));
            }
        }
        else if (child.nodeType == Node.TEXT_NODE) {
            appendRange(clone, cloneTextNode(child, context));
        }
        else {
            clone.insertBefore(cloneNode(child), null);
        }
    }
    if (elmt.tagName == 'SVG') {
        context['svg-depth']--;
    }
    return clone;
}
/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param context A dictionary of all accessible values
 */
function cloneAttributes(src, dest, context) {
    for (var i = 0; i < src.attributes.length; i++) {
        var name_5 = normalizeName(src.attributes[i].name);
        var value = src.attributes[i].value;
        value = cloneText(value, context);
        if (name_5 == 'id') {
            dest.id = value;
        }
        else if (name_5 == 'class') {
            if (value) {
                var classes = value.split(' ');
                for (var i_5 = 0; i_5 < classes.length; i_5++) {
                    if (classes[i_5].length > 0) {
                        dest.classList.add(classes[i_5]);
                    }
                }
            }
        }
        // REVIEW: special case 'style'?
        else {
            // Clone styles, using same XMLNS as the tag name
            var ns = dest.getAttributeNS('', 'data-xmlns') || '';
            var xmlns = nameSpaces[ns] || '';
            if (xmlns) {
                dest.setAttributeNS(xmlns, name_5, value);
            }
            else {
                dest.setAttribute(name_5, value);
            }
        }
    }
}
/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @param context A dictionary of all accessible values
 * @returns A list of text nodes
 */
function cloneTextNode(text, context) {
    var dest = [];
    var str = text.textContent;
    var i = str ? str.indexOf('{') : -1;
    while (str && i >= 0) {
        var j = str.indexOf('}', i);
        if (j < 0) {
            break;
        }
        if (i > 0) {
            dest.push(document.createTextNode(str.substring(0, i)));
        }
        var key = str.substring(i + 1, j);
        dest.push(document.createTextNode(textFromContext(key, context)));
        str = str.substring(j + 1);
        i = str.indexOf('{');
    }
    if (str) {
        dest.push(document.createTextNode(str));
    }
    return dest;
}
/**
 * Process text which may contain {curly} formatting.
 * @param text Any text
 * @param context A dictionary of all accessible values
 * @returns Expanded text
 */
function cloneText(str, context) {
    return contextFormula(str, context, false);
}
var TokenType;
(function (TokenType) {
    TokenType[TokenType["start"] = 0] = "start";
    TokenType[TokenType["bracket"] = 1] = "bracket";
    TokenType[TokenType["operator"] = 2] = "operator";
    TokenType[TokenType["text"] = 3] = "text";
})(TokenType || (TokenType = {}));
/**
 * Divide up a string into sibling tokens.
 * Each token may be divisible into sub-tokens, but those are skipped here.
 * If we're not inside a {=formula}, the only tokens are { and }.
 * If we are inside a {=formula}, then operators and others brackets are tokens too.
 * @param str The parent string
 * @param inFormula True if str should be treated as already inside {}
 * @returns A list of token strings. Uninterpretted.
 */
function tokenizeFormula(str, inFormula) {
    var tokens = [];
    var stack = [];
    var tok = '';
    var tokType = TokenType.start;
    for (var i = 0; i < str.length; i++) {
        var prevTT = tokType;
        var ch = str[i];
        if (!inFormula && ch == '{') {
            stack.push(bracketPairs[ch]); // push the expected close
            tokType = TokenType.bracket;
        }
        else if (inFormula && ch in bracketPairs) {
            stack.push(bracketPairs[ch]); // push the expected close
            tokType = TokenType.bracket;
        }
        else if (stack.length > 0) {
            tok += ch;
            if (ch == stack[stack.length - 1]) {
                stack.pop();
                if (stack.length == 0) {
                    tokens.push(tok);
                    tok = '';
                    tokType = TokenType.start;
                }
            }
            continue;
        }
        else if (inFormula && ch in binaryOperators) {
            tokType = TokenType.operator;
        }
        else {
            tokType = TokenType.text;
        }
        if (tokType != prevTT) {
            if (tok) {
                tokens.push(tok);
            }
            tok = ch;
            if (tokType == TokenType.operator) {
                tokens.push(ch);
                tok = '';
                tokType = TokenType.start;
            }
        }
        else {
            tok += ch;
        }
    }
    if (tok) {
        tokens.push(tok);
    }
    return tokens;
}
var bracketPairs = {
    '(': ')',
    // '[': ']',
    '{': '}',
    // '<': '>',  // should never be used for comparison operators in this context
    '"': '"',
    "'": "'",
};
var binaryOperators = {
    '+': function (a, b) { return String(parseFloat(a) + parseFloat(b)); },
    '-': function (a, b) { return String(parseFloat(a) - parseFloat(b)); },
    '*': function (a, b) { return String(parseFloat(a) * parseFloat(b)); },
    '/': function (a, b) { return String(parseFloat(a) / parseFloat(b)); },
    '%': function (a, b) { return String(parseFloat(a) % parseInt(b)); },
    '&': function (a, b) { return String(a) + String(b); },
};
var unaryOperators = {
    '-': function (a) { return String(-parseFloat(a)); },
};
/**
 * Handle a mix of context tokens and operators
 * @param str Raw text of a token/operator string
 * @param context A dictionary of all accessible values
 * @param inFormula True if str should be treated as already inside {}
 * @returns Expanded text
 */
function contextFormula(str, context, inFormula) {
    var dest = '';
    var tokens = tokenizeFormula(str, inFormula);
    var binaryOp;
    var unaryOp;
    for (var t = 0; t < tokens.length; t++) {
        var tok = tokens[t];
        if (!tok) {
            continue;
        }
        if (tok in binaryOperators) {
            if ((binaryOp || dest == '') && tok in unaryOperators) {
                unaryOp = unaryOperators[tok];
            }
            else if (binaryOp) {
                // TODO: consider unary operators
                throw new Error("Consecutive binary operators: " + tok);
            }
            else {
                binaryOp = binaryOperators[tok];
            }
            continue;
        }
        if (tok[0] in bracketPairs) {
            var inner = tok.substring(1, tok.length - 1);
            if (tok[0] == '(') {
                // (...) is a precedence operator
                tok = contextFormula(inner, context, true);
            }
            else if (tok[0] == '{') {
                if (tok[1] == '=') {
                    // {=...} is a nested formula
                    tok = contextFormula(inner.substring(1), context, true);
                }
                else {
                    // {...} is a context look-up
                    tok = textFromContext(inner, context);
                }
            }
        }
        if (unaryOp) {
            tok = unaryOp(tok);
            unaryOp = undefined;
        }
        if (binaryOp) {
            // All operators read left-to-right
            // TODO: if dest=='', consider unary operators
            dest = binaryOp(dest, tok);
            binaryOp = undefined; // used up
        }
        else {
            dest += tok;
        }
    }
    if (unaryOp) {
        throw new Error("Incomplete unary operation: " + str);
    }
    if (binaryOp) {
        throw new Error("Incomplete binary operation: " + str);
    }
    return dest;
}
/**
 * Enable lookups into the context by key name.
 * Keys can be paths, separated by dots (.)
 * Paths can have other paths as nested arguments, using [ ]
 * Note, the dot separator is still required.
 *   example: foo.[bar].fuz       equivalent to foo[{bar}].fuz
 *   example: foo.[bar.baz].fuz   equivalent to foo[{bar.baz}].fuz
 * Even arrays use dot notation: foo.0 is the 0th item in foo
 * @param key A key, initially from {curly} notation
 * @param context A dictionary of all accessible values
 * @returns Resolved text
 */
function anyFromContext(key, context) {
    key = key.trim();
    if (key[0] == '{' && key[key.length - 1] == '}') {
        // Remove redundant {curly}, since some fields don't require them
        key = key.substring(1, key.length - 1).trim();
    }
    var path = key.split('.');
    var nested = [context];
    for (var i = 0; i < path.length; i++) {
        var step = path[i];
        if (!step) {
            continue; // Ignore blank steps for now
        }
        var maybe = step.indexOf('?') == step.length - 1;
        if (maybe) {
            step = step.substring(0, step.length - 1);
        }
        var newNest = step[0] == '[';
        if (newNest) {
            step = step.substring(1);
            nested.push(context);
        }
        // steps can end in one more more ']', which can't occur anywhere else
        var unnest = step.indexOf(']');
        if (unnest >= 0) {
            unnest = step.length - unnest;
            if (nested.length <= unnest) {
                throw new Error('Malformed path has unmatched ] : ' + key);
            }
            step = step.substring(0, step.length - unnest);
        }
        if (!(step in nested[nested.length - 1])) {
            if ((i == 0 && path.length == 1) || (newNest && unnest > 0)) {
                nested[nested.length - 1] = new String(step); // A lone step (or nested step) can be a literal
            }
            else if (maybe) {
                if (i != path.length - 1) {
                    console.log('Optional key ' + step + '?' + ' before the end of ' + key);
                }
                return ''; // All missing optionals return ''
            }
            else {
                throw new Error('Unrecognized key: ' + step + ' in ' + key);
            }
        }
        else {
            nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], step, maybe);
        }
        for (; unnest > 0; unnest--) {
            var pop = '' + nested.pop();
            nested[nested.length - 1] = getKeyedChild(nested[nested.length - 1], pop, maybe);
        }
    }
    if (nested.length > 1) {
        throw new Error('Malformed path has unmatched [ : ' + key);
    }
    return nested.pop();
}
exports.anyFromContext = anyFromContext;
/**
 * Look up a value, according to the context path cached in an attribute
 * @param path A context path
 * @returns Any JSON object
 */
function globalContextData(path) {
    var context = theBoilerContext();
    if (path && context) {
        return anyFromContext(path, context);
    }
    return undefined;
}
exports.globalContextData = globalContextData;
/**
 * Test a key in the current context
 * @param key A key, initially from {curly} notation
 * @param context A dictionary of all accessible values
 * @returns true if key is a valid path within the context
 */
function validateKeyInContet(key, context) {
    try {
        anyFromContext(key, context);
        return true;
    }
    catch (_a) {
        return false;
    }
}
/**
 * Enable lookups into the context by key name.
 * Keys can be paths, separated by dots (.)
 * Paths can have other paths as nested arguments, using [ ]
 * Note, the dot separator is still required.
 *   example: foo.[bar].fuz       equivalent to foo[{bar}].fuz
 *   example: foo.[bar.baz].fuz   equivalent to foo[{bar.baz}].fuz
 * Even arrays use dot notation: foo.0 is the 0th item in foo
 * @param key A key, initially from {curly} notation
 * @param context A dictionary of all accessible values
 * @returns Resolved text
 */
function textFromContext(key, context) {
    try {
        return '' + anyFromContext(key, context);
    }
    catch (ex) {
        if (key.indexOf('.') < 0) {
            return key; // key can be a literal value
        }
        throw ex;
    }
}
/**
 * Get a keyed child of a parent, where the key is either a dictionary key
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset
 * @param maybe If true, and key does not work, return ''
 * @returns A child object, or a substring
 */
function getKeyedChild(parent, key, maybe) {
    if (typeof (parent) == 'string') {
        var i = parseInt(key);
        if (maybe && (i < 0 || i >= parent.length)) {
            return '';
        }
        return parent[i];
    }
    if (!(key in parent)) {
        if (maybe) {
            return '';
        }
        throw new Error('Unrecognized key: ' + key);
    }
    return parent[key];
}
/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node) {
    return node; // STUB: keep original node
}
/**
 * Replace a <use> tag with the contents of a <template>.
 * Along the way, push any attributes of the <use> tag onto the context.
 * Also push the context paths (as strings) as separate attributes.
 * Afterwards, pop them all back off.
 * Optionally, a <use> tag without a template="" attribute is a way to modify the context for the use's children.
 * @param node a <use> tag
 * @param context The current context
 * @returns An array of nodes to insert into the document in place of the <use> tag
 */
function useTemplate(node, context) {
    var dest = [];
    var popContext = {};
    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i].name;
        var val = node.attributes[i].value;
        var attri = node.attributes[i].name.toLowerCase();
        if (attri != 'template' && attri != 'builder_control') {
            popContext[attr] = context[attr];
            popContext[attr + '$'] = context[attr + '$'];
            context[attr] = anyFromContext(val, context);
            if (context[attr] === '') {
                context[attr] = val;
            }
            context[attr + '$'] = val; // Store the context path, so it can also be referenced
        }
    }
    var tempId = node.getAttribute('template');
    if (tempId) {
        var template = getTemplate(tempId);
        if (!template) {
            throw new Error('Template not found: ' + tempId);
        }
        if (!template.content) {
            throw new Error('Invalid template: ' + tempId);
        }
        // The template doesn't have any child nodes. Its content must first be cloned.
        var clone = template.content.cloneNode(true);
        dest = expandContents(clone, context);
    }
    else {
        dest = expandContents(node, context);
    }
    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i].name.toLowerCase();
        if (attr != 'template' && attr != 'builder_control') {
            context[attr] = popContext[attr];
            context[attr + '$'] = popContext[attr + '$'];
        }
    }
    return dest;
}
/*-----------------------------------------------------------
 * _templates.ts
 *-----------------------------------------------------------*/
/**
 * Find a template that matches an ID.
 * Could be on the local page, or a built-in one
 * @param tempId The ID of the template (must be valid)
 * @returns An HTMLTemplateElement, or throws
 */
function getTemplate(tempId) {
    if (tempId) {
        var elmt = document.getElementById(tempId);
        if (elmt) {
            return elmt;
        }
        var template = builtInTemplate(tempId);
        if (template) {
            return template;
        }
    }
    throw new Error('Unresolved template ID: ' + tempId);
}
exports.getTemplate = getTemplate;
var builtInTemplates = {
    paintByNumbers: paintByNumbersTemplate,
    paintByColorNumbers: paintByColorNumbersTemplate,
    classStampPalette: classStampPaletteTemplate,
    classStampNoTools: classStampNoToolsTemplate,
};
/**
 * Match a template name to a built-in template object
 * @param tempId The ID
 * @returns A template element (not part of the document), or undefined if unrecognized.
 */
function builtInTemplate(tempId) {
    if (tempId in builtInTemplates) {
        return builtInTemplates[tempId]();
    }
}
exports.builtInTemplate = builtInTemplate;
;
/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByNumbersTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    var temp = document.createElement('template');
    temp.id = 'paintByNumbers';
    temp.innerHTML =
        "<table_ class=\"paint-by-numbers bolden_5 bolden_10\" data-col-context=\"{cols$}\" data-row-context=\"{rows$}\">\n    <thead_>\n      <tr_ class=\"pbn-col-headers\">\n        <th_ class=\"pbn-corner\">\n          <span class=\"pbn-instructions\">\n            This is a nonogram<br>(aka paint-by-numbers).<br>\n            For instructions, see \n            <a href=\"https://help.puzzyl.net/PBN\" target=\"_blank\">\n              https://help.puzzyl.net/PBN<br>\n              <img src=\"../Images/Intro/pbn.png\">\n            </a>\n          </span>\n        </th_>\n        <for each=\"col\" in=\"colGroups\">\n          <td_ id=\"colHeader-{col#}\" class=\"pbn-col-header\">\n            <for each=\"group\" in=\"col\"><span class=\"pbn-col-group\" onclick=\"togglePbnClue(this)\">{.group}</span></for>\n          </td_>\n        </for>\n        <th_ class=\"pbn-row-footer pbn-corner\">&nbsp;</th_>\n      </tr_>\n    </thead_>\n    <for each=\"row\" in=\"rowGroups\">\n      <tr_ class=\"pbn-row\">\n        <td_ id=\"rowHeader-{row#}\" class=\"pbn-row-header\">\n          &hairsp; <for each=\"group\" in=\"row\"><span class=\"pbn-row-group\" onclick=\"togglePbnClue(this)\">{.group}</span> </for>&hairsp;\n        </td_>\n        <for each=\"col\" in=\"colGroups\">\n          <td_ id=\"{row#}_{col#}\" class=\"pbn-cell stampable\">&times;</td_>\n        </for>\n        <td_ class=\"pbn-row-footer\"><span id=\"rowSummary-{row#}\" class=\"pbn-row-validation\"></span></td_>\n      </tr_>\n    </for>\n    <tfoot_>\n      <tr_ class=\"pbn-col-footer\">\n        <th_ class=\"pbn-corner\">&nbsp;</th_>\n        <for each=\"col\" in=\"colGroups\">\n          <td_ class=\"pbn-col-footer\"><span id=\"colSummary-{col#}\" class=\"pbn-col-validation\"></span></td_>\n        </for>\n        <th_ class=\"pbn-corner-validation\">\n          \uA71B&nbsp;&nbsp;&nbsp;&nbsp;\uA71B&nbsp;&nbsp;&nbsp;&nbsp;\uA71B\n          <br>\u2190&nbsp;validation</th_>\n      </tr_>\n    </tfoot_>\n  </table_>";
    return temp;
}
/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByColorNumbersTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    var temp = document.createElement('template');
    temp.id = 'paintByNumbers';
    temp.innerHTML =
        "<table_ class=\"paint-by-numbers pbn-two-color bolden_5 bolden_10\" data-col-context=\"{cols$}\" data-row-context=\"{rows$}\" data-stamp-list=\"{stamplist$}\">\n    <thead_>\n      <tr_ class=\"pbn-col-headers\">\n        <th_ class=\"pbn-corner\">\n          <span class=\"pbn-instructions\">\n            This is a nonogram<br>(aka paint-by-numbers).<br>\n            For instructions, see \n            <a href=\"https://help.puzzyl.net/PBN\" target=\"_blank\">\n              https://help.puzzyl.net/PBN<br>\n              <img src=\"https://help.puzzyl.net/pbn.png\">\n            </a>\n          </span>\n        </th_>\n        <for each=\"col\" in=\"colGroups\">\n          <td_ id=\"colHeader-{col#}\" class=\"pbn-col-header\">\n            <for each=\"colorGroup\" in=\"col\"><for key=\"color\" in=\"colorGroup\"><for each=\"group\" in=\"color!\"><span class=\"pbn-col-group pbn-color-{color}\" onclick=\"togglePbnClue(this)\">{.group}</span></for></for></for>\n          </td_>\n        </for>\n        <if test=\"validate?\" ne=\"false\">\n          <th_ class=\"pbn-row-footer pbn-corner\">&nbsp;</th_>\n        </if>\n      </tr_>\n    </thead_>\n      <for each=\"row\" in=\"rowGroups\">\n        <tr_ class=\"pbn-row\">\n          <td_ id=\"rowHeader-{row#}\" class=\"pbn-row-header\">\n            &hairsp; \n            <for each=\"colorGroup\" in=\"row\"><for key=\"color\" in=\"colorGroup\">\n              <for each=\"group\" in=\"color!\"><span class=\"pbn-row-group pbn-color-{color}\" onclick=\"togglePbnClue(this)\">{.group}</span> </for>\n            &hairsp;</for></for>\n          </td_>\n          <for each=\"col\" in=\"colGroups\">\n          <td_ id=\"{row#}_{col#}\" class=\"pbn-cell stampable\">{blank?}</td_>\n        </for>\n        <if test=\"validate?\" ne=\"false\">\n          <td_ class=\"pbn-row-footer\"><span id=\"rowSummary-{row#}\" class=\"pbn-row-validation\"></span></td_>\n        </if>\n      </tr_>\n    </for>\n    <if test=\"validate?\" ne=\"false\">\n      <tfoot_>\n        <tr_ class=\"pbn-col-footer\">\n          <th_ class=\"pbn-corner\">&nbsp;</th_>\n          <for each=\"col\" in=\"colGroups\">\n            <td_ class=\"pbn-col-footer\"><span id=\"colSummary-{col#}\" class=\"pbn-col-validation\"></span></td_>\n          </for>\n          <th_ class=\"pbn-corner-validation\">\n            \uA71B&nbsp;&nbsp;&nbsp;&nbsp;\uA71B&nbsp;&nbsp;&nbsp;&nbsp;\uA71B\n            <br>\u2190&nbsp;validation</th_>\n        </tr_>\n      </tfoot_>\n    </if>\n  </table_>";
    return temp;
}
/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 * @remarks This template takes the following arguments:
 *   size: Optional descriptor of stamp toolbar button size.
 *         Choices are "medium" and "small". The default is large.
 *   erase: the tool id of the eraser
 *   tools: A list of objects, each of which contain:
 *     id: the name of the stamp.
 *     next: Optional id of the next stamp, for rotational clicking.
 *           If absent, clicking on pre-stamped cells does nothing differnt.
 *     modifier: Optional shift state for clicks.
 *               Choices are "ctrl", "alt", "shift".
 *     img: The image source path to the button.
 *     label: Optional text to render below the toolbar button
 * @remarks Invoking this stamping template also loads the PaintByNumbers.css
 * Top candidates of styles to override include:
 *   stampLabel: to change or suppress the display of the label.
 *   stampMod: to change of suppress the modifier as a simple label.
 */
function classStampPaletteTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    var temp = document.createElement('template');
    temp.id = 'classStampPalette';
    temp.innerHTML =
        "<div id=\"stampPalette\" data-tool-count=\"3\" data-tool-erase=\"{erase}\">\n    <for each=\"tool\" in=\"tools\">\n      <div class=\"stampTool {size?}\" data-template-id=\"{tool.id}\" data-click-modifier=\"{tool.modifier?}\" title=\"{tool.modifier?} + draw\" data-next-template-id=\"{tool.next}\">\n        <div class=\"roundTool {tool.id}-button\">\n          <span id=\"{tool.id}-icon\" class=\"stampIcon\"><img src_=\"{tool.img}\"></span>\n          <span id=\"{tool.id}-label\" class=\"stampLabel\">{tool.label?}</span>\n          <span id=\"{tool.id}-mod\" class=\"stampMod\">{tool.modifier?}+click</span>\n        </div>\n      </div>\n    </for>\n  </div>";
    return temp;
}
function classStampNoToolsTemplate() {
    linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');
    var temp = document.createElement('template');
    temp.id = 'classStampPalette';
    temp.innerHTML =
        "<div id=\"stampPalette\" class=\"hidden\" data-tool-erase=\"{erase}\">\n    <for each=\"tool\" in=\"tools\">\n      <div class=\"stampTool\" data-template-id=\"{tool.id}\" data-next-template-id=\"{tool.next}\">\n      </div>\n    </for>\n  </div>";
    return temp;
}
function stampPaletteTemplate() {
    linkCss(getSafariDetails().cssRoot + 'StampTools.css');
    var temp = document.createElement('template');
    temp.innerHTML =
        "<table_ class=\"paint-by-numbers bolden_5 bolden_10\" data-col-context=\"{cols$}\" data-row-context=\"{rows$}\">\n  </table_>";
    return temp;
}
var pbnStampTools = [
    { id: 'stampPaint', modifier: 'ctrl', label: 'Paint', img: '../Images/Stamps/brushH.png', next: 'stampBlank' },
    { id: 'stampBlank', modifier: 'shift', label: 'Blank', img: '../Images/Stamps/blankH.png', next: 'stampErase' },
    { id: 'stampErase', modifier: 'alt', label: 'Erase', img: '../Images/Stamps/eraserH.png', next: 'stampPaint' },
];
/*-----------------------------------------------------------
 * _validatePBN.ts
 *-----------------------------------------------------------*/
/**
 * Validate the paint-by-numbers grid that contains this cell
 * @param target The cell that was just modified
 */
function validatePBN(target) {
    var table = findParentOfClass(target, 'paint-by-numbers');
    if (!table) {
        return;
    }
    var stampList = getOptionalStyle(table, 'data-stamp-list');
    if (stampList) {
        validateColorPBN(target, table, stampList);
        return;
    }
    var pos = target.id.split('_');
    var row = parseInt(pos[0]);
    var col = parseInt(pos[1]);
    var rSum = document.getElementById('rowSummary-' + row);
    var cSum = document.getElementById('colSummary-' + col);
    if (!rSum && !cSum) {
        return; // this PBN does not have a UI for validation
    }
    // Scan all cells in this PBN table, looking for those in the current row & column
    // Track the painted ones as a list of row/column indices
    var cells = table.getElementsByClassName('stampable');
    var rowOn = [];
    var colOn = [];
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (hasClass(cell, 'stampPaint')) {
            pos = cell.id.split('_');
            var r = parseInt(pos[0]);
            var c = parseInt(pos[1]);
            if (r == row) {
                rowOn.push(c);
            }
            if (c == col) {
                colOn.push(r);
            }
        }
    }
    var rows = contextDataFromRef(table, 'data-row-context');
    if (rSum && rows) {
        // Convert a list of column indices to group notation
        var groups = summarizePBN(rowOn);
        rSum.innerHTML = '';
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var g = groups_1[_i];
            if (g > 0) {
                var span = document.createElement('span');
                toggleClass(span, 'pbn-row-group', true);
                span.innerText = g.toString();
                rSum.appendChild(span);
            }
        }
        var header = rows[row];
        var comp = compareGroupsPBN(header, groups);
        toggleClass(rSum, 'done', comp == 0);
        toggleClass(rSum, 'exceeded', comp > 0);
        var rHead = document.getElementById('rowHeader-' + row);
        toggleClass(rHead, 'done', comp == 0);
    }
    var cols = contextDataFromRef(table, 'data-col-context');
    if (cSum) {
        var groups = summarizePBN(colOn);
        cSum.innerHTML = '';
        for (var _a = 0, groups_2 = groups; _a < groups_2.length; _a++) {
            var g = groups_2[_a];
            if (g > 0) {
                var span = document.createElement('span');
                toggleClass(span, 'pbn-col-group', true);
                span.innerText = g.toString();
                cSum.appendChild(span);
            }
        }
        var header = cols[col];
        var comp = compareGroupsPBN(header, groups);
        toggleClass(cSum, 'done', comp == 0);
        toggleClass(cSum, 'exceeded', comp > 0);
        var cHead = document.getElementById('colHeader-' + col);
        toggleClass(cHead, 'done', comp == 0);
    }
}
/**
 * Is a given cell tagged with a (non-blank) stamp id?
 * @param cell
 * @param stampTools
 * @returns the stamp data, or undefined if none found
 */
function dataFromTool(cell, stampTools) {
    for (var i = 0; i < stampTools.length; i++) {
        if (stampTools[i].data && hasClass(cell, stampTools[i].id))
            return stampTools[i].data;
    }
    return undefined;
}
/**
 * Look up a value, according to the context path cached in an attribute
 * @param elmt Any element
 * @param attr An attribute name, which should exist in elmt or any parent
 * @returns Any JSON object
 */
function contextDataFromRef(elmt, attr) {
    var context = theBoilerContext();
    var path = getOptionalStyle(elmt, attr);
    if (path && context) {
        return anyFromContext(path, context);
    }
    return undefined;
}
/**
 * Read the user's actual painting within the PBN grid as a list of group sizes.
 * @param list A list of numbers, indicating row or column indices
 * @returns A list of groups separated by gaps. Positive numbers are consecutive painted. Negative are consecutive un-painted.
 * The leading- and trailing- empty cells are ignored. But if the whole series is empty, return [0]
 */
function summarizePBN(list) {
    var prev = NaN;
    var consec = 0;
    var summary = [];
    list.push(NaN);
    for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
        var next = list_4[_i];
        if (next == prev + 1) {
            consec++;
        }
        else {
            if (consec > 0) {
                summary.push(consec);
                var gap = next - prev - 1;
                if (!isNaN(gap) && gap > 0) {
                    summary.push(-gap);
                }
            }
            consec = (!isNaN(next)) ? 1 : 0;
        }
        prev = next;
    }
    if (summary.length == 0) {
        return [0];
    }
    return summary;
}
/**
 * Compare the actual panted cells vs. the clues.
 * The actual cells could indicate either more than was clued, or less than was clued, or exactly what was clued.
 * @param expect A list of expected groups (positives only)
 * @param have A list of actual groups (positives indicate groups, negatives indicates gaps between groups)
 * @returns 0 if exact, 1 if actual exceeds expected, or -1 if actual is not yet expected, but hasn't contradicted it yet
 */
function compareGroupsPBN(expect, have) {
    var exact = true;
    var e = 0;
    var gap = 0;
    var prevH = 0;
    var curE = expect.length > 0 ? expect[0] : 0;
    for (var _i = 0, have_1 = have; _i < have_1.length; _i++) {
        var h = have_1[_i];
        if (h <= 0) {
            gap = -h;
            continue;
        }
        prevH = prevH > 0 ? (prevH + gap + h) : h;
        if (prevH <= curE) {
            exact = exact && h == curE;
            gap = 0;
            if (prevH == curE) {
                prevH = 0;
                e++;
                curE = e < expect.length ? expect[e] : 0;
            }
        }
        else {
            exact = false;
            prevH = 0;
            gap = 0;
            e++;
            while (e < expect.length && h > expect[e]) {
                e++;
            }
            curE = e < expect.length ? expect[e] : 0;
            if (h < curE) {
                prevH = h;
            }
            else if (h == curE) {
                e++;
                curE = e < expect.length ? expect[e] : 0;
            }
            else {
                return 1; // too big
            }
        }
    }
    // return 0 for exact match
    // return -1 for incomplete match - groups thus far do not exceed expected
    return (exact && e == expect.length) ? 0 : -1;
}
/**
 * When a PBN group in row or col header is checked,
 * toggle a check- or cross-off effect.
 * @param group The group that was clicked.
 */
function togglePbnClue(group) {
    toggleClass(group, 'pbn-check');
}
var nonIndexTag = { index: NaN, tag: '' };
var nonLinearTag = { len: 0, tag: '' };
var outerGapTag = { len: 1, tag: '' };
/**
* Validate the paint-by-numbers grid that contains this cell
* @param target The cell that was just modified
* @param table The containing table
* @param stampList
*/
function validateColorPBN(target, table, stampList) {
    var stampTools = globalContextData(stampList);
    var pos = target.id.split('_');
    var row = parseInt(pos[0]);
    var col = parseInt(pos[1]);
    var rSum = document.getElementById('rowSummary-' + row);
    var cSum = document.getElementById('colSummary-' + col);
    if (!rSum && !cSum) {
        return; // this PBN does not have a UI for validation
    }
    // Scan all cells in this PBN table, looking for those in the current row & column
    // Track the painted ones as a list of row/column indices
    var cells = table.getElementsByClassName('stampable');
    var rowOn = [];
    var colOn = [];
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var data = dataFromTool(cell, stampTools);
        if (data) {
            pos = cell.id.split('_');
            var r = parseInt(pos[0]);
            var c = parseInt(pos[1]);
            if (r == row) {
                var it = { index: c, tag: data };
                rowOn.push(it);
            }
            if (c == col) {
                var it = { index: r, tag: data };
                colOn.push(it);
            }
        }
    }
    var rows = contextDataFromRef(table, 'data-row-context');
    if (rSum && rows) {
        // Convert a list of column indices to group notation
        var groups = summarizeTaggedPBN(rowOn);
        rSum.innerHTML = '';
        for (var _i = 0, groups_3 = groups; _i < groups_3.length; _i++) {
            var g = groups_3[_i];
            if (g.tag != '') {
                var span = document.createElement('span');
                toggleClass(span, 'pbn-row-group', true);
                toggleClass(span, 'pbn-color-' + g.tag, true);
                span.innerText = g.len.toString();
                rSum.appendChild(span);
            }
        }
        var header = invertColorTags(rows[row]);
        var comp = compareTaggedGroupsPBN(header, groups);
        toggleClass(rSum, 'done', comp == 0);
        toggleClass(rSum, 'exceeded', comp > 0);
        var rHead = document.getElementById('rowHeader-' + row);
        toggleClass(rHead, 'done', comp == 0);
    }
    var cols = contextDataFromRef(table, 'data-col-context');
    if (cSum) {
        var groups = summarizeTaggedPBN(colOn);
        cSum.innerHTML = '';
        for (var _a = 0, groups_4 = groups; _a < groups_4.length; _a++) {
            var g = groups_4[_a];
            if (g.tag != '') {
                var span = document.createElement('span');
                toggleClass(span, 'pbn-col-group', true);
                toggleClass(span, 'pbn-color-' + g.tag, true);
                span.innerText = g.len.toString();
                cSum.appendChild(span);
            }
        }
        var header = invertColorTags(cols[col]);
        var comp = compareTaggedGroupsPBN(header, groups);
        toggleClass(cSum, 'done', comp == 0);
        toggleClass(cSum, 'exceeded', comp > 0);
        var cHead = document.getElementById('colHeader-' + col);
        toggleClass(cHead, 'done', comp == 0);
    }
}
/**
* Starting from a tag-clumped header input:
*  [ {tag1:[1,2]}, {tag2:[3,4]} ]
* Convert to linear groups with tags
*  [ [1,tag1], [2,tag1], [3,tag2], [4,tag2]]
* @param header input-style header
* @returns linear-style header
*/
function invertColorTags(header) {
    var linear = [];
    for (var i = 0; i < header.length; i++) {
        var tagged = header[i]; // {tag:[1,2]}
        var tag = Object.keys(tagged)[0];
        var groups = tagged[tag];
        for (var g = 0; g < groups.length; g++) {
            var lt = { len: groups[g], tag: tag };
            linear.push(lt);
        }
    }
    return linear;
}
/**
 * Read the user's actual painting within the PBN grid as a list of group sizes.
 * @param list A list of numbers, indicating row or column indices
 * @returns A list of groups and gaps, trimming exterior gaps.
 */
function summarizeTaggedPBN(list) {
    var prev = nonIndexTag;
    var consec = 0;
    var summary = [];
    list.push(nonIndexTag);
    for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
        var next = list_5[_i];
        if (next.tag == prev.tag && next.index == prev.index + 1) {
            consec++;
        }
        else {
            if (consec > 0) {
                var line = { len: consec, tag: prev.tag };
                summary.push(line);
                var gap = { len: next.index - prev.index - 1, tag: '' };
                if (next.tag != '') {
                    summary.push(gap);
                }
            }
            consec = next == nonIndexTag ? 0 : 1;
        }
        prev = next;
    }
    if (summary.length == 0) {
        return [];
    }
    return summary;
}
/**
 * Compare the actual painted cells vs. the clues.
 * The actual cells could indicate either more than was clued, or less than was clued, or exactly what was clued.
 * @param expect A list of expected groups (omitting gaps)
 * @param have A list of actual groups (including gaps between groups)
 * @returns 0 if exact, 1 if actual exceeds expected, or -1 if actual is not yet expected, but hasn't contradicted it yet
 */
function compareTaggedGroupsPBN(expect, have) {
    var exact = true;
    var e = 0;
    var gap = outerGapTag;
    var prevH = nonLinearTag;
    var curE = expect.length == 0 ? nonLinearTag : expect[0];
    for (var _i = 0, have_2 = have; _i < have_2.length; _i++) {
        var h = have_2[_i];
        if (h.tag == '') {
            gap = h;
            continue;
        }
        if (h.tag == prevH.tag) {
            // Two groups of the same type, separated by a gap, could fit within a single expected range
            prevH.len += gap.len + h.len;
            if (prevH.len <= curE.len) {
                continue;
            }
            // curE has already accomodated prevH. If this new, bigger prevH doesn't fit, move on to the next E, and forget prevH
            e++;
        }
        // If the next expected group is either a different type, or too small, fast forward to one that fits
        while (e < expect.length && (expect[e].tag != h.tag || expect[e].len < h.len)) {
            exact = false;
            e++;
        }
        if (e >= expect.length) {
            return 1; // We're past the end, while still having cells that don't fit
        }
        if (h.len == curE.len) {
            e++;
            prevH = nonLinearTag;
        }
        else {
            exact = false;
            prevH = h;
        }
        curE = expect[e];
    }
    // return 0 for exact match
    // return -1 for incomplete match - groups thus far do not exceed expected
    return (exact && e == expect.length) ? 0 : -1;
}
//# sourceMappingURL=kit.js.map