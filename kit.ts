

/*-----------------------------------------------------------
 * _classUtil.ts
 *-----------------------------------------------------------*/

/**
 * Add or remove a class from a classlist, based on a boolean test.
 * @param obj - A page element, or id of an element
 * @param cls - A class name to toggle (unless null)
 * @param bool - If omitted, cls is toggled in the classList; if true, cls is added; if false, cls is removed
 */
export function toggleClass(obj: Node|string|null|undefined, 
                            cls: string|null, 
                            bool?: boolean) {
    if (obj === null || obj === undefined || cls === null || cls === undefined) {
        return;
    }
    let elmt: Element;
    if ('string' === typeof obj) {
        elmt = document.getElementById(obj as string) as Element;
    }
    else {
        elmt = obj as Element;
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

/**
 * Check if an HTML element is tagged with a given CSS class
 * @param obj - A page element, or id of an element
 * @param cls - A class name to test
 * @returns true iff the class is in the classList
 */
export function hasClass( obj: Node|string|null, 
                          cls: string|undefined) 
                          : boolean {
    if (obj === null || obj === undefined || cls === undefined) {
        return false;
    }
    let elmt: Element;
    if ('string' === typeof obj) {
        elmt = document.getElementById(obj as string) as Element;
    }
    else {
        elmt = obj as Element;
    }
    return elmt !== null 
        && elmt.classList !== null
        && elmt.classList.contains(cls);
}

/**
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
export function applyAllClasses(obj: Node|string, 
                                classes:string) {
    var list = classes.split(' ');
    for (let cls of list) {
        toggleClass(obj, cls, true);
    }
}

/**
 * Given one element, find the next one in the document that matches the desired class
 * @param current - An existing element
 * @param matchClass - A class that this element has
 * @param skipClass - [optional] A class of siblings to be skipped
 * @param dir - 1 (default) finds the next sibling, else -1 finds the previous
 * @returns A sibling element, or null if none is found
 */
export function findNextOfClass(current: Element, 
                                matchClass: string, 
                                skipClass?: string, 
                                dir: number = 1)
                                : Element|null {
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

/**
 * Find the index of the current element among the siblings under its parent
 * @param current - An existing element
 * @param parentObj - A parent element (or the class of a parent)
 * @param sibClass - A class name shared by current and siblings
 * @returns - The index, or -1 if current is not found in the specified parent
 */
export function indexInContainer( current: Element, 
                                  parentObj: Element|string, 
                                  sibClass: string) {
    let parent: Element;
    if (typeof(parentObj) == 'string') {
        parent = findParentOfClass(current, parentObj as string) as Element;
    }
    else {
        parent = parentObj as Element;
    }
    var sibs = parent.getElementsByClassName(sibClass);
    for (var i = 0; i < sibs.length; i++) {
        if (sibs[i] === current) {
            return i;
        }
    }
    return -1;
}

/**
 * Get the index'ed child element within this parent
 * @param parent - An existing element
 * @param childClass - A class of children under parent
 * @param index - The index of the desired child. A negative value counts back from the end
 * @returns The child element, or null if no children
 */
export function childAtIndex( parent: Element, 
                              childClass: string, 
                              index: number)
                              : Element|null {
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

/**
 * Given an input in one container, find an input in the next container
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
*/
export function findInNextContainer(current: Element, 
                                    matchClass: string, 
                                    skipClass: string|undefined, 
                                    containerClass: string, 
                                    dir: number = 1)
                                    : Element|null {
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

/**
 * Find either the first or last sibling element under a parent
* @param current - the reference element
* @param matchClass - the class we're looking for
* @param skipClass - a class we're avoiding
* @param containerClass - the parent level to go up to, before coming back down
* @param dir - 1 (default) to go forward, -1 to go back
* @returns The first or last sibling element, or null if no matches
 */
export function findEndInContainer( current: Element, 
                                    matchClass: string, 
                                    skipClass: string|undefined, 
                                    containerClass: string, 
                                    dir: number = 1) {
    var container = findParentOfClass(current, containerClass);
    if (container == null) {
        return null;
    }
    return findFirstChildOfClass(container, matchClass, skipClass, dir);
}

/**
 * Find the nearest containing node that contains the desired class.
 * @param elmt - An existing element
 * @param parentClass - A class name of a parent element
 * @returns The nearest matching parent element, up to but not including the body
 */
export function findParentOfClass(elmt: Element, 
                                  parentClass: string)
                                  : Element|null {
    if (parentClass == null || parentClass == undefined) {
        return null;
    }
    while (elmt !== null && elmt.tagName !== 'BODY') {
        const name = elmt.tagName;
        if (name == 'BODY') {
            break;
        }
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        elmt = elmt.parentNode as Element;
    }
    return null;
}

/**
 * Find the nearest containing node of the specified tag type.
 * @param elmt - An existing element
 * @param parentTag - A tag name of a parent element
 * @returns The nearest matching parent element, up to and including the body
 */
export function findParentOfTag(elmt: Element, parentTag: string)
                                : Element|null {
    if (parentTag == null || parentTag == undefined) {
        return null;
    }
    parentTag = parentTag.toUpperCase();
    while (elmt !== null) {
        const name = elmt.tagName.toUpperCase();
        if (name === parentTag) {
            return elmt;
        }
        if (name === 'BODY') {
            break;
        }
        elmt = elmt.parentNode as Element;
    }
    return null;
}

/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param elmt - A parent element
 * @param childClass - A class name of the desired child
 * @param skipClass - [optional] A class name to avoid
 * @param dir - If positive (default), search forward; else search backward
 * @returns A child element, if a match is found, else null
 */
export function findFirstChildOfClass(  elmt: Element, 
                                        childClass: string, 
                                        skipClass: string|undefined = undefined,
                                        dir: number = 1)
                                        : Element|null {
    var children = elmt.getElementsByClassName(childClass);
    for (var i = dir == 1 ? 0 : children.length - 1; i >= 0 && i < children.length; i += dir) {
        if (skipClass !== null && hasClass(children[i], skipClass)) {
            continue;
        }
        return children[i];
    }
    return null;
}

/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, BODY)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @param defaultStyle - (optional) The default value, if no tag is found with the attribute. Null if omitted.
 * @param prefix - (optional) - A prefix to apply to the answer
 * @returns The found or default style, optional with prefix added
 */
export function getOptionalStyle(   elmt: Element, 
                                    attrName: string, 
                                    defaultStyle?: string, 
                                    prefix?: string)
                                    : string|null {
    var val = elmt.getAttribute(attrName);
    while (val === null) {
        elmt = elmt.parentNode as Element;
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

/**
 * Move focus to the given input (if not null), and select the entire contents.
 * If input is of type number, do nothing.
 * @param input - A text input element
 * @param caret - The character index where the caret should go
 * @returns true if the input element and caret position are valid, else false
 */
export function moveFocus(input: HTMLInputElement, 
                          caret?: number)
                          : boolean {
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
let initGuessFunctionality: any;

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
export function setupNotes(margins:HTMLDivElement) {
    let index = 0;
    index = setupNotesCells('notes-above', 'note-above', index);
    index = setupNotesCells('notes-below', 'note-below', index);
    index = setupNotesCells('notes-right', 'note-right', index);
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

/**
 * Find all objects tagged as needing notes, then create a note cell adjacent.
 * @param findClass The class of the puzzle element that wants notes
 * @param tagInput The class of note to create
 * @param index The inde of the first note
 * @returns The index after the last note
 */
function setupNotesCells(findClass:string, tagInput:string|undefined, index:number) {
    var cells = document.getElementsByClassName(findClass);
    for (var i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // Place a small text input field in each cell
        let inp = document.createElement('input');
        inp.type = 'text';
        inp.classList.add('note-input');
        if (tagInput != undefined) {
            inp.classList.add(tagInput);
        }
        inp.onkeyup=function(e){onNoteArrowKey(e)};
        inp.onchange=function(e){onNoteChange(e)};
        cell.appendChild(inp);
    }
    return index;
}

/**
 * Custom nabigation key controls from within notes
 * @param event The key event
 */
function onNoteArrowKey(event:KeyboardEvent) {
    if (event.isComposing || event.currentTarget == null) {
        return;  // Don't interfere with IMEs
    }

    const input = event.currentTarget as Element;
    let code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'ArrowUp' || code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'note-input', undefined, -1) as HTMLInputElement);
        return;
    }
    else if (code == 'Enter' || code == 'ArrowDown' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'note-input') as HTMLInputElement);
        return;
    }
}

/**
 * Each time a note is modified, save
 * @param event The change event
 */
function onNoteChange(event:Event) {
    if (event.target == null || (event.type == 'KeyboardEvent' && (event as KeyboardEvent).isComposing)) {
        return;  // Don't interfere with IMEs
    }

    const input = event.currentTarget as Element;
    const note =  findParentOfClass(input, 'note-input') as HTMLInputElement;
    saveNoteLocally(note);
}

/**
 * Notes can be toggled on or off, and when on, can also be lit up to make them easier to see.
 */
var NoteState = {
    Disabled: 0,
    Visible: 1,
    Subdued: 2,  // Enabled but not highlighted
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
function setNoteState(state:number) {
    var body = document.getElementsByTagName('body')[0];
    toggleClass(body, 'show-notes', state == NoteState.Visible);
    toggleClass(body, 'enable-notes', state == NoteState.Subdued);
}

/**
 * There is a Notes link in the bottom corner of the page.
 * Set it up such that clicking rotates through the 3 visibility states.
 * @param margins the parent of the toggle UI
 */
function setupNotesToggle(margins:HTMLDivElement|null) {
    let toggle = document.getElementById('notes-toggle') as HTMLAnchorElement;
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'notes-toggle';
        margins.appendChild(toggle);
    }
    const state = getNoteState();
    if (state == NoteState.Disabled) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Subdued) {
        toggle.innerText = 'Disable Notes';
    }
    else {  // NoteState.Visible
        toggle.innerText = 'Dim Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}

/**
 * Rotate to the next note visibility state.
 */
export function toggleNotes() {
    const state = getNoteState();
    setNoteState((state + 1) % NoteState.MAX);
    setupNotesToggle(null);
}


/**
 * Elements tagged with class = 'cross-off' are for puzzles clues that don't indicate where to use it.
 * Any such elements are clickable. When clicked, a check mark is toggled on and off, allowed players to mark some clues as done.
 */
export function setupCrossOffs() {
    const cells = document.getElementsByClassName('cross-off');
    for (var i = 0; i < cells.length; i++) {
        const cell = cells[i] as HTMLElement;

        // Place a small text input field in each cell
        cell.onclick=function(e){onCrossOff(e)};

        var check = document.createElement('span');
        check.classList.add('check');
        check.innerHTML = '&#x2714;&#xFE0F;' // ✔️;
        cell.appendChild(check);
    }
    indexAllCheckFields();
}

/**
 * Handler for when an object that can be crossed off is clicked
 * @param event The mouse event
 */
function onCrossOff(event:MouseEvent) {
    let obj = event.target as HTMLElement;
    if (obj.tagName == 'A' || hasClass(obj, 'note-input') || hasClass(obj, 'letter-input') || hasClass(obj, 'word-input')) {
        return;  // Clicking on lines, notes, or inputs should not check anything
    }
    obj = findParentOfClass(obj, 'cross-off') as HTMLElement;
    if (obj != null) {
        const newVal = !hasClass(obj, 'crossed-off');
        toggleClass(obj, 'crossed-off', newVal);
        saveCheckLocally(obj, newVal);
    }
}

export function setupHighlights() {
    const highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function() {toggleHighlight()};
    }

    const containers = document.getElementsByClassName('highlight-container');
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLElement;
        const rules = getOptionalStyle(container, 'data-highlight-rules');
        if (rules) {
            const list = rules.split(' ');
            for (let r = 0; r < list.length; r++) {
                const rule = list[r];
                if (rule[0] == '.') {
                    const children = container.getElementsByClassName(rule.substring(1));
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'can-highlight', true);
                    }
                }
                else if (rule[0] == '#') {
                    const child = document.getElementById(rule.substring(1));
                    toggleClass(child, 'can-highlight', true);
                }
                else {
                    const children = container.getElementsByTagName(rule.toLowerCase());
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'can-highlight', true);
                    }
                }
            }
        }
    }

    const cans = document.getElementsByClassName('can-highlight');
    for (let i = 0; i < cans.length; i++) {
        const can = cans[i] as HTMLElement;
        can.onclick = function(e) { onClickHighlight(e);};
    }

    // Index will now include all children from above expansion rules
    indexAllHighlightableFields();
}

