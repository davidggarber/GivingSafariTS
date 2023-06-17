

/*-----------------------------------------------------------
 * _classUtil.ts
 *-----------------------------------------------------------*/

/**
 * Add or remove a class from a classlist, based on a boolean test.
 * @param obj - A page element, or id of an element
 * @param cls - A class name to toggle (unless null)
 * @param bool - If omitted, cls is toggled in the classList; if true, cls is added; if false, cls is removed
 */
export function toggleClass(obj: Node|string|null, 
                            cls: string|null, 
                            bool?: boolean) {
    if (obj === null || cls === null || cls === undefined) {
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
    if (obj === null || cls === undefined) {
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
 * Find the first child/descendent of the current element which matches a desired class
 * @param elmt - A parent element
 * @param childClass - A class name of the desired child
 * @param skipClass - [optional] A class name to avoid
 * @param dir - If positive (default), search forward; else search backward
 * @returns A child element, if a match is found, else null
 */
export function findFirstChildOfClass( elmt: Element, 
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
export function getOptionalStyle( elmt: Element, 
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
export function setupNotes() {
    let index = 0;
    index = setupNotesCells('notes-above', 'note-above', index);
    index = setupNotesCells('notes-below', 'note-below', index);
    index = setupNotesCells('notes-right', 'note-right', index);
    index = setupNotesCells('notes-left', 'note-left', index);
    index = setupNotesCells('notes-left', 'note-left', index);
    // Puzzles can use the generic 'notes' class if they have their own .note-input style
    index = setupNotesCells('notes', undefined, index);
    index = setupNotesCells('notes-abs', undefined, index);
    setupNotesToggle();
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
 */
function setupNotesToggle() {
    let toggle = document.getElementById('notes-toggle') as HTMLAnchorElement;
    if (toggle == null) {
        toggle = document.createElement('a');
        toggle.id = 'notes-toggle';
        document.getElementsByClassName('pageWithinMargins')[0]?.appendChild(toggle);
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
    setupNotesToggle();
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
    indexAllHighlightableFields();

    const highlight = document.getElementById('highlight-ability');
    if (highlight != null) {
        highlight.onmousedown = function() {toggleHighlight()};
    }
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
 */
export function setupDecoderToggle() {
    const toggle = document.getElementById('decoder-toggle') as HTMLAnchorElement;
    if (toggle !== null) {
        const visible = getDecoderState();
        if (visible) {
            toggle.innerText = 'Hide Decoders';
        }
        else {
            toggle.innerText = 'Show Decoders';
        }
        toggle.href = 'javascript:toggleDecoder()';
    }
}

/**
 * Rotate to the next note visibility state.
 */
export function toggleDecoder() {
    var visible = getDecoderState();
    setDecoderState(!visible);
    setupDecoderToggle();
}



/*-----------------------------------------------------------
 * _storage.ts
 *-----------------------------------------------------------*/

export function saveLetterLocally(input: HTMLInputElement) {
}

export function saveWordLocally(input: HTMLInputElement) {
}

export function saveNoteLocally(input: HTMLInputElement) {
}

export function saveCheckLocally(input: HTMLElement, val: boolean) {
}

export function saveHighlightLocally(input: HTMLElement) {
}

export function indexAllInputFields() {
}

export function indexAllNoteFields() {
}

export function indexAllCheckFields() {
}

export function indexAllHighlightableFields() {
}

export function checkLocalStorage() {
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
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', 0) as HTMLInputElement);
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
        // Don't move focus if nothing was typed
        return;
    }
    if (input.value.length === 1 && !input.value.match(/[a-z0-9]/i)) {
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
function afterInputUpdate(input:HTMLInputElement) {
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

    const destInp:HTMLInputElement = dest as HTMLInputElement;
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
        UpdateWordExtraction(extractId);
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
function UpdateWordExtraction(extractedId:string|null) {
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
    var rect = start.getBoundingClientRect();
    var pos = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    var elements = document.getElementsByClassName(cls);
    var distance = 0;
    let nearest:HTMLInputElement|null = null;
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
                    nearest = elmt as HTMLInputElement;
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
                    nearest = elmt as HTMLInputElement;
                }
            }
        }
    }
    if (nearest != null) {
        return nearest;
    }

    // Try again, but look in the next row/column
    var distance2 = 0;
    let wrap:HTMLInputElement|null = null;
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
            wrap = elmt as HTMLInputElement;
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
    var patterns:HTMLCollectionOf<Element> = document.getElementsByClassName('create-from-pattern');
    for (let i = 0; i < patterns.length; i++) {
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
    if (numPattern === null) {
        numbered = false;
        numPattern = parseNumberPattern(extracted, 'data-letter-pattern');
    }
    if (numPattern != null) {
        var nextNumber = 1;
        for (var pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count'] !== null) {
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

function preSetup() {
    debugSetup();
    if (isIFrame()) {
        var bodies = document.getElementsByTagName('BODY');
        bodies[0].classList.add('iframe');
    }
}

type AbilityData = {
    notes?: boolean;
    checkMarks?: boolean;
    highlights?: boolean;
    decoder?: boolean;
    dragDrop?: boolean;
}

type BoilerPlateData = {
    title: string;
    author: string;
    copyright: string;
    type: string;  // todo: enum
    lang?: string;  // en-us by default
    paperSize?: string;  // letter by default
    orientation?: string;  // portrait by default
    textInput?: boolean;  // false by default
    storage?: boolean;  // false by default
    abilities?: AbilityData;  // booleans for various UI affordances
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

function boilerplate(bp: BoilerPlateData) {
    if (bp === null) {
        return;
    }

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


    toggleClass(body, bp['paperSize'] || 'letter');
    toggleClass(body, bp['orientation'] || 'portrait');

    const page: HTMLDivElement = createSimpleDiv({id:'page', cls:'printedPage'});
    const margins: HTMLDivElement = createSimpleDiv({cls:'pageWithinMargins'});
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({cls:'title', html:bp['title']}));
    margins.appendChild(createSimpleDiv({id:'copyright', html:'&copy; ' + bp['copyright'] + ' ' + bp['author']}));
    margins.appendChild(createSimpleA({id:'backlink', href:'safari.html', friendly:'Puzzle list'}));
    
    if (bp['notes']) {
        margins.appendChild(createSimpleA({id:'notes-toggle', href:'safari.html', friendly:'Show Notes'}));
    }
    if (bp['decoder']) {
        margins.appendChild(createSimpleA({id:'decoder-toggle', href:'https://ambitious-cliff-0dbb54410.azurestaticapps.net/Decoders/', friendly:'Show Decoders'}));
    }

    preSetup()
    
    if (bp['textInput']) {
        textSetup()
    }
    setupAbilities(bp['abilities'] || {});

    //setTimeout(checkLocalStorage, 100);

}

/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(data:AbilityData) {
    let ability = document.getElementById('ability');
    if (ability != null) {
        const text = ability.innerText;
        if (text.search('✔️') >= 0) {
            data.checkMarks = true;
        }
        else if (text.search('💡') >= 0) {
            data.highlights = true;
        }
        else if (text.search('👈') >= 0) {
            data.dragDrop = true;
        }
    }
    else {
        ability = document.createElement('div');
        ability.id = 'ability';
        document.getElementsByClassName('pageWithinMargins')[0]?.appendChild(ability);
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
        // setupDragDrop();
        count++;
    }
    if (data.notes) {
        setupNotes();
    }
    if (data.decoder) {
        setupDecoderToggle();
    }
    ability.innerHTML = fancy;
    if (count == 2) {
        ability.style.right = '0.1in';
    }
}


declare let boiler: any;
window.onload = function(){boilerplate(boiler as BoilerPlateData)};