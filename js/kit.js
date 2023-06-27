"use strict";
/*-----------------------------------------------------------
 * _classUtil.ts
 *-----------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickFreeMove = exports.quickMove = exports.preprocessDragFunctions = exports.positionFromStyle = exports.textSetup = exports.onWordChange = exports.onLetterChange = exports.updateWordExtraction = exports.onWordKey = exports.afterInputUpdate = exports.onLetterKey = exports.onLetterKeyDown = exports.indexAllVertices = exports.indexAllHighlightableFields = exports.indexAllDrawableFields = exports.indexAllDragDropFields = exports.indexAllCheckFields = exports.indexAllNoteFields = exports.indexAllInputFields = exports.mapGlobalIndeces = exports.getGlobalIndex = exports.saveHighlightLocally = exports.saveDrawingLocally = exports.savePositionLocally = exports.saveContainerLocally = exports.saveCheckLocally = exports.saveNoteLocally = exports.saveWordLocally = exports.saveLetterLocally = exports.checkLocalStorage = exports.toggleDecoder = exports.setupDecoderToggle = exports.toggleHighlight = exports.setupHighlights = exports.setupCrossOffs = exports.toggleNotes = exports.setupNotes = exports.moveFocus = exports.getOptionalStyle = exports.findFirstChildOfClass = exports.findParentOfTag = exports.findParentOfClass = exports.findEndInContainer = exports.findInNextContainer = exports.childAtIndex = exports.indexInContainer = exports.findNextOfClass = exports.applyAllClasses = exports.hasClass = exports.toggleClass = void 0;
exports.getSafariDetails = exports.isIFrame = exports.isBodyDebug = exports.isDebug = exports.preprocessRulerFunctions = exports.distance2 = exports.distance2Mouse = exports.positionFromCenter = exports.doDraw = exports.preprocessDrawObjects = void 0;
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
    index = setupNotesCells('notes-left', 'note-left', index);
    // Puzzles can use the generic 'notes' class if they have their own .note-input style
    index = setupNotesCells('notes', undefined, index);
    index = setupNotesCells('notes-abs', undefined, index);
    setupNotesToggle(margins);
    indexAllNoteFields();
    if (isBodyDebug()) {
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
}
/**
 * Notes can be toggled on or off, and when on, can also be lit up to make them easier to see.
 */
var NoteState = {
    Disabled: 0,
    Visible: 1,
    Subdued: 2,
    MAX: 3,
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
    return hasClass(body, 'enable-notes')
        ? NoteState.Subdued : NoteState.Disabled;
}
/**
 * Update the body tag to be the desired visibility state
 * @param state A NoteState enum value
 */
function setNoteState(state) {
    var body = document.getElementsByTagName('body')[0];
    toggleClass(body, 'show-notes', state == NoteState.Visible);
    toggleClass(body, 'enable-notes', state == NoteState.Subdued);
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
    if (state == NoteState.Disabled) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Subdued) {
        toggle.innerText = 'Disable Notes';
    }
    else { // NoteState.Visible
        toggle.innerText = 'Dim Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}
/**
 * Rotate to the next note visibility state.
 */
function toggleNotes() {
    var state = getNoteState();
    setNoteState((state + 1) % NoteState.MAX);
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
        check.innerHTML = '&#x2714;&#xFE0F;'; // ✔️;
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
    obj = findParentOfClass(obj, 'cross-off');
    if (obj != null) {
        var newVal = !hasClass(obj, 'crossed-off');
        toggleClass(obj, 'crossed-off', newVal);
        saveCheckLocally(obj, newVal);
    }
}
function setupHighlights() {
    indexAllHighlightableFields();
    var highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function () { toggleHighlight(); };
    }
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
var localCache = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, drawings: {}, highlights: {}, time: null };
////////////////////////////////////////////////////////////////////////
// User interface
//
var checkStorage = null;
/**
 * If storage exists from a previous visit to this puzzle, offer to reload.
 */