/**
 * If an element can be highlighted, toggle that highlight on or off
 * @param elmt The element to highlight
 */
export function toggleHighlight(elmt?:HTMLElement) {
    if (elmt == undefined) {
        elmt = document.activeElement as HTMLElement;  // will be body if no inputs have focus
    }
    const highlight = findParentOfClass(elmt, 'can-highlight') as HTMLElement;
    if (highlight) {
        toggleClass(highlight, 'highlighted');
        saveHighlightLocally(highlight);
    }
}

/**
 * Clicking on highlightable elements can toggle their highlighting.
 * If they are not input elements, a simple click works.
 * If they are inputs, user must ctrl+click.
 * @param evt The mouse event from the click
 */
function onClickHighlight(evt:MouseEvent) {
    const elem = document.elementFromPoint(evt.clientX, evt.clientY) as HTMLElement;
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
    const frame = document.getElementById('decoder-frame');
    if (frame != null) {
        const style = window.getComputedStyle(frame);
        return style.display != 'none';
    }
    return null;
}

/**
 * Update the iframe tag to be the desired visibility state.
 * Also ensure that it points at the correct URL
 * @param state true to show, false to hide
 */
function setDecoderState(state: boolean) {
    const frame = document.getElementById('decoder-frame') as HTMLIFrameElement;
    if (frame != null) {
        let src = 'https://www.decrypt.fun/index.html';
        const mode = frame.getAttributeNS('', 'data-decoder-mode');
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
export function setupDecoderToggle(margins:HTMLDivElement|null, mode?:string) {
    let iframe = document.getElementById('decoder-frame') as HTMLIFrameElement;
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = 'decoder-frame';
        if (mode != undefined) {
            iframe.setAttributeNS(null, 'data-decoder-mode', mode);
        }
        document.getElementsByTagName('body')[0]?.appendChild(iframe);
    }

    let toggle = document.getElementById('decoder-toggle') as HTMLAnchorElement;
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'decoder-toggle';
        margins.appendChild(toggle);
    }
    const visible = getDecoderState();
    if (visible) {
        toggle.innerText = 'Hide Decoders';
    }
    else {
        toggle.innerText = 'Show Decoders';
    }
    toggle.href = 'javascript:toggleDecoder()';
}

/**
 * Rotate to the next note visibility state.
 */
export function toggleDecoder() {
    var visible = getDecoderState();
    setDecoderState(!visible);
    setupDecoderToggle(null);
}



/*-----------------------------------------------------------
 * _storage.ts
 *-----------------------------------------------------------*/


////////////////////////////////////////////////////////////////////////
// Types
//

/**
 * Cache structure for of all collections that persist on page refresh
 */

type LocalCacheStruct = {
    letters: object;    // number => string
    words: object;      // number => string
    notes: object;      // number => string
    checks: object;     // number => boolean
    containers: object; // number => number
    positions: object;  // number => Position
    stamps: object;   // number => string
    highlights: object; // number => boolean
    edges: string[]; // strings
    time: Date|null;
}

var localCache:LocalCacheStruct = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, stamps: {}, highlights: {}, edges: [], time: null };

////////////////////////////////////////////////////////////////////////
// User interface
//

let checkStorage:any = null;

/**
 * If storage exists from a previous visit to this puzzle, offer to reload.
 */
export function checkLocalStorage() {
    // Each puzzle is cached within localStorage by its URL
    if (!isIFrame() && !isRestart() && window.location.href in localStorage){
        const item = localStorage.getItem(window.location.href);
        if (item != null) {
            checkStorage = JSON.parse(item);
            let empty = true;  // It's possible to cache all blanks, which are uninteresting
            for (let key in checkStorage) {
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

/**
 * Globals for reload UI elements
 */
let reloadDialog:HTMLDivElement;
let reloadButton:HTMLButtonElement;
let restartButton:HTMLButtonElement;

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
function createReloadUI(time:string) {
    reloadDialog = document.createElement('div');
    reloadDialog.id = 'reloadLocalStorage';
    const img = document.createElement('img');
    img.classList.add('icon');
    img.src = getSafariDetails().icon;
    const title = document.createElement('span');
    title.classList.add('title-font');
    title.innerText = document.title;
    const p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('Would you like to reload your progress on '));
    p1.appendChild(title);
    p1.appendChild(document.createTextNode(' from earlier?'));
    const now = new Date();
    const dateTime = new Date(time);
    const delta = now.getTime() - dateTime.getTime();
    const seconds = Math.ceil(delta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    let ago = 'The last change was ';
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
    reloadButton.onclick = function(){doLocalReload(true)};
    reloadButton.onkeydown = function(e){onkeyReload(e)}
    restartButton = document.createElement('button');
    restartButton.innerText = 'Start over';
    restartButton.onclick = function(){cancelLocalReload(true)};
    restartButton.onkeydown = function(e){onkeyReload(e)};
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
function onkeyReload(e:KeyboardEvent) {
    if (e.code=='Escape'){
        cancelLocalReload(true)
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
function doLocalReload(hide:boolean) {
    if (hide) {
        reloadDialog.style.display = 'none';
    }
    loadLocalStorage(checkStorage);
}

/**
 * User has confirmed they want to start over
 * @param hide true if called from reloadDialog
 */
function cancelLocalReload(hide:boolean) {
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
export function saveLetterLocally(input:HTMLInputElement) {
    if (input) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.letters[index] = input.value;
            saveCache();  
        }  
    }
}

/**
 * Update the saved words object
 * @param element an word-input element
 */
export function saveWordLocally(input:HTMLInputElement) {
    if (input) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.words[index] = input.value;
            saveCache();  
        }  
    }
}

/**
 * Update the saved notes object
 * @param element an note-input element
 */
export function saveNoteLocally(input:HTMLInputElement) {
    if (input) {
        var index = getGlobalIndex(input);
        if (index >= 0) {
            localCache.notes[index] = input.value;
            saveCache();  
        }  
    }
}

/**
 * Update the saved checkmark object
 * @param element an element which might contain a checkmark
 */
export function saveCheckLocally(element:HTMLElement, value:boolean) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            localCache.checks[index] = value;
            saveCache();
        }
    }
}

/**
 * Update the saved containers objects
 * @param element an element which can move between containers
 */
export function saveContainerLocally(element:HTMLElement, container:HTMLElement) {
    if (element && container) {
        var elemIndex = getGlobalIndex(element);
        var destIndex = getGlobalIndex(container);
        if (elemIndex >= 0 && destIndex >= 0) {
            localCache.containers[elemIndex] = destIndex;
            saveCache();
        }
    }
}

/**
 * Update the saved positions object
 * @param element a moveable element which can free-move in its container
 */
export function savePositionLocally(element:HTMLElement) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            var pos = positionFromStyle(element);
            localCache.positions[index] = pos;
            saveCache();
        }
    }
}

/**
 * Update the saved drawings object
 * @param element an element which might contain a drawn object
 */
export function saveStampingLocally(element:HTMLElement) {
    if (element) {
        var index = getGlobalIndex(element);
        if (index >= 0) {
            const parent = getStampParent(element);
            var drawn = findFirstChildOfClass(parent, 'stampedObject');
            if (drawn) {
                localCache.stamps[index] = drawn.getAttributeNS('', 'data-template-id');
            }
            else {
                delete localCache.stamps[index];
            }
            saveCache();
        }
    }
}

/**
 * Update the saved highlights object
 * @param element a highlightable object
 */
export function saveHighlightLocally(element:HTMLElement) {
    if (element) {
        var index = getGlobalIndex(element, 'ch');
        if (index >= 0) {
            localCache.highlights[index] = hasClass(element, 'highlighted');
            saveCache();
        }
    }
}

/**
 * Update the local cache with this vertex list.
 * @param vertexList A list of vertex global indeces
 * @param add If true, this edge is added to the saved state. If false, it is removed.
 */
export function saveStraightEdge(vertexList: string, add:boolean) {
    if (add) {
        localCache.edges.push(vertexList);
    }
    else {
        const i = localCache.edges.indexOf(vertexList);
        if (i >= 0) {
            localCache.edges.splice(i, 1);
        }
    }
    saveCache();
}

////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//

/**
 * Assign indeces to all of the elements in a group
 * @param elements A list of elements
 * @param suffix A variant name of the index (optional)
 */