function checkLocalStorage() {
    // Each puzzle is cached within localStorage by its URL
    if (window.location.href in localStorage) {
        var item = localStorage.getItem(window.location.href);
        if (item != null) {
            checkStorage = JSON.parse(item);
            var empty = true; // It's possible to cache all blanks, which are uninteresting
            for (var key in checkStorage) {
                if (checkStorage[key] != null && checkStorage[key] != '') {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                createReloadUI(checkStorage.time);
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
    localStorage.removeItem(window.location.href);
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
        localStorage.setItem(window.location.href, JSON.stringify(localCache));
    }
}
/**
 * Update the saved letters object
 * @param element an letter-input element
 */
function saveLetterLocally(input) {
    if (input) {
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
    if (input) {
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
function saveDrawingLocally(element) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            var drawn = findFirstChildOfClass(element, 'drawnObject');
            if (drawn) {
                localCache.drawings[index] = drawn.getAttributeNS('', 'data-template-id');
            }
            else {
                delete localCache.drawings[index];
            }
            saveCache();
        }
    }
}
exports.saveDrawingLocally = saveDrawingLocally;
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
////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//
/**
 * Assign indeces to all of the elements in a group
 * @param elements A list of elements
 * @param suffix A variant name of the index (optional)
 */
function applyGlobalIndeces(elements, suffix) {
    var attr = 'data-globalIndex';
    if (suffix != undefined) {
        attr += '-' + suffix;
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
    var inputs = document.getElementsByClassName('cross-off');
    applyGlobalIndeces(inputs);
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
 * Assign globalIndeces to every drawable element
 */
function indexAllDrawableFields() {
    var inputs = document.getElementsByClassName('drawable');
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
    restoreDrawings(storage.drawings);
    restoreHighlights(storage.highlights);
    reloading = false;
}
/**
 * Restore any saved letter input values
 * @param values A dictionary of index=>string
 */
function restoreLetters(values) {
    localCache.letters = values;
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            afterInputUpdate(input);
        }
    }
}
/**
 * Restore any saved word input values
 * @param values A dictionary of index=>string
 */
function restoreWords(values) {
    localCache.words = values;
    var inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = values[i];
        if (value != undefined) {
            input.value = value;
            var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
            if (extractId != null) {
                updateWordExtraction(extractId);
            }
        }
    }
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
    // Each time an element is moved, the movers structure recalcs. So pre-fetch.
    var moved = [];
    for (var key in containers) {
        moved.push(movers[key]);
    }
    for (var i = 0; i < moved.length; i++) {
        var mover = moved[i];
        // Movers can move, and thus get re-ordered. Don't trust i to be the index.
        var index = getGlobalIndex(mover);
        var j = containers[index];
        if (j != undefined) {
            quickMove(mover, targets[j]);
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
function restoreDrawings(drawings) {
    localCache.drawings = drawings;
    var targets = document.getElementsByClassName('drawable');
    for (var i = 0; i < targets.length; i++) {
        var tool = drawings[i];
        if (tool != undefined) {
            doDraw(targets[i], tool);
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
// Convert the absolute href of the current window to a relative href
// levels: 1=just this file, 2=parent folder + fiole, etc.
function getRelFileHref(levels) {
    var bslash = window.location.href.lastIndexOf('\\');
    var fslash = window.location.href.lastIndexOf('/');
    var delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }
    var parts = window.location.href.split(delim);
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
    var bslash = window.location.href.lastIndexOf('\\');
    var fslash = window.location.href.lastIndexOf('/');
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
    var parts = window.location.href.split(delim);
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
    var skipClass = hasClass(input, 'word-input') ? 'word-non-input' : 'letter-non-input';
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
            afterInputUpdate(input);
            event.preventDefault();
            return;
        }
        if (event.key.length == 1) {
            if (event.key == '`') {
                toggleHighlight(input);
            }
            if (!event.ctrlKey && !event.altKey && event.key.match(/[a-z0-9]/i)) {
                input.value = event.key;
                afterInputUpdate(input);
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
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', 0));
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
        // Don't move focus if nothing was typed
        return;
    }
    if (input.value.length === 1 && !input.value.match(/[a-z0-9]/i)) {
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
    afterInputUpdate(input);
}
exports.onLetterKey = onLetterKey;
/**
 * Re-scan for extractions
 * @param input The input which just changed
 */
function afterInputUpdate(input) {
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
    if (!multiLetter && text.length > 1) {
        overflow = text.substring(1);
        text = text.substring(0, 1);
    }
    input.value = text;
    ExtractFromInput(input);
    if (!multiLetter) {
        if (nextInput != null) {
            if (overflow.length > 0 && nextInput.value.length == 0) {
                // Insert our overflow into the next cell
                nextInput.value = overflow;
                moveFocus(nextInput);
                // Then do the same post-processing as this cell
                afterInputUpdate(nextInput);
            }
            else if (text.length > 0) {
                // Just move the focus
                moveFocus(nextInput);
            }
        }
    }
    else {
        var spacing = (text.length - 1) * 0.05;
        input.style.letterSpacing = -spacing + 'em';
        input.style.paddingRight = (2 * spacing) + 'em';
        //var rotate = text.length <= 2 ? 0 : (text.length * 5);
        //input.style.transform = 'rotate(' + rotate + 'deg)';
    }
    saveLetterLocally(input);
}
exports.afterInputUpdate = afterInputUpdate;
/**
 * Extract contents of an extract-flagged input
 * @param input an input field
 */
function ExtractFromInput(input) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    if (hasClass(input.parentNode, 'extract')) {
        UpdateExtraction(extractedId);
    }
    else if (hasClass(input.parentNode, 'extractor')) { // can also be numbered
        UpdateExtractionSource(input);
    }
    else if (hasClass(input.parentNode, 'numbered')) {
        UpdateNumbered(extractedId);
    }
}
/**
 * Update an extraction destination
 * @param extractedId The id of an element that collects extractions
 */
function UpdateExtraction(extractedId) {
    var extracted = document.getElementById(extractedId === null ? 'extracted' : extractedId);
    if (extracted == null) {
        return;
    }
    if (extracted.getAttribute('data-number-pattern') != null || extracted.getAttribute('data-letter-pattern') != null) {
        UpdateNumbered(extractedId);
        return;
    }
    var inputs = document.getElementsByClassName('extract-input');
    var extraction = '';
    for (var i = 0; i < inputs.length; i++) {
        if (extractedId != null && getOptionalStyle(inputs[i], 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        var inp = inputs[i];
        var letter = inp.value || '';
        letter = letter.trim();
        if (letter.length == 0) {
            extraction += '_';
        }
        else {
            extraction += letter;
        }
    }
    ApplyExtraction(extraction, extracted);
}
/**
 * Check whether a collection of extracted text is more than blanks and underlines
 * @param text Generated extraction, which may still contain underlines for missing parts
 * @returns true if text contains anything other than spaces and underlines
 */
function ExtractionIsInteresting(text) {
    return text.length > 0 && text.match(/[^_]/) != null;
}
/**
 * Update an extraction area with new text
 * @param text The current extraction
 * @param dest The container for the extraction. Can be a div or an input
 */
function ApplyExtraction(text, dest) {
    if (hasClass(dest, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (hasClass(dest, 'all-caps')) {
        text = text.toLocaleUpperCase();
    }
    var destInp = dest;
    var current = (destInp === null) ? dest.innerText : destInp.value;
    if (!ExtractionIsInteresting(text) && !ExtractionIsInteresting(current)) {
        return;
    }
    if (!ExtractionIsInteresting(text) && ExtractionIsInteresting(current)) {
        text = '';
    }
    if (dest.tagName != 'INPUT') {
        dest.innerText = text;
    }
    else {
        destInp.value = text;
    }
}
/**
 * Update an extraction that uses numbered indicators
 * @param extractedId The id of an extraction area
 */
function UpdateNumbered(extractedId) {
    var inputs = document.getElementsByClassName('extract-input');
    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        var index = inputs[i].getAttribute('data-number');
        var extractCell = document.getElementById('extractor-' + index);
        var letter = inp.value || '';
        letter = letter.trim();
        if (letter.length > 0 || extractCell.value.length > 0) {
            extractCell.value = letter;
        }
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
    for (var i = 0; i < sources.length; i++) {
        var src = sources[i];
        var dataNumber = getOptionalStyle(src, 'data-number');
        if (dataNumber != null && dataNumber == index) {
            src.value = input.value;
            return;
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
    var extracted = document.getElementById(extractedId === null ? 'extracted' : extractedId);
    if (extracted == null) {
        return;
    }
    var inputs = document.getElementsByClassName('word-input');
    var extraction = '';
    var partial = false;
    for (var i = 0; i < inputs.length; i++) {
        if (extractedId != null && getOptionalStyle(inputs[i], 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        var index = getOptionalStyle(inputs[i], 'data-extract-index', '');
        var indeces = index.split(' ');
        for (var j = 0; j < indeces.length; j++) {
            var extractIndex = parseInt(indeces[j]);
            if (extractIndex > 0) { // indeces start at 1
                var inp = inputs[i];
                var letter = inp.value.length >= extractIndex ? inp.value[extractIndex - 1] : '_';
                extraction += letter;
                partial = partial || (letter != '_');
            }
        }
    }
    ApplyExtraction(extraction, extracted);
}
exports.updateWordExtraction = updateWordExtraction;
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
    saveWordLocally(input);
}
exports.onWordChange = onWordChange;
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
    var find = null;
    if (root2d != null) {
        find = findNext2dInput(root2d, start, dx, dy, cls, clsSkip);
        if (find != null) {
            return find;
        }
    }
    var discoverRoot = findParentOfClass(start, 'letter-grid-discover');
    if (discoverRoot != null) {
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
    return findNextOfClassGroup(start, cls, clsSkip, 'text-input-group', back ? -1 : 1);
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
            if (dest != null && !hasClass(dest, 'letter-non-input')) {
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
        var d = 0, d2 = 0;
        if (dx != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.y + rect.height / 2 - pos.y) / dx;
            d2 = rect.x / dx;
        }
        else if (dy != 0) {
            // Look for inputs in the next row, using dx as a dy
            d = (rect.x + rect.width / 2 - pos.x) / dy;
            d2 = rect.y / dy;
        }
        if (d > 0 && (nearest == null || d < distance || (d == distance && d2 < distance2))) {
            distance = d;
            distance2 = d2;
            nearest = elmt;
        }
    }
    return nearest != null ? nearest : wrap;
}
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
 *   NOTE: the -style and -image fields can be placed on the affected pattern tag, or on any parent below the <BODY>.
 */
function setupLetterPatterns() {
    var patterns = document.getElementsByClassName('create-from-pattern');
    for (var i = 0; i < patterns.length; i++) {
        var parent = patterns[i];
        var pattern = parseNumberPattern(parent, 'data-letter-pattern');
        var extractPattern = parsePattern(parent, 'data-extract-indeces');
        var numberedPattern = parsePattern2(parent, 'data-number-assignments');
        var vertical = hasClass(parent, 'vertical');
        var numeric = hasClass(parent, 'numeric');
        var styles = getLetterStyles(parent, 'underline', '', numberedPattern == null ? 'box' : 'numbered');
        if (pattern != null) { //if (parent.classList.contains('letter-cell-block')) {
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
            inp.setAttribute('disabled', '');
            toggleClass(inp, 'letter-non-input');
            inp.setAttribute('data-literal', cell.innerText == '\xa0' ? ' ' : cell.innerText);
            var span = document.createElement('span');
            toggleClass(span, 'letter-literal');
            span.innerText = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(span);
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
    if (numPattern === null) {
        numbered = false;
        numPattern = parseNumberPattern(extracted, 'data-letter-pattern');
    }
    if (numPattern != null) {
        var nextNumber = 1;
        for (var pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count'] !== null) {
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
        var height = elem.getBoundingClientRect().height;
        var zUp = hasClass(elems[i], 'z-grow-up');
        var zDown = hasClass(elems[i], 'z-grow-down');
        if (zUp || zDown) {
            var children = elems[i].getElementsByClassName('moveable');
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                var z = parseInt(child.style.top);
                z = zUp ? 1000 + (height - z) : z;
                child.style.zIndex = String(z);
            }
        }
    }
}
exports.preprocessDragFunctions = preprocessDragFunctions;
/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessMoveable(elem) {
    elem.onmousedown = function (e) { onClickDrag(e); };
    elem.ondrag = function (e) { onDrag(e); };
    elem.ondragend = function (e) { onDragDrop(e); };
}
/**
 * Hook up the necessary mouse events to each drop target
 * @param elem a moveable element
 */
function preprocessDropTarget(elem) {
    elem.onmouseup = function (e) { onClickDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
}
/**
 * Hook up the necessary mouse events to each free drop target
 * @param elem a moveable element
 */
function preprocessFreeDrop(elem) {
    elem.onmousedown = function (e) { doFreeDrop(e); };
    elem.ondragenter = function (e) { onDropAllowed(e); };
    elem.ondragover = function (e) { onDropAllowed(e); };
}
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
 * @param y The y-offset of that element
 */
function updateZ(elem, y) {
    var dest = findParentOfClass(elem, 'free-drop');
    if (hasClass(dest, 'z-grow-down')) {
        elem.style.zIndex = String(1000 + y);
    }
    else if (hasClass(dest, 'z-grow-up')) {
        var rect = dest.getBoundingClientRect();
        elem.style.zIndex = String(rect.height + 1000 - y);
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
    if (moveable != null && destination != null) {
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
 * _drawTools.ts
 *-----------------------------------------------------------*/
// VOCABULARY
// drawable: any object which can be clicked on to draw an icon
// drawPalette: the toolbar from which a user can see and select the draw tools
// drawTool: a UI control to make one or another draw mode the default
// selected: when a drawTool is primary, and will draw when clicking in an active area
// drawToolTemplates: a hidden container of objects that are cloned when drawn
// drawnObject: templates for cloning when drawn
/**
 * The tools in the palette.
 */
var _drawTools = [];
/**
 * The currently selected tool from the palette.
 */
var _selectedTool = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
var _extractorTool = null;
/**
 * The tool name that would erase things.
 */
var _eraseTool = null;
/**
 * Scan the page for anything marked drawable or a draw tool
 */
function preprocessDrawObjects() {
    var elems = document.getElementsByClassName('drawable');
    for (var i = 0; i < elems.length; i++) {
        var elmt = elems[i];
        elmt.onmousedown = function (e) { onClickDraw(e); };
        //elmt.ondrag=function(e){onMoveDraw(e)};
        elmt.onmouseenter = function (e) { onMoveDraw(e); };
        elmt.onmouseleave = function (e) { preMoveDraw(e); };
    }
    elems = document.getElementsByClassName('drawTool');
    for (var i = 0; i < elems.length; i++) {
        var elmt = elems[i];
        _drawTools.push(elmt);
        elmt.onclick = function (e) { onSelectDrawTool(e); };
    }
    var palette = document.getElementById('drawPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
    }
}
exports.preprocessDrawObjects = preprocessDrawObjects;
/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectDrawTool(event) {
    var tool = findParentOfClass(event.target, 'drawTool');
    if (tool != null) {
        for (var i = 0; i < _drawTools.length; i++) {
            toggleClass(_drawTools[i], 'selected', false);
        }
        if (tool != _selectedTool) {
            toggleClass(tool, 'selected', true);
            _selectedTool = tool;
        }
        else {
            _selectedTool = null;
        }
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
function getDrawTool(event, toolFromErase) {
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (var i = 0; i < _drawTools.length; i++) {
            var mods = _drawTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                && event.shiftKey == (mods.indexOf('shift') >= 0)
                && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _drawTools[i].getAttributeNS('', 'data-template-id');
            }
        }
    }
    if (toolFromErase != null) {
        return toolFromErase;
    }
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }
    return _drawTools[0].getAttributeNS('', 'data-template-id');
}
/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a drawable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseDraw(target) {
    if (target == null) {
        return null;
    }
    var cur = findFirstChildOfClass(target, 'drawnObject');
    if (cur != null) {
        var curTool = cur.getAttributeNS('', 'data-template-id');
        toggleClass(target, curTool, false);
        target.removeChild(cur);
        if (_extractorTool != null) {
            updateDrawExtraction();
        }
        if (_selectedTool == null) {
            return cur.getAttributeNS('', 'data-next-template-id'); // rotate
        }
        if (_selectedTool.getAttributeNS('', 'data-template-id') == curTool) {
            return _eraseTool; // erase
        }
    }
    return null; // normal
}
/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The name of a tool template
 */
function doDraw(target, tool) {
    // Template can be null if tool removes drawn objects
    var template = document.getElementById(tool);
    if (template != null) {
        var clone = template.content.cloneNode(true);
        target.appendChild(clone);
        toggleClass(target, tool, true);
    }
    if (_extractorTool != null) {
        updateDrawExtraction();
    }
    saveDrawingLocally(target);
}
exports.doDraw = doDraw;
var _dragDrawTool = null;
var _lastDrawTool = null;
/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickDraw(event) {
    var target = findParentOfClass(event.target, 'drawable');
    var nextTool = eraseDraw(target);
    nextTool = getDrawTool(event, nextTool);
    if (nextTool) {
        doDraw(target, nextTool);
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}
/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveDraw(event) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        var target = findParentOfClass(event.target, 'drawable');
        eraseDraw(target);
        doDraw(target, _dragDrawTool);
        _dragDrawTool = null;
    }
}
/**
 * When dragging a drawing around, copy each cell's drawing to the next one.
 * As the mouse leaves one surface, note which tool is used there.
 * If dragging unrelated to drawing, flag the coming onMoveDraw to do nothing.
 * @param event The mouse leave event
 */
function preMoveDraw(event) {
    if (event.buttons == 1) {
        var target = findParentOfClass(event.target, 'drawable');
        if (target != null) {
            var cur = findFirstChildOfClass(target, 'drawnObject');
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
function updateDrawExtraction() {
    var extracted = document.getElementById('extracted');
    if (extracted != null) {
        var drawnObjects = document.getElementsByClassName('drawnObject');
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
// straigh-edge-area: the potential drag range
// ruler-path: a drawn line connecting one or more vertices.
// 
// Ruler ranges can have styles and rules.
// Styles shape the straight edge, which can also be an outline
// Rules dictate drop restrictions and the snap range
/**
 * Scan the page for anything marked vertex or straigh-edge-area
 * Those items get click handlers
 */
function preprocessRulerFunctions() {
    var elems = document.getElementsByClassName('straigh-edge-area');
    for (var i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i]);
    }
    indexAllVertices();
    // TODO: make lines editable
}
exports.preprocessRulerFunctions = preprocessRulerFunctions;
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
    elem.onmousemove = function (e) { onRulerHover(e); };
    elem.onmousedown = function (e) { onLineStart(e); };
    elem.onmouseup = function (e) { onLineUp(e); };
    elem.ondragenter = function (e) { onRulerAllowed(e); };
    elem.ondragover = function (e) { onRulerAllowed(e); };
}
function getRulerData(evt) {
    var range = findParentOfClass(evt.target, 'straigh-edge-area');
    var svg = findParentOfTag(range, 'SVG');
    var bounds = svg.getBoundingClientRect();
    var maxPoints = range.getAttributeNS('', 'data-max-points');
    var canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    var hoverRange = range.getAttributeNS('', 'data-hover-range');
    var showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    var pos = new DOMPoint(evt.x, evt.y);
    var spt = svg.createSVGPoint();
    spt.x = pos.x - bounds.left;
    spt.y = pos.y - bounds.top;
    var data = {
        svg: svg,
        container: range,
        bounds: bounds,
        maxPoints: maxPoints ? parseInt(maxPoints) : 2,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : (bounds.width + bounds.height),
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() == 'true') : false,
        evtPos: pos,
        evtPoint: spt,
    };
    var near = findNearestVertex(data);
    if (near) {
        data.nearest = getVertexData(data, near);
    }
    return data;
}
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
            _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
            toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
            _straightEdgeVertices.splice(ruler.maxPoints - 1, 1);
        }
        // Hoving near any other index is ignored
        return;
    }
    if (_straightEdgeBuilder) {
        // Extending a straight-edge that we've already started
        if (ruler.nearest || ruler.showOpenDrag) {
            if (_straightEdgeBuilder.points.length >= ruler.maxPoints) {
                if (_straightEdgeVertices.length == _straightEdgeBuilder.points.length) {
                    toggleClass(_straightEdgeVertices[ruler.maxPoints - 1], 'building', false);
                    _straightEdgeVertices.splice(ruler.maxPoints - 1, 1);
                }
                _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
            }
        }
        if (_straightEdgeVertices.length < ruler.maxPoints) {
            if (ruler.nearest) {
                // Extend to new point
                toggleClass(_straightEdgeBuilder, 'open-ended', false);
                snapStraightLineTo(ruler, ruler.nearest);
            }
            else if (ruler.showOpenDrag) {
                toggleClass(_straightEdgeBuilder, 'open-ended', true);
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
 * Mouse down over an vertex
 * @param evt Mouse down event
 */
function onLineStart(evt) {
    var ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }
    if (!ruler.canShareVertices && hasClass(ruler.nearest.vertex, 'has-line')) {
        // User has clicked a point that already has a line
        // Re-select it
        var edge = findStraightEdgeFromVertex(ruler.nearest.index);
        if (edge) {
            deleteStraightEdge(edge);
            // Find the other end of this edge
            var vertices = findStraightEdgeVertices(edge);
            if (vertices.length == 2) {
                if (vertices[0] == ruler.nearest.vertex) {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[1]));
                }
                else {
                    createStraightLineFrom(ruler, getVertexData(ruler, vertices[0]));
                }
                snapStraightLineTo(ruler, ruler.nearest);
                return;
            }
        }
    }
    createStraightLineFrom(ruler, ruler.nearest);
}
function onLineUp(evt) {
    var ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    if (_straightEdgeBuilder) {
        if (_straightEdgeVertices.length < 2) {
            // Incomplete without at least two snapped ends. Abandon
            var range = findParentOfClass(_straightEdgeBuilder, 'straigh-edge-area');
            range.removeChild(_straightEdgeBuilder);
            _straightEdgeBuilder = null;
        }
        else {
            if (_straightEdgeBuilder.points.length > _straightEdgeVertices.length) {
                // Remove open-end
                _straightEdgeBuilder.points.removeItem(ruler.maxPoints - 1);
                toggleClass(_straightEdgeBuilder, 'open-ended', false);
            }
        }
    }
    var indeces = [];
    for (var i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }
    if (_straightEdgeBuilder) {
        toggleClass(_straightEdgeBuilder, 'building', false);
        _straightEdgeBuilder === null || _straightEdgeBuilder === void 0 ? void 0 : _straightEdgeBuilder.setAttributeNS('', 'data-vertices', ',' + indeces.join(',') + ',');
        _straightEdges.push(_straightEdgeBuilder);
    }
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}
function createStraightLineFrom(ruler, start) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);
    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    toggleClass(_straightEdgeBuilder, 'straight-edge', true);
    toggleClass(_straightEdgeBuilder, 'building', true);
    toggleClass(start.vertex, 'building', true);
    _straightEdgeBuilder.points.appendItem(start.centerPoint);
    ruler.container.appendChild(_straightEdgeBuilder);
    toggleClass(_hoverEndpoint, 'hover', false);
    _hoverEndpoint = null;
}
function snapStraightLineTo(ruler, next) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder === null || _straightEdgeBuilder === void 0 ? void 0 : _straightEdgeBuilder.points.appendItem(next.centerPoint);
    toggleClass(next.vertex, 'building', true);
}
function openStraightLineTo(ruler) {
    _straightEdgeBuilder === null || _straightEdgeBuilder === void 0 ? void 0 : _straightEdgeBuilder.points.appendItem(ruler.evtPoint);
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
function deleteStraightEdge(edge) {
    var _a;
    for (var i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }
    (_a = edge.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(edge);
}
function onRulerAllowed(evt) {
}
function findNearestVertex(data) {
    var min = data.hoverRange * data.hoverRange;
    var vertices = data.container.getElementsByClassName('vertex');
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
function findStraightEdgeFromVertex(index) {
    var pat = ',' + String(index) + ',';
    var edges = document.getElementsByClassName('straight-edge');
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
var safariDetails = {
    'title': 'Safari Labs',
    'logo': './Images/PS20 logo.png',
    'icon': './Images/Beaker_icon.png',
    'puzzleList': './indexx.html'
};
/**
 * Return the details of this puzzle event
 */
function getSafariDetails() {
    return safariDetails;
}
exports.getSafariDetails = getSafariDetails;
/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp
 */
function preSetup(bp) {
    debugSetup();
    if (isIFrame()) {
        var bodies = document.getElementsByTagName('BODY');
        bodies[0].classList.add('iframe');
    }
    if (bp.pathToRoot) {
        safariDetails.logo = bp.pathToRoot + '/' + safariDetails.logo;
        safariDetails.icon = bp.pathToRoot + '/' + safariDetails.icon;
        safariDetails.puzzleList = bp.pathToRoot + '/' + safariDetails.puzzleList;
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
 * @param puzzleType the name of the puzzle type
 * @returns A div element, to be appended to the pageWithinMargins
 */
function createTypeIcon(puzzleType) {
    var iconDiv = document.createElement('div');
    iconDiv.id = 'icons';
    var icon = document.createElement('img');
    icon.src = './Icons/' + puzzleType + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' puzzle');
    iconDiv.appendChild(icon);
    return iconDiv;
}
function boilerplate(bp) {
    if (bp === null) {
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
    var html = document.getElementsByTagName('HTML')[0];
    var head = document.getElementsByTagName('HEAD')[0];
    var body = document.getElementsByTagName('BODY')[0];
    var pageBody = document.getElementById('pageBody');
    document.title = bp['title'];
    html.lang = bp['lang'] || 'en-us';
    var viewport = document.createElement('META');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    head.appendChild(viewport);
    linkCss(head, 'Css/PageSizes.css');
    toggleClass(body, bp['paperSize'] || 'letter');
    toggleClass(body, bp['orientation'] || 'portrait');
    var page = createSimpleDiv({ id: 'page', cls: 'printedPage' });
    var margins = createSimpleDiv({ cls: 'pageWithinMargins' });
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({ cls: 'title', html: bp['title'] }));
    margins.appendChild(createSimpleDiv({ id: 'copyright', html: '&copy; ' + bp['copyright'] + ' ' + bp['author'] }));
    if (safariDetails.puzzleList) {
        margins.appendChild(createSimpleA({ id: 'backlink', href: safariDetails.puzzleList, friendly: 'Puzzle list' }));
    }
    // Set tab icon for safari event
    var tabIcon = document.createElement('link');
    tabIcon.rel = 'shortcut icon';
    tabIcon.type = 'image/png';
    tabIcon.href = safariDetails.icon;
    head.appendChild(tabIcon);
    if (bp['type']) {
        margins.appendChild(createTypeIcon(bp['type']));
    }
    if (bp['textInput']) {
        textSetup();
    }
    setupAbilities(head, margins, bp['abilities'] || {});
    setTimeout(checkLocalStorage, 100);
}
/**
 * Append a CSS link to the header
 * @param head the head tag
 * @param relPath The contents of the link's href
 */
function linkCss(head, relPath) {
    var link = document.createElement('link');
    link.href = relPath;
    link.rel = "Stylesheet";
    link.type = "text/css";
    head.appendChild(link);
}
/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head, margins, data) {
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
            data.drawing = true;
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
        fancy += '<span id="highlight-ability" title="Ctrl+` to highlight cells" style="text-shadow: 0 0 3px black;">💡</span>';
        setupHighlights();
        count++;
    }
    if (data.dragDrop) {
        fancy += '<span id="drag-ability" title="Drag & drop enabled" style="text-shadow: 0 0 3px black;">👈</span>';
        preprocessDragFunctions();
        indexAllDragDropFields();
        linkCss(head, 'Css/DragDrop.css');
        count++;
    }
    if (data.drawing) {
        preprocessDrawObjects();
        indexAllDrawableFields();
        linkCss(head, 'Css/DrawTools.css');
        // No ability icon
    }
    if (data.straightEdge) {
        fancy += '<span id="drag-ability" title="Drag & drop enabled" style="text-shadow: 0 0 3px black;">📐</span>';
        preprocessRulerFunctions();
        linkCss(head, 'Css/StraightEdge.css');
        //indexAllVertices();
        // No ability icon
    }
    if (data.notes) {
        setupNotes(margins);
        // no ability icon
    }
    if (data.decoder) {
        setupDecoderToggle(margins, data.decoderMode);
    }
    ability.innerHTML = fancy;
    if (count == 2) {
        ability.style.right = '0.1in';
    }
}
window.onload = function () { boilerplate(boiler); };
//# sourceMappingURL=kit.js.map