function applyGlobalIndeces(elements:HTMLCollectionOf<Element>, suffix?:string) {
    let attr = 'data-globalIndex';
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
export function getGlobalIndex(elmt:HTMLElement, suffix?:string):number {
    if (elmt) {
        let attr = 'data-globalIndex';
        if (suffix != undefined) {
            attr += '-' + suffix;
        }
        const index = elmt.getAttributeNS('', attr);
        if (index) {  // not null or empty
            return Number(index);
        }
    }
    return -1;
}

/**
 * Create a dictionary, mapping global indeces to the corresponding elements
 * @param cls the class tag on all applicable elements
 * @param suffix the optional suffix of the global indeces
 */
export function mapGlobalIndeces(cls:string, suffix?:string):object {
    const map = {};
    const elements = document.getElementsByClassName(cls);
    for (let i = 0; i < elements.length; i++) {
        const index = getGlobalIndex(elements[i] as HTMLElement, suffix);
        if (index >= 0) {
            map[index] = elements[String(i)] as HTMLElement;
        }
    }
    return map;
}

/**
 * Assign globalIndeces to every letter- or word- input field
 */
export function indexAllInputFields() {
    let inputs = document.getElementsByClassName('letter-input');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('word-input');
    applyGlobalIndeces(inputs);
}

/**
 * Assign globalIndeces to every note field
 */
export function indexAllNoteFields() {
    const inputs = document.getElementsByClassName('note-input');
    applyGlobalIndeces(inputs);
}

/**
 * Assign globalIndeces to every check mark
 */
export function indexAllCheckFields() {
    const inputs = document.getElementsByClassName('cross-off');
    applyGlobalIndeces(inputs);
}

/**
 * Assign globalIndeces to every moveable element and drop target
 */
export function indexAllDragDropFields() {
    let inputs = document.getElementsByClassName('moveable');
    applyGlobalIndeces(inputs);
    inputs = document.getElementsByClassName('drop-target');
    applyGlobalIndeces(inputs);
}

/**
 * Assign globalIndeces to every stampable element
 */
export function indexAllDrawableFields() {
    const inputs = document.getElementsByClassName('stampable');
    applyGlobalIndeces(inputs);
}

/**
 * Assign globalIndeces to every highlightable element
 */
export function indexAllHighlightableFields() {
    const inputs = document.getElementsByClassName('can-highlight');
    applyGlobalIndeces(inputs, 'ch');
}

/**
 * Assign globalIndeces to every vertex
 */
export function indexAllVertices() {
    const inputs = document.getElementsByClassName('vertex');
    applyGlobalIndeces(inputs, 'vx');
}

////////////////////////////////////////////////////////////////////////
// Load from local storage
//

/**
 * Avoid re-entrancy. Track if we're mid-reload
 */
let reloading = false;

/**
 * Load all structure types from storage
 */
function loadLocalStorage(storage:LocalCacheStruct) {
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
    reloading = false;
}

/**
 * Restore any saved letter input values
 * @param values A dictionary of index=>string
 */
function restoreLetters(values:object) {
    localCache.letters = values;
    var inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i] as HTMLInputElement;
        var value = values[i] as string;
        if(value != undefined){
            input.value = value;
            afterInputUpdate(input);
        }
    }
}

/**
 * Restore any saved word input values
 * @param values A dictionary of index=>string
 */
function restoreWords(values:object) {
    localCache.words = values;
    var inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i] as HTMLInputElement;
        var value = values[i] as string;
        if(value != undefined){
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
function restoreNotes(values:object) {
    localCache.notes = values;
    var elements = document.getElementsByClassName('note-input');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i] as HTMLInputElement;
        var globalIndex = getGlobalIndex(element);
        var value = values[globalIndex] as string;
        if (value != undefined){
            element.value = value;
        }
    }  
}

/**
 * Restore any saved note input values
 * @param values A dictionary of index=>boolean
 */
function restoreCrossOffs(values:object) {
    localCache.checks = values;
    var elements = document.getElementsByClassName('cross-off');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i] as HTMLElement;
        var globalIndex = getGlobalIndex(element);
        var value = values[globalIndex] as boolean;
        if(value != undefined){
            toggleClass(element, 'crossed-off', value);
        }
    }  
}

/**
 * Restore any saved moveable objects to drop targets
 * @param containers A dictionary of moveable-index=>target-index
 */
function restoreContainers(containers:object) {
    localCache.containers = containers;
    var movers = document.getElementsByClassName('moveable');
    var targets = document.getElementsByClassName('drop-target');
    // Each time an element is moved, the movers structure recalcs. So pre-fetch.
    const moved:HTMLElement[] = [];
    for (let key in containers) {
        moved.push(movers[key]);
    }
    for (var i = 0; i < moved.length; i++) {
        const mover = moved[i];
        // Movers can move, and thus get re-ordered. Don't trust i to be the index.
        const index = getGlobalIndex(mover);
        var j = containers[index] as number;
        if (j != undefined) {
            quickMove(mover, targets[j] as HTMLElement);
        }
    }
}

/**
 * Restore any saved moveable objects to free-positions within their targets
 * @param positions A dictionary of index=>Position
 */
function restorePositions(positions:object) {
    localCache.positions = positions;
    var movers = document.getElementsByClassName('moveable');
    for (var i = 0; i < movers.length; i++) {
        var pos = positions[i] as Position;
        if (pos != undefined) {
            quickFreeMove(movers[i] as HTMLElement, pos);
        }
    }
}

/**
 * Restore any saved note input values
 * @param values A dictionary of index=>string
 */
function restoreStamps(drawings:object) {
    localCache.stamps = drawings;
    var targets = document.getElementsByClassName('stampable');
    for (var i = 0; i < targets.length; i++) {
        var tool = drawings[i] as string;
        if (tool != undefined) {
            doStamp(targets[i] as HTMLElement, tool);
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
        var element = elements[i] as HTMLElement;
        var globalIndex = getGlobalIndex(element, 'ch');
        var value = highlights[globalIndex] as boolean;
        if (value != undefined){
            toggleClass(element, 'highlighted', value);
        }
    }
}

/**
 * Recreate any saved straight-edges and word-selections
 * @param vertexLists A list of strings, where each string is a comma-separated-list of vertices
 */
function restoreEdges(vertexLists:string[]) {
    if (!vertexLists) {
        vertexLists = [];
    }
    localCache.edges = vertexLists;
    for (var i = 0; i < vertexLists.length; i++) {
        createFromVertexList(vertexLists[i]);
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
function saveMetaMaterials(puzzle:string, up:number, page:string, obj:object) {
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
function loadMetaMaterials(puzzle, up, page): object|undefined {
    var key = getOtherFileHref(puzzle, up) + "-" + page;
    if (key in localStorage) {
        const item = localStorage.getItem(key);
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
    parts.splice(0, parts.length - levels)
    return parts.join(delim);
}

/**
 * Convert the absolute href of the current window to an absolute href of another file
 * @param file name of another file
 * @param up the number of steps up. 0=same folder. 1=parent folder, etc.
 * @param rel if set, only return the last N terms of the relative path
 * @returns a path to the other file
 */
function getOtherFileHref(file:string, up?:number, rel?:number):string {
    var bslash = window.location.href.lastIndexOf('\\');
    var fslash = window.location.href.lastIndexOf('/');
    var delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }

    // We'll replace the current filename and potentially some parent folders
    if (!up) {
        up = 1
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
const ignoreKeys:string[] = [
    'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'OptionLeft', 'OptionRight', 'CapsLock', 'Backspace', 'Escape', 'Delete', 'Insert', 'NumLock', 'ScrollLock', 'Pause', 'PrintScreen',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16',
]

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
let keyDownTarget:HTMLInputElement|null = null;

/**
 * Callback when a user pressed a keyboard key from any letter-input or word-input text field
 * @param event - A keyboard event
 */
export function onLetterKeyDown(event: KeyboardEvent) {
    var input = event.currentTarget as HTMLInputElement;
    keyDownTarget = input;
    priorInputValue = input.value;

    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key;  // Mobile doesn't use code
    }

    var inpClass = hasClass(input, 'word-input') ? 'word-input' : 'letter-input';
    var skipClass = hasClass(input, 'word-input') ? 'word-non-input' : 'letter-non-input';

    let prior:HTMLInputElement|null = null;

    if (hasClass(input.parentNode as Element, 'multiple-letter') || hasClass(input, 'word-input')) {
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
                const prior:HTMLInputElement = findNextInput(input, -plusX, 0, inpClass, skipClass);
                if (prior != null) {
                    moveFocus(prior, prior.value.length);
                }
                event.preventDefault();
            }
        }
    }
    else {
        if (code == 'Backspace' || code == 'Space') {
            if (code == 'Space') {
                // Make sure user isn't just typing a space between words
                prior = findNextOfClass(input, 'letter-input', undefined, -1) as HTMLInputElement;
                if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
                    var lit = prior.getAttribute('data-literal');
                    if (lit == ' ' || lit == '¶') {  // match any space-like things  (lit == '¤'?)
                        prior = findNextOfClass(prior, 'letter-input', 'literal', -1) as HTMLInputElement;
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
                    prior = findNextOfClassGroup(input, 'letter-input', 'letter-non-input', 'text-input-group', dxDel) as HTMLInputElement;
                }
                ExtractFromInput(input);
                if (prior !== null) {
                    moveFocus(prior);
                    input = prior;  // fall through
                }
            }
            if (input != null && input.value.length > 0) {
                if (!hasClass(input.parentNode as Element, 'multiple-letter')) {
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
            if (matchInputRules(input, event)) {
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

/**
 * Does a typed character match the input rules?
 * @param input 
 * @param evt 
 * @returns 
 */
function matchInputRules(input:HTMLInputElement, evt:KeyboardEvent) {
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
export function onLetterKey(event:KeyboardEvent) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    if (isDebug()) {
        alert('code:' + event.code + ', key:' + event.key);
    }

    var input:HTMLInputElement = event.currentTarget as HTMLInputElement;
    if (input != keyDownTarget) {
        keyDownTarget = null;
        // key-down likely caused a navigation
        return;
    }
    keyDownTarget = null;

    var code = event.code;
    if (code == undefined || code == '') {
        code = event.key;  // Mobile doesn't use code
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
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', 10) as HTMLInputElement);
        return;
    }
    else if (code == 'End') {
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', -1) as HTMLInputElement);
        return;
    }
    else if (code == 'Backquote') {
        return;  // Highlight already handled in key down
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
                input.value = '';  // abort this space
                return;
            }
        }
    }
    afterInputUpdate(input);
}

/**
 * Re-scan for extractions
 * @param input The input which just changed
 */
export function afterInputUpdate(input:HTMLInputElement) {
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
    else if (!hasClass(input.parentNode, 'fixed-spacing')) {
        var spacing = (text.length - 1) * 0.05;
        input.style.letterSpacing = -spacing + 'em';
        input.style.paddingRight = (2 * spacing) + 'em';
        //var rotate = text.length <= 2 ? 0 : (text.length * 5);
        //input.style.transform = 'rotate(' + rotate + 'deg)';
    }
    saveLetterLocally(input);
}

/**
 * Extract contents of an extract-flagged input
 * @param input an input field
 */
function ExtractFromInput(input:HTMLInputElement) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    if (hasClass(input.parentNode, 'extract')) {
        UpdateExtraction(extractedId);
    }
    else if (hasClass(input.parentNode, 'extractor')) {  // can also be numbered
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
function UpdateExtraction(extractedId:string|null) {
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
        const inp = inputs[i] as HTMLInputElement;
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
function ExtractionIsInteresting(text:string): boolean {
    return text.length > 0 && text.match(/[^_]/) != null;
}

/**
 * Update an extraction area with new text
 * @param text The current extraction
 * @param dest The container for the extraction. Can be a div or an input
 */
function ApplyExtraction(   text:string, 
                            dest:HTMLElement) {
    if (hasClass(dest, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (hasClass(dest, 'all-caps')) {
        text = text.toLocaleUpperCase();
    }

    const destInp:HTMLInputElement|null = (dest.tagName != 'INPUT') ? null : dest as HTMLInputElement;
    var current = (destInp === null) ? dest.innerText : destInp.value;
    if (!ExtractionIsInteresting(text) && !ExtractionIsInteresting(current)) {
        return;
    }
    if (!ExtractionIsInteresting(text) && ExtractionIsInteresting(current)) {
        text = '';
    }
    if (!destInp) {
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
function UpdateNumbered(extractedId:string|null) {
    var inputs = document.getElementsByClassName('extract-input');
    for (var i = 0; i < inputs.length; i++) {
        const inp = inputs[i] as HTMLInputElement
        const index = inputs[i].getAttribute('data-number');
        const extractCell = document.getElementById('extractor-' + index) as HTMLInputElement;
        let letter = inp.value || '';
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
function UpdateExtractionSource(input:HTMLInputElement) {
    //var extractedId = getOptionalStyle(input, 'data-extracted-id', null, 'extracted-');
    var extractors = document.getElementsByClassName('extractor-input');
    var index = getOptionalStyle(input.parentNode as Element, 'data-number');
    if (index === null) {
        for (var i = 0; i < extractors.length; i++) {
            if (extractors[i] == input) {
                index = "" + (i + 1);  // start at 1
                break;
            }
        }
    }
    if (index === null) {
        return;
    }
    var sources = document.getElementsByClassName('extract-input');
    for (var i = 0; i < sources.length; i++) {
        var src = sources[i] as HTMLInputElement;
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
export function onWordKey(event:KeyboardEvent) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    const input = event.currentTarget as HTMLInputElement;
    if (getOptionalStyle(input, 'data-extract-index') != null) {
        var extractId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
        updateWordExtraction(extractId);
    }

    var code = event.code;
    if (code == 'Enter') {
        code = event.shiftKey ? 'ArrowUp' : 'ArrowDown';
    }
    if (code == 'PageUp') {
        moveFocus(findNextOfClass(input, 'word-input', undefined, -1) as HTMLInputElement);
        return;
    }
    else if (code == 'Enter' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'word-input') as HTMLInputElement);
        return;
    }
}

/**
 * Update extractions that come from word input
 * @param extractedId The ID of an extraction area
 */
export function updateWordExtraction(extractedId:string|null) {
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
        var index = getOptionalStyle(inputs[i], 'data-extract-index', '') as string;
        const indeces = index.split(' ');
        for (var j = 0; j < indeces.length; j++) {
            var extractIndex = parseInt(indeces[j]);
            if (extractIndex > 0) {  // indeces start at 1
                const inp = inputs[i] as HTMLInputElement;  
                var letter = inp.value.length >= extractIndex ? inp.value[extractIndex - 1] : '_';
                extraction += letter;
                partial = partial || (letter != '_');
            }
        }
    }

    ApplyExtraction(extraction, extracted);
}

/**
 * Callback when user has changed the text in a letter-input 
 * @param event A keyboard event
 */
export function onLetterChange(event:KeyboardEvent) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    const input = findParentOfClass(event.currentTarget as Element, 'letter-input') as HTMLInputElement;
    saveLetterLocally(input);
}

/**
 * Callback when user has changed the text in a word-input 
 * @param event A keyboard event
 */
export function onWordChange(event:KeyboardEvent) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }

    const input = findParentOfClass(event.currentTarget as Element, 'word-input') as HTMLInputElement;
    saveWordLocally(input);
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
function findNextInput( start: Element, 
                        dx: number, 
                        dy: number, 
                        cls: string, 
                        clsSkip: string)
                        : HTMLInputElement {
    var root2d = findParentOfClass(start, 'letter-grid-2d');
    let find:HTMLInputElement|null = null;
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
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block', -1) as HTMLInputElement;
        if (find != null) {
            return find;
        }
    }
    if (dy > 0) {
        find = findInNextContainer(start, cls, clsSkip, 'letter-cell-block') as HTMLInputElement;
        if (find != null) {
            return find;
        }
    }
    var back = dx == -plusX || dy < 0;
    return findNextOfClassGroup(start, cls, clsSkip, 'text-input-group', back ? -1 : 1) as HTMLInputElement;
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
function findNextOfClassGroup(  start: Element,
                                cls: string, 
                                clsSkip: string, 
                                clsGroup: string, 
                                dir:number = 1)
                                : Element|null {
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
function findNext2dInput(   root: Element, 
                            start: Element, 
                            dx: number, 
                            dy: number, 
                            cls: string, 
                            clsSkip: string)
                            : HTMLInputElement {
  // TODO: root
    if (dy != 0) {
        // In a 2D grid, up/down keep their relative horizontal positions
        var parent = findParentOfClass(start, 'letter-cell-block');
        var index = indexInContainer(start, parent as Element, cls);
        var nextParent = findNextOfClass(parent as Element, 'letter-cell-block', 'letter-grid-2d', dy);
        while (nextParent != null) {
            var dest:HTMLInputElement = childAtIndex(nextParent, cls, index) as HTMLInputElement;
            if (dest != null && !hasClass(dest, 'letter-non-input')) {
                return dest;
            }
            nextParent = findNextOfClass(nextParent, 'letter-cell-block', 'letter-grid-2d', dy);
        }
        dx = dy;
    }        
    return findNextOfClass(start, cls, clsSkip, dx) as HTMLInputElement;
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
function findNextByPosition(root: Element,
                            start: Element, 
                            dx: number, 
                            dy: number, 
                            cls: string, 
                            clsSkip: string)
                            : HTMLInputElement|null {
    let rect = start.getBoundingClientRect();
    let pos = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const elements = document.getElementsByClassName(cls);
    let distance = 0;
    let nearest:HTMLInputElement|null = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
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
                const d = (rect.x + rect.width / 2 - pos.x) / dx;
                // Keep the nearest
                if (d > 0 && (nearest == null || d < distance)) {
                    distance = d;
                    nearest = elmt as HTMLInputElement;
                }
            }
        }
        else if (dy != 0) {
            // Look for inputs in the same column
            if (pos.x >= rect.x && pos.x < rect.x + rect.width) {
                // Measure distance in the dy direction
                const d = (rect.y + rect.height / 2 - pos.y) / dy;
                if (d > 0 && (nearest == null || d < distance)) {
                    // Keep the nearest
                    distance = d;
                    nearest = elmt as HTMLInputElement;
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
                    : { x: rect.x + (dy < 0 ? rect.width - 1 : 1), y: rect.y + (dx < 0 ? rect.height - 1 : 1) }
    let distance2 = 0;
    let wrap:HTMLInputElement|null = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i];
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        // Remember the first element (if dx/dy is positive), or else the last
        if (wrap == null || (dx < 0 || dy < 0)) {
            wrap = elmt as HTMLInputElement;
        }
        rect = elmt.getBoundingClientRect();
        // d measures direction in continuing perpendicular direction
        // d2 measures relative position within original direction
        let d = 0, d2 = 0;
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
            nearest = elmt as HTMLInputElement;
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
export function textSetup() {
    setupLetterPatterns();
    setupExtractPattern();
    setupLetterCells();
    setupLetterInputs();
    setupWordCells();
    indexAllInputFields();
}

/**
 * Look for elements of class 'create-from-pattern'.
 * When found, use the pattern, as well as other inputs, to build out a sequence of text inputs inside that element.
 * Secondary attributes:
 *   letter-cell-table: A table with this class is will expect every cell
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
    const tables:HTMLCollectionOf<Element> = document.getElementsByClassName('letter-cell-table');
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const cells = table.getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            const td = cells[j];
            // Skip cells with existing contents
            if (td.innerHTML == '') {
                toggleClass(td, 'create-from-pattern', true);
                if (!getOptionalStyle(td, 'data-letter-pattern')) {
                    td.setAttributeNS(null, 'data-letter-pattern', '1');
                }
                // Make sure every row that contains any cells with inputs is tagged as a block
                const tr = td.parentNode;
                toggleClass(tr, 'letter-cell-block', true);
            }
            else {
                toggleClass(td, 'literal', true);
            }
        }
    }
    
    var patterns:HTMLCollectionOf<Element> = document.getElementsByClassName('create-from-pattern');
    for (let i = 0; i < patterns.length; i++) {
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
                    var count:number = pattern[pi]['count'] as number;
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
                            toggleClass(span, 'numbered', true);  // indicates numbers used in extraction
                            applyAllClasses(span, styles.extract);  // 'extract-numbered' indicates the visual appearance
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
                    const lit = pattern[pi]['char'] as string
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

interface LetterStyles {
    letter: string;
    literal: string;
    extract: string;
}

/**
 * Look for the standard styles in the current tag, and all parents
 * @param elmt - A page element
 * @param defLetter - A default letter style
 * @param defLiteral - A default literal style
 * @param defExtract - A default extraction style
 * @returns An object with a style name for each role
 */
function getLetterStyles(   elmt: Element, 
                            defLetter: string, 
                            defLiteral: string|undefined, 
                            defExtract: string)
                            : LetterStyles {
    var letter = getOptionalStyle(elmt, 'data-input-style', defLetter, 'letter-');
    var literal = getOptionalStyle(elmt, 'data-literal-style', defLiteral);
    literal = (literal != null) ? ('literal-' + literal) : letter;
    var extract = getOptionalStyle(elmt, 'data-extract-style', defExtract, 'extract-');

    return {
        'letter' : letter as string,
        'extract' : extract as string,
        'literal' : literal as string
    };
}

/**
 * Create a span block for a literal character, which can be a sibling of text input fields.
 * It should occupy the same space, although may not have the same decorations such as underline.
 * The trick is to create an empty, disabled input (to hold the size), and then render plain text in front of it.
 * @param char - Literal text for a single character. Special case the paragraphs as <br>
 * @returns The generated <span> element
 */
function createLetterLiteral(char: string)
                            : HTMLElement {
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
function initLiteralLetter( span: HTMLElement, 
                            char: string) {
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
 * A token in a pattern of text input
 */
interface NumberPatternToken {
    char?: string;
    count?: number;
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
function parseNumberPattern(elmt: Element, 
                            patternAttr: string)
                            : NumberPatternToken[] {
    var list:NumberPatternToken[] = [];
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
            list.push({count: count as number});
        }
        if (pi < pattern.length) {
            list.push({char: pattern[pi]});
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
function parsePattern(  elmt: Element, 
                        patternAttr: string, 
                        offset: number = 0)
                        : number[] {
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    const set:number[] = [];
    if (pattern != null)
    {
        var array = pattern.split(' ');
        for(let i:number = 0; i < array.length; i++){
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
function parsePattern2( elmt: Element, 
                        patternAttr: string, 
                        offset: number = 0)
                        : object {
    var pattern = elmt.getAttributeNS('', patternAttr);
    offset = offset || 0;
    var set = {};
    if (pattern != null)
    {
        var array = pattern.split(' ');
        for(let i:number = 0; i < array.length; i++){
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
    let extracteeIndex:number = 1;
    let extractorIndex:number = 1;
    for (var i = 0; i < cells.length; i++) {
        const cell:HTMLElement = cells[i] as HTMLElement;

        // Place a small text input field in each cell
        const inp:HTMLInputElement = document.createElement('input');
        inp.type = 'text';
        if (hasClass(cell, 'numeric')) {
            // We never submit, so this doesn't have to be exact. But it should trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*';  // iOS
            inp.inputMode = 'numeric';  // Android
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
                const dataNumber = cell.getAttribute('data-number');
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
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        inp.onkeydown=function(e){onLetterKeyDown(e)};
        inp.onkeyup=function(e){onLetterKey(e)};
        inp.onchange=function(e){onLetterChange(e as KeyboardEvent)};
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
        const cell:HTMLElement = cells[i] as HTMLElement;
        var inpStyle = getOptionalStyle(cell, 'data-word-style', 'underline', 'word-');

        // Place a small text input field in each cell
        const inp:HTMLInputElement = document.createElement('input');
        inp.type = 'text';
        toggleClass(inp, 'word-input');

        if (inpStyle != null) {
            toggleClass(inp, inpStyle);
        }

        if (hasClass(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            toggleClass(inp, 'word-non-input');
            var span:HTMLElement = document.createElement('span');
            toggleClass(span, 'word-literal');
            span.innerText = cell.innerText;
            cell.innerHTML = '';
            cell.appendChild(span);
        }
        else {
            inp.onkeydown=function(e){onLetterKeyDown(e)};
            inp.onkeyup=function(e){onWordKey(e)};
            inp.onchange=function(e){onWordChange(e as KeyboardEvent)};
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
    const extracted = document.getElementById('extracted');
    if (extracted === null) {
        return;
    }
    let numbered:boolean = true;
    // Special case: if extracted root is tagged data-indexed-by-letter, 
    // then the indeces that lead here are letters rather than the usual numbers.
    const lettered:boolean = extracted.getAttributeNS('', 'data-indexed-by-letter') != null;
    // Get the style to use for each extracted value. Default: "letter-underline"
    var extractorStyle = getOptionalStyle(extracted, 'data-extractor-style', 'underline', 'letter-');

    let numPattern = parseNumberPattern(extracted, 'data-number-pattern');
    if (numPattern === null || numPattern.length === 0) {
        numbered = false;
        numPattern = parseNumberPattern(extracted, 'data-letter-pattern');
    }
    if (numPattern != null) {
        var nextNumber = 1;
        for (var pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count']) {
                var count = numPattern[pi]['count'] as number;
                for (var ci = 1; ci <= count; ci++) {
                    const span:HTMLSpanElement = document.createElement('span');
                    toggleClass(span, 'letter-cell', true);
                    toggleClass(span, 'extractor', true);
                    toggleClass(span, extractorStyle, true);
                    extracted.appendChild(span);
                    if (numbered) {
                        toggleClass(span, 'numbered');
                        const number:HTMLSpanElement = document.createElement('span');
                        toggleClass(number, 'under-number');
                        number.innerText = lettered ? String.fromCharCode(64 + nextNumber) : ("" + nextNumber);
                        span.setAttribute('data-number', "" + nextNumber);
                        span.appendChild(number);
                        nextNumber++;
                    }
                }
            }
            else if (numPattern[pi]['char'] !== null) {
                var span = createLetterLiteral(numPattern[pi]['char'] as string);
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
function hasProgress(event: Event): boolean {
    let inputs = document.getElementsByClassName('letter-input');
    for (var i = 0; i < inputs.length; i++) {
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        if (inp.value != '') {
            return true;
        }
    }
    inputs = document.getElementsByClassName('word-input');
    for (var i = 0; i < inputs.length; i++) {
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        if (inp.value != '') {
            return true;
        }
    }
    return false;
}


/*-----------------------------------------------------------
 * _dragDrop.ts
 *-----------------------------------------------------------*/


export type Position = {
    x: number;
    y: number;
}

/**
 * Convert an element's left/top style to a position
 * @param elmt Any element with a style
 * @returns A position
 */
export function positionFromStyle(elmt:HTMLElement): Position {
    return { x: parseInt(elmt.style.left), y: parseInt(elmt.style.top) };
}

// VOCABULARY
// moveable: any object which can be clicked on to begin a move
// drop-target: a container that can receive a (single) moveable element
// drag-source: a container that can hold a single spare moveable element

/**
 * Scan the page for anything marked moveable, drag-source, or drop-target
 * Those items get click handlers
 */
export function preprocessDragFunctions() {
    let elems = document.getElementsByClassName('moveable');
    for (let i = 0; i < elems.length; i++) {
        preprocessMoveable(elems[i] as HTMLElement);
    }

    elems = document.getElementsByClassName('drop-target');
    for (let i = 0; i < elems.length; i++) {
        preprocessDropTarget(elems[i] as HTMLElement);
    }

    elems = document.getElementsByClassName('free-drop');
    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i] as HTMLElement;
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

/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessMoveable(elem:HTMLElement) {
    elem.setAttribute('draggable', 'true');
    elem.onmousedown=function(e){onClickDrag(e)};
    elem.ondrag=function(e){onDrag(e)};
    elem.ondragend=function(e){onDragDrop(e)};
}

/**
 * Hook up the necessary mouse events to each drop target
 * @param elem a drop-target element
 */
function preprocessDropTarget(elem:HTMLElement) {
    elem.onmouseup=function(e){onClickDrop(e)};
    elem.ondragenter=function(e){onDropAllowed(e)};
    elem.ondragover=function(e){onDropAllowed(e)};
}

/**
 * Hook up the necessary mouse events to each free drop target
 * @param elem a free-drop element
 */
function preprocessFreeDrop(elem:HTMLElement) {
    elem.onmousedown=function(e){doFreeDrop(e)};
    elem.ondragenter=function(e){onDropAllowed(e)};
    elem.ondragover=function(e){onDropAllowed(e)};
}

/**
 * Assign z-index values to all moveable objects within a container.
 * Objects' z index is a function of their y-axis, and can extend up or down.
 * @param container The free-drop container, which can contain a data-z-grow attribute
 */
export function initFreeDropZorder(container:HTMLElement) {
    const zGrow = container.getAttributeNS('', 'data-z-grow')?.toLowerCase();
    if (!zGrow || (zGrow != 'up' && zGrow != 'down')) {
        return;
    }
    const zUp = zGrow == 'up';
    const height = container.getBoundingClientRect().height;
    const children = container.getElementsByClassName('moveable');
    for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        let z = parseInt(child.style.top);  // will always be in pixels, relative to the container
        z = 1000 + (zUp ? (height - z) : z);
        child.style.zIndex = String(z);
    }
}

/**
 * The most recent object to be moved
 */
let _priorDrag:HTMLElement|null = null;
/**
 * The object that is selected, if any
 */
let _dragSelected:HTMLElement|null = null;
/**
 * The drop-target over which we are dragging
 */
let _dropHover:HTMLElement|null = null;
/**
 * The position within its container that a dragged object was in before dragging started
 */
let _dragPoint:Position|null = null;

/**
 * Pick up an object
 * @param obj A moveable object
 */
function pickUp(obj:HTMLElement) {
    _priorDrag = _dragSelected;
    if (_dragSelected != null && _dragSelected != obj) {
        toggleClass(_dragSelected, 'drag-selected', false);
        _dragSelected = null;
    }
    if (obj != null && obj != _dragSelected) {
        _dragSelected = obj;
        toggleClass(_dragSelected, 'displaced', false);  // in case from earlier
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
function doDrop(dest:HTMLElement|null) {
    if (!_dragSelected) {
        return;
    }
    
    let src = getDragSource();
    if (dest === src) {
        if (_priorDrag !== _dragSelected) {
            // Don't treat the first click of a 2-click drag
            // as a 1-click non-move.
            return;
        }
        // 2nd click on src is equivalent to dropping no-op
        dest = null;
    }

    let other:Element|null = null;
    if (dest != null) {
        other = findFirstChildOfClass(dest, 'moveable', undefined, 0);
        if (other != null) {
            dest.removeChild(other);
        }
        src?.removeChild(_dragSelected);
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
            const src2 = findEmptySource();
            if (src2 != null) {
                src = src2;
            }
        }
        src?.appendChild(other);
        saveContainerLocally(other as HTMLElement, src as HTMLElement);
    }
}

/**
 * Drag the selected object on a region with flexible placement.
 * @param event The drop event
 */
function doFreeDrop(event:MouseEvent) {
    if (_dragPoint == null 
            || (event.clientX == _dragPoint.x && event.clientY == _dragPoint.y && _priorDrag == null)) {
        // This is the initial click
        return;
    }
    if (_dragSelected != null) {
        const dx = event.clientX - _dragPoint.x;
        const dy = event.clientY - _dragPoint.y;
        const oldLeft = parseInt(_dragSelected.style.left);
        const oldTop = parseInt(_dragSelected.style.top);
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
function updateZ(elem:HTMLElement, y:number) {
    let dest = findParentOfClass(elem, 'free-drop') as HTMLElement;
    const zGrow = dest?.getAttributeNS('', 'data-z-grow')?.toLowerCase();
    if (zGrow == 'down') {
        elem.style.zIndex = String(1000 + y);
    }
    else if (zGrow == 'up') {
        const rect = dest.getBoundingClientRect();
        elem.style.zIndex = String(1000 + rect.height - y);
    }
}

/**
 * The drag-target or drag-source that is the current parent of the dragging item
 * @returns 
 */
function getDragSource():HTMLElement|null {
    if (_dragSelected != null) {
        let src = findParentOfClass(_dragSelected, 'drop-target') as HTMLElement;
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'drag-source') as HTMLElement;
        }
        if (src == null) {
            src = findParentOfClass(_dragSelected, 'free-drop') as HTMLElement;
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
function onClickDrag(event:MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    const obj = findParentOfClass(target, 'moveable') as HTMLElement;
    if (obj != null) {
        if (_dragSelected == null) {
            pickUp(obj);
            _dragPoint = {x: event.clientX, y: event.clientY};
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
function onClickDrop(event:MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    if (_dragSelected != null) {
        const dest = findParentOfClass(target, 'drop-target') as HTMLElement;
        doDrop(dest);
    }
}

/**
 * Conlcude a drag with a single drag-move-release.
 * We we released over a drop-target or free-drop element, make the move.
 * @param event The mouse drag end event
 */
function onDragDrop(event:MouseEvent) {
    const elem = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    let dest = findParentOfClass(elem, 'drop-target') as HTMLElement;
    if (dest) {
        doDrop(dest);
    }
    else {
        dest = findParentOfClass(elem, 'free-drop') as HTMLElement;
        if (dest) {
            doFreeDrop(event);
        }
    }    
}

/**
 * As a drag is happening, highlight the destination
 * @param event The mouse drag start event
 */
function onDrag(event:MouseEvent) {
    if (event.screenX == 0 && event.screenY == 0) {
        return;  // not a real event; some extra fire on drop
    }
    const elem = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    const dest = findParentOfClass(elem, 'drop-target') as HTMLElement;
    if (dest != _dropHover) {
        toggleClass(_dropHover, 'drop-hover', false);

        const src = getDragSource();
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
function onDropAllowed(event:MouseEvent) {
    const elem = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    let dest = findParentOfClass(elem, 'drop-target');
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
function findEmptySource():HTMLElement|null {
    const elems = document.getElementsByClassName('drag-source');
    for (let i = 0; i < elems.length; i++) {
        if (findFirstChildOfClass(elems[i], 'moveable', undefined, 0) == null) {
            return elems[i] as HTMLElement;
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
export function quickMove(moveable:HTMLElement, destination:HTMLElement) {
    if (moveable != null && destination != null) {
        pickUp(moveable);
        doDrop(destination);    
    }
}

/**
 * Move an object within a free-move container
 * @param moveable The object to move
 * @param position The destination position within the container
 */
export function quickFreeMove(moveable:HTMLElement, position:Position) {
    if (moveable != null && position != null) {
        moveable.style.left = position.x + 'px';
        moveable.style.top = position.y + 'px';
        updateZ(moveable, position.y);
        toggleClass(moveable, 'placed', true);
    }
}

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
const _stampTools:Array<HTMLElement> = [];
/**
 * The currently selected tool from the palette.
 */
let _selectedTool:HTMLElement|null = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
let _extractorTool:string|null = null;
/**
 * The tool name that would erase things.
 */
let _eraseTool:string|null = null;

/**
 * Scan the page for anything marked stampable or a draw tool
 */
export function preprocessStampObjects() {
    let elems = document.getElementsByClassName('stampable');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        elmt.onmousedown=function(e){onClickStamp(e)};
        //elmt.ondrag=function(e){onMoveStamp(e)};
        elmt.onmouseenter=function(e){onMoveStamp(e)}; 
        elmt.onmouseleave=function(e){preMoveStamp(e)};
    }

    elems = document.getElementsByClassName('stampTool');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        _stampTools.push(elmt);
        elmt.onclick=function(e){onSelectStampTool(e)};
    }

    const palette = document.getElementById('stampPalette');
    if (palette != null) {
        _extractorTool = palette.getAttributeNS('', 'data-tool-extractor');
        _eraseTool = palette.getAttributeNS('', 'data-tool-erase');
    }
}

/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectStampTool(event:MouseEvent) {
    const tool = findParentOfClass(event.target as HTMLElement, 'stampTool') as HTMLElement;
    if (tool != null) {
        for (let i = 0; i < _stampTools.length; i++) {
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
function getStampTool(event:MouseEvent, toolFromErase:string|null):string|null {
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < _stampTools.length; i++) {
            const mods = _stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                    && event.shiftKey == (mods.indexOf('shift') >= 0)
                    && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                    && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _stampTools[i].getAttributeNS('', 'data-template-id');
            }
        }
    }
    
    if (toolFromErase != null) {
        return toolFromErase;
    }
    if (_selectedTool != null) {
        return _selectedTool.getAttributeNS('', 'data-template-id');
    }
    return _stampTools[0].getAttributeNS('', 'data-template-id');
}

/**
 * A stampable element can be the eventual container of the stamp. (example: TD)
 * Or it can assign another element to be the stamp container, with the data-stamp-parent attribute.
 * If present, that field specifies the ID of an element.
 * @param target An element with class="stampable"
 * @returns 
 */
export function getStampParent(target:HTMLElement) {
    const parentId = getOptionalStyle(target, 'data-stamp-parent');
    if (parentId) {
        return document.getElementById(parentId) as HTMLElement;
    }
    return target;
}

/**
 * When drawing on a surface where something is already drawn. The first click
 * always erases the existing drawing.
 * In that case, if the existing drawing was the selected tool, then we are in erase mode.
 * If there is no selected tool, then rotate to the next tool in the palette.
 * Otherwise, return null, to let normal drawing happen.
 * @param target a click event on a stampable object
 * @returns The name of a draw tool (overriding the default), or null
 */
function eraseStamp(target:HTMLElement):string|null {
    if (target == null) {
        return null;
    }
    const parent = getStampParent(target);

    const cur = findFirstChildOfClass(parent, 'stampedObject');
    if (cur != null) {
        const curTool = cur.getAttributeNS('', 'data-template-id');
        toggleClass(target, curTool, false);
        parent.removeChild(cur);
        if (_extractorTool != null) {
            updateStampExtraction();
        }

        if (_selectedTool == null) {
            return cur.getAttributeNS('', 'data-next-template-id');  // rotate
        }
        if (_selectedTool.getAttributeNS('', 'data-template-id') == curTool) {
            return _eraseTool;  // erase
        }
    }
    return null;  // normal
}

/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The name of a tool template
 */
export function doStamp(target:HTMLElement, tool:string) {
    const parent = getStampParent(target);
    
    // Template can be null if tool removes drawn objects
    let template = document.getElementById(tool) as HTMLTemplateElement;
    if (template != null) {
        const clone = template.content.cloneNode(true);
        parent.appendChild(clone);
        toggleClass(target, tool, true);
    }
    if (_extractorTool != null) {
        updateStampExtraction();
    }
    saveStampingLocally(target);
}

let _dragDrawTool:string|null = null;
let _lastDrawTool:string|null = null;

/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(event:MouseEvent) {
    const target = findParentOfClass(event.target as HTMLElement, 'stampable') as HTMLElement;
    let nextTool = eraseStamp(target);
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
function onMoveStamp(event:MouseEvent) {
    if (event.buttons == 1 && _dragDrawTool != null) {
        const target = findParentOfClass(event.target as HTMLElement, 'stampable') as HTMLElement;
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
function preMoveStamp(event:MouseEvent) {
    if (event.buttons == 1) {
        const target = findParentOfClass(event.target as HTMLElement, 'stampable');
        if (target != null) {
            const cur = findFirstChildOfClass(target, 'stampedObject');
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
    const extracted = document.getElementById('extracted');
    if (extracted != null) {
        const drawnObjects = document.getElementsByClassName('stampedObject');
        let extraction = '';
        for (let i = 0; i < drawnObjects.length; i++) {
            const tool = drawnObjects[i].getAttributeNS('', 'data-template-id');
            if (tool == _extractorTool) {
                const drawn = drawnObjects[i] as HTMLElement;
                const extract = findFirstChildOfClass(drawn, 'extract') as HTMLElement;
                if (extract) {
                    extraction += extract.innerText;
                }
            }
        }

        if (extracted.tagName != 'INPUT') {
            extracted.innerText = extraction;
        }
        else {
            let inp = extracted as HTMLInputElement;
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
export function positionFromCenter(elmt:HTMLElement): DOMPoint {
    const rect = elmt.getBoundingClientRect();
    return new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
}

/**
 * Find the square of the distance between a point and the mouse
 * @param elmt A position, in screen coordinates
 * @param evt A mouse event
 * @returns The distance, squared
 */
export function distance2Mouse(pos:DOMPoint, evt:MouseEvent): number {
    const dx = pos.x - evt.x;
    const dy = pos.y - evt.y;
    return dx * dx + dy * dy;
}

export function distance2(pos:DOMPoint, pos2:DOMPoint): number {
    const dx = pos.x - pos2.x;
    const dy = pos.y - pos2.y;
    return dx * dx + dy * dy;
}

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
export function preprocessRulerFunctions(mode:string, fill:boolean) {
    selector_class = mode;
    area_class = mode + '-area';
    selector_fill_class = fill ? (selector_class + '-fill') : null;
    let elems = document.getElementsByClassName(area_class);
    for (let i = 0; i < elems.length; i++) {
        preprocessRulerRange(elems[i] as HTMLElement);
    }

    indexAllVertices();
    // TODO: make lines editable
}

/**
 * Identified which type of selector is enabled for this page
 * @returns either 'straight-edge' or 'word-select'
 */
export function getStraightEdgeType() {
    return selector_class;
}

/**
 * Hook up the necessary mouse events to each moveable item
 * @param elem a moveable element
 */
function preprocessEndpoint(elem:HTMLElement) {
}

/**
 * Hook up the necessary mouse events to the background region for a ruler
 * @param elem a moveable element
 */
function preprocessRulerRange(elem:HTMLElement) {
    elem.onmousemove=function(e){onRulerHover(e)};
    elem.onmousedown=function(e){onLineStart(e)};
    elem.onmouseup=function(e){onLineUp(e)};
}

/**
 * Supported kinds of straight edges. 
 */
export const EdgeTypes = {
    straightEdge: 'straight-edge',
    wordSelect: 'word-select'
}

/**
 * Which class are we looking for: should be one of the EdgeTypes
 */
let selector_class:string;
/**
 * A second class, which can overlay the first as a fill
 */
let selector_fill_class:string|null;
/**
 * What is the class of the container: straight-edge-are or word-select-area
 */
let area_class:string;

/**
 * A VertexData contains all the information about a defined vertex in the puzzle
 * @property vertex The element tagged as a vertex
 * @property group (optional) The contained of the vertex, which should react to hovers
 * @property index The global-index of the vertex (assigned during initialization)
 * @property centerPos The center of the vertex, in screen coordinates
 * @property centerPoint The center of the vertex, in svg coordinates
 */
type VertexData = {
    vertex: HTMLElement;
    index: number;
    centerPos: DOMPoint;
    centerPoint: SVGPoint;
    group: HTMLElement;
}

/**
 * A RulerEventData is the collection of all ruler settings that might be useful following a mouse event
 * @property svg the root svg object
 * @property container the container for any straight edges we create
 * @property bounds the bounds of the svg, in client coordinates
 * @property maxPoints an official maximum for how many vertices may be in a single straight-edge
 * @property canShareVertices can two straight-edges share the same vertex?
 * @property hoverRange the maximum distance from a vertex before hover/snap is triggered
 * @property angleConstraints optional limit for connectable vertices to multiples of a base angle (in degrees) - usually 90 or 45, if set at all
 * @property showOpenDrag determines whether a straight-edge, mid-drag, can exist in open space (un-snapped)
 * @property evtPos the position of the mouse event, in client coordinates
 * @property evtPoint the position of the mouse event, in svg coordinates
 * @property nearest the nearest vertex, if any is within the hoverRange of the event
 */
type RulerEventData = {
    svg: SVGSVGElement;
    container: Element;
    bounds: DOMRect;
    maxPoints: number;
    canShareVertices: boolean;
    canCrossSelf: boolean;
    hoverRange: number;
    angleConstraints?: number;
    showOpenDrag: boolean;
    evtPos: DOMPoint;
    evtPoint: SVGPoint;
    nearest?: VertexData;
}

/**
 * Looks up the containing area, and any optional settings
 * @param evt A mouse event within the area
 * @returns A RulerEventData
 */
function getRulerData(evt:MouseEvent):RulerEventData {
    const range = findParentOfClass(evt.target as Element, area_class) as HTMLElement;
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const containers = svg.getElementsByClassName(selector_class + '-container');
    const bounds = svg.getBoundingClientRect();
    const max_points = range.getAttributeNS('', 'data-max-points');
    const maxPoints = max_points ? parseInt(max_points) : 2;
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    const canCrossSelf = range.getAttributeNS('', 'data-can-cross-self');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const pos = new DOMPoint(evt.x, evt.y);
    let spt = svg.createSVGPoint();
        spt.x = pos.x - bounds.left;
        spt.y = pos.y - bounds.top;
    const data:RulerEventData = {
        svg: svg, 
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints ? parseInt(angleConstraints) : undefined,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: pos,
        evtPoint: spt,
    };

    let near = findNearestVertex(data) as HTMLElement;
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
function getRulerDataFromVertex(vertex:HTMLElement):RulerEventData {
    const range = findParentOfClass(vertex, area_class) as HTMLElement;
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const containers = svg.getElementsByClassName(selector_class + '-container');
    const bounds = svg.getBoundingClientRect();
    const max_points = range.getAttributeNS('', 'data-max-points');
    const maxPoints = max_points ? parseInt(max_points) : 2;
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    const canCrossSelf = range.getAttributeNS('', 'data-can-cross-self');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const vBounds = vertex.getBoundingClientRect();
    const pos = new DOMPoint(vBounds.x + vBounds.width / 2, vBounds.y + vBounds.height / 2);
    let spt = svg.createSVGPoint();
        spt.x = pos.x - bounds.left;
        spt.y = pos.y - bounds.top;
    const data:RulerEventData = {
        svg: svg, 
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints ? parseInt(angleConstraints) : undefined,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: pos,
        evtPoint: spt,
    };

    let near = findNearestVertex(data) as HTMLElement;
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
function getVertexData(ruler:RulerEventData, vert:HTMLElement):VertexData {
    const data:VertexData = {
        vertex: vert,
        index: getGlobalIndex(vert, 'vx'),
        group: (findParentOfClass(vert, 'vertex-g') as HTMLElement) || vert,
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
let _straightEdges:SVGPolylineElement[] = [];
/**
 * The nearest vertex, if being affected by hover
 */
let _hoverEndpoint:HTMLElement|null = null;
/**
 * A straight edge under construction
 */
let _straightEdgeBuilder:SVGPolylineElement|null = null;
/**
 * The vertices that are part of the straight edge under construction
 */
let _straightEdgeVertices:HTMLElement[] = [];

/**
 * Handler for both mouse moves and mouse drag
 * @param evt The mouse move event
 */
function onRulerHover(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler) {
        return;
    }
    const inLineIndex = ruler.nearest ? indexInLine(ruler.nearest.vertex) : -1;
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
            const extendLast = extendsLastSegment(ruler.nearest);
            const updateOpen = _straightEdgeBuilder.points.length > _straightEdgeVertices.length;
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
        if (ruler.nearest?.group != _hoverEndpoint) {
            toggleClass(_hoverEndpoint, 'hover', false);
            toggleClass(ruler.nearest?.group as HTMLElement, 'hover', true);
            _hoverEndpoint = ruler.nearest?.group || null;
        }
    }
}
/**
 * Starts a drag from the nearest vertex to the mouse
 * @param evt Mouse down event
 */
function onLineStart(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler || !ruler.nearest) {
        return;
    }

    if (!ruler.canShareVertices && hasClass(ruler.nearest.vertex, 'has-line')) {
        // User has clicked a point that already has a line
        // Either re-select it or delete it
        const edge = findStraightEdgeFromVertex(ruler.nearest.index);
        if (edge) {
            const vertices = findStraightEdgeVertices(edge);
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
function onLineUp(evt:MouseEvent) {
    const ruler = getRulerData(evt);
    if (!ruler || !_straightEdgeBuilder) {
        return;
    }

    // Clean up classes that track active construction
    const indeces:number[] = [];
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(_straightEdgeVertices[i], 'building', false);
        toggleClass(_straightEdgeVertices[i], 'has-line', _straightEdgeBuilder != null);
        indeces.push(getGlobalIndex(_straightEdgeVertices[i], 'vx'));
    }

    const vertexList = ','+indeces.join(',')+',';
    completeStraightLine(ruler, vertexList);
}

/**
 * Create a new straight-edge, starting at one vertex
 * @param ruler The containing area and rules
 * @param start The first vertex (can equal ruler.nearest, which is otherwise ignored)
 */
function createStraightLineFrom(ruler:RulerEventData, start:VertexData) {
    _straightEdgeVertices = [];
    _straightEdgeVertices.push(start.vertex);

    _straightEdgeBuilder = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
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
function snapStraightLineTo(ruler:RulerEventData, next:VertexData) {
    _straightEdgeVertices.push(next.vertex);
    _straightEdgeBuilder?.points.appendItem(next.centerPoint);
    toggleClass(_straightEdgeBuilder, 'open-ended', false);
    toggleClass(next.vertex, 'building', true);
}

/**
 * Extend a straight-edge into open space
 * @param ruler The containing area and rules, including the latest event coordinates
 */
function openStraightLineTo(ruler:RulerEventData) {
    toggleClass(_straightEdgeBuilder, 'open-ended', true);
    _straightEdgeBuilder?.points.appendItem(ruler.evtPoint);
}

/**
 * Convert the straight line being built to a finished line
 * @param ruler The containing area and rules
 * @param vertexList A string join of all the vertex indeces
 * @param save Determines whether this edge is saved. It should be false when loading from a save.
 */
function completeStraightLine(ruler:RulerEventData, vertexList:string, save:boolean = true) {
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
            const fill = document.createElementNS('http://www.w3.org/2000/svg', 'polyline') as SVGPolylineElement;
            toggleClass(fill, selector_fill_class, true);
            for (let i = 0; i < _straightEdgeBuilder.points.length; i++) {
                fill.points.appendItem(_straightEdgeBuilder.points[i]);
            }
            ruler.container.appendChild(fill);  // will always be after the original
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
function indexInLine(end: HTMLElement):number {
    if (!_straightEdgeVertices || !end) {
        return -1;
    }
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
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
function extendsLastSegment(vert:VertexData|undefined):boolean {
    if (!vert || !_straightEdgeBuilder || _straightEdgeVertices.length < 2) {
        return false;
    }
    const last = _straightEdgeBuilder.points[_straightEdgeVertices.length - 1];
    const prev = _straightEdgeBuilder.points[_straightEdgeVertices.length - 2];
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    const err = Math.atan2(vert.centerPoint.y - prev.y, vert.centerPoint.x - prev.x) - angle;
    return Math.abs(err * 180 / Math.PI) < 1;
}

/**
 * Uses a form a dot-product to detect if the sweep from segment AB to AC is counter-clockwise
 * @param a Start of both segments
 * @param b First endpoint
 * @param c Second endpoint
 * @returns true if sweep is to the left (counter-clockwise)
 */
function segmentPointCCW(a:SVGPoint, b:SVGPoint, c:SVGPoint) {
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
function pointOnSegment(pt:SVGPoint, a:SVGPoint, b:SVGPoint) {
    if (pt == a || pt == b) {
        return true;
    }
    if (a.x == b.x) {
        return pt.x == a.x && pt.y >= Math.min(a.y, b.y) && pt.y <= Math.max(a.y, b.y);
    }
    if (a.y == b.y) {
        return pt.y == a.y && pt.x >= Math.min(a.x, b.x) && pt.x <= Math.max(a.x, b.x);
    }
    const dxS = b.x - a.x;
    const dyS = b.y - a.y;
    const dxP = pt.x - a.x;
    const dyP = pt.y - a.y;
    const pctX = dxP / dxS;
    const pctY = dyP / dyS;
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
function segmentsIntersect(a:SVGPoint, b:SVGPoint, c:SVGPoint, d:SVGPoint) {
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
function polylineSelfIntersection(pt:SVGPoint, points:SVGPointList) {
    if (points.length <= 1) {
        return false;
    }
    const p0 = points[points.length - 1];
    for (let i = 1; i < points.length - 1; i++) {
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
function isReachable(data:RulerEventData, vert: VertexData):boolean {
    if (!_straightEdgeBuilder || _straightEdgeVertices.length < 1) {
        return false;
    }
    
    if (!data.canCrossSelf && polylineSelfIntersection(vert.centerPoint, _straightEdgeBuilder.points)) {
        return false;
    }

    //if (indexInLine(vert.vertex) >= 0) return false;

    const prev = getVertexData(data, _straightEdgeVertices[_straightEdgeVertices.length - 1]);
    const dx = vert.centerPos.x - prev.centerPos.x;
    const dy = vert.centerPos.y - prev.centerPos.y;
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return false;  // Can't re-select the previous point
    }
    else if (data.angleConstraints == undefined) {
        return true;  // Any other point is valid
    }
    const degrees = Math.atan2(dy, dx) * 180 / Math.PI + 360;
    let mod = Math.abs(degrees % data.angleConstraints);
    if (mod > data.angleConstraints / 2) {
        mod = data.angleConstraints - mod;
    }
    return mod < 1; // Within 1 degree of constraint angle pattern
}

/**
 * Delete an existing straight-edge
 * @param edge The edge to remove
 */
function deleteStraightEdge(edge:SVGPolylineElement) {
    for (let i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }

    // See if there's a duplicate straight-edge, of class word-select2
    if (selector_fill_class) {
        const points = (edge as Element).getAttributeNS('', 'points');
        const second = document.getElementsByClassName(selector_fill_class);
        for (let i = 0; i < second.length; i++) {
            const sec = second[i] as HTMLElement;
            if (sec.getAttributeNS('', 'points') === points) {
                edge.parentNode?.removeChild(sec);
                break;
            }
        }
    }

    const indexList = edge.getAttributeNS('', 'data-vertices');
    saveStraightEdge(indexList as string, false);  // Deletes from the saved list

    edge.parentNode?.removeChild(edge);
}

/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns A vertex data, or null if none close enough
 */
function findNearestVertex(data:RulerEventData):Element|null {
    let min = data.hoverRange * data.hoverRange;
    const vertices = data.svg.getElementsByClassName('vertex');
    let nearest:HTMLElement|null = null;
    for (let i = 0; i < vertices.length; i++) {
        const end = vertices[i] as HTMLElement;
        const center = positionFromCenter(end);
        const dist = distance2(center, data.evtPos);
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
function findStraightEdgeFromVertex(index:number):SVGPolylineElement|null {
    const pat = ',' + String(index) + ',';
    const edges = document.getElementsByClassName(selector_class);
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i] as SVGPolylineElement;
        const indexList = edge.getAttributeNS('', 'data-vertices')
        if (indexList && indexList.search(pat) >= 0) {
            return edge;
        };
    }
    return null;
}

/**
 * Given a straight edge, enumerate the vertices that it passes through
 * @param edge A straight-edge
 * @returns An array of zero or more vertices
 */
function findStraightEdgeVertices(edge:SVGPolylineElement):HTMLElement[] {
    const indexList = edge.getAttributeNS('', 'data-vertices')
    const vertices:HTMLElement[] = [];
    const indeces = indexList?.split(',');
    if (indeces) {
        const map = mapGlobalIndeces('vertex', 'vx');
        for (var i = 0; i < indeces.length; i++) {
            if (indeces[i]) {
                const vertex = map[indeces[i]];
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
export function createFromVertexList(vertexList:string) {
    const map = mapGlobalIndeces('vertex', 'vx');
    const vertices:string[] = vertexList.split(',');
    let ruler:RulerEventData|null = null;
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i].length > 0) {
            const id = parseInt(vertices[i]);
            const vert = map[id];
            if (vert) {
                if (ruler == null) {
                    ruler = getRulerDataFromVertex(vert);
                    createStraightLineFrom(ruler, ruler.nearest as VertexData);
                }
                else {
                    snapStraightLineTo(ruler, getVertexData(ruler, vert));
                }
            }
        }
    }
    if (ruler) {
        completeStraightLine(ruler, vertexList, false/*no save while restoring*/);
    }
}

export function clearAllStraightEdges(id:string) {
    const svg = document.getElementById(id);
    if (!svg) {
        return;
    }

    const edges = svg.getElementsByClassName(selector_class);
    for (let i = edges.length - 1; i >= 0; i--) {
        const edge = edges[i];
        edge.parentNode?.removeChild(edge);
    }

    // Remove styles from all vertices
    const vertices = svg.getElementsByClassName('vertex');
    for (let i = 0; i < _straightEdgeVertices.length; i++) {
        toggleClass(vertices[i], 'building', false);
        toggleClass(vertices[i], 'has-line', false);
    }

    // Remove builder
    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}

/*-----------------------------------------------------------
 * _boilerplate.ts
 *-----------------------------------------------------------*/



/**
 * Cache the URL parameneters as a dictionary.
 * Arguments that don't specify a value receive a default value of true
 */
const urlArgs = {};

/**
 * Scan the url for special arguments.
 */
function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1);  // trim leading ?
        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true;  // e.g. present
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
export function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}

/**
 * Determines if the caller has specified <i>body-debug</i> in the URL,
 * or else if the puzzle explictly has set class='debug' on the body.
 * @returns true if set, unless explictly set to false
 */
export function isBodyDebug() {
    return hasClass(document.getElementsByTagName('body')[0], 'debug');
}

/**
 * Determines if this document is being loaded inside an iframe.
 * While any document could in theory be in an iframe, this library tags such pages with a url argument.
 * @returns true if this page's URL contains an iframe argument (other than false)
 */
export function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}

/**
 * Special url arg to override any cached storage. Always restarts.
 * @returns true if this page's URL contains a restart argument (other than =false)
 */
export function isRestart() {
    return urlArgs['restart'] != undefined && urlArgs['restart'] !== false;
}

type PuzzleEventDetails = {
    title: string;
    logo: string;  // path from root
    icon: string;  // path from root
    puzzleList: string;
    cssRoot: string;  // path from root
    fontCss: string;  // path from root
}

const safariSampleDetails:PuzzleEventDetails = {
    'title': 'Puzzle Safari',
    'logo': './Images/Sample_Logo.png',
    'icon': './Images/Sample_Icon.png',
    'puzzleList': './index.html',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts.css'
}

const safari20Details:PuzzleEventDetails = {
    'title': 'Safari Labs',
    'logo': './Images/PS20 logo.png',
    'icon': './Images/Beaker_icon.png',
    'puzzleList': './indexx.html',
    'cssRoot': '../Css/',
    'fontCss': './Css/Fonts20.css'
}

const pastSafaris = {
    'Sample': safariSampleDetails,
    '20': safari20Details,
}

let safariDetails:PuzzleEventDetails;

/**
 * Return the details of this puzzle event
 */
export function getSafariDetails(): PuzzleEventDetails {
    return safariDetails;
}

type AbilityData = {
    notes?: boolean;
    checkMarks?: boolean;
    highlights?: boolean;
    decoder?: boolean;
    decoderMode?: string;
    dragDrop?: boolean;
    stamping?: boolean;
    straightEdge?: boolean;
    wordSearch?: boolean;
}

type BoilerPlateData = {
    safari: string;  // key for Safari details
    title: string;
    author: string;
    copyright: string;
    type: string;  // todo: enum
    lang?: string;  // en-us by default
    paperSize?: string;  // letter by default
    orientation?: string;  // portrait by default
    textInput?: boolean;  // false by default
    abilities?: AbilityData;  // booleans for various UI affordances
    pathToRoot?: string;  // By default, '.'
}

/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp 
 */
function preSetup(bp:BoilerPlateData) {
    safariDetails = pastSafaris[bp.safari];
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

interface CreateSimpleDivArgs {
    id?: string;
    cls?: string;
    html?: string;
}
function createSimpleDiv({id, cls, html}: CreateSimpleDivArgs) : HTMLDivElement {
    let div: HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
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

interface CreateSimpleAArgs {
    id?: string;
    cls?: string;
    friendly: string;
    href: string;
    target?: string;
}
function createSimpleA({id, cls, friendly, href, target}: CreateSimpleAArgs) : HTMLAnchorElement {
    let a: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
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
const iconTypeAltText = {
    'Word': 'Word puzzle',
    'Math': 'Math puzzle',
    'Rebus': 'Rebus puzzle',
    'Code': 'Features encodings',
    'Trivia': 'Trivia puzzle',
    'Meta': 'Meta puzzle',
    'Reassemble': 'Assembly'
}

/**
 * Create an icon appropriate for this puzzle type
 * @param puzzleType the name of the puzzle type
 * @returns A div element, to be appended to the pageWithinMargins
 */
function createTypeIcon(puzzleType:string):HTMLDivElement {
    const iconDiv = document.createElement('div');
    iconDiv.id = 'icons';    
    const icon = document.createElement('img');
    icon.id = 'icons-' + iconDiv.childNodes.length;
    icon.src = './Icons/' + puzzleType + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' puzzle');
    iconDiv.appendChild(icon);
    return iconDiv;
}

function boilerplate(bp: BoilerPlateData) {
    if (bp === null) {
        return;
    }

    preSetup(bp)

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

    const html:HTMLHtmlElement = document.getElementsByTagName('HTML')[0] as HTMLHtmlElement;
    const head:HTMLHeadElement = document.getElementsByTagName('HEAD')[0] as HTMLHeadElement;
    const body:HTMLBodyElement = document.getElementsByTagName('BODY')[0] as HTMLBodyElement;
    const pageBody:HTMLDivElement = document.getElementById('pageBody') as HTMLDivElement;

    document.title = bp['title'];
    
    html.lang = bp['lang'] || 'en-us';

    const viewport = document.createElement('META') as HTMLMetaElement;
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1'
    head.appendChild(viewport);

    linkCss(head, safariDetails.fontCss);
    linkCss(head, safariDetails.cssRoot + 'PageSizes.css');
    linkCss(head, safariDetails.cssRoot + 'TextInput.css');
    if (!bp['paperSize']) {
        bp['paperSize'] = 'letter';
    }
    if (!bp['orientation']) {
        bp['orientation'] = 'portrait';
    }
    toggleClass(body, bp['paperSize']);
    toggleClass(body, bp['orientation']);
    toggleClass(body, safariDetails.fontCss);  // So event fonts can trump defaults

    const page: HTMLDivElement = createSimpleDiv({id:'page', cls:'printedPage'});
    const margins: HTMLDivElement = createSimpleDiv({cls:'pageWithinMargins'});
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({cls:'title', html:bp['title']}));
    margins.appendChild(createSimpleDiv({id:'copyright', html:'&copy; ' + bp['copyright'] + ' ' + bp['author']}));
    if (safariDetails.puzzleList) {
        margins.appendChild(createSimpleA({id:'backlink', href:safariDetails.puzzleList, friendly:'Puzzle list'}));
    }

    // Set tab icon for safari event
    const tabIcon = document.createElement('link');
    tabIcon.rel = 'shortcut icon';
    tabIcon.type = 'image/png';
    tabIcon.href = safariDetails.icon;
    head.appendChild(tabIcon);


    if (bp['type']) {
        margins.appendChild(createTypeIcon(bp['type']));
    }

    if (bp['textInput']) {
        textSetup()
    }
    setupAbilities(head, margins, bp['abilities'] || {});

    if (!isIFrame()) {
        setTimeout(checkLocalStorage, 100);
    }

}

/**
 * Append a CSS link to the header
 * @param head the head tag
 * @param relPath The contents of the link's href
 */
function linkCss(head:HTMLHeadElement, relPath:string) {
    const link = document.createElement('link');
    link.href=relPath;
    link.rel = "Stylesheet";
    link.type = "text/css";
    head.appendChild(link);
}

/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head:HTMLHeadElement, margins:HTMLDivElement, data:AbilityData) {
    let ability = document.getElementById('ability');
    if (ability != null) {
        const text = ability.innerText;
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
    let fancy = '';
    let count = 0;
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
        linkCss(head, safariDetails.cssRoot + 'DragDrop.css');
        count++;
    }
    if (data.stamping) {
        preprocessStampObjects();
        indexAllDrawableFields();
        linkCss(head, safariDetails.cssRoot + 'StampTools.css');
        // No ability icon
    }
    if (data.straightEdge) {
        fancy += '<span id="drag-ability" title="Line-drawing enabled" style="text-shadow: 0 0 3px black;">📐</span>';
        preprocessRulerFunctions(EdgeTypes.straightEdge, false);
        linkCss(head, safariDetails.cssRoot + 'StraightEdge.css');
        //indexAllVertices();
    }
    if (data.wordSearch) {
        fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">💊</span>';
        preprocessRulerFunctions(EdgeTypes.wordSelect, true);
        linkCss(head, safariDetails.cssRoot + 'WordSearch.css');
        //indexAllVertices();
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
}


declare let boiler: any;
window.onload = function(){boilerplate(boiler as BoilerPlateData)};