/************************************************************
 * Puzzyl.net puzzle-building web kit                       *
 ************************************************************/


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
    const elmt = getElement(obj);
    if (!elmt || !cls) {
        return;
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
            if (elmt.classList.length == 0) {
                elmt.removeAttribute('class');
            }
        }
    }
}

/**
 * Several utilities allow an element to be passed as either a pointer,
 * or by its ID, or omitted completely.
 * Resolve to the actual pointer, if possible.
 * @param obj An element pointer, ID (string), or null/undefined
 * @returns The actual element, or else null
 */
function getElement(obj: Node|string|null|undefined):Element|null {
    if (!obj) {
        return null;
    }
    if ('string' === typeof obj) {
        return document.getElementById(obj as string) as Element;
    }
    return obj as Element;
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
    const elmt = getElement(obj);
    if (!elmt || !cls) {
        return false;
    }
    return elmt !== null 
        && elmt.classList
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
 * Convert the classList to a simple array of strings
 * @param obj A page element, or id of an element
 * @returns a string[]
 */
export function getAllClasses(obj: Node|string):string[] {
    const elmt = getElement(obj) as Element;
    const list:string[] = [];
    elmt.classList.forEach((s,n) => list.push(s));
    return list;
}

/**
 * Apply all classes in a list of classes.
 * @param obj - A page element, or id of an element
 * @param classes - A list of class names, delimited by spaces
 */
export function clearAllClasses(obj: Node|string, 
                                classes?:string|string[]) {
    const elmt = getElement(obj) as Element;
    let list:string[] = [];
    if (!classes) {
        elmt.classList.forEach((s,n) => list.push(s));
    }
    else if (typeof(classes) == 'string') {
        list = classes.split(' ');
    }
    else {
        list = classes as string[];
    }
    for (let cls of list) {
        toggleClass(obj, cls, false);
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
    for (let i = dir == 1 ? 0 : inputs.length - 1; i >= 0 && i < inputs.length; i += dir) {
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
    for (let i = 0; i < sibs.length; i++) {
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
 * Determine the tag type, based on the tag name (case-insenstive)
 * @param elmt An HTML element
 * @param tag a tag name, or array of names
 */
export function isTag(elmt: Element, tag: string|string[]) {
    const tagName = elmt.tagName.toUpperCase();
    if (typeof(tag) == 'string') {
        return tagName == tag.toUpperCase();
    }
    const tags = tag as string[];
    for (let i = 0; i < tags.length; i++) {
        if (tagName == tags[i].toUpperCase()) {
            return true;
        }
    }
    return false;
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
    while (elmt !== null && !isTag(elmt, 'body')) {
        if (hasClass(elmt, parentClass)) {
            return elmt;
        }
        elmt = elmt.parentNode as Element;
    }
    return null;
}

/**
 * Is the element anywhere underneath parent (including itself)
 * @param elmt An element
 * @param parent An element
 * @returns true if parent is anywhere in elmt's parent chain
 */
export function isSelfOrParent(elmt: Element, parent: Element) {
    while (elmt !== null && !isTag(elmt, 'body')) {
        if (elmt === parent) {
            return true;
        }
        elmt = elmt.parentNode as Element;
    }
    return false;
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
    for (let i = dir == 1 ? 0 : children.length - 1; i >= 0 && i < children.length; i += dir) {
        if (skipClass !== null && hasClass(children[i], skipClass)) {
            continue;
        }
        return children[i];
    }
    return null;
}

/**
 * Find the first child/descendent of the current element which matches a desired class
 * @param parent - A parent element
 * @param childClass - A class name of the desired child
 * @param index - Which child to find. If negative, count from the end
 * @returns A child element, if a match is found, else null
 */
export function findNthChildOfClass(  parent: Element, 
    childClass: string, 
    index: number)
    : Element|null {
    var children = parent.getElementsByClassName(childClass);
    if (index >= 0) {
        return (index < children.length) ? children[index] : null;
    }
    else {
        index = children.length + index;
        return (index >= 0) ? children[index] : null;
    }
}

/**
 * Get the index of an element among its siblings.
 * @param parent A parent/ancestor of the child
 * @param child Any element of type childClass
 * @param childClass A class that defines the group of siblings
 * @returns The index, or -1 if there's an error (the child is not in fact inside the specified parent)
 */
export function siblingIndexOfClass(parent: Element, child: Element, childClass: string): number {
    var children = parent.getElementsByClassName(childClass);
    for (let i = 0; i < children.length; i++) {
        if (children[i] == child) {
            return i;
        }
    }
    return -1;
}

/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, body)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @param defaultStyle - (optional) The default value, if no tag is found with the attribute. Null if omitted.
 * @param prefix - (optional) - A prefix to apply to the answer
 * @returns The found or default style, optional with prefix added
 */
export function getOptionalStyle(   elmt: Element|null, 
                                    attrName: string, 
                                    defaultStyle?: string, 
                                    prefix?: string)
                                    : string|null {
    if (!elmt) {
        return null;
    }
    const e = getParentIf(elmt, (e)=>e.getAttribute(attrName) !== null && cloneText(e.getAttribute(attrName)) !== '');
    let val = e ? e.getAttribute(attrName) : null;
    val = val !== null ? cloneText(val) : (defaultStyle || null);
    return (val === null || prefix === undefined) ? val : (prefix + val);
}

/**
 * Look for any attribute in the current tag, and all parents (up to, but not including, body)
 * @param elmt - A page element
 * @param attrName - An attribute name
 * @returns The found data, looked up in context
 */
export function getOptionalContext( elmt: Element|null, 
                                    attrName: string)
                                    : any {
    if (!elmt) {
        return null;
    }
    const e = getParentIf(elmt, (e)=>e.getAttribute(attrName) !== null && textFromContext(e.getAttribute(attrName)) !== '');
    const val = e ? e.getAttribute(attrName) : null;
    return val !== null ? evaluateFormula(val) : null;
}

/**
 * Loop through all elements in a DOM sub-tree, looking for any elements with an optional tag.
 * Recurse as needed. But once found, don't recurse within the find.
 * @param root The node to look through. Can also be 'document'
 * @param attr The name of an attribute. It must be present and non-empty to count
 * @returns A list of zero or more elements
 */
export function getAllElementsWithAttribute(root: Node, attr:string):HTMLElement[] {
    const list:HTMLElement[] = [];
    for (let i = 0; i < root.childNodes.length; i++) {
        const child = root.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            const elmt = child as HTMLElement;
            if (elmt.getAttribute(attr)) {
                list.push(elmt);
                // once found, don't recurse
            }
            else {
                const recurse = getAllElementsWithAttribute(elmt, attr);
                for (let r = 0; r < recurse.length; r++) {
                    list.push(recurse[r]);
                }
            }
        }
    }
    return list;
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

/**
 * Sort a collection of elements into an array
 * @param src A collection of elements, as from document.getElementsByClassName
 * @param sort_attr The name of the optional attribute, by which we'll sort. Attribute values must be numbers.
 * @returns An array of the same elements, either sorted, or else in original document order
 */
export function SortElements(src:HTMLCollectionOf<Element>, sort_attr:string = 'data-extract-order'): Element[] {
    const lookup = {};
    const indeces:number[] = [];
    const sorted:Element[] = [];
    for (let i = 0; i < src.length; i++) {
        const elmt = src[i];
        const order = getOptionalStyle(elmt, sort_attr);
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
    for (let i = 0; i < indeces.length; i++) {
        const order = '' + indeces[i];
        const peers = lookup[order];
        for (let p = 0; p < peers.length; p++) {
            sorted.push(peers[p]);
        }
    }

    return sorted;
}


/*-----------------------------------------------------------
 * _tableBuilder.ts
 *-----------------------------------------------------------*/



export type TableDetails = {
  rootId: string;
  height?: number;  // number of rows, indexed [0..height)
  width?: number;   // number of columns, indexed [0..width)
  data?: string[];  // array of strings, where each string is one row and each character is one cell
                        // if set, height and width can be omitted, and derived from this array
  onRoot?: (root: HTMLElement|null) => undefined;  // if provided, callback once on the table root, before any rows or cells
  onRow?: (y: number) => HTMLElement|null;
  onCell: (val: string, x: number, y: number) => HTMLElement|null;
}

/**
 * Create a generic TR tag for each row in a table.
 * Available for TableDetails.onRow where that is all that's needed
 */
export function newTR(y:number) {
  return document.createElement('tr');
}

/**
 * Create a table from details
 * @param details A TableDetails, which can exist in several permutations with optional fields
 */
export function constructTable(details: TableDetails) {
  const root = document.getElementById(details.rootId);
  if (details.onRoot) {
    details.onRoot(root);
  }
  const height = (details.data) ? details.data.length : (details.height as number);
  for (let y = 0; y < height; y++) {
    let row = root;
    if (details.onRow) {
      const rr = details.onRow(y);
      if (!rr) {
        continue;
      }
      root?.appendChild(rr);
      row = rr;
    }
    
    const width = (details.data) ? details.data[y].length : (details.width as number);
    for (let x = 0; x < width; x++) {
      const val:string = (details.data) ? details.data[y][x] : '';
      const cc = details.onCell(val, x, y);
      if (cc) {
        row?.appendChild(cc);
      }
    }
  }
}

export const svg_xmlns = 'http://www.w3.org/2000/svg';
const html_xmlns = 'http://www.w3.org/2000/xmlns';

export function constructSvgTextCell(val:string, dx:number, dy:number, cls:string, stampable?:boolean) {
  if (val == ' ') {
    return null;
  }
  var vg = document.createElementNS(svg_xmlns, 'g');
  vg.classList.add('vertex-g');
  if (cls) {
    applyAllClasses(vg, cls);
  }
  vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
  var r = document.createElementNS(svg_xmlns, 'rect');
  r.classList.add('vertex');
  var t = document.createElementNS(svg_xmlns, 'text');
  t. appendChild(document.createTextNode(val));
  vg.appendChild(r);
  vg.appendChild(t);

  if (stampable) {
    var fog = document.createElementNS(svg_xmlns, 'g'); 
    fog.classList.add('fo-stampable');
    var fo = document.createElementNS(svg_xmlns, 'foreignObject');
    var fod = document.createElement('div');
    fod.setAttribute('xmlns', html_xmlns);
    fod.classList.add('stampable');

    fo.appendChild(fod);
    fog.appendChild(fo);
    vg.appendChild(fog);
  }
  return vg;
}

export function constructSvgImageCell(img:string, dx:number, dy:number, id?:string, cls?:string) {
  var vg = document.createElementNS(svg_xmlns, 'g');
  if (id) {
    vg.id = id;
  }
  vg.classList.add('vertex-g');
  if (cls) {
    applyAllClasses(vg, cls);
  }
  vg.setAttributeNS('', 'transform', 'translate(' + dx + ', ' + dy + ')');
  var r = document.createElementNS(svg_xmlns, 'rect');
  r.classList.add('vertex');
  var i = document.createElementNS(svg_xmlns, 'image');
  i.setAttributeNS('', 'href', img);
  vg.appendChild(r);
  vg.appendChild(i);
  return vg;
}

export function constructSvgStampable() {
  var fo = document.createElementNS(svg_xmlns, 'foreignObject');
  fo.classList.add('fo-stampable');
  var fod = document.createElement('div');
  fod.setAttribute('xmlns', html_xmlns);
  fod.classList.add('stampable');
  fo.appendChild(fod);
  return fo;
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
    if (isPrint()) {
        setNoteState(NoteState.Disabled);
    }
    else if (isBodyDebug()) {
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
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // Place a small text input field in each cell
        let inp = document.createElement('input');
        inp.type = 'text';
        inp.classList.add('note-input');
        if (hasClass(cell, 'numeric')) {
            // Trigger the mobile numeric keyboard
            inp.pattern = '[0-9]*';  // iOS
            inp.inputMode = 'numeric';  // Android
        }
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
    noteChangeCallback(input as HTMLInputElement);
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
    noteChangeCallback(note);
}

/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 */
function noteChangeCallback(inp: HTMLInputElement) {
    const fn = theBoiler().onNoteChange;
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
    Subdued: 2,  // Enabled but not highlighted
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
function setNoteState(state:number) {
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
function setupNotesToggle(margins:HTMLDivElement|null) {
    let toggle = document.getElementById('notes-toggle') as HTMLAnchorElement;
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'notes-toggle';
        margins.appendChild(toggle);
    }
    const state = getNoteState();
    if (state == NoteState.Disabled || state == NoteState.Unmarked) {
        toggle.innerText = 'Show Notes';
    }
    else if (state == NoteState.Visible) {
        toggle.innerText = 'Dim Notes';
    }
    else {  // state == NoteState.Subdued
        // toggle.innerText = 'Disable Notes';
        toggle.innerText = 'Un-mark Notes';
    }
    toggle.href = 'javascript:toggleNotes()';
}

/**
 * Rotate to the next note visibility state.
 */
export function toggleNotes() {
    const state = getNoteState();
    setNoteState((state + 1) % NoteState.MOD);
    setupNotesToggle(null);
}


/**
 * Elements tagged with class = 'cross-off' are for puzzles clues that don't indicate where to use it.
 * Any such elements are clickable. When clicked, a check mark is toggled on and off, allowed players to mark some clues as done.
 */
export function setupCrossOffs() {
    const cells = document.getElementsByClassName('cross-off');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i] as HTMLElement;

        // Place a small text input field in each cell
        cell.onclick=function(e){onCrossOff(e)};

        var check = document.createElement('span');
        check.classList.add('check');
        //check.innerHTML = '&#x2714;&#xFE0F;' // ✔️;
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
    let parent = findParentOfClass(obj, 'cross-off') as HTMLElement;
    if (parent != null) {
        const newVal = !hasClass(parent, 'crossed-off');
        toggleClass(parent, 'crossed-off', newVal);
        saveCheckLocally(parent, newVal);
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
export function setupDecoderToggle(margins:HTMLDivElement|null, mode?:boolean|string) {
    let iframe = document.getElementById('decoder-frame') as HTMLIFrameElement;
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = 'decoder-frame';
        iframe.style.display = 'none';
        if (mode !== undefined && mode !== true) {
            iframe.setAttributeNS(null, 'data-decoder-mode', mode as string);
        }
        document.getElementsByTagName('body')[0]?.appendChild(iframe);
    }

    let toggle = document.getElementById('decoder-toggle') as HTMLAnchorElement;
    if (toggle == null && margins != null) {
        toggle = document.createElement('a');
        toggle.id = 'decoder-toggle';
        margins.appendChild(toggle);
    }
    if (toggle) {
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
    stamps: object;     // number => string
    highlights: object; // number => boolean
    controls: object;   // id => attribute
    scratch: object;    // (x,y) => string
    edges: string[];    // strings
    guesses: GuessLog[];
    time: Date|null;
}

var localCache:LocalCacheStruct = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, stamps: {}, highlights: {}, controls: {}, scratch: {}, edges: [], guesses: [], time: null };

////////////////////////////////////////////////////////////////////////
// User interface
//

let checkStorage:any = null;

/**
 * Saved state uses local storage, keyed off this page's URL
 * minus any parameters
 */
export function storageKey() {
    return window.location.origin + window.location.pathname;
}

/**
 * If storage exists from a previous visit to this puzzle, offer to reload.
 */
export function checkLocalStorage() {
    // Each puzzle is cached within localStorage by its URL
    const key = storageKey();
    if (!isIFrame() && !isRestart() && key in localStorage){
        const item = localStorage.getItem(key);
        if (item != null) {
            try {
                checkStorage = JSON.parse(item);
            }
            catch {
                checkStorage = {};
            }
            let empty = true;  // It's possible to cache all blanks, which are uninteresting
            for (let key in checkStorage) {
                if (checkStorage[key] != null && checkStorage[key] != '') {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                const force = forceReload();
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
    let img:HTMLImageElement|null = null;
    if (getSafariDetails().icon) {
        img = document.createElement('img');
        img.classList.add('icon');
        img.src = getSafariDetails().icon!;
    }
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
    if (img) { reloadDialog.appendChild(img); }
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
export function saveLetterLocally(input:HTMLInputElement) {
    if (input && input != currently_restoring) {
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
    if (input && input != currently_restoring) {
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
            const stampId = parent.getAttributeNS('', 'data-stamp-id');
            if (stampId) {
                localCache.stamps[index] = stampId;
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

/**
 * Update the local cache with the full set of guesses for this puzzle
 * @param guesses An array of guesses, in time order
 */
export function saveGuessHistory(guesses: GuessLog[]) {
    localCache.guesses = guesses;
    saveCache();
}

/**
 * Update the local cache with the latest notes, and where they're placed.
 * NOTE: only call this once any active note has been flattened.
 * @param scratchPad The parent div of all notes
 */
export function saveScratches(scratchPad:HTMLDivElement) {
    const map = {};
    const divs = scratchPad.getElementsByClassName('scratch-div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs[i] as HTMLDivElement;
        const rect = div.getBoundingClientRect();
        const pos = [rect.left,rect.top,rect.width,rect.height].join(',');
        const text = textFromScratchDiv(div);
        map[pos] = text;
        localCache.scratch = map;
        saveCache();
    }
}

type ValuableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement;

/**
 * Save one attribute from any element that is tagged with the class 'save-state'
 * The attribute to save is named in the optional attribute 'data-save-state'.
 * If omitted, the default is the value of an form field.
 */
export function saveStates() {
    const map = {};
    const savers = document.getElementsByClassName('save-state');
    for (let i = 0; i < savers.length; i++) {
        const elmt = savers[i];
        const id = elmt.id;
        if (id) {
            const attr = getOptionalStyle(elmt, 'data-save-state');
            let val:string = '';
            if (!attr && isTag(elmt, ['input', 'select', 'textarea', 'button'])) {
                // Since form-field values are not normal attributes, don't specify them in data-save-state
                const val = (elmt as ValuableElement).value;
                if (val) {
                    map[id] = val;
                }
                // if (isTag(elmt, 'input')) {
                //     val = (elmt as HTMLInputElement).value
                // }
                // else if (isTag(elmt, 'select')) {
                //     val = (elmt as HTMLSelectElement).value
                // }
                // else if (isTag(elmt, 'textarea')) {
                //     val = (elmt as HTMLTextAreaElement).value
                // }
                // else if (isTag(elmt, 'button')) {
                //     val = (elmt as HTMLButtonElement).value
                // }
            }
            else if (attr == 'class') {
                const classes:string[] = [];
                elmt.classList.forEach((s,n) => classes.push(s));
                if (classes.length > 0) {
                    map[id] = classes.join(' ');
                }
            }
            else if (attr) {
                const val = elmt.getAttributeNS('', attr);
                if (val) {
                    map[id] = val;
                }
            }
        }
    }
    if (Object.keys(map).length > 0) {
        localCache.controls = map;
        saveCache();
    }
}

////////////////////////////////////////////////////////////////////////
// Utilities for applying global indeces for saving and loading
//

/**
 * Assign indeces to all of the elements in a group
 * @param elements A list of elements
 * @param suffix A variant name of the index (optional)
 * @param offset A number to shift all indeces (optional) - used when two collections share an index space
 */
function applyGlobalIndeces(elements:HTMLCollectionOf<Element>, suffix?:string, offset?:number) {
    let attr = 'data-globalIndex';
    if (suffix != undefined) {
        attr += '-' + suffix;
    }
    if (!offset) {
        offset = 0;
    }
    for (let i = 0; i < elements.length; i++) {
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
 * At page initialization, every element that can be cached gets an index attached to it.
 * Possibly more than one, if it can cache multiple traits.
 * Find the element with the desired global index.
 * @param cls A class, to narrow down the set of possible elements
 * @param index The index
 * @param suffix The name of the index (optional)
 * @returns The element
 */
export function findGlobalIndex(cls: string, index: number, suffix?:string) :HTMLElement|null {
    const elements = document.getElementsByClassName(cls);
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i] as HTMLElement;
        if (index == getGlobalIndex(elmt, suffix)) {
            return elmt;
        }
    }
    return null;
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
    const checks = document.getElementsByClassName('cross-off');
    applyGlobalIndeces(checks);
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
    restoreGuesses(storage.guesses);
    restoreScratches(storage.scratch);
    restoreStates(storage.controls);
    reloading = false;

    const fn = theBoiler().onRestore;
    if (fn) {
        fn();
    }
}

let currently_restoring:HTMLElement|null = null;

/**
 * Restore any saved letter input values
 * @param values A dictionary of index=>string
 */
function restoreLetters(values:object) {
    localCache.letters = values;
    var inputs = document.getElementsByClassName('letter-input');
    for (let i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i] as HTMLElement;
        var input = inputs[i] as HTMLInputElement;
        var value = values[i] as string;
        if(value != undefined){
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
function restoreWords(values:object) {
    localCache.words = values;
    var inputs = document.getElementsByClassName('word-input');
    for (let i = 0; i < inputs.length; i++) {
        currently_restoring = inputs[i] as HTMLElement;
        var input = inputs[i] as HTMLInputElement;
        var value = values[i] as string;
        if(value != undefined){
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
function restoreNotes(values:object) {
    localCache.notes = values;
    var elements = document.getElementsByClassName('note-input');
    for (let i = 0; i < elements.length; i++) {
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
    let elements = document.getElementsByClassName('cross-off');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const globalIndex = getGlobalIndex(element);
        const value = values[globalIndex] as boolean;
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
    // Each time an element is moved, the containers structure changes out from under us. So pre-fetch.
    const moving:number[] = [];
    for (let key in containers) {
        moving[parseInt(key)] = parseInt(containers[key]);
    }
    for (let key in moving) {
        const mover = findGlobalIndex('moveable', parseInt(key));
        const target = findGlobalIndex('drop-target', moving[key]);
        if (mover && target) {
            quickMove(mover, target);
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
    for (let i = 0; i < movers.length; i++) {
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
    for (let i = 0; i < targets.length; i++) {
        var tool = drawings[i] as string;
        if (tool != undefined) {
            const stamp = document.getElementById(tool);
            if (stamp) {
                doStamp(targets[i] as HTMLElement, stamp);
            }
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
    for (let i = 0; i < elements.length; i++) {
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
    for (let i = 0; i < vertexLists.length; i++) {
        createFromVertexList(vertexLists[i]);
    }
}

/**
 * Recreate any saved guesses and their responses
 * @param guesses A list of guess structures
 */
function restoreGuesses(guesses:GuessLog[]) {
    if (!guesses) {
        guesses = [];
    }
    for (let i = 0; i < guesses.length; i++) {
        const src = guesses[i];
        // Rebuild the GuessLog, to convert the string back to a DateTime
        const gl:GuessLog = { field:src.field, guess:src.guess, time:new Date(String(src.time)) };
        decodeAndValidate(gl);
        // Decoding will rebuild the localCache
    }
}

/**
 * Update the local cache with the latest notes, and where they're placed.
 * NOTE: only call this once any active note has been flattened.
 */
function restoreScratches(scratch:object) {
    localCache.scratch = scratch;
    
    scratchClear();
    const points = Object.keys(scratch);
    for (let i = 0; i < points.length; i++) {
        const pos = points[i];
        const xywh = pos.split(',').map(n => parseInt(n));
        const text = scratch[pos];
        scratchCreate(xywh[0], xywh[1], xywh[2], xywh[3], text);
    }
}

/**
 * Restore any elements tagged as save-state.
 * They must each have a unique ID. One attribute may be saved for each.
 * @param controls 
 */
function restoreStates(controls:object) {
    localCache.controls = controls;

    const savers = document.getElementsByClassName('save-state');
    for (let i = 0; i < savers.length; i++) {
        const elmt = savers[i];
        const id = elmt.id;
        if (id && controls[id] !== undefined) {
            const attr = getOptionalStyle(elmt, 'data-save-state');
            if (!attr && isTag(elmt, ['input', 'select', 'textarea', 'button'])) {
                (elmt as ValuableElement).value = controls[id];
            }
            else if (attr === 'class') {
                const oldClasses = getAllClasses(elmt).filter((v) => v !== 'save-state');
                clearAllClasses(elmt, oldClasses);
                const classes = controls[id].split(' ');
                for (let c = 0; c < classes.length; c++) {
                    toggleClass(elmt, classes[c], true);
                }
            }
            else if (attr) {
                elmt.setAttributeNS('', attr, controls[id]);
            }
            else {
                continue;
            }

            // If we've set anything, give the element a chance to reload
            const load = new Event("load");
            elmt.dispatchEvent(load);
        }
    }
}

////////////////////////////////////////////////////////////////////////
// Utils for working with the shared puzzle list
//

/**
 * A limited list of meaningful puzzle statuses
 */
export const PuzzleStatus = {
    Hidden: 'hidden',  // A puzzle the player should not even see
    Locked: 'locked',  // A puzzle the player should not have a link to
    Unlocked: 'unlocked',  // A puzzle that the player can now reach
    Loaded: 'loaded',  // A puzzle which has been loaded, possibly triggering secondary storage
    Solved: 'solved',  // A puzzle which is fully solved
}

/**
 * Update the master list of puzzles for this event
 * @param puzzle The name of this puzzle (not the filename)
 * @param status One of the statuses in PuzzleStatus
 */
export function updatePuzzleList(puzzle:string|null, status:string) {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    let pList = {};
    if (key in localStorage) {
        const item = localStorage.getItem(key);
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

/**
 * Lookup the status of a puzzle
 * @param puzzle The name of a puzzle
 * @param defaultStatus The initial status, before a player updates it
 * @returns The saved status
 */
export function getPuzzleStatus(puzzle:string|null, defaultStatus?:string): string|undefined {
    if (!puzzle) {
        puzzle = getCurFileName();
    }
    var key = getOtherFileHref('puzzle_list', 0);
    let pList = {};
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            pList = JSON.parse(item);
            if (pList && puzzle in pList) {
                return pList[puzzle];
            }
        }
    }
    return defaultStatus;
}

/**
 * Return a list of puzzles we are tracking, which currently have the indicated status
 * @param status one of the valid status strings
 */
export function listPuzzlesOfStatus(status:string): string[] {
    const list:string[] = [];
    var key = getOtherFileHref('puzzle_list', 0);
    if (key in localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
            const pList = JSON.parse(item);
            if (pList) {
                const names = Object.keys(pList);
                for (let i = 0; i < names.length; i++) {
                    const name = names[i];
                    if (pList[name] === status) {
                        list.push(name);
                    }
                }
            }
        }
    }
    return list;
}

/**
 * Clear the list of which puzzles have been saved, unlocked, etc.
 */
export function resetAllPuzzleStatus() {
    var key = getOtherFileHref('puzzle_list', 0);
    localStorage.setItem(key, JSON.stringify(null));
}

/**
 * Clear any saved progress on this puzzle
 * @param puzzleFile a puzzle filename
 */
export function resetPuzzleProgress(puzzleFile:string) {
    var key = getOtherFileHref(puzzleFile, 0);
    localStorage.setItem(key, JSON.stringify(null));
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

/**
 * Get the last level of the URL's pathname
 */
export function getCurFileName(no_extension:boolean = true) {
    const key = window.location.pathname;
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    const parts = key.split(fslash >= bslash ? '/' : '\\');
    let name = parts[parts.length - 1];
    if (no_extension) {
        const dot = name.split('.');
        if (dot.length > 1) {
            name = name.substring(0, name.length - 1 - dot[dot.length - 1].length);
        }
    }
    return name;
}

// Convert the absolute href of the current window to a relative href
// levels: 1=just this file, 2=parent folder + file, etc.
function getRelFileHref(levels) {
    const key = storageKey();
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    let delim = '/';
    if (fslash < 0 || bslash > fslash) {
        delim = '\\';
    }

    const parts = key.split(delim);
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
    const key = storageKey();
    const bslash = key.lastIndexOf('\\');
    const fslash = key.lastIndexOf('/');
    let delim = '/';
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
    let skipClass:string|undefined;
    if (!findParentOfClass(input, 'navigate-literals')) {
        skipClass = hasClass(input, 'word-input') ? 'word-non-input' : 'letter-non-input';
    }

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
                    if (!prior) {
                        const loop = findParentOfClass(input, 'loop-navigation');
                        if (loop) {
                            prior = findFirstChildOfClass(loop, 'letter-input', 'letter-non-input', dxDel) as HTMLInputElement;
                        }
                    }
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

/**
 * Does a typed character match the input rules?
 * @param input 
 * @param evt 
 * @returns 
 */
function matchInputRules(input:HTMLInputElement, evt:KeyboardEvent) {
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
export function onLetterKeyUp(event:KeyboardEvent) {
    if (event.isComposing) {
        return;  // Don't interfere with IMEs
    }
    var post = onLetterKey(event);
    if (post) {
        var input:HTMLInputElement = event.currentTarget as HTMLInputElement;
        inputChangeCallback(input, event.key);
    }
}

/**
 * Process the end of a keystroke
 * @param event - A keyboard event
 * @return true if some post-processing is still needed
 */
export function onLetterKey(event:KeyboardEvent): boolean {
    if (isDebug()) {
        alert('code:' + event.code + ', key:' + event.key);
    }

    var input:HTMLInputElement = event.currentTarget as HTMLInputElement;
    if (input != keyDownTarget) {
        keyDownTarget = null;
        // key-down likely caused a navigation
        return true;
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
        return true;
    }
    else if (code == 'Home') {
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', 1) as HTMLInputElement);
        return true;
    }
    else if (code == 'End') {
        moveFocus(findEndInContainer(input, 'letter-input', 'letter-non-input', 'letter-cell-block', -1) as HTMLInputElement);
        return true;
    }
    else if (code == 'Backquote') {
        return true;  // Highlight already handled in key down
    }
    if (input.value.length == 0 || ignoreKeys.indexOf(code) >= 0) {
        var multiLetter = hasClass(input.parentNode, 'multiple-letter');
        // Don't move focus if nothing was typed
        if (!multiLetter) {
            return true;
        }
    }
    else if (input.value.length === 1 && !input.value.match(/[a-z0-9]/i)) {
        // Spaces and punctuation might be intentional, but if they follow a matching literal, they probably aren't.
        // NOTE: this tends to fail when the punctuation is stylized like smart quotes or minus instead of dash.
        var prior = findNextOfClass(input, 'letter-input', undefined, -1);
        if (prior != null && hasClass(prior, 'letter-non-input') && findNextOfClass(prior, 'letter-input') == input) {
            if (prior.getAttribute('data-literal') == input.value) {
                input.value = '';  // abort this space
                return true;
            }
        }
    }
    afterInputUpdate(input, event.key);
    return false;
}

/**
 * Re-scan for extractions
 * @param input The input which just changed
 * @param key The key from the event that led here
 */
export function afterInputUpdate(input:HTMLInputElement, key:string) {
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
    
    const showReady = getOptionalStyle(input.parentElement, 'data-show-ready');
    if (showReady) {
        const btn = document.getElementById(showReady) as HTMLButtonElement;
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

/**
 * Extract contents of an extract-flagged input
 * @param input an input field
 */
function ExtractFromInput(input:HTMLInputElement) {
    var extractedId = getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-');
    if (findParentOfClass(input, 'extract')) {
        UpdateExtraction(extractedId);
    }
    else if (findParentOfClass(input, 'extractor')) {  // can also be numbered
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
function UpdateExtraction(extractedId:string|null) {
    const extracted = document.getElementById(extractedId || 'extracted');
    
    if (extracted == null) {
        return;
    }
    const join = getOptionalStyle(extracted, 'data-extract-join') || '';
    
    if (extracted.getAttribute('data-extraction-source') != 'data'
        && (extracted.getAttribute('data-number-pattern') != null || extracted.getAttribute('data-letter-pattern') != null)) {
        UpdateNumbered(extractedId);
        return;    
    }
    
    const inputs = document.getElementsByClassName('extract-input');
    const sorted_inputs = SortElements(inputs);
    const parts:string[] = [];
    let hiddens = false;
    let ready = true;
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        if (hasClass(input, 'extract-literal')) {
            parts.push(HiddenExtract(input, false));
            hiddens = true;
        }
        else {
            const inp = input as HTMLInputElement;
            let letter = inp.value || '';
            letter = letter.trim();
            ready = ready && letter.length > 0;
            parts.push(letter || '_');
        }
    }
    if (hiddens) {
        let p = 0;
        for (let i = 0; i < sorted_inputs.length; i++) {
            const input = sorted_inputs[i];
            if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
                continue;
            }
            if (hasClass(input, 'extract-literal')) {
                parts[p] = HiddenExtract(input, ready, parts);
            }
            p++;
        }
    }
    let extraction = parts.join(join);

    if (extracted.getAttribute('data-letter-pattern') != null) {
        const inps = extracted.getElementsByClassName('extractor-input');
        if (inps.length > extraction.length) {
            extraction += Array(1 + inps.length - extraction.length).join('_');
        }
        let ready = true;
        for (let i = 0; i < inps.length; i++) {
            const inp = inps[i] as HTMLInputElement;
            if (extraction[i] != '_') {
                inp.value = extraction.substring(i, i+1);
            }
            else {
                inp.value = '';
                ready = false;
            }
        }
        updateExtractionData(extracted, extraction, ready);
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
function ExtractViaData(elmt:HTMLElement, value:string|null, extractedId:string|null) {
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
 * Hidden literal extracts often have rules for when they are applied.
 * @param span The (hidden) span that contains the literal value and possible rules
 * @param ready Whether the non-hidden inputs are now complete
 * @param extraction Either undefined, if still building, or a list of all extracted elements, of which this is one part.
 * @returns A letter to extract right now
 */
function HiddenExtract(span:Element, ready:boolean, extraction?:string[]):string {
    // Several ways to extract literals.
    // Old-style used data-* optional styles.
    // New style uses simpler names, only on current span.
    const de = span.hasAttributeNS('', 'delay') !== null     // placeholder value to extract, until player has finished other work
            ? span.getAttributeNS('', 'delay')               // empty is ok
            : getOptionalStyle(span, 'data-extract-delay');  
    const ev = span.getAttributeNS('', 'value')              // eventual extraction (unless a copy)
            || getOptionalStyle(span, 'data-extract-value'); 
    const ec = getOptionalStyle(span, 'data-extract-copy');  // this extraction is a copy of another
    if (!ready && de != null) {
        return de;
    }
    else if (ec) {
        // On the first pass, extraction may be undefined, so return ''. Later, copy another cell.
        return extraction ? extraction[parseInt(ec) - 1] : '';
    }
    else {
        return ev || '';
    }

}

/**
 * Check whether a collection of extracted text is more than blanks and underlines
 * @param text Generated extraction, which may still contain underlines for missing parts
 * @returns true if text contains anything other than spaces and underlines
 */
function ExtractionIsInteresting(text:string): boolean {
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
function ApplyExtraction(   text:string, 
                            dest:HTMLElement,
                            ready:boolean) {
    if (hasClass(dest, 'lower-case')) {
        text = text.toLocaleLowerCase();
    }
    else if (hasClass(dest, 'all-caps')) {
        text = text.toLocaleUpperCase();
    }

    const destInp:HTMLInputElement|null = isTag(dest, 'INPUT') ? dest as HTMLInputElement : null;
    const destText:HTMLElement|null = isTag(dest, 'TEXT') ? dest as HTMLElement : null;
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
    else if (!hasClass(dest, 'create-from-pattern')) {
        dest.innerText = text;
    }

    updateExtractionData(dest, text, ready);

    if (isTag(dest, 'input')) {
        // It's possible that the destination is itself an extract source
        ExtractFromInput(dest as HTMLInputElement);
    }
}

/**
 * Update an extraction that uses numbered indicators
 * @param extractedId The id of an extraction area
 */
function UpdateNumbered(extractedId:string|null) {
    extractedId = extractedId || 'extracted';
    const div = document.getElementById(extractedId);
    var outputs = div?.getElementsByTagName('input');
    var inputs = document.getElementsByClassName('extract-input');
    const sorted_inputs = SortElements(inputs);
    let concat = '';
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        const inp = input as HTMLInputElement
        const index = input.getAttribute('data-number');
        let output = document.getElementById('extractor-' + index) as HTMLInputElement;
        if (!output && outputs) {
            output = outputs[i];
        }
        let letter = inp.value || '';
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
function UpdateExtractionSource(input:HTMLInputElement) {
    //var extractedId = getOptionalStyle(input, 'data-extracted-id', null, 'extracted-');
    var extractors = document.getElementsByClassName('extractor-input');
    var index = getOptionalStyle(input.parentNode as Element, 'data-number');
    if (index === null) {
        for (let i = 0; i < extractors.length; i++) {
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
    let extractId:any;
    const extraction:string[] = [];
    for (let i = 0; i < sources.length; i++) {
        var src = sources[i] as HTMLInputElement;
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
    const extractionText = extraction.join('');
    updateExtractionData(extractId, extractionText, extractionText.length == sources.length);
}

function updateExtractionData(extracted:string|HTMLElement, value:string, ready:boolean) {
    const container = !extracted
        ? document.getElementById('extracted')
        : (typeof extracted === "string")
            ? document.getElementById(extracted as string)
            : extracted;
    if (container) {
        container.setAttribute('data-extraction', value);
        let btnId = container.getAttribute('data-show-ready');
        if (btnId) {
            const btn = document.getElementById(btnId);
            toggleClass(btn, 'ready', ready);
        }
        else {
            btnId = getOptionalStyle(container, 'data-show-ready');
            if (btnId) {
                const btn = document.getElementById(btnId);
                validateInputReady(btn as HTMLButtonElement, value);
            }
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
        moveFocus(findNextOfClass(input, 'word-input', undefined, -1) as HTMLInputElement);
        return;
    }
    else if (code == 'Enter' || code == 'PageDown') {
        moveFocus(findNextOfClass(input, 'word-input') as HTMLInputElement);
        return;
    }

    saveWordLocally(input);
}

/**
 * Update extractions that come from word input
 * @param extractedId The ID of an extraction area
 */
export function updateWordExtraction(extractedId:string|null) {
    var extracted = document.getElementById(extractedId || 'extracted');

    if (extracted == null) {
        return;
    }
    
    let inputs = document.getElementsByClassName('word-input');
    const sorted_inputs = SortElements(inputs);
    const parts:string[] = [];
    let hasWordExtraction = false;
    let partial = false;
    let ready = true;
    let hiddens = false;
    for (let i = 0; i < sorted_inputs.length; i++) {
        const input = sorted_inputs[i];
        if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
            continue;
        }
        if (hasClass(input, 'extract-literal')) {
            parts.push(HiddenExtract(input, false));
            hiddens = true;
            continue;
        }
        var index = getOptionalStyle(input, 'data-extract-index', '') as string;
        if (index === null) {
            continue;
        }
        hasWordExtraction = true;
        const indeces = index.split(' ');
        let letters = '';
        for (let j = 0; j < indeces.length; j++) {
            const inp = input as HTMLInputElement;  
            const letter = extractWordIndex(inp.value, indeces[j]);
            if (letter) {
                letters += letter;
                partial = partial || (letter != '_');
                ready = ready && (letter != '_');
            }
        }
        parts.push(letters);
    }
    if (hiddens) {
        let p = 0;
        for (let i = 0; i < sorted_inputs.length; i++) {
            const input = sorted_inputs[i];
            if (extractedId && getOptionalStyle(input, 'data-extracted-id', undefined, 'extracted-') != extractedId) {
                continue;
            }
            if (hasClass(input, 'extract-literal')) {
                parts[p] = HiddenExtract(input, ready, parts);
            }
            p++;
        }
    }
    let extraction = parts.join('');

    if (hasWordExtraction) {
        ApplyExtraction(extraction, extracted, !partial);
    }
}

/**
 * Extract a single letter from an input. Either using an absolute index, or else a word.letter index.
 * @param input User's input string
 * @param index Index rule: either one number (absolute index, starting at 1), or a decimal number (word.letter, each starting at 1)
 */
export function extractWordIndex(input:string, index:string) {
    const dot = index.split('.');
    let letter_index:number;
    if (dot.length == 2) {
        let word_index = parseInt(dot[0]);
        letter_index = parseInt(dot[1]) - 1;
        const words = input.split(' ');
        input = '';
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
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
        return null;  // bogus index
    }
    if (letter_index < input.length) {
        return input[letter_index];
    }
    return '_';
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
    inputChangeCallback(input, event.key);
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
    inputChangeCallback(input, event.key);
    saveWordLocally(input);
}

/**
 * Anytime any note changes, inform any custom callback
 * @param inp The affected input
 * @param key The key from the event that led here
 */
function inputChangeCallback(inp: HTMLInputElement, key:string) {
    const fn = theBoiler().onInputChange;
    if (fn) {
        fn(inp);
    }
    const doc = getOptionalStyle(inp, 'data-onchange');
    if (doc) {
        const func = window[doc];
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
function findNextInput( start: Element, 
                        dx: number, 
                        dy: number, 
                        cls: string, 
                        clsSkip: string|undefined)
                        : HTMLInputElement {
    const root2d = findParentOfClass(start, 'letter-grid-2d');
    const loop = findParentOfClass(start, 'loop-navigation');
    let find:HTMLInputElement|null = null;
    if (root2d != null) {
        find = findNext2dInput(root2d, start, dx, dy, cls, clsSkip);
        if (find != null) {
            return find;
        }
    }
    const discoverRoot = findParentOfClass(start, 'letter-grid-discover');
    if (discoverRoot != null) {
        find = findNextDiscover(discoverRoot, start, dx, dy, cls, clsSkip) as HTMLInputElement|null;
        if (find != null) {
            return find;
        }
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
    const back = dx == -plusX || dy < 0;
    let next = findNextOfClassGroup(start, cls, clsSkip, 'text-input-group', back ? -1 : 1) as HTMLInputElement;
    while (next != null && next.disabled) {
        next = findNextOfClassGroup(next, cls, clsSkip, 'text-input-group', back ? -1 : 1) as HTMLInputElement;
    }
    if (loop != null && findParentOfClass(next, 'loop-navigation') != loop) {
        find = findFirstChildOfClass(loop, cls, clsSkip, back ? -1 : 1) as HTMLInputElement;
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
function findNextOfClassGroup(  start: Element,
                                cls: string, 
                                clsSkip: string|undefined, 
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
                            clsSkip: string|undefined)
                            : HTMLInputElement {
  // TODO: root
    if (dy != 0) {
        // In a 2D grid, up/down keep their relative horizontal positions
        var parent = findParentOfClass(start, 'letter-cell-block');
        var index = indexInContainer(start, parent as Element, cls);
        var nextParent = findNextOfClass(parent as Element, 'letter-cell-block', 'letter-grid-2d', dy);
        while (nextParent != null) {
            var dest:HTMLInputElement = childAtIndex(nextParent, cls, index) as HTMLInputElement;
            if (dest != null && !hasClass(dest, clsSkip)) {
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
                            clsSkip: string|undefined)
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

/**
 * Smallest rectangle that bounds both inputs
 */
function union(rect1:DOMRect, rect2:DOMRect) :DOMRect {
    const left = Math.min(rect1.left, rect2.left);
    const right = Math.max(rect1.right, rect2.right);
    const top = Math.min(rect1.top, rect2.top);
    const bottom = Math.max(rect1.bottom, rect2.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
  }

/**
 * Distort a distance by a sympathetic factor
 * @param delta An actual distance (either horizontal or vertical)
 * @param bias A desired direction of travel, within that axis
 * @returns Shrinks delta, when it aligns with bias, stretches when orthogonal, and -1 when in the wrong direction
 */
function bias(delta:number, bias:number) {
    if (bias != 0) {
        if (delta * bias > 0) {
            return Math.abs(delta * 0.8);  // sympathetic bias shrinks distance
        }
        else {
            return -1;  // anti-bias invalidates distance
        }
    }
    return Math.abs(delta) * 1.2;  // orthogonal bias stretches distance
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
function biasedDistance(from:DOMPoint, toward:DOMPoint, bx:number, by:number) :number {
    let dx = bias(toward.x - from.x, bx);
    let dy = bias(toward.y - from.y, by);
    if (dx < 0 || dy < 0) {
        return -1;  // Invalid target
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
function wrapAround(world:DOMRect, pos:DOMPoint, dx:number, dy:number) :DOMPoint {
    if (dx > 0) {  // wrap around right to far left
        return new DOMPoint(world.left - dx, pos.y);
    }
    if (dx < 0) {  // wrap around left to far right
        return new DOMPoint(world.right - dx, pos.y);
    }
    if (dy > 0) {  // wrap around bottom to far top
        return new DOMPoint(pos.x, world.top - dy);
    }
    if (dy < 0) {  // wrap around top to far bottom
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
function findNextDiscover(root: Element,
                            start: Element, 
                            dx: number, 
                            dy: number, 
                            cls: string, 
                            clsSkip: string|undefined)
                            : HTMLElement|null {
    let rect = start.getBoundingClientRect();
    let bounds = rect;
    let pos = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const elements = document.getElementsByClassName(cls);
    let distance = -1;
    let nearest:HTMLElement|null = null;
    for (let i = 0; i < elements.length; i++) {
        const elmt = elements[i] as HTMLElement;
        if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
            continue;
        }
        if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
            continue;
        }
        rect = elmt.getBoundingClientRect();
        bounds = union(bounds, rect);
        let center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        let d2 = biasedDistance(pos, center, dx, dy);
        if (d2 > 0 && (nearest == null || d2 < distance)) {
            nearest = elmt;
            distance = d2;
        }
    }
    if (nearest == null) {
        // Wrap around
        pos = wrapAround(bounds, pos, dx, dy);
        for (let i = 0; i < elements.length; i++) {
            const elmt = elements[i] as HTMLElement;
            if (clsSkip != undefined && hasClass(elmt, clsSkip)) {
                continue;
            }
            if (root != null && root != findParentOfClass(elmt, 'letter-grid-discover')) {
                continue;
            }
            rect = elmt.getBoundingClientRect();
            let center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
            let d2 = biasedDistance(pos, center, dx, dy);
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
export function autoCompleteWord(input:HTMLInputElement|HTMLTextAreaElement, list:string[]) {
    var value = input.value.toLowerCase();
    var match:string|null = null;
    for (let i of list) {
      if (i.toLowerCase().indexOf(value) == 0) {
        if (match) {
          return false;  // multiple matches
        }
        match = i;
      }
    }
    if (match) {
      var len = input.value.length;
      input.value = match;
      input.setSelectionRange(len, match.length);  // Select the remainder of the word
      return true;
    }
    return false;  // no matches
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
    const tables:HTMLCollectionOf<Element> = document.getElementsByClassName('letter-cell-table');
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const navLiterals = findParentOfClass(table, 'navigate-literals') != null;
        const cells = table.getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            const td = cells[j];
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
                const tr = td.parentNode;
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
    
    var patterns:HTMLCollectionOf<Element> = document.getElementsByClassName('create-from-pattern');
    for (let i = 0; i < patterns.length; i++) {
        var parent = patterns[i];
        var pattern = parseNumberPattern(parent, 'data-letter-pattern');
        var extractPattern = parsePattern(parent, 'data-extract-indeces');
        var numberedPattern = parsePattern2(parent, 'data-number-assignments');
        var vertical = hasClass(parent, 'vertical');  // If set, each input and literal needs to be on a separate line
        var numeric = hasClass(parent, 'numeric');  // Forces inputs to be numeric
        var styles = getLetterStyles(parent, 'underline', 'none', numberedPattern == null ? 'box' : 'numbered');

        if (pattern != null && pattern.length > 0) { //if (parent.classList.contains('letter-cell-block')) {
            var prevCount = 0;
            for (let pi = 0; pi < pattern.length; pi++) {
                if (pattern[pi]['count']) {
                    var count:number = pattern[pi]['count'] as number;
                    var word = document.createElement('span');
                    if (!vertical) {
                        toggleClass(word, 'letter-cell-set', true);  // usually, each number wants to be nobr
                    }
                    for (let ci = 1; ci <= count; ci++) {
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
                        word.appendChild(span);
                        if (vertical && (ci < count || pi < pattern.length - 1)) {
                            word.appendChild(document.createElement('br'));
                        }
                    }
                    parent.appendChild(word);
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
export function getLetterStyles(   elmt: Element, 
                            defLetter: string, 
                            defLiteral: string|undefined, 
                            defExtract: string)
                            : LetterStyles {
    var letter = getOptionalStyle(elmt, 'data-letter-style', undefined, 'letter-')
        || getOptionalStyle(elmt, 'data-input-style', defLetter, 'letter-');
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
    for (let pi = 0; pi < pattern.length; pi++) {
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
    const cells = document.getElementsByClassName('letter-cell');
    let extracteeIndex:number = 1;
    let extractorIndex:number = 1;
    for (let i = 0; i < cells.length; i++) {
        const cell:HTMLElement = cells[i] as HTMLElement;
        const navLiterals = findParentOfClass(cell, 'navigate-literals') != null;

        // Place a small text input field in each cell
        const inp:HTMLInputElement = document.createElement('input');
        inp.type = 'text';

        // Allow container to inject ID
        let attr:string|null;
        if (attr = cell.getAttributeNS('', 'input-id')) {
            inp.id = attr;
        }     

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
            toggleClass(inp, 'letter-non-input');
            const val = cell.innerText || cell.innerHTML;
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
    for (let i = 0; i < inputs.length; i++) {
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        inp.onkeydown=function(e){onLetterKeyDown(e)};
        inp.onkeyup=function(e){onLetterKeyUp(e)};
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
    for (let i = 0; i < cells.length; i++) {
        const cell:HTMLElement = cells[i] as HTMLElement;
        let inpStyle = getOptionalStyle(cell, 'data-word-style', 'underline', 'word-');

        // Place a small text input field in each cell
        const inp:HTMLInputElement = document.createElement('input');
        inp.type = 'text';
        toggleClass(inp, 'word-input');

        // Allow container to inject ID
        let attr:string|null;
        if (attr = cell.getAttributeNS('', 'input-id')) {
            inp.id = attr;
        }     

        if (hasClass(cell, 'literal')) {
            inp.setAttribute('disabled', '');
            toggleClass(inp, 'word-literal');
            // var span:HTMLElement = document.createElement('span');
            // toggleClass(span, 'word-literal');
            inp.value = cell.innerText;
            cell.innerHTML = '';
            // cell.appendChild(span);
            inpStyle = getOptionalStyle(cell, 'data-literal-style', undefined, 'word-') || inpStyle;
        }
        else {
            inp.onkeydown=function(e){onLetterKeyDown(e)};
            inp.onkeyup=function(e){onWordKey(e)};
            inp.onchange=function(e){onWordChange(e as KeyboardEvent)};
        }

        if (inpStyle != null) {
            toggleClass(inp, inpStyle);
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
        for (let pi = 0; pi < numPattern.length; pi++) {
            if (numPattern[pi]['count']) {
                var count = numPattern[pi]['count'] as number;
                for (let ci = 1; ci <= count; ci++) {
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
    for (let i = 0; i < inputs.length; i++) {
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        if (inp.value != '') {
            return true;
        }
    }
    inputs = document.getElementsByClassName('word-input');
    for (let i = 0; i < inputs.length; i++) {
        const inp:HTMLInputElement = inputs[i] as HTMLInputElement;
        if (inp.value != '') {
            return true;
        }
    }
    return false;
}

/**
 * Setup a click handler on the page to help sloppy clickers find inputs
 * @param page 
 */
export function clicksFindInputs(page:HTMLDivElement) {
    page.addEventListener('click', function (e) { focusNearestInput(e); } );
}

/**
 * Move the focus to the nearest input-appropriate element.
 * @param evt A mouse event
 */
function focusNearestInput(evt:MouseEvent) {
    // Ignore shift states
    // Ignore fake events (!isTrusted)
    if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey && evt.isTrusted) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i] as HTMLElement;
            if ((target.getAttribute('disabled') === null) &&
                (isTag(target, 'input') || isTag(target, 'textarea') || isTag(target, 'select') || isTag(target, 'a'))) {
                return;  // Shouldn't need my help
            }
            if (hasClass(target, 'stampTool') || hasClass(target, 'stampable') || hasClass(target, 'stampLock')) {
                return;  // Stamping elements don't handle their own clicks; the page does
            }
            if (target.id == 'page' || target.id == 'scratch-pad' || hasClass(target as Node, 'scratch-div')) {
                break;  // Found none. Continue below
            }
            if (target.onclick || target.onmousedown || target.onmouseup 
                || target.onpointerdown || target.onpointerup || hasClass(target, 'clickable')) {
                return;  // Target has its own handler
            }
        }

        let nearestD:number = NaN;
        let nearest:HTMLElement|undefined = undefined;
        const tags = ['input', 'textarea', 'select', 'a', 'clickable'];

        for (let t = 0; t < tags.length; t++) {
            const elements = tags[t] === 'clickable' ? document.getElementsByClassName(tags[t])
                : document.getElementsByTagName(tags[t]);
            for (let i = 0; i < elements.length; i++) {
                const elmt = elements[i] as HTMLElement;
                if (elmt.style.display !== 'none' && elmt.getAttribute('disabled') === null) {
                    const d = distanceToElement(evt, elmt);
                    if (Number.isNaN(nearestD) || d < nearestD) {
                        nearest = elmt;
                        nearestD = d;
                    }
                }
            }
        }

        if (nearest) {
            if (isTag(nearest, 'a') && nearestD < 50) {  // 1/2 inch max
                nearest.click();
            }
            else if (hasClass(nearest, 'clickable')) {
                nearest.click();
            }
            else {
                nearest.focus();
            }
        }
    }

}

/**
 * Distance between a mouse event and the nearest edge or corner of an element
 * @param evt A mouse event
 * @param elmt A rectangular element
 * @returns A distance in client pixels
 */
function distanceToElement(evt:MouseEvent, elmt:HTMLElement):number {
    const rect = elmt.getBoundingClientRect();
    if (evt.clientX < rect.left) {
        if (evt.clientY < rect.top) {
            return distanceP2P(evt.clientX, evt.clientY, rect.left, rect.top);
        }
        if (evt.clientY < rect.bottom) {
            return distanceP2P(evt.clientX, evt.clientY, rect.left, evt.clientY);
        }
        return distanceP2P(evt.clientX, evt.clientY, rect.left, rect.bottom);
    }
    if (evt.clientX > rect.right) {
        if (evt.clientY < rect.top) {
            return distanceP2P(evt.clientX, evt.clientY, rect.right, rect.top);
        }
        if (evt.clientY < rect.bottom) {
            return distanceP2P(evt.clientX, evt.clientY, rect.right, evt.clientY);
        }
        return distanceP2P(evt.clientX, evt.clientY, rect.right, rect.bottom);
    }
    if (evt.clientY < rect.top) {
        return distanceP2P(evt.clientX, evt.clientY, evt.clientX, rect.top);
    }
    if (evt.clientY < rect.bottom) {
        return 0;
    }
    return distanceP2P(evt.clientX, evt.clientY, evt.clientX, rect.bottom);
}

/**
 * Pythagorean distance, but favor X more than Y
 * @returns A distance in client pixels
 */
function distanceP2P(x1:number, y1:number, x2:number, y2:number):number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) * 3);
}

/*-----------------------------------------------------------
 * _subway.ts
 *-----------------------------------------------------------*/


/**
 * On page load, look for any instances of elements tag with class names we respond to.
 * When found, expand those elements appropriately.
 */
export function setupSubways() {
  const subways = document.getElementsByClassName('subway');
  for (let i = 0; i < subways.length; i++) {
      createSubway(subways[i] as HTMLElement);
  }
}

/**
 * Maximum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current max value, which can be null
 * @returns The max
 */
function maxx(val:number, curr?:number):number {
  return (!curr || curr < val) ? val : curr;
}
/**
 * Minimum of two numbers, or the second, if current is null
 * @param val A new value
 * @param curr The current min value, which can be null
 * @returns The min
 */
function minn(val:number, curr?:number):number {
  return (!curr || curr > val) ? val : curr;
}

function bounding(pt:DOMPoint, rect?:DOMRect) :DOMRect {
  if (!rect) {
      return  new DOMRect(pt.x, pt.y, 0, 0);
  }
  const left = minn(rect.left, pt.x);
  const right = maxx(rect.right, pt.x);
  const top = minn(rect.top, pt.y);
  const bottom = maxx(rect.bottom, pt.y);
  return new DOMRect(left, top, right - left, bottom - top);
}

/**
 * Round a value to the nearest 0.1
 * @param n Any number
 * @returns A number with no significant digits smaller than a tenth
 */
function dec(n:number) {
  return Math.round(n * 10) / 10;
}

type SubwayPath = {
  origin:DOMRect;
  path_d:string;
  bounds:DOMRect;
  shift:DOMPoint;
}

/**
 * Create an SVG inside a <div class='subway'>, to connect input cells.
 * @param subway 
 */
function createSubway(subway:HTMLElement) {
  let details = verticalSubway(subway);
  if (!details) {
    details = horizontalSubway(subway);
  }
  if (details) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const path = document.createElementNS(xmlns, 'path');

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
function verticalSubway(subway:HTMLElement) :SubwayPath|undefined {
  const origin = subway.getBoundingClientRect();
  let sLefts:string = subway.getAttributeNS('', 'data-left-end') || '';
  let sRights:string = subway.getAttributeNS('', 'data-right-end') || '';
  if (sLefts.length == 0 && sRights.length == 0) {
    return undefined;
  }

  const leftId:string|null = subway.getAttributeNS('', 'data-left-id');
  const rightId:string|null = subway.getAttributeNS('', 'data-right-id');
  sLefts = joinIds(leftId, sLefts);
  sRights = joinIds(rightId, sRights);

  let bounds:DOMRect|undefined;
  const yLefts:number[] = [];
  const yRights:number[] = [];

  // right-side spurs
  const rights = sRights.split(' ');
  for (let i = 0; i < rights.length; i++) {
      const pt = getAnchor(rights[i], 'left');
      bounds = bounding(pt, bounds);
      yRights.push(dec(pt.y - origin.top));
  }

  // left-side spurs
  const lefts = sLefts.split(' ');
  for (let i = 0; i < lefts.length; i++) {
      const pt = getAnchor(lefts[i], 'right');
      bounds = bounding(pt, bounds);
      yLefts.push(dec(pt.y - origin.top));
  }

  if (!bounds) {
    return;  // ERROR
  }
  // rationalize the boundaries
  const shift_left = minn(0, bounds.left - origin.left);
  const left = maxx(0, dec(bounds.left - origin.left - shift_left));
  const right = dec(bounds.left + bounds.width - origin.left - shift_left);

  // belatedly calculate the middle
  const sMiddle = subway.getAttributeNS('', 'data-center-line');
  let middle:number;
  if (!sMiddle) {
    middle = bounds.width / 2;
  }
  else if (sMiddle.indexOf('%') == sMiddle.length - 1) {
      middle = dec(parseInt(sMiddle) * bounds.width / 100);
  }
  else {
      middle = parseInt(sMiddle);
  }
  
  let d = '';
  if (bounds.height <= 2.5 && yLefts.length == 1 && yRights.length == 1) {
    d = 'M' + left + ',' + yLefts[0]
      + ' L' + right + yRights[0];
  }
  else {
    // Draw the first left to the last right
    let d = 'M' + left + ',' + yLefts[0] 
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
    for (let i = 1; i < yLefts.length - 1; i++) {
        d += 'M' + left + ',' + yLefts[i] 
            + ' L' + middle + ',' + yLefts[i]
            + ' L' + middle + ',' + yRights[0];
    }
    for (let i = 1; i < yRights.length - 1; i++) {
        d += 'M' + right + ',' + yRights[i] 
            + ' L' + middle + ',' + yRights[i]
            + ' L' + middle + ',' + yLefts[0];
    }
  }

  return {
    origin: origin,
    path_d: d,
    bounds: bounds,
    shift: new DOMPoint(shift_left, 0)
  } as SubwayPath;
}

function joinIds(id:string|null, indeces:string) :string {
  if (!id || !indeces) {
    return indeces;
  }
  const list = indeces.split(' ').map(i => id + '.' + i);
  return list.join(' ');
}

/**
 * Build the paths of a horizontally-oriented subway
 * @param subway The <div class='subway' with coordinate info
 * @returns Details for the SVG and PATH to be created, or undefined if the div does not indicate horizontal
 */
function horizontalSubway(subway:HTMLElement) :SubwayPath|undefined {
  const origin = subway.getBoundingClientRect();
  let sTops:string = subway.getAttributeNS('', 'data-top-end') || '';
  let sBottoms:string = subway.getAttributeNS('', 'data-bottom-end') || '';
  if (sTops.length == 0 && sBottoms.length == 0) {
    return undefined;
  }

  const topId:string|null = subway.getAttributeNS('', 'data-top-id');
  const bottomId:string|null = subway.getAttributeNS('', 'data-bottom-id');
  sTops = joinIds(topId, sTops);
  sBottoms = joinIds(bottomId, sBottoms);

  let bounds:DOMRect|undefined;
  const xTops:number[] = [];
  const xBottoms:number[] = [];

  // top-side spurs
  if (sBottoms.length > 0) {
    const bottoms = sBottoms.split(' ');
    for (let i = 0; i < bottoms.length; i++) {
        const pt = getAnchor(bottoms[i], 'top');
        bounds = bounding(pt, bounds);
        xBottoms.push(dec(pt.x - origin.left));
    }  
  }

  // bottom-side spurs
  if (sTops.length > 0) {
    const tops = sTops.split(' ');
    for (let i = 0; i < tops.length; i++) {
        const pt = getAnchor(tops[i], 'bottom');
        bounds = bounding(pt, bounds);
        xTops.push(dec(pt.x - origin.left));
    }  
  }

  if (!bounds) {
    return;  // ERROR
  }

  // belatedly calculate the middle
  const sMiddle = subway.getAttributeNS('', 'data-center-line');
  let middle:number;
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
  const shift_top = minn(0, bounds.top - origin.top);  // zero or negative
  const top = maxx(0, dec(bounds.top - origin.top - shift_top));
  const bottom = dec(bounds.top + bounds.height - origin.top - shift_top);
  
  let d = '';
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
    for (let i = 0; i < xTops.length; i++) {
        d += ' M' + xTops[i] + ',' + middle
          + ' v' + -middle;
    }
    // Draw all down-facing spurs
    for (let i = 0; i < xBottoms.length; i++) {
        d += ' M' + xBottoms[i] + ',' + middle
          + ' v' + dec(bounds.height - middle);
    }
  }

  return {
    origin: origin,
    path_d: d,
    bounds: bounds,
    shift: new DOMPoint(0, shift_top)
  } as SubwayPath;
}

/**
 * Find a point on the perimeter of a specific subway cell
 * @param id_index A cell identity in the form "col1.4", where col1 is a letter-cell-block and .4 is the 4th cell in that block
 * @param edge One of {left|right|top|bottom}. The point is the midpoint of that edge of the cell
 * @returns A point on the page in client coordinates
 */
function getAnchor(id_index:string, edge:string):DOMPoint {
  const idx = id_index.split('.');
  let elmt = document.getElementById(idx[0]) as HTMLElement;
  if (idx.length > 1) {
      const children = elmt.getElementsByClassName('letter-cell');
      elmt = children[parseInt(idx[1]) - 1] as HTMLElement;  // indexes start at 1
  }
  const rect = elmt.getBoundingClientRect();
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
    elem.onpointerdown=function(e){onClickDrag(e)};
    elem.ondrag=function(e){onDrag(e)};
    elem.ondragend=function(e){onDragDrop(e)};
}

/**
 * Hook up the necessary mouse events to each drop target
 * @param elem a drop-target element
 */
function preprocessDropTarget(elem:HTMLElement) {
    elem.onpointerup=function(e){onClickDrop(e)};
    elem.ondragenter=function(e){onDropAllowed(e)};
    elem.ondragover=function(e){onDropAllowed(e)};
    elem.onpointermove=function(e){onTouchDrag(e)};
}

/**
 * Hook up the necessary mouse events to each free drop target
 * @param elem a free-drop element
 */
function preprocessFreeDrop(elem:HTMLElement) {
    elem.onpointerdown=function(e){doFreeDrop(e)};
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
function onClickDrop(event:PointerEvent) {
    const target = event.target as HTMLElement;
    if (!target || target.tagName == 'INPUT') {
        return;
    }
    if (_dragSelected != null) {
        let dest = findParentOfClass(target, 'drop-target') as HTMLElement;
        if (event.pointerType == 'touch') {
            // Touch events' target is really the source. Need to find target
            let pos = document.elementFromPoint(event.clientX, event.clientY);
            if (pos) {
                pos = findParentOfClass(pos, 'drop-target');
                if (pos) {
                    dest = pos as HTMLElement;
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
 * Touch move events should behave like drag.
 * @param event Any pointer move, but since we filter to touch, they must be dragging
 */
function onTouchDrag(event:PointerEvent) {
    if (event.pointerType == 'touch') {
        console.log('touch-drag to ' + event.x + ',' + event.y);
        onDrag(event);
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
    if (moveable != null && destination != null && !isSelfOrParent(moveable, destination)) {
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
 * The tool name to cycle to first.
 */
let _firstTool:HTMLElement|null = null;
/**
 * A tool name which, as a side effect, extract an answer from the content under it.
 */
let _extractorTool:HTMLElement|null = null;
/**
 * The tool name that would erase things.
 */
let _eraseTool:HTMLElement|null = null;

/**
 * Type structure of a stamp tool, as provided to a classStampPalette template
 */
export type StampToolDetails = {
    id: string,
    modifier?: string,
    label?: string,
    img?: string,  // img src url
    next?: string,  // id of another tool
    data?: string,  // extra data, depending on context
};

let stamps_can_drag = false;

/**
 * A document can only support a single stamp palette.
 * @returns The palette container, if one exists, else null
 */
function findStampPalette():HTMLElement|null {
    return document.getElementById('stampPalette');
}

/**
 * Scan the page for anything marked stampable or a draw tool
 */
export function preprocessStampObjects() {
    const containers = document.getElementsByClassName('stampable-container');
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLElement;
        const rules = getOptionalStyle(container, 'data-stampable-rules');
        if (rules) {
            const list = rules.split(' ');
            for (let r = 0; r < list.length; r++) {
                const rule = list[r];
                if (rule[0] == '.') {
                    const children = container.getElementsByClassName(rule.substring(1));
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'stampable', true);
                    }
                }
                else if (rule[0] == '#') {
                    const child = document.getElementById(rule.substring(1));
                    toggleClass(child, 'stampable', true);
                }
                else {
                    const children = container.getElementsByTagName(rule.toLowerCase());
                    for (let i = 0; i < children.length; i++) {
                        toggleClass(children[i], 'stampable', true);
                    }
                }
            }
        }
        container.addEventListener('pointerdown', pointerDownInContainer);
        if (hasClass(container, 'stamp-drag')) {
            stamps_can_drag = true;
            container.addEventListener('pointerup', pointerUpInContainer);
            container.addEventListener('pointermove', pointerMoveInContainer);
            container.addEventListener('pointerleave', pointerLeaveContainer);    
        }
    }

    let elems = document.getElementsByClassName('stampable');
    if (containers.length == 0 && elems.length > 0) {
        const container = document.getElementById('pageBody');
        if (container) {
            container.addEventListener('pointerdown', pointerDownInContainer);
            // container.addEventListener('pointerup', pointerUpInContainer);
            // container.addEventListener('pointermove', pointerMoveInContainer);
            // container.addEventListener('pointerleave', pointerLeaveContainer);
        }
        // for (let i = 0; i < elems.length; i++) {
        //     const elmt = elems[i] as HTMLElement;
        //     elmt.onpointerdown=function(e){onClickStamp(e, findStampableAtPointer(e))};
        //     //elmt.ondrag=function(e){onMoveStamp(e)};
        //     elmt.onpointerenter=function(e){onMoveStamp(e)}; 
        //     elmt.onpointerleave=function(e){preMoveStamp(e)};
        // }
    }

    elems = document.getElementsByClassName('stampTool');
    for (let i = 0; i < elems.length; i++) {
        const elmt = elems[i] as HTMLElement;
        _stampTools.push(elmt);
        elmt.onclick=function(e){onSelectStampTool(e)};
    }

    const palette = findStampPalette();
    if (palette != null) {
        let id = palette.getAttributeNS('', 'data-tool-extractor');
        _extractorTool = id != null ? document.getElementById(id) : null;
        id = palette.getAttributeNS('', 'data-tool-erase');
        _eraseTool = id != null ? document.getElementById(id) : null;
        id = palette.getAttributeNS('', 'data-tool-first');
        _firstTool = id != null ? document.getElementById(id) : null;
    }

    if (!_firstTool) {
        _firstTool = _stampTools[0];
    }
}

let prevStampablePointer:HTMLElement|null = null;
function pointerDownInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt) {
        prevStampablePointer = elmt;
        onClickStamp(event, elmt);
    }
}

function pointerUpInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    prevStampablePointer = null;
}

function pointerMoveInContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    const elmt = findStampableAtPointer(event);
    if (elmt !== prevStampablePointer) {
        if (prevStampablePointer) {
            preMoveStamp(event, prevStampablePointer);
        }
        if (elmt) {
            onMoveStamp(event, elmt);
        }
        prevStampablePointer = elmt;
    }
}

function pointerLeaveContainer(event:PointerEvent) {
    if (!isPrimaryButton(event)) {
        return;
    }
    if (event.pointerType != 'mouse' && stamps_can_drag) {
        event.preventDefault();
    }
    if (prevStampablePointer) {
        preMoveStamp(event, prevStampablePointer);
    }
    prevStampablePointer = null;
}

function findStampableAtPointer(event:PointerEvent):HTMLElement|null {
    const stampable = document.getElementsByClassName('stampable');
    for (let i = 0; i < stampable.length; i++) {
        const rect = stampable[i].getBoundingClientRect();
        if (rect.left <= event.clientX && rect.right > event.clientX
                && rect.top <= event.clientY && rect.bottom > event.clientY) {
            return stampable[i] as HTMLElement;
        }
    }
    return null;
}

/**
 * Called when a draw tool is selected from the palette
 * @param event The click event
 */
function onSelectStampTool(event:MouseEvent) {
    const tool = findParentOfClass(event.target as HTMLElement, 'stampTool') as HTMLElement;
    const prevToolId = getCurrentStampToolId();
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

    const fn = theBoiler().onStampChange;
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
function getStampTool(event:PointerEvent, toolFromErase:HTMLElement|null):HTMLElement|null {
    // Shift keys always win
    if (event.shiftKey || event.altKey || event.ctrlKey) {
        for (let i = 0; i < _stampTools.length; i++) {
            const mods = _stampTools[i].getAttributeNS('', 'data-click-modifier');
            if (mods != null
                    && event.shiftKey == (mods.indexOf('shift') >= 0)
                    && event.ctrlKey == (mods.indexOf('ctrl') >= 0)
                    && event.altKey == (mods.indexOf('alt') >= 0)) {
                return _stampTools[i];
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
        return _selectedTool;
    }

    // If no selection, the first tool is the default
    return _firstTool;
}

/**
 * A stamp is referenced by the object it was stamped upon.
 * Look up the original stampTool element.
 * @param id The stamp ID
 * @returns An HTMLElement, unless the stamping is malformed.
 */
function getStampToolById(id:string|null):HTMLElement|null {
    return id ? document.getElementById(id) : null;
}

/**
 * Given one tool, currently applied to a target, what is the next stamp in rotation?
 * @param tool The current tool's HTMLElement, or null if none.
 * @returns The next tool's HTMLElement, or else the _firstTool
 */
function getNextStampTool(tool:HTMLElement|null):HTMLElement|null {
    if (tool) {
        const nextId = tool.getAttributeNS('', 'data-next-stamp-id');
        if (nextId) {
            return document.getElementById(nextId);
        }
        const palette = findStampPalette();
        if (palette) {
            const curIndex = siblingIndexOfClass(palette, tool, 'stampTool');
            return findNthChildOfClass(palette, 'stampTool', curIndex + 1) as HTMLElement|null;
        }
    }
    return _firstTool;
} 

/**
 * Expose current stamp tool, in case other features want to react
 */
export function getCurrentStampToolId() {
    if (_selectedTool == null) {
        return '';
    }
    var id = _selectedTool.id;
    return id || '';
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
function eraseStamp(target:HTMLElement):HTMLElement|null {
    if (target == null) {
        return null;
    }
    const parent = getStampParent(target);

    const cur = findFirstChildOfClass(parent, 'stampedObject');
    let curId:string|null;
    if (cur != null) {
        // The target contains a stampedObject, which was injected by a template
        // The tool itself is likely stamped on the parent, but check everywhere
        curId = getOptionalStyle(cur, 'data-stamp-id');
        toggleClass(target, curId, false);
        parent.removeChild(cur);
        parent.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction();
    }
    else if (hasClass(target, 'stampedObject')) {
        // Template is a class on the container itself
        curId = target.getAttributeNS('', 'data-stamp-id');
        toggleClass(target, 'stampedObject', false);
        toggleClass(target, curId, false);
        target.removeAttributeNS('', 'data-stamp-id');
        updateStampExtraction();
    }
    else {
        return null;  // This cell is currently blank
    }

    if (_selectedTool && _selectedTool.id == curId) {
        // When a tool is explicitly selected, clicking on that type toggles it back off
        return _eraseTool;
    }
    if (_selectedTool == null) {
        // If no tool is selected, clicking on anything rotates it to the next tool in the cycle
        if (curId) {
            const curTool = getStampToolById(curId);
            const nextTool = getNextStampTool(curTool);
            return nextTool;
        }
    }

    // No guidance on what to replace this cell with
    return null;
}

/**
 * Draw on the target surface, using the named tool.
 * @param target The surface on which to draw
 * @param tool The stampTool object that defines a tool
 * A stampTool can then define behavior in several ways...
 *  - data-template-id       id of a template to instantiate
 *  - data-use-template-id   id of a builder template to use, passing arguments
 *  - data-style             apply the named style(s) to the destination
 *  - data-unstyle           remove the named style(s) from the destination
 *  - data-erase             simply delete the existing contents
 * A stampTool can also define the next element in a rotation
 *  - data-next-id           id of another stampTool
 *                           otherwise it will rotate through stampTools in visual order
 */
export function doStamp(target:HTMLElement, tool:HTMLElement) {
    const parent = getStampParent(target);
    
    // Template can be null if tool removes drawn objects
    const tmpltId = tool.getAttributeNS('', 'data-template-id');
    const useId = tool.getAttributeNS('', 'data-use-template-id');
    const styles = tool.getAttributeNS('', 'data-style');
    const unstyles = tool.getAttributeNS('', 'data-unstyle');
    const erase = tool.getAttributeNS('', 'data-erase');
    if (tmpltId) {
        let template = document.getElementById(tmpltId) as HTMLTemplateElement;
        if (template != null) {
            // Inject the template into the stampable container
            const clone = template.content.cloneNode(true);
            parent.appendChild(clone);
        }
        parent.setAttributeNS('', 'data-stamp-id', tool.id);
    }
    else if (useId) {
        const nodes = useTemplate(tool, useId);
        for (let i = 0; i < nodes.length; i++) {
            parent.appendChild(nodes[i]);
        }
        parent.setAttributeNS('', 'data-stamp-id', tool.id);
    }
    else if (erase != null) {
        // Do nothing. The caller should already have removed any existing contents
    }

    // Styles can coexist with templates
    if (styles || unstyles) {
        toggleClass(target, 'stampedObject', true);
        target.setAttributeNS('', 'data-stamp-id', tool.id);
        
        if (styles) {
            // Apply one or more styles (delimited by spaces)
            // to the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            const split = styles.split(' ');
            for (let i = 0; i < split.length; i++) {
                toggleClass(target, split[i], true);
            }
        }
        if (unstyles) {
            // Apply one or more styles (delimited by spaces)
            // to the target itself. NOT to some parent stampable object.
            // No parent needed if we're not injecting anything.
            const split = unstyles.split(' ');
            for (let i = 0; i < split.length; i++) {
                toggleClass(target, split[i], false);
            }
        }    
    }

    updateStampExtraction();
    saveStampingLocally(target);

    const fn = theBoiler().onStamp;
    if (fn) {
        fn(target);
    }
}

let _dragDrawTool:HTMLElement|null = null;
let _lastDrawTool:HTMLElement|null = null;

/**
 * Draw where a click happened.
 * Which tool is taken from selected state, click modifiers, and current target state.
 * @param event The mouse click
 */
function onClickStamp(event:PointerEvent, target:HTMLElement) {
    let nextTool = eraseStamp(target);
    nextTool = getStampTool(event, nextTool);
    if (nextTool) {
        doStamp(target, nextTool);   
    }
    _lastDrawTool = nextTool;
    _dragDrawTool = null;
}

function isPrimaryButton(event:PointerEvent) {
    return event.pointerType != 'mouse' || event.buttons == 1;
}

/**
 * Continue drawing when the mouse is dragged, using the same tool as in the cell we just left.
 * @param event The mouse enter event
 */
function onMoveStamp(event:PointerEvent, target:HTMLElement) {
    if (_dragDrawTool != null) {
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
function preMoveStamp(event:PointerEvent, target:HTMLElement) {
    if (target != null) {
        const cur = findFirstChildOfClass(target, 'stampedObject');
        if (cur != null) {
            const stampId = getOptionalStyle(cur, 'data-stamp-id');
            _dragDrawTool = stampId ? document.getElementById(stampId) : null;
        }
        else {
            _dragDrawTool = _lastDrawTool;
        }
    }
    else {
        _dragDrawTool = null;
    }
}

/**
 * Drawing tools can be flagged to do extraction.
 */
function updateStampExtraction() {
    if (!_extractorTool) {
        return;
    }
    const extracted = document.getElementById('extracted');
    if (extracted != null) {
        const drawnObjects = document.getElementsByClassName('stampedObject');
        let extraction = '';
        for (let i = 0; i < drawnObjects.length; i++) {
            const tool = getOptionalStyle(drawnObjects[i], 'data-stamp-id');
            if (tool == _extractorTool.id) {
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
    elem.onpointermove=function(e){onRulerHover(e)};
    elem.onpointerdown=function(e){onLineStart(e)};
    elem.onpointerup=function(e){onLineUp(e)};
}

/**
 * Supported kinds of straight edges. 
 */
export const EdgeTypes = {
    straightEdge: 'straight-edge',
    wordSelect: 'word-select',
    hashiBridge: 'hashi-bridge',
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
 * What is the class of the container: straight-edge-area or word-select-area
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
    maxBridges: number,
    bridgeOffset: number,
    hoverRange: number;
    angleConstraints?: number;
    angleConstraintsOffset: number;
    showOpenDrag: boolean;
    evtPos: DOMPoint;
    evtPoint: SVGPoint;
    nearest?: VertexData;
}

function createPartialRulerData(range:Element):RulerEventData {
    const svg = findParentOfTag(range, 'SVG') as SVGSVGElement;
    const containers = svg.getElementsByClassName(selector_class + '-container');
    const bounds = svg.getBoundingClientRect();
    const max_points = range.getAttributeNS('', 'data-max-points');
    const maxPoints = max_points ? parseInt(max_points) : 2;
    const canShareVertices = range.getAttributeNS('', 'data-can-share-vertices');
    const canCrossSelf = range.getAttributeNS('', 'data-can-cross-self');
    const maxBridges = range.getAttributeNS('', 'data-max-bridges');
    const bridgeOffset = range.getAttributeNS('', 'data-bridge-offset');
    const hoverRange = range.getAttributeNS('', 'data-hover-range');
    const angleConstraints = range.getAttributeNS('', 'data-angle-constraints');
    const showOpenDrag = range.getAttributeNS('', 'data-show-open-drag');
    const angleConstraints2 = angleConstraints ? (angleConstraints+'+0').split('+').map(c => parseInt(c)) : undefined;
    const data:RulerEventData = {
        svg: svg, 
        container: (containers && containers.length > 0) ? containers[0] : svg,
        bounds: bounds,
        maxPoints: maxPoints <= 0 ? 10000 : maxPoints,
        canShareVertices: canShareVertices ? (canShareVertices.toLowerCase() == 'true') : false,
        canCrossSelf: canCrossSelf ? (canCrossSelf.toLowerCase() == 'true') : false,
        maxBridges: maxBridges ? parseInt(maxBridges) : selector_class == EdgeTypes.hashiBridge ? 2 : 1,
        bridgeOffset: bridgeOffset ? parseInt(bridgeOffset) : 2,
        hoverRange: hoverRange ? parseInt(hoverRange) : ((showOpenDrag != 'false') ? 30 : Math.max(bounds.width, bounds.height)),
        angleConstraints: angleConstraints2 ? angleConstraints2[0] : undefined,
        angleConstraintsOffset: angleConstraints2 ? angleConstraints2[1] : 0,
        showOpenDrag: showOpenDrag ? (showOpenDrag.toLowerCase() != 'false') : true,
        evtPos: new DOMPoint(NaN, NaN),  // stub
        evtPoint: svg.createSVGPoint(),  // stub 
    };
    return data;
}

/**
 * Looks up the containing area, and any optional settings
 * @param evt A mouse event within the area
 * @returns A RulerEventData
 */
function getRulerData(evt:MouseEvent):RulerEventData {
    const range = findParentOfClass(evt.target as Element, area_class) as HTMLElement;
    const data = createPartialRulerData(range);
    data.evtPos = new DOMPoint(evt.x, evt.y);
    data.evtPoint = data.svg.createSVGPoint();
    data.evtPoint.x = data.evtPos.x - data.bounds.left;
    data.evtPoint.y = data.evtPos.y - data.bounds.top;

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
    const data = createPartialRulerData(range);
    const vBounds = vertex.getBoundingClientRect();
    data.evtPos = new DOMPoint(vBounds.x + vBounds.width / 2, vBounds.y + vBounds.height / 2);
    data.evtPoint = data.svg.createSVGPoint();
    data.evtPoint.x = data.evtPos.x - data.bounds.left;
    data.evtPoint.y = data.evtPos.y - data.bounds.top;

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
 * Vertex lists are identifiers, so normalize them to be low-to-high
 * @param vertexList A comma-delimited list of vertex indeces
 * @param edge A Polyline, whose points would also need to be reversed
 * @returns An equivalent list, where the first is always < last
 */
function normalizeVertexList(vertexList:string, edge?:SVGPolylineElement):string {
    let list = vertexList.split(',').map(v => parseInt(v));
    if (list.length > 2 && list[1] > list[list.length - 2]) {
        // Reverse the point list too
        if (edge) {
            const pts:SVGPoint[] = [];
            for (let i = edge.points.length - 1; i >= 0; i--) {
                pts.push(edge.points[i]);
            }
            edge.points.clear();
            for (let i = 0; i < pts.length; i++) {
                edge.points.appendItem(pts[i]);
            }
        }

        // Reverse the vertex list
        const rev = list.map(n => isNaN(n) ? '' : String(n)).reverse();
        return rev.join(',');
    }
    return vertexList;  // unchanged
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

    vertexList = normalizeVertexList(vertexList, _straightEdgeBuilder);
    const dupes:Element[] = findDuplicateEdges('data-vertices', vertexList, selector_class, []);
    if (dupes.length >= ruler.maxBridges && _straightEdgeBuilder) {
        // Disallow any more duplicates
        ruler.container.removeChild(_straightEdgeBuilder);
        _straightEdgeBuilder = null;
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
            fill.onmouseenter=function(e){onEdgeHoverStart(e)};
            fill.onmouseleave=function(e){onEdgeHoverEnd(e)};
            fill.onclick=function(e){onDeleteEdge(e)};    
        }
        else {
            _straightEdgeBuilder.onmouseenter=function(e){onEdgeHoverStart(e)};
            _straightEdgeBuilder.onmouseleave=function(e){onEdgeHoverEnd(e)};
            _straightEdgeBuilder.onclick=function(e){onDeleteEdge(e)};        
        }

        dupes.push(_straightEdgeBuilder);
        if (dupes.length > 1) {
            // We have duplicates, so spread them apart
            for (let d = 0; d < dupes.length; d++) {
                const offset = dupes.length == 1 ? 0
                : dupes.length == 2 ? ruler.bridgeOffset * (d * 2 - 1)
                : ruler.bridgeOffset * (d - Math.floor(dupes.length / 2));
                offsetBridge(ruler, dupes[d] as SVGPolylineElement, offset);
            }
        }
        
        if (save) {
            saveStraightEdge(vertexList, true);
        }
    }

    _straightEdgeVertices = [];
    _straightEdgeBuilder = null;
}

/**
 * Move an edge sideways by some amount by turning a simple segment into a C shape.
 * Alternatively, remove the C shape, and return to the simple segment.
 * @param edge The polyline to modify
 * @param offset The amount to offset, or 0 to remove the C shape
 */
function offsetBridge(ruler:RulerEventData, edge:SVGPolylineElement, offset:number) {
    if (edge.points.length < 2) {
        return;
    }

    const oldPoints = (edge as Element).getAttributeNS('', 'points') || '';

    const start = edge.points[0];
    const end = edge.points[edge.points.length - 1];

    const normal = {x:start.y - end.y, y:end.x - start.x}
    const lenNormal = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= lenNormal;
    normal.y /= lenNormal;

    edge.points.clear();
    edge.points.appendItem(start);
    if (offset != 0) {
        const p1 = ruler.svg.createSVGPoint();
        const p2 = ruler.svg.createSVGPoint();
        p1.x = start.x + normal.x * offset;
        p1.y = start.y + normal.y * offset
        p2.x = end.x + normal.x * offset;
        p2.y = end.y + normal.y * offset
        edge.points.appendItem(p1);
        edge.points.appendItem(p2);
    }
    edge.points.appendItem(end);

    if (selector_fill_class) {
        const fills = findDuplicateEdges('points', oldPoints, selector_fill_class, []);
        if (fills.length > 0) {
            // Change just 1 to match
            fills[0].setAttributeNS('', 'points', edge.getAttributeNS('', 'points') || '');
        }
    }
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
    let mod = Math.abs((degrees + data.angleConstraintsOffset) % data.angleConstraints);
    if (mod > data.angleConstraints / 2) {
        mod = data.angleConstraints - mod;
    }
    return mod < 1; // Within 1 degree of constraint angle pattern
}

/**
 * For various reasons, multiple edges can ocupy the same space. Find them all.
 * @param attr The attribute to check
 * @param points The points attribute
 * @param cls A class name to search through
 * @param dupes A list of elements to append to
 */
function findDuplicateEdges(attr:string, points:string, cls:string, dupes:Element[]):Element[] {
    const list = document.getElementsByClassName(cls);
    for (let i = 0; i < list.length; i++) {
        const elmt = list[i] as Element;
        if (elmt.getAttributeNS('', attr) === points) {
            dupes.push(elmt);
        }
    }
    return dupes;
}

/**
 * Delete an existing straight-edge
 * @param edge The edge to remove
 */
function deleteStraightEdge(edge:SVGPolylineElement) {
    const range = findParentOfClass(edge, area_class) as HTMLElement;
    const data = createPartialRulerData(range);

    for (let i = 0; i < _straightEdges.length; i++) {
        if (_straightEdges[i] === edge) {
            _straightEdges.splice(i, 1);
            break;
        }
    }

    // See if there's a duplicate straight-edge, of class word-select
    let dupes:Element[] = [];
    const points = (edge as Element).getAttributeNS('', 'points');
    if (points) {
        dupes = findDuplicateEdges('points', points, selector_class, []);
        if (selector_fill_class) {
            dupes = findDuplicateEdges('points', points, selector_fill_class, dupes);
        }
    }

    let vertexList:string = '';
    for (let d = 0; d < dupes.length; d++) {
        const dupe = dupes[d];
        if (!vertexList) {
            vertexList = dupe.getAttributeNS('', 'data-vertices') || '';
            if (vertexList) {
                saveStraightEdge(vertexList as string, false);  // Deletes from the saved list
            }        
        }
        dupe.parentNode?.removeChild(dupe);
    }

    // See if there were any parallel bridges
    dupes = findDuplicateEdges('data-vertices', vertexList, selector_class, []);
    if (dupes.length >= 1) {
        // If so, re-layout to show fewer
        for (let d = 0; d < dupes.length; d++) {
            const offset = dupes.length == 1 ? 0
                : dupes.length == 2 ? data.bridgeOffset * (d * 2 - 1)
                : data.bridgeOffset * (d - Math.floor(dupes.length / 2));
            offsetBridge(data, dupes[d] as SVGPolylineElement, offset);
        }
    }
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

function distanceToLine(edge: SVGPolylineElement, pt: SVGPoint) {
    const ret = {
        distance: NaN,
        ptOnLine: {x:NaN, y:NaN},
        fractionAlongLine: NaN
    };

    // For our uses, points attribute is always x0 y0 x1 y1
    if (!edge.points || edge.points.length != 2) { 
        return ret; 
    }
    const p0 = edge.points[0];
    const p1 = edge.points[1];

    // Line form: ax + by + c = 0
    const line = {
        a: p0.y - p1.y,
        b: p1.x - p0.x,
        c: -p0.x * (p0.y - p1.y) - p0.y * (p1.x - p1.x) };
    const edgeLen = Math.sqrt(line.a * line.a + line.b * line.b);  // Length of edge
    ret.distance = Math.abs(line.a * pt.x + line.b * pt.y + line.c) / edgeLen;

    // Normal vector
    const nx = line.b / edgeLen;
    const ny = -line.a / edgeLen;
    // Not sure which direction, so consider both directions along normal
    const n1 = {x:nx * ret.distance, y:ny * ret.distance};
    const n2 = {x:nx * -ret.distance, y:ny * -ret.distance};
    // To find point p2 on the line
    ret.ptOnLine = Math.abs(line.a * n1.x + line.b * n1.y) < Math.abs(line.a * n2.x + line.b * n2.y) ? n1 : n2;

    // Calculate where on line, where 0 == p0 and 1 == p1
    ret.fractionAlongLine = line.b != 0 
        ? (ret.ptOnLine.x - p0.x) / line.b
        : (ret.ptOnLine.y - p0.y) / -line.a;
    
        return ret;
}

/**
 * Find the vertex nearest to the mouse event, and within any snap limit
 * @param data The containing area and rules, including mouse event details
 * @returns A vertex data, or null if none close enough
 */
function findEdgeUnder(data:RulerEventData):Element|null {
    let min = data.hoverRange;
    const edges = data.svg.getElementsByClassName(selector_class);
    let nearest:Element|null = null;
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const dtl = distanceToLine(edge as SVGPolylineElement, data.evtPoint);
        if (dtl.distance < min && dtl.fractionAlongLine > 0.1 && dtl.fractionAlongLine < 0.9) {
            // We're reasonably near the line segment
            min = dtl.distance;
            nearest = edge;
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
        for (let i = 0; i < indeces.length; i++) {
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
                // Both of the above set 'building', but complete does not clear it
                toggleClass(vert, 'building', false);
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

function onEdgeHoverStart(evt:MouseEvent) {
    const edge = evt.target as SVGPolylineElement;

}

function onEdgeHoverEnd(evt:MouseEvent) {
    const edge = evt.target as SVGPolylineElement;

}

function onDeleteEdge(evt:MouseEvent) {
    const edge = evt.target as SVGPolylineElement;
    deleteStraightEdge(edge);
}


/*-----------------------------------------------------------
 * _events.ts
 *-----------------------------------------------------------*/

export type LinkDetails = {
  rel: string;  // 'preconnect', 'stylesheet', ...
  href: string;
  type?: string;  // example: 'text/css'
  crossorigin?: string;  // if anything, ''
}

// Any relative paths should be relative to the calling puzzle page's folder
export type PuzzleEventDetails = {
  title?: string;  // The event title (or sub-title, after "Safari ##")
  logo?: string;  // The event's banner logo - large scale
  icon?: string;  // The favicon for all puzzles of this event
  iconRoot?: string  // Folder for other icons - notably puzzle types, feeders, etc.
  puzzleList?: string;  // The URL of the index page for this event. A back-pointer from each puzzle
  cssRoot: string;  // Folder for CSS files for generic puzzle layout. Often shared across events.
  fontCss?: string;  // Specific font stylesheet for this event
  googleFonts?: string;  // comma-delimeted list of font names to load with Google APIs
  links: LinkDetails[];  // A list of additional link tags to add to every puzzle
  qr_folders?: {};  // Folder for any QR codes
  solverSite?: string;  // URL to a separate solver website, where players can enter answers
}

const noEventDetails:PuzzleEventDetails = {
  'cssRoot': '../Css/',
  'links': []
};

const safariDocsDetails:PuzzleEventDetails = {
  'title': 'Puzzyl Utility Library',
  'logo': '../Docs/Images/logo.jpg',
  'icon': '../Docs/Images/monster-book-icon.png',
  'iconRoot': '../24/Icons/',
  'puzzleList': '../Docs/index.html',
  'cssRoot': '../Css/',
  'fontCss': '../Docs/Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': []
};

const safariSingleDetails:PuzzleEventDetails = {
  'title': 'Puzzle',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'puzzleList': '',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': [
//        { rel:'preconnect', href:'https://fonts.googleapis.com' },
//        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
  ]
}

const safariSampleDetails:PuzzleEventDetails = {
  'title': 'Puzzle Safari',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './index.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': []
}

const safari20Details:PuzzleEventDetails = {
  'title': 'Safari Labs',
  'logo': './Images/PS20 logo.png',
  'icon': './Images/Beaker_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './safari.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts20.css',
  'googleFonts': 'Architects+Daughter,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
}

const safari21Details:PuzzleEventDetails = {
  'title': 'Safari Labs',
  'logo': './Images/GS24_banner.png',  // PS21 logo.png',
  'icon': './Images/Plate_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './menuu.xhtml',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
}

const safari24Details:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': '../24/Images/PS24 logo.png',
  'icon': '../24/Images/Sample_Icon.png',
  'iconRoot': '../24/Icons/',
  // 'puzzleList': './safari.html',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
              //    'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
}

const safariDggDetails:PuzzleEventDetails = {
  'title': 'David’s Puzzles',
  'logo': './Images/octopus_watermark.png',
  'icon': './Images/octopus_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './indexx.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat,Righteous,Cormorant+Upright',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/Dgg/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/Dgg/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
}

// Event for the PuzzylSafariTeam branch
const puzzylSafariTeamDetails:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': './Images/Sample_Logo.png',
  'icon': '24/favicon.png',
  'iconRoot': './Icons/',
  'puzzleList': '',
  'cssRoot': 'Css/',
  'fontCss': '24/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',
  'links': [
//        { rel:'preconnect', href:'https://fonts.googleapis.com' },
//        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
  ]
}

const pastSafaris = {
  'Docs': safariDocsDetails,
  'Sample': safariSampleDetails,
  'Single': safariSingleDetails,
  '20': safari20Details,
  '21': safari21Details,
  'Dgg': safariDggDetails,
  '24': safari24Details,
  'gs24': safari21Details,
  'team': puzzylSafariTeamDetails,
}

let safariDetails:PuzzleEventDetails;

/**
* Initialize a global reference to Safari event details
*/
export function initSafariDetails(safariId?:string): PuzzleEventDetails {
  if (!safariId) {
    return safariDetails = noEventDetails;
  }
  if (!(safariId in pastSafaris)) {
    const err = new Error('Unrecognized Safari Event ID: ' + safariId);
    console.error(err);
    return safariDetails = noEventDetails;
  }
  safariDetails = pastSafaris[safariId];
  return safariDetails;
}

/**
* Return the details of this puzzle event
*/
export function getSafariDetails(): PuzzleEventDetails {
  return safariDetails;
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
 * Cache the original, pre-modified HTML, in case there is an error to point to
 */
export let _rawHtmlSource:string;

/**
 * Scan the url for special arguments.
 */
function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1);  // trim leading ?
        var args = search.split('&');
        for (let i = 0; i < args.length; i++) {
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
    if (urlArgs['compare-layout'] != undefined) {
        linkCss('../Css/TestLayoutDiffs.css');  // TODO: path
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
 * Determines if this document's URL was tagged with ?print
 * This is intended to as an alternative way to get a print-look, other than CSS's @media print
 * @returns true if this page's URL contains a print argument (other than false)
 */
export function isPrint() {
    return urlArgs['print'] != undefined && urlArgs['print'] !== false;
}

/**
 * Determines if this document's URL was tagged with ?icon
 * This is intended to as an alternative way to generate icons for each puzzle
 * @returns true if this page's URL contains a print argument (other than false)
 */
export function isIcon() {
    return urlArgs['icon'] != undefined && urlArgs['icon'] !== false;
}

/**
 * Special url arg to override any cached storage. Always restarts.
 * @returns true if this page's URL contains a restart argument (other than =false)
 */
export function isRestart() {
    return urlArgs['restart'] != undefined && urlArgs['restart'] !== false;
}

/**
 * Do we want to skip the UI that offers to reload?
 * @returns 
 */
export function forceReload(): boolean|undefined {
    if (urlArgs['reload'] != undefined) {
        return urlArgs['reload'] !== false;
    }
    return undefined;
}


type AbilityData = {
    textInput?: boolean|string;  // true by default
    notes?: boolean;
    checkMarks?: boolean;
    highlights?: boolean;
    decoder?: boolean|string;  // If a string, should be Proper case
    dragDrop?: boolean;
    stamping?: boolean;
    straightEdge?: boolean;
    wordSearch?: boolean;
    hashiBridge?: boolean;
    subway?: boolean;
    scratchPad?: boolean;
}

export type BoilerPlateData = {
    safari?: string;  // key for Safari details
    title?: string;
    qr_base64?: string;
    print_qr?: boolean;
    author?: string;
    copyright?: string;
    type?: string;  // todo: enum
    feeder?: string;
    lang?: string;  // en-us by default
    paperSize?: string;  // letter by default
    orientation?: string;  // portrait by default
    printAsColor?: boolean;  // true=color, false=grayscale, unset=unmentioned
    abilities?: AbilityData;  // booleans for various UI affordances
    pathToRoot?: string;  // By default, '.'
    validation?: object;  // a dictionary of input fields mapped to dictionaries of encoded inputs and encoded responses
    tableBuilder?: TableDetails;  // Arguments to table-generate the page content
    reactiveBuilder?: boolean;  // invoke the new reactive builder
    lookup?: object;  // a dictionary of json data available to builder code
    postBuild?: () => void;  // invoked after the builder is done
    preSetup?: () => void;
    postSetup?: () => void;
    googleFonts?: string;  // A list of fonts, separated by commas
    onNoteChange?: (inp:HTMLInputElement) => void;
    onInputChange?: (inp:HTMLInputElement) => void;
    onStampChange?: (newTool:string, prevTool:string) => void;
    onStamp?: (stampTarget:HTMLElement) => void;
    onRestore?: () => void;
}

const print_as_color = { id:'printAs', html:"<div style='color:#666;'>Print as <span style='color:#FF0000;'>c</span><span style='color:#538135;'>o</span><span style='color:#00B0F0;'>l</span><span style='color:#806000;'>o</span><span style='color:#7030A0;'>r</span>.</div>" };
const print_as_grayscale = { id:'printAs', text: "<div style='color:#666;'>Print as grayscale</div>"};

/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp 
 */
function preSetup(bp:BoilerPlateData) {
    _rawHtmlSource = document.documentElement.outerHTML;
    const safariDetails = initSafariDetails(bp.safari);
    debugSetup();
    var bodies = document.getElementsByTagName('body');
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

interface CreateSimpleDivArgs {
    id?: string;
    cls?: string;
    text?: string;  // raw text, which will be entitized
    html?: string;  // html code
}
function createSimpleDiv({id, cls, text, html}: CreateSimpleDivArgs) : HTMLDivElement {
    let div: HTMLDivElement = document.createElement('div') as HTMLDivElement;
    if (id !== undefined) {
        div.id = id;
    }
    if (cls !== undefined) {
        div.classList.add(cls);
    }
    if (text !== undefined) {
        div.appendChild(document.createTextNode(text));
    }
    else if (html !== undefined) {
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
    let a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
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
 * @param data Base64 image data
 * @returns An img element, with inline base-64 data
 */
function createPrintQrBase64(data:string):HTMLImageElement {
    const qr = document.createElement('img');
    qr.id = 'qr';
    qr.src = 'data:image/png;base64,' + data;
    qr.alt = 'QR code to online page';
    return qr;
}

function getQrPath():string|undefined {
    const safariDetails = getSafariDetails();
    if (safariDetails.qr_folders) {
        const url = window.location.href;
        for (const key of Object.keys(safariDetails.qr_folders)) {
            if (url.indexOf(key) == 0) {
                const folder = safariDetails.qr_folders[key];
                const names = window.location.pathname.split('/');  // trim off path before last slash
                const name = names[names.length - 1].split('.')[0];  // trim off extension
                return folder + '/' + name + '.png';
            }
        }
    }
    return undefined;
}

function createPrintQr():HTMLImageElement|null {
    // Find relevant folder:
    const path = getQrPath();
    if (path) {
        const qr = document.createElement('img');
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
function createTypeIcon(puzzleType:string, icon_use:string=''):HTMLDivElement {
    if (!icon_use) {
        icon_use = 'puzzle';
    }
    const iconDiv = document.createElement('div');
    iconDiv.id = 'icons';
    const icon = document.createElement('img');
    icon.id = 'icons-' + iconDiv.childNodes.length;
    icon.src = getSafariDetails().iconRoot + puzzleType.toLocaleLowerCase() + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' ' + icon_use);
    iconDiv.appendChild(icon);
    return iconDiv;
}

function boilerplate(bp: BoilerPlateData) {
    if (!bp) {
        return;
    }
    _boiler = bp;

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

    if (bp.reactiveBuilder) {
        try {
            expandControlTags();
        }
        catch (ex) {
            const ctx = wrapContextError(ex);
            console.error(ctx.stack);  // Log, but then continue with the rest of the page
        }
    }
    else if (hasBuilderElements(document)) {
        const warn = Error('WARNING: this page contains <build>-style elements.\nSet boiler.reactiveBuilder:true to engage.');
        console.error(warn);
    }

    if (bp.tableBuilder) {
        constructTable(bp.tableBuilder);
    }

    const html:HTMLHtmlElement = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    const head:HTMLHeadElement = document.getElementsByTagName('head')[0] as HTMLHeadElement;
    const body:HTMLBodyElement = document.getElementsByTagName('body')[0] as HTMLBodyElement;
    const pageBody:HTMLDivElement = document.getElementById('pageBody') as HTMLDivElement;

    if (bp.title) {
        document.title = bp.title;
    }
    
    html.lang = bp.lang || 'en-us';

    const safariDetails = getSafariDetails();
    for (let i = 0; i < safariDetails.links.length; i++) {
        addLink(head, safariDetails.links[i]);
    }

    const viewport = document.createElement('meta') as HTMLMetaElement;
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1'
    head.appendChild(viewport);

    if (safariDetails.fontCss) {
        linkCss(safariDetails.fontCss);
    }
    let gFonts = bp.googleFonts;
    if (safariDetails.googleFonts) {
        gFonts = safariDetails.googleFonts + (gFonts ? (',' + gFonts) : '');
    }
    if (gFonts) {
        //<link rel="preconnect" href="https://fonts.googleapis.com">
        const gapis = {
            'rel': 'preconnect',
            'href': 'https://fonts.googleapis.com'
        };
        addLink(head, gapis);
        //<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        const gstatic = {
            'rel': 'preconnect',
            'href': 'https://fonts.gstatic.com',
            'crossorigin': ''
        };
        addLink(head, gstatic);

        const fonts = gFonts.split(',');
        const link = {
            'href': 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=') + '&display=swap',
            'rel': 'stylesheet'
        }
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
        const ps = bp.paperSize.split('|');
        bp.paperSize = isPrint() ? ps[1] : ps[0];
    }
    toggleClass(body, bp.paperSize);
    toggleClass(body, bp.orientation);
    toggleClass(body, '_' + bp.safari);  // So event fonts can trump defaults

    const page: HTMLDivElement = createSimpleDiv({id:'page', cls:'printedPage'});
    const margins: HTMLDivElement = createSimpleDiv({cls:'pageWithinMargins'});
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({cls:'title', text:bp.title}));
    if (bp.copyright || bp.author) {
        margins.appendChild(createSimpleDiv({id:'copyright', text:'© ' + (bp.copyright || '') + ' ' + (bp.author || '')}));
    }
    if (safariDetails.puzzleList) {
        margins.appendChild(createSimpleA({id:'backlink', href:safariDetails.puzzleList, friendly:'Puzzle list'}));
    }
    if (bp.printAsColor !== undefined) {
        margins.appendChild(createSimpleDiv(bp.printAsColor ? print_as_color : print_as_grayscale));
    }

    if (safariDetails.icon) {
        // Set tab icon for safari event
        const tabIcon = document.createElement('link');
        tabIcon.rel = 'shortcut icon';
        tabIcon.type = 'image/png';
        tabIcon.href = safariDetails.icon;
        head.appendChild(tabIcon);
    }

    if (bp.qr_base64) {
        margins.appendChild(createPrintQrBase64(bp.qr_base64, ));
    }
    else if (bp.print_qr) {
        const qrImg = createPrintQr();
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

    setupAbilities(head, margins, bp.abilities || {});

    if (bp.validation) {
        linkCss(safariDetails.cssRoot + 'Guesses.css');
        setupValidation();
    }


    if (!isIFrame()) {
        setTimeout(checkLocalStorage, 100);
    }
}

function debugPostSetup() {
    if (urlArgs['scan-layout'] != undefined) {
        const summary = summarizePageLayout();
        const json = JSON.stringify(summary);
        const comment = document.createComment(json);
        document.getRootNode().appendChild(comment);
    }
    if (urlArgs['compare-layout'] != undefined) {
        const after = summarizePageLayout();
        const root = document.getRootNode();
        for (let i = 0; i < root.childNodes.length; i++) {
            if (root.childNodes[i].nodeType == Node.COMMENT_NODE) {
                const comment = root.childNodes[i] as Comment;
                let commentJson = comment.textContent;
                if (commentJson) {
                    commentJson = commentJson.trim();
                    if (commentJson.substring(0, 7) == 'layout=') {
                        const before = JSON.parse(commentJson.substring(7)) as LayoutSummary;
                        const diffs = diffSummarys(before, after);
                        if (diffs.length > 0) {
                            renderDiffs(diffs);                            
                        }        
                        break;
                    }
                }
            }
        }
    }

}

function theHead(): HTMLHeadElement {
    return document.getElementsByTagName('head')[0] as HTMLHeadElement;
}

function baseHref(): string {
    const bases = document.getElementsByTagName('base');
    for (let i = 0; i < bases.length; i++) {
        var href = bases[i].getAttribute('href');
        if (href) {
            return relHref(href, document.location.href || '');
        }
    }
    return document.location.href;
}

function relHref(path:string, fromBase?:string): string {
    const paths = path.split('/');
    if (paths[0].length == 0 || paths[0].indexOf(':') >= 0) {
        // Absolute path
        return path;
    }
    if (fromBase === undefined) {
        fromBase = baseHref();
    }
    const bases = fromBase.split('/');
    bases.pop();  // Remove filename at end of base path
    let i = 0;
    for (; i < paths.length; i++) {
        if (paths[i] == '..') {
            if (bases.length == 0 || (bases.length == 1 && bases[0].indexOf(':') > 0)) {
                throw new Error('Relative path beyond base: ' + path);
            }
            bases.pop();
        }
        else if (paths[i] != '.') {
            bases.push(paths[i]);
        }
    }
    return bases.join('/');
}

/**
 * Count-down before we know all delay-linked CSS have been loaded
 */
let cssToLoad = 1;

/**
 * Append any link tag to the header
 * @param head the head tag
 * @param det the attributes of the link tag
 */
export function addLink(head:HTMLHeadElement, det:LinkDetails) {
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(det.href);
    link.rel = det.rel;
    if (det.type) {
        link.type = det.type;
    }
    if (det.crossorigin != undefined) {
        link.crossOrigin = det.crossorigin;
    }
    if (det.rel.toLowerCase() == "stylesheet") {
        link.onload = function(){cssLoaded();};
        cssToLoad++;
    }
    head.appendChild(link);
}

const linkedCss = {};

/**
 * Append a CSS link to the header
 * @param relPath The contents of the link's href
 * @param head the head tag
 */
export function linkCss(relPath:string, head?:HTMLHeadElement) {
    if (relPath in linkedCss) {
        return;  // Don't re-add
    }
    linkedCss[relPath] = true;
    
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(relPath);
    link.rel = "Stylesheet";
    link.type = "text/css";
    link.onload = function(){cssLoaded();};
    cssToLoad++;
    head.appendChild(link);
}

/**
 * Each CSS file that is delay-linked needs time to load.
 * Decrement the count after each one.
 * When complete, call final setup step.
 */
function cssLoaded() {
    if (--cssToLoad == 0) {
        setupAfterCss(theBoiler());
    }
}

/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head:HTMLHeadElement, margins:HTMLDivElement, data:AbilityData) {
    const safariDetails = getSafariDetails();
    const page = (margins.parentNode || document.getElementById('page') || margins) as HTMLDivElement;

    if (data.textInput !== false) {  // If omitted, default to true
        textSetup()
        if (data.textInput == 'nearest') {
            clicksFindInputs(page);
        }
    }

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
        page.appendChild(ability);
    }
    let fancy = '';
    let count = 0;
    if (data.checkMarks) {
        setupCrossOffs();
        fancy += '<span id="check-ability" title="Click items to check them off">✔️</span>';
        count++;
    }
    if (data.highlights) {
        let instructions = "Ctrl+click to highlight cells";
        if (theBoiler()?.abilities?.textInput) {
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
        preprocessRulerFunctions(EdgeTypes.straightEdge, false);
        linkCss(safariDetails.cssRoot + 'StraightEdge.css');
        //indexAllVertices();
    }
    if (data.wordSearch) {
        fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">💊</span>';
        preprocessRulerFunctions(EdgeTypes.wordSelect, true);
        linkCss(safariDetails.cssRoot + 'WordSearch.css');
        //indexAllVertices();
    }
    if (data.hashiBridge) {
        // fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">🌉</span>';
        preprocessRulerFunctions(EdgeTypes.hashiBridge, true);
        linkCss(safariDetails.cssRoot + 'HashiBridge.css');
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
    if (data.scratchPad) {
        setupScratch();
        let instructions = "Ctrl+click anywhere on the page to create a note.";
        fancy += '<span id="highlight-ability" title="' + instructions + '" style="text-shadow: 0 0 3px black;">📔</span>';
    }
    if (data.decoder) {
        setupDecoderToggle(page, data.decoder);
    }
    ability.innerHTML = fancy;
    ability.style.bottom = data.decoder ? '4pt' : '20pt';
    if (count == 2) {
        ability.style.right = '0.6in';
    }

    // Release our lock on css loading
    cssLoaded();
}

/**
 * All delay-linked CSS files are now loaded. Layout should be complete.
 * @param bp The global boilerplate
 */
function setupAfterCss(bp: BoilerPlateData) {
    if (bp.abilities) {
        if (bp.abilities.subway) {
            setupSubways();
        }
    }

    // If the puzzle has a post-setup method they'd like to run after all abilities and contents are processed, do so now
    if (bp.postSetup) {
        bp.postSetup();
    }

    debugPostSetup();
}


declare let boiler: BoilerPlateData | undefined;

/**
 * We forward-declare boiler, which we expect calling pages to define.
 * @returns The page's boiler, if any. Else undefined.
 */
function pageBoiler():BoilerPlateData | undefined {
    if (typeof boiler !== 'undefined') {
        return boiler as BoilerPlateData;
    }
    return undefined;
}

let _boiler: BoilerPlateData = {};

/**
 * Expose the boilerplate as an export
 * Only called by code which is triggered by a boilerplate, so safely not null
 */
export function theBoiler():BoilerPlateData {
    return _boiler;
}

export function testBoilerplate(bp:BoilerPlateData) {
    boilerplate(bp);
}

if (typeof window !== 'undefined') {
    window.onload = function(){boilerplate(pageBoiler()!)};  // error if boiler still undefined
}


/*-----------------------------------------------------------
 * _confirmation.ts
 *-----------------------------------------------------------*/


/**
 * Response codes for different kinds of responses
 */
const ResponseType = {
    Error: 0,
    Correct: 1,  // aka solved
    Confirm: 2,  // confirm an intermediate step
    KeepGoing: 3,// a wrong guess that deserves a hint
    Unlock: 4,   // offer players a link to a hidden page
    Load: 5,     // load another page in a hidden iframe
    Show: 6,     // cause another cell to show
//    Save: 7,     // write a key/value directly to storage
};

/**
 * CSS classes for each response type
 */
const ResponseTypeClasses = [
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
const no_match_response = "0";

/**
 * Default response text, if the validation block only specifies a type
 */
const default_responses = [
    "Incorrect",    // Error
    "Correct!",     // Correct
    "Confirmed",    // Confirmation
    "Keep going",   // Keep Going
];

/**
 * img src= URLs for icons to further indicate whether guesses were correct or not
 */
const response_img = [
    "../Icons/X.png",         // Error
    "../Icons/Check.png",     // Correct
    "../Icons/Thumb.png",     // Confirmation
    "../Icons/Thinking.png",  // Keep Going
    "../Icons/Unlocked.png",  // Unlock
];

/**
 * A single guess submitted by a player, noting also when it was submitted
 */
export type GuessLog = {
    field: string;  // Which field did the user guess on
    guess: string;  // What the user guessed
    time: Date;     // When the guess was submitted
};

/**
 * The full history of guesses on the current puzzle
 */
let guess_history:GuessLog[] = [];

/**
 * This puzzle has a validation block, so there must be either a place for the
 * player to propose an answer, or an automatic extraction for other elements.
 */
export function setupValidation() {
    const buttons = document.getElementsByClassName('validater');
    if (buttons.length > 0) {
        let hist = getHistoryDiv('');
        if (!hist) {
            // Create a standard <div id="guess-log"> to track the all guesses
            const log = document.createElement('div');
            log.id = 'guess-log';
            const div = document.createElement('div');
            div.id = 'guess-history';
            const span = document.createElement('span');
            span.id = 'guess-titlebar';
            span.appendChild(document.createTextNode('Guesses'));
            log.appendChild(span);
            log.appendChild(div);
            document.getElementById('pageBody')?.appendChild(log);
        }
    }
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLElement;
        if (isTag(btn, 'button')) {
            btn.onclick=function(e){clickValidationButton(e.target as HTMLButtonElement)};
            const srcId = getOptionalStyle(btn, 'data-extracted-id') || 'extracted';
            const src = document.getElementById(srcId);
            // If button is connected to a text field, hook up ENTER to submit
            if (src && ((isTag(src, 'input') && (src as HTMLInputElement).type == 'text')
                        || isTag(src, 'textarea'))) {  // TODO: not multiline
                src.onkeyup=function(e){validateInputReady(btn as HTMLButtonElement, e.key)};
            }
        }
    }
}

function calculateTextExtents(src:HTMLElement, value:string):number {
    let fe = document.getElementById('fontExtents');
    if (!fe) {
        fe = document.createElement('span');
        fe.id = 'fontExtents';
        fe.style.position = 'absolute';
        document.getElementsByTagName('body')[0].appendChild(fe);
    }

    fe.innerText = value;
    const styles = window.getComputedStyle(src, null);
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
function horzScaleToFit(input:HTMLElement, value:string) {
    let widthPx = parseFloat(input.getAttribute('data-original-width') || '');
    if (!widthPx) {
        widthPx = calcPxStyle(input, 'width');
        input.setAttribute('data-original-width', '' + widthPx);
    }
    if (value.length == 0) {
        input.style.transform = 'scale(100%, 100%)';
        input.style.width = widthPx + 'px';
    }
    const curScale = calcTransform(input, 'scale', matrix.scaleX, 1);
    const needPx = calculateTextExtents(input, value + '|');  // account for borders
    if (needPx * curScale > widthPx) {
        const wantPx = calculateTextExtents(input, value + ' 12345678');  // one more word
        const newScalePct = Math.floor(widthPx * 100 / wantPx);
         if (newScalePct > 33) {  // Maximum compression before unreadable
            input.style.transformOrigin = 'left';
            input.style.transform = 'scale(' + newScalePct + '%, 100%)';
            input.style.width = Math.floor(widthPx * 100 / newScalePct) + 'px';
        }
        const test = calculateTextExtents(input, value);
    }
}

function calcPxStyle(elmt:HTMLElement, prop:string):number {
    const val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 2));  // px
}

function calcPctStyle(elmt:HTMLElement, prop:string):number {
    const val = window.getComputedStyle(elmt, null).getPropertyValue(prop);
    return parseFloat(val.substring(0, val.length - 1));  // %
}

const matrix = {
    scaleX: 0,
    rotX: 1,
    rotY: 2,
    scaleY: 3,
    translateX: 4,
    translateY: 5
}

function calcTransform(elmt:HTMLElement, prop:string, index:number, defValue:number):number {
    const trans = window.getComputedStyle(elmt, null).getPropertyValue('transform');
    let matrix = '1, 0, 0, 0, 1, 0';  // unit transform
    if (trans && trans.substring(0, 7) == 'matrix(') {
        matrix = trans.substring(7, trans.length - 8);
    }
    const split = matrix.split(',');
    if (index < split.length) {
        const val = split[index];
        if (val.substring(val.length - 1) == '%') {
            return parseFloat(val.substring(0, val.length - 1)) * 0.01;
        }
        else if (val.substring(val.length - 2) == 'px') {
            return parseFloat(val.substring(0, val.length - 2));
        }
        else return parseFloat(val);
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
export function validateInputReady(btn:HTMLButtonElement, key:string|null) {
    const id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    const ext = id ? document.getElementById(id) : null;
    if (!ext) {
        return;
    }
    const value = getValueToValidate(ext);
    const ready = isValueReady(btn, value);

    toggleClass(btn, 'ready', ready);
    if (ready && key == 'Enter') {
        clickValidationButton(btn as HTMLButtonElement); 
    }
    else if (isTag(ext, 'input') || isTag(ext, 'textarea')) {
        horzScaleToFit(ext, value);
    }
}

/**
 * Submit buttons can be associated with various constructs.
 * Extract an appropriate value to submit
 * @param container The container of the value to submit.
 * @returns The value, or concatenation of values.
 */
function getValueToValidate(container:HTMLElement):string {
    // If the extraction has alredy been cached, use it
    const cached = container.getAttribute('data-extraction');
    if (cached) {
        return cached;
    }
    // If container is an input, get its value
    if (isTag(container, 'input')) {
        return (container as HTMLInputElement).value;
    }
    if (isTag(container, 'textarea')) {
        return (container as HTMLTextAreaElement).value;
    }
    // If we contain multiple inputs, concat them
    const inputs = container.getElementsByClassName('letter-input');
    if (inputs.length > 0) {
        let value = '';
        for (let i = 0; i < inputs.length; i++) {
            value += (inputs[i] as HTMLInputElement).value;
        }
        return value;
    }
    // If we contain multiple other extractions, concat them
    const datas = getAllElementsWithAttribute(container, 'data-extraction');
    if (datas.length > 0) {
        let value = '';
        for (let i = 0; i < datas.length; i++) {
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
function isValueReady(btn:HTMLButtonElement, value:string|null):boolean {
    if (!value) {
        return false;
    }
    if (value.indexOf('_') >= 0) {
        return false;
    }
    const minLength = getOptionalStyle(btn, 'data-min-length')
    if (minLength) {
        return value.length >= parseInt(minLength);
    }
    return value.length > 0;
}

/**
 * There should be a singleton guess history, which we likely created above
 * @param id The ID, or 'guess-history' by default
 */
function getHistoryDiv(id:string): HTMLDivElement {
    return document.getElementById('guess-history') as HTMLDivElement;
}

/**
 * The user has clicked a "Submit" button next to their answer.
 * @param btn The target of the click event
 * The button can have parameters pointing to the extraction.
 */
function clickValidationButton(btn:HTMLButtonElement) {
    const id = getOptionalStyle(btn, 'data-extracted-id', 'extracted');
    if (!id) {
        return;
    }
    const ext = document.getElementById(id);
    if (!ext) {
        return;
    }

    const value = getValueToValidate(ext);
    const ready = isValueReady(btn, value);

    if (ready) {
        const now = new Date();
        const gl:GuessLog = { field:id, guess: value, time: now };
        decodeAndValidate(gl);
    }
}

/**
 * Validate a user's input against the encoded set of validations
 * @param gl the guess information, but not the response
 */
export function decodeAndValidate(gl:GuessLog) {
    const validation = theBoiler().validation;
    if (validation && gl.field in validation) {
        const obj = validation[gl.field];

        // Normalize guesses
        // TODO: make this optional, in theBoiler, if a puzzle needs
        gl.guess = gl.guess.toUpperCase();  // All caps (permanent)
        let guess = gl.guess.replace(/ /g, '');  // Remove spaces for hashing - keep in UI
        // Keep all other punctuation

        const hash = rot13(guess);  // TODO: more complicated hashing
        const block = appendGuess(gl);
        if (hash in obj) {
            const encoded = obj[hash];
    
            // Guess was expected. It may have multiple responses.
            const multi = encoded.split('|');
            for (let i = 0; i < multi.length; i++) {
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

/**
 * Build a guess/response block, initialized with the guess
 * @param gl The user's guess info
 * @returns The block, to which responses can be appended
 */
function appendGuess(gl:GuessLog): HTMLDivElement {
    // Save
    guess_history.push(gl);
    saveGuessHistory(guess_history);

    // Build a block for the guess and any connected responses
    const hist = getHistoryDiv(gl.field);
    const block = document.createElement('div');
    block.classList.add('rt-block');

    const div = document.createElement('div');
    div.classList.add('rt-guess');
    div.appendChild(document.createTextNode(gl.guess));

    const now = gl.time;
    const time = now.getHours() + ":" 
        + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes() + ":"
        + (now.getSeconds() < 10 ? "0" : "") + now.getSeconds();
    const span = document.createElement('span');
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
function appendResponse(block:HTMLDivElement, response:string) {
    const type = parseInt(response[0]);
    response = response.substring(1);
    if (response.length == 0 && type < default_responses.length) {
        response = default_responses[type];
    }
    else {
        response = rot13(response);
    }

    const div = document.createElement('div');
    div.classList.add('response');
    div.classList.add(ResponseTypeClasses[type]);

    if (type == ResponseType.Unlock) {
        // Create a link to a newly unlocked page.
        // The (decrypted) response is either just a URL, 
        // or else URL^Friendly (separated by a caret)
        const caret = response.indexOf('^');
        const friendly = caret < 0 ? response : response.substring(caret + 1);
        if (caret >= 0) {
            response = response.substring(0, caret);
        }
        const parts = response.split('^');  // caret not allowed in a URL
        div.appendChild(document.createTextNode('You have unlocked '));
        const link = document.createElement('a');
        link.href = response;
        link.target = '_blank';
        link.appendChild(document.createTextNode(friendly));
        div.appendChild(link);
    }
    else if (type == ResponseType.Load) {
        // Use an iframe to navigate immediately to the response URL.
        // The iframe will be hidden, but any scripts will run immediately.
        const iframe = document.createElement('iframe');
        iframe.src = response;
        div.appendChild(iframe);
    }
    else if (type == ResponseType.Show) {
        const parts = response.split('^');  // caret not allowed in a URL
        const elmt = document.getElementById(parts[0]);
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
        const img = document.createElement('img');
        img.classList.add('rt-img');
        img.src = response_img[type];
        div.appendChild(img);    
    }

    block.appendChild(div);

    if (type == ResponseType.Correct) {
        // Tag this puzzle as solved
        toggleClass(document.getElementsByTagName('body')[0], 'solved', true);
        // Cache that the puzzle is solved, to be indicated in tables of contents
        updatePuzzleList(getCurFileName(), PuzzleStatus.Solved);
    }
}

/**
 * Rot-13 cipher, maintaining case.
 * Chars other than A-Z are preserved as-is
 * @param source Text to be encoded, or encoded text to be decoded
 */
function rot13(source:string) {
    let rot = '';
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        let r = ch;
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
 * _contextError.ts
 *-----------------------------------------------------------*/


export type SourceOffset = {
  source:string;
  offset?:number;
  length?:number;
}

/**
 * Custom error which identify which parts of the source document are malformed.
 * It can leverage nested try/catch blocks to add additional context.
 */
export class ContextError extends Error {
  public cause: Error|undefined;
  public callStack: string|undefined;
  public elementStack: Element[];
  public functionStack: string[];
  public sourceStack: SourceOffset[];

  /**
   * Create a new ContextError (or derived error)
   * @param msg The message of the Error
   * @param source Indicates which source text specifically triggered this error
   * @param inner The inner/causal error, if any
   */
  constructor(msg: string, source?:SourceOffsetable, inner?:Error) {
    super(msg);
    this.name = 'ContextError';
    this.cause = inner;
    this.functionStack = [];
    this.sourceStack = [];
    this.callStack = '';

    if (source) {
      if (typeof(source) == 'function') {
        this.sourceStack.push(source());
      }
      else {
        this.sourceStack.push(source);
      }
    }
  }

  _cacheCallstack():void {
    if (this.callStack === '') {
      this.callStack = this.cause ? this.cause.stack : this.stack;

      if (this.callStack?.substring(0, this.message.length) == this.message) {
        this.callStack = this.callStack.substring(this.message.length);  // REVIEW: trim \n ?
      }
    }
  }
}

/**
 * Type predicate to separate ContextErrors from generic errors.
 * @param err Any error
 * @returns true if it is a ContextError
 */
export function isContextError(err:Error|ContextError): err is ContextError {
  //return err instanceof ContextError;
  return err.name === 'ContextError';
}

/**
 * Instead of creating a source offset every time, anticipating an exception
 * that rarely gets thrown, instead pass a lambda.
 */
type SourceOffseter = () => SourceOffset;

/**
 * Methods generally take either flavor: SourceOffset or SourceOffseter
 */
export type SourceOffsetable = SourceOffset|SourceOffseter;

/**
 * Add additional information to a context error.
 * @param inner Another exception, which has just been caught.
 * @param func The name of the current function (optional).
 * @param elmt The name of the current element in the source doc (optional)
 * @param src The source offset that was being evaluated
 * @returns If inner is already a ContextError, returns inner, but now augmented.
 * Otherwise creates a new ContextError that wraps inner.
 */
export function wrapContextError(inner:Error, func?:string, src?:SourceOffsetable) {
  let ctxErr:ContextError;
  if (isContextError(inner)) {
    ctxErr = inner as ContextError;
  }
  else {
    ctxErr = new ContextError(inner.name + ': ' + inner.message, undefined, inner);
  }

  // Cache callstack
  if (ctxErr.callStack === '') {
    ctxErr.callStack = ctxErr.cause ? ctxErr.cause.stack : ctxErr.stack;

    if (ctxErr.callStack?.substring(0, ctxErr.message.length) == ctxErr.message) {
      ctxErr.callStack = ctxErr.callStack.substring(ctxErr.message.length);  // REVIEW: trim \n ?
    }
  }

  if (func) {
    ctxErr.functionStack.push(func);
  }
  if (src) {
    if (typeof(src) == 'function') {
      src = src() as SourceOffset;
    }
    ctxErr.sourceStack.push(src);
  }

  makeBetterStack(ctxErr);

  return ctxErr;
}

/**
 * Once we've added context to the exception, update the stack to reflect it
 */
function makeBetterStack(err:ContextError):void {
  const msg = 'ContextError: ' + err.message;
  let str = msg;

  if (err.sourceStack.length > 0) {
    for (let i = 0; i < err.sourceStack.length; i++) {
      const c = err.sourceStack[i];
      str += '\n' + c.source;
      if (c.offset !== undefined) {
        str += '\n' + Array(c.offset + 1).join(' ') + '^';
        if (c.length && c.length > 1) {
          str += Array(c.length).join('^');
        }
      }
    }
  }

  if (err.callStack) {
    str += '\n' + err.callStack;
  }

  if (err.cause) {
    str += '\nCaused by: ' + err.cause;
  }

  // if (err.functionStack.length > 0) {
  //   str += "\nBuild functions stack:";
  //   for (let i = 0; i < err.functionStack.length; i++) {
  //     str += '\n    ' + err.functionStack[i];
  //   }
  // }

  err.stack = str;
}

export function nodeSourceOffset(node:Node):SourceOffset {
  if (node.nodeType == Node.ELEMENT_NODE) {
    return elementSourceOffset(node as Element)
  }
  else {
    const tok:SourceOffset = {
      source: node.nodeValue || '',  // for text elements, same as textContent
      offset: 0,
      length: 1,  // No need to span the whole
    }
    return tok;
  }
}

/**
 * Recreate the source for a tag. Then pinpoint the offset of a desired attribute.
 * @param elmt An HTML tag
 * @param attr A specific attribute, whose value is being evaluated.
 * @returns A source offset, built on the recreation
 */
export function elementSourceOffset(elmt:Element, attr?:string):SourceOffset {
  let str = '<' + elmt.localName;
  let offset = 0;
  let length = 0;

  for (let i = 0; i < elmt.attributes.length; i++) {
    const name = elmt.attributes[i].name;
    const value = elmt.attributes[i].value;
    if (name === attr) {
      offset = str.length + name.length + 3; // The start of the value
      length = value.length;
    }
    str += ' ' + elmt.attributes[i].name + '="' + elmt.attributes[i].value + '"';
  }

  if (attr && offset == 0) {
    // Never found the attribute we needed. Highlight the element name
    offset = 1;
    length = elmt.localName.length;
  }

  if (elmt.childNodes.length == 0) {
    str += ' /';  // show as empty tag
  }
  str += '>';  // close tag
  
  if (offset == 0) {
    length = str.length;  // Full tag
  }

  const tok:SourceOffset = { source: str, offset: offset, length: length };
  return tok;
}

/**
 * Instead of creating a source offset every time, anticipating an exception
 * that rarely gets thrown, instead pass a lambda.
 */
export function elementSourceOffseter(elmt:Element, attr?:string): SourceOffseter {
  return () => { return elementSourceOffset(elmt, attr); };
}

/**
 * A code error has no additional fields.
 * It just acknowledges that the bug is probably the code's fault, and not the raw inputs's.
 */
export class CodeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'CodeError';
  }
}

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
 *          'lookup': {               // free-form, for example...
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
*    There is a special rule for tags and attributes prefixed with _, or starting with a double-letter
 *    when you need to avoid the pre-processed tags/attributes being acted upon by the DOM.
 *      <iimg ssrc="{fonts.0}Icon.png">
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
 *    However, the DOM will refactor them if found inside a <table> but not inside <td>.
 *    
 *    Two options: _prefix (or pprefix) and CSS
 *      <ttable>
 *        <for ...>
 *          <ttr>
 *            <if eq ...><tth></tth></if>
 *            <if ne ...><ttd></ttd></if>
 *          </ttr>
 *        </for>
 *      </ttable>
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


const builder_tags = [
  'build', 'use', 'for', 'if', 'else', 'elseif'
];

function firstBuilderElement():HTMLElement|null {
  const btags = builder_tags.concat(inputAreaTagNames);
  for (const t of btags) {
    const tags = document.getElementsByTagName(t);
    for (let i=0; i < tags.length; i++) {
      toggleClass(tags[i], '_builder_control_', true);
    }
  }
  const builds = document.getElementsByClassName('_builder_control_');
  if (builds.length == 0)
    return null;
  const first = builds[0];
  for (let i = builds.length-1; i >= 0; i--) {
    toggleClass(builds[i], '_builder_control_', false);
  }
  return first as HTMLElement;
}

/**
 * Does this document contain any builder elements?
 * @param doc An HTML document
 * @returns true if any of our custom tags are present.
 * NOTE: Does not detect {curlies} in plain text or plain elements.
 */
export function hasBuilderElements(doc:Document) {
  const btags = builder_tags.concat(inputAreaTagNames);
  for (let i = 0; i < btags.length; i++) {
    if (doc.getElementsByTagName(builder_tags[i]).length > 0) {
      return true;
    }
  }
}

let src_element_stack:Element[] = [];
let dest_element_stack:Element[] = [];

function initElementStack(elmt:Element|null) {
  dest_element_stack = [];
  src_element_stack = [];
  const parent_stack:Element[] = [];
  while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
    parent_stack.push(elmt);
    elmt = elmt.parentElement;
  }
  // Invert stack
  while (parent_stack.length > 0) {
    src_element_stack.push(parent_stack.pop() as Element);
  }
}

function pushDestElement(elmt:Element) {
  dest_element_stack.push(elmt);
}

function popDestElement() {
  dest_element_stack.pop();
}

export enum TrimMode {
  off = 0,  // no trimming (default)
  on,       // trim text regions that are only whitespace
  all,      // trim all text regions
}

/**
 * When in trim mode, cloning text between elements will omit any sections that are pure whitespace.
 * Sections that include both text and whitespace will be kept in entirety.
 * @returns One of three trim states, set anywhere in the current element heirarchy.
 */
export function getTrimMode():TrimMode {
  const elmt = getBuilderParentIf(e => hasClass(e, 'trim') || e.getAttributeNS('', 'trim') !== null);
  if (elmt) {
    if (hasClass(elmt, 'trim')) {
      return TrimMode.on;
    }
    let trim = elmt.getAttributeNS('', 'trim');
    trim = trim == null ? null : trim.toLowerCase();
    if (trim === 'all') {
      return TrimMode.all;
    }
    if (trim != null) {
      return (trim !== 'false' && trim !== 'off') ? TrimMode.on : TrimMode.off;
    }
  }
  return TrimMode.off;
}

/**
 * Throwing exceptions while building will hide large chunks of page.
 * Instead, set nothrow on any build element (not normal elements) to disable rethrow at that level.
 * In that case, the error will be logged, but then building will continue.
 * FUTURE: set onthrow to the name of a local function, and onthrow will call that, passing the error
 * @returns true if the current element expresses nothrow as either a class or attribute.
 */
export function shouldThrow(ex:Error, node1?:Node, node2?:Node, node3?:Node):boolean {
  // Inspect any passed-in nodes for throwing instructions.
  const nodes = [node1, node2, node3];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || node.nodeType != Node.ELEMENT_NODE) {
        continue;
    }

    const elmt = nodes[i] as Element;  // The first element that had a elmt
    if (hasClass(elmt, 'nothrow') || elmt.getAttributeNS('', 'nothrow') !== null) {
      console.error(ex.stack);
      return false;
    }
    const fn = elmt.getAttributeNS('', 'onthrow');
    if (fn) {
      const func = window[fn];
      if (func) {
        console.error(ex.stack);
        func(ex, elmt);
        return false;
      }
    }
  }
  return true;
}

/**
 * See if any parent element in the builder stack matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
export function getBuilderParentIf(fn:(e:Element) => boolean):Element|null {
  for (let i = dest_element_stack.length - 1; i >= 0; i--) {
    if (fn(dest_element_stack[i])) {
      return dest_element_stack[i];
    }
  }

  for (let i = src_element_stack.length - 1; i >= 0; i--) {
    if (fn(src_element_stack[i])) {
      return src_element_stack[i];
    }
  }

  return null;  // no parent satisfied lambda
}

/**
 * See if any parent element, either in the builder stack, or src element tree, matches a lambda
 * @param fn a Lambda which takes an element and returns true for the desired condition
 * @returns the first parent element that satisfies the lambda, or null if none do
 */
export function getParentIf(elmt:Element|null, fn:(e:Element) => boolean):Element|null {
  const bp = getBuilderParentIf(fn);
  if (bp != null) {
    return bp;
  }

  while (elmt !== null && elmt.nodeName != '#document-fragment' && elmt.tagName !== 'BODY') {
    if (fn(elmt)) {
      return elmt;
    }
    elmt = elmt.parentElement;
  }

  return null;
}

/**
 * Is the current stack of building elements currently inside an SVG tag.
 * @returns returns true if inside an SVG, unless further inside an EMBEDDED_OBJECT.
 */
export function inSvgNamespace():boolean {
  const elmt = getBuilderParentIf((e)=>isTag(e, 'SVG') || isTag(e, 'FOREIGNOBJECT'));
  if (elmt) {
    return isTag(elmt, 'SVG');
  }
  return false;
}


/**
 * See if we are inside an existing <svg> tag. Or multiple!
 * @param elmt Any element
 * @returns How many <svg> tags are in its parent chain
 */
function getSvgDepth(elmt:Element) {
  let s = 0;
  let parent = findParentOfTag(elmt, 'SVG');
  while (parent) {
    s++;
    parent = parent.parentElement ? findParentOfTag(parent.parentElement, 'SVG') : null;
  }
  return s;
}

/**
 * Look for control tags like for loops and if branches.
 */
export function expandControlTags() {
  const ifResult:ifResult = {passed:false, index:0};
  for (let src = firstBuilderElement(); src != null; src = firstBuilderElement()) {
    try {
      initElementStack(src);
      let dest:Node[] = [];
      if (isTag(src, ['if', 'elseif', 'else'])) {
        dest = startIfBlock(src, ifResult);        
      }
      else {
        ifResult.index = 0;  // Reset

        if (isTag(src, 'build')) {
          dest = expandContents(src);
        }
        else if (isTag(src, 'for')) {
          dest = startForLoop(src);
        }
        else if (isTag(src, 'use')) {
          dest = useTemplate(src);
        }
        else if (isTag(src, inputAreaTagNames)) {
          dest = startInputArea(src);
        }
      }
      const parent = src.parentNode;
      for (let d = 0; d < dest.length; d++) {
        const node = dest[d];
        parent?.insertBefore(node, src);
      }
      parent?.removeChild(src);
    }
    catch (ex) {
      const ctxerr = wrapContextError(ex, "expandControlTags", elementSourceOffset(src));
      if (shouldThrow(ctxerr, src)) { throw ctxerr; }
    }
  }
  initElementStack(null);

  // Call any post-builder method
  const fn = theBoiler().postBuild;
  if (fn) {
      fn();
  }
}

/**
 * Concatenate one list onto another
 * @param list The list to modified
 * @param add The list to add to the end
 */
export function pushRange(list:Node[], add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    list.push(add[i]);
  }
}

/**
 * Append more than one child node to the end of a parent's child list
 * @param parent The parent node
 * @param add A list of new children
 */
export function appendRange(parent:Node, add:Node[]) {
  for (let i = 0; i < add.length; i++) {
    parent.insertBefore(add[i], null);
  }
}

/**
 * Clone every node inside a parent element.
 * Any occurence of {curly} braces is in fact a lookup.
 * It can be in body text or an element attribute value
 * @param src The containing element
 * @param context A dictionary of all values that can be looked up
 * @returns A list of nodes
 */
export function expandContents(src:HTMLElement):Node[] {
  const dest:Node[] = [];
  const ifResult:ifResult = {passed:false, index:0};
  for (let i = 0; i < src.childNodes.length; i++) {
    const child = src.childNodes[i];
    if (child.nodeType == Node.ELEMENT_NODE) {
      const child_elmt = child as HTMLElement;
      try {
        if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
          pushRange(dest, startIfBlock(child_elmt, ifResult));
          continue;
        }
        ifResult.index = 0;  // Reset

        if (isTag(child_elmt, 'for')) {
          pushRange(dest, startForLoop(child_elmt));
        }
        else if (isTag(child_elmt, 'use')) {
          pushRange(dest, useTemplate(child_elmt));
        }
        else if (isTag(child_elmt, inputAreaTagNames)) {
          pushRange(dest, startInputArea(child_elmt));
        }
        else if (isTag(child_elmt, 'template')) {
          // <template> tags do not clone the same as others
          throw new ContextError('Templates get corrupted when inside a build region. Define all templates at the end of the BODY');
        }
        else {
          dest.push(cloneWithContext(child_elmt));
        }
      }
      catch (ex) {
        const ctxerr = wrapContextError(ex, "expandContents", elementSourceOffset(child_elmt));
        if (shouldThrow(ctxerr, child_elmt, src)) { throw ctxerr; }
      }
    }
    else if (child.nodeType == Node.TEXT_NODE) {
      pushRange(dest, cloneTextNode(child as Text));
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
 * use any of three alternate naming schemes:
 *   _prefix or suffix_  Underscores will be removed.
 *   ddupe-letter        If the initial letter is duplicated, drop it.
 * The tag or attribute will be renamed when cloned, and the browser will treat it as a no-op until then.
 * @param name Any tag or attribute name
 * @returns The name, or the the name without the _ underscore or doubled initial letter
 */
export function normalizeName(name:string):string {
  if (name.substring(0, 1) == '_') {
    return name.substring(1);
  }
  if (name.substring(name.length - 1) == '_') {
    return name.substring(0, name.length - 1);
  }
  if (name.length >= 2 && name[0] == name[1]) {
    return name.substring(1);
  }
  // Any other interior underscores are kept
  return name;
}

const nameSpaces = {
  '': '',
  'svg': svg_xmlns,
  's': svg_xmlns,
  'html': null,
  'h': null,
}

/**
 * Deep-clone an HTML element
 * Note that element and attribute names with _prefix will be renamed without _
 * @param elmt The original element
 * @param context A dictionary of all accessible values
 * @returns A cloned element
 */
function cloneWithContext(elmt:HTMLElement):Element {
  const tagName = normalizeName(elmt.localName);
  let clone:Element;
  if (inSvgNamespace() || tagName == 'svg') {
    // TODO: contents of embedded objects aren't SVG
    clone = document.createElementNS(svg_xmlns, tagName);
  }
  else if (elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns')) {
    const xmlns = elmt.getAttribute('xmlns') || elmt.getAttribute('xxmlns');
    clone = document.createElementNS(xmlns, tagName);
  }
  else {
    clone = document.createElement(tagName);
  }
  pushDestElement(clone);
  cloneAttributes(elmt, clone);

  const ifResult:ifResult = {passed:false, index:0};
  for (let i = 0; i < elmt.childNodes.length; i++) {
    const child = elmt.childNodes[i];
    try {
      if (child.nodeType == Node.ELEMENT_NODE) {
        const child_elmt = child as HTMLElement;
        if (isTag(child_elmt, ['if', 'elseif', 'else'])) {
          appendRange(clone, startIfBlock(child_elmt, ifResult));
          continue;
        }
        ifResult.index = 0;  // Reset

        if (isTag(child_elmt, 'for')) {
          appendRange(clone, startForLoop(child_elmt));
        }
        else if (isTag(child_elmt, 'use')) {
          appendRange(clone, useTemplate(child_elmt));
        }
        else if (isTag(child_elmt, inputAreaTagNames)) {
          appendRange(clone, startInputArea(child_elmt));
        }
        else {
          clone.appendChild(cloneWithContext(child_elmt));
        }
      }
      else if (child.nodeType == Node.TEXT_NODE) {
        appendRange(clone, cloneTextNode(child as Text));
      }
      else {
        clone.insertBefore(cloneNode(child), null);
      }
    }
    catch (ex) {
      const ctxerr = wrapContextError(ex, "cloneWithContext", nodeSourceOffset(child));
      if (shouldThrow(ctxerr, child, elmt)) { throw ctxerr; }
    }
    
  }
  popDestElement();
  return clone;
}

/**
 * Clone other node types, besides HTML elements and Text
 * @param node Original node
 * @returns A node to use in the clone
 */
function cloneNode(node:Node):Node {
  return node;  // STUB: keep original node
}

export function consoleComment(str:string):Comment {
  if (isDebug()) {
    console.log(str);
  }
  return document.createComment(str);
} 

/*-----------------------------------------------------------
 * _builderContext.ts
 *-----------------------------------------------------------*/


/**
 * The root context for all builder functions
 * @returns the lookup object on the boiler.
 */
export function theBoilerContext() {
  return theBoiler().lookup || {};
}

const contextStack:object[] = [];

/**
 * Get the current builder context.
 * If needed, initialized from boilerplate.lookup
 * @returns The top context on the stack.
 */
export function getBuilderContext():object {
  if (contextStack.length == 0) {
    contextStack.push(theBoilerContext());
  }
  return contextStack[contextStack.length - 1];
}

/**
 * Inject a builder context for testing purposes.
 * @param lookup Any object, or undefined to remove.
 */
export function testBuilderContext(lookup?:object) {
  theBoiler().lookup = lookup;
  contextStack.splice(0, contextStack.length);  // clear
}

/**
 * Start a new top level builder context.
 * @param newContext If specified, this is the new context. If not, start from a clone of the current top context.
 * @returns The new context, which the caller may want to modify.
 */
export function pushBuilderContext(newContext?:object):object {
  if (newContext === undefined) {
    newContext = structuredClone(getBuilderContext());
  }
  contextStack.push(newContext);
  return getBuilderContext();
}

/**
 * Pop the builder context stack.
 * @returns The new top-level builder context.
 */
export function popBuilderContext():object {
  contextStack.pop();
  return getBuilderContext();
}

/**
 * Try to look up a key in the current context level.
 * @param key A key name
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns The value from that key, or undefined if not present
 */
export function valueFromContext(key:string, maybe?:boolean):any {
  const context = getBuilderContext();
  return getKeyedChild(context, key, undefined, maybe);
}

/**
 * Look up a value, according to the context path cached in an attribute
 * @param path A context path
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns Any JSON object
 */
export function valueFromGlobalContext(path:string, maybe?:boolean):any {
  if (path) {
    return getKeyedChild(null, path, undefined, maybe);
  }
  return undefined;
}

/**
 * Finish cloning an HTML element
 * @param src The element being cloned
 * @param dest The new element, still in need of attributes
 * @param context A dictionary of all accessible values
 */
export function cloneAttributes(src:Element, dest:Element) {
  for (let i = 0; i < src.attributes.length; i++) {
    const name = normalizeName(src.attributes[i].name);
    let value = src.attributes[i].value;
    try {
      value = cloneText(value);
      if (name == 'id') {
        dest.id = value;
      }
      else if (name == 'class') {
        if (value) {
          const classes = value.split(' ');
          for (let i = 0; i < classes.length; i++) {
            if (classes[i].length > 0) {
              dest.classList.add(classes[i]);
            }
          }
        }    
      }
      else if (name == 'xmlns') {
        // These are applied when the node is cloned, not here as an attribute
      }
      else {
        dest.setAttributeNS('', name, value);
      }
    }
    catch (ex) {
      throw wrapContextError(ex, 'cloneAttributes', elementSourceOffset(src, name));
    }
  }
}

/**
 * Process a text node which may contain {curly} formatting.
 * @param text A text node
 * @returns A list with 1 or 0 text nodes
 */
export function cloneTextNode(text:Text):Node[] {
  const str = text.textContent || '';
  const cloned = complexAttribute(str, getTrimMode());
  if (cloned === '') {
    return [];
  }
  
  const node = document.createTextNode(cloned);
  return [node];
}

/**
 * Process text which may contain {curly} formatting.
 * @param text Any text, including text inside attributes
 * @returns Expanded text
 */
export function cloneText(str:string|null):string {
  if (str === null) {
    return '';
  }
  const trimMode = getTrimMode();
  const cloned = complexAttribute(str, Math.max(trimMode, TrimMode.on));
  return '' + cloned;
}

/**
 * Resolve an attribute, in situations where it can resolve to an object, 
 * and not just text. If any portion is text, then the entire will concatenate
 * as text.
 * @param str the raw attribute
 * @param trim whether any whitespace should be trimmed while processing. By default, off.
 * @returns an object, if the entire raw attribute string is a {formula}.
 * Otherwise a string, which may simply be a clone of the original.
 */
export function complexAttribute(str:string, trim:TrimMode = TrimMode.off):any {
  if (str === null) {
    return '';
  }
  
  if (trim != TrimMode.off) {
    str = simpleTrim(str);
  }

  const list = tokenizeText(str);

  let buffer = '';
  for (let i = 0; i < list.length; i++) {
    if (!list[i].formula) {
      if (trim == TrimMode.all) {
        buffer += simpleTrim(list[i].text);
      }
      else {
        buffer += list[i].text;
      }
    }
    else {
      try {
        const complex = evaluateFormula(list[i].text);
        if (i == 0 && list.length == 1) {
          return complex;
        }
        buffer += makeString(complex, list[i]);          
      }
      catch (ex) {
        throw wrapContextError(ex, 'complexAttribute', list[i]);
      }
    }
  }

  return buffer;
}

/**
 * Trim a string without taking non-breaking-spaces
 * @param str Any string
 * @returns A substring
 */
function simpleTrim(str:string):string {
  let s = 0;
  let e = str.length;
  while (s < e && (str.charCodeAt(s) || 33) <= 32) {
    s++;
  }
  while (--e > s && (str.charCodeAt(e) || 33) <= 32) {
    ;
  }
  return str.substring(s, e + 1);
}

enum TokenType {
  unset = 0,
  unaryOp = 0x1,  // sub-types of operator, when we get to that
  binaryOp = 0x2,
  anyOperator = 0x3,
  openBracket = 0x10,
  closeBracket = 0x20,
  anyBracket = 0x30,
  anyOperatorOrBracket = 0xff,
  word = 0x100,
  number = 0x200,
  spaces = 0x400,
  anyText = 0xf00,
  node = 0x1000,
}

export type FormulaToken = SourceOffset & {
  text?: string;
  type: TokenType;
  node?: FormulaNode;
}

/**
 * Divide up a string into sibling tokens.
 * Each token may be divisible into sub-tokens, but those are skipped here.
 * If we're not inside a {=formula}, the only tokens are { and }.
 * If we are inside a {=formula}, then operators and other brackets are tokens too.
 * @param str The parent string
 * @param inFormula True if str should be treated as already inside {}
 * @returns A list of token strings. Uninterpretted.
 * (Only exported for unit tests)
 */
export function tokenizeFormula(str:string): FormulaToken[] {
  const tokens:FormulaToken[] = [];
  const stack:string[] = [];  // currently open brackets

  let tok:FormulaToken = { text: '', type: TokenType.unset, 
    source: str, offset: 0, length: 0 };
  let escape = false;
  const len = str.length;
  for (let i = 0; i <= str.length; i++) {
    const ch = i < str.length ? str[i] : '';
    if (ch == '`') {
      if (!escape) {
        escape = true;
        continue;  // First one. Do nothing.
      }
      escape = false;
      // Fall through, and process second ` as normal text
    }
    
    const op = getOperator(ch);

    if (stack.length > 0 && !escape && ch == stack[stack.length - 1]) {
      // Found a matching close bracket
      stack.pop();
      if (tok.type != TokenType.unset) { tokens.push(tok); }        // push any token in progress
      tokens.push(tok = {  text:ch,  type:TokenType.closeBracket,   // push close bracket
        source: str, offset: i, length: 1 });  
      tok = { text: '', type: TokenType.unset,                      // reset next token
        source: str, offset: i + 1, length: 0 }; 
    }
    else if (!isInQuotes(stack) && !escape && (isBracketOperator(op) || isCloseBracket(op))) {
      // New open bracket, or unmatched close
      const type = isBracketOperator(op) ? TokenType.openBracket : TokenType.closeBracket;
      if (tok.type != TokenType.unset) { tokens.push(tok); }       // push any token in progress
      tokens.push(tok = { text:ch, type:type,                      // push open bracket
        source: str, offset: i, length: 1 });  
      if (type == TokenType.openBracket) {
        stack.push(op!.closeChar!);                                // cache the pending close bracket
      }
      tok = { text: '', type: TokenType.unset,                     // reset next token
        source: str, offset: i + 1, length: 0 };
    }
    else if (!isInQuotes(stack) && !escape && op !== null) {
      // Found an operator
      let tt:TokenType = TokenType.unset;
      if (isBinaryOperator(op)) { tt |= TokenType.binaryOp; }
      if (isUnaryOperator(op)) { tt |= TokenType.unaryOp; }
      if (tok.type != TokenType.unset) { tokens.push(tok); }   // push any token in progress
      tokens.push(tok = { text:ch, type:tt,                    // push operator (exact type TBD)
        source: str, offset: i, length: 1 });
      tok = { text: '', type: TokenType.unset,                 // reset next token
        source: str, offset: i + 1, length: 0 };
    }
    else {
      // Anything else is text
      if (escape && op == null) {
        tok.text += '`';  // Standalone escape. Treat as regular `
      }
      tok.text += ch;
      if (tok.text !== '') {
        tok.type = TokenType.anyText;
        tok.length = Math.min(i + 1,len) - tok.offset!;
      }
    }
    escape = false;
  }
  if (tok.type != TokenType.unset) { 
    tokens.push(tok);  // push any token in progress
  }

  // Re-scan tokens, to clarify operator and text sub-types
  let prev = TokenType.unset;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.source == undefined || tok.offset == undefined || tok.length == undefined) {
      throw new CodeError('All tokens should know their source offset: ' + tok);
    }
    if (tok.type & TokenType.anyOperator) {
      if ((prev & (TokenType.word | TokenType.number | TokenType.closeBracket)) == 0) {
        // If no object (text or a closeBracket) precedes us, we're a unary operator
        // For example, consecutive operators mean all but the first are unary (since we have no post-fix unary operators)
        tok.type = TokenType.unaryOp;
        const op = getOperator(tok.text!);
        tok.text = op!.unaryChar ?? tok.text;  // possibly substitute operator char
      }
      else if (tok.type & TokenType.anyOperator) {
        // When an object does precede us, then ambiguous operators are binary
        tok.type = TokenType.binaryOp;
        const op = getOperator(tok.text!);
        tok.text = op!.binaryChar ?? tok.text;  // possibly substitute operator char
      }
    }
    else if (tok.type & TokenType.anyText) {
      if (simpleTrim(tok.text!).length == 0) {
        tok.type = TokenType.spaces;
      }
      else if (isIntegerRegex(tok.text!)) {
        tok.type = TokenType.number;
      }
      else {
        tok.type = TokenType.word;
      }
    }
    
    if (tok.type != TokenType.spaces) {
      prev = tok.type;
    }
  }

  return tokens;
}

function findCloseBracket(tokens:FormulaToken[], open:number):number {
  const closes:FormulaToken[] = [tokens[open]];
  for (let i = open + 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type == TokenType.closeBracket) {
      if (tok.text == bracketPairs[closes[closes.length - 1].text!]) {
        closes.pop();
        if (closes.length == 0) {
          return i;
        }
      }
      else {
        throw new ContextError('Unmatched close bracket', tok);
      }
    }
    else if (tok.type == TokenType.openBracket) {
      closes.push(tok);
    }
  }
  throw new ContextError('Missing close ' + (isStringBracket(closes[closes.length - 1].text!) ? 'quotes' : 'brackets'), 
    closes[closes.length - 1]);
}

/**
 * A node of a formula's expression, which can be combined into a binary tree.
 * Each node also has a parent pointer, to support tree restructuring.
 * A single node is one of:
 *   plain text (could be a number)
 *   a unary operation, with an operator and its operand
 *   a binary operation, with an operator and two operands
 * If an operation, the operand(s) are also FormulaNodes.
 * Nodes are decorated with any immediate bracket, which affects text parsing.
 * (Only exported for unit tests)
 */
export class FormulaNode {
  value: FormulaToken;  // Doubles as the operator and the simple string value
  span: FormulaToken;   // For context, when debugging
  left?: FormulaNode;
  right?: FormulaNode;
  bracket: string = '';  // If this node is the root of a bracketed sub-formula, name the bracket char, else ''
  parent?: FormulaNode;

  constructor(value:FormulaToken, right?:FormulaNode, left?:FormulaNode, span?:FormulaToken) {
    this.left = left;
    this.right = right;
    this.value = value;
    this.span = span ? span : value;

    if (right) {
      right.parent = this;
    }
    if (left) {
      left.parent = this;
    }
  }

  /**
   * Recreate the expression, as text
   * @returns A string equivalent (including any brackets or quotes it was found inside)
   */
  toString(): string {
    const rbrace = this.bracket === '' ? '' : bracketPairs[this.bracket];
    if (this.left) {
      return this.bracket + this.left.toString() + ' ' + this.value + ' ' + this.right?.toString() + rbrace;
    }
    else if (this.right) {
      return this.bracket + this.value + ' ' + this.right?.toString() + rbrace;
    }
    else {
      return this.bracket + this.value + rbrace;
    }
  }

  /**
   * Is this node plain-text?
   * @returns false if there is an operation and operands, else false
   */
  isSimple():boolean {
    return !this.left && !this.right;
  }

  reRootContext():boolean {
    return this.bracket == '[' || this.bracket == '{';
  }

  /**
   * Evaluate this node.
   * @param evalText if true, any simple text nodes are assumed to be named objects or numbers
   * else any simple text is just that. No effect for non-simple text.
   * @returns If it's a simple value, return it (any type).
   * If there's an operator and operands, return a type appropriate for that operator.
   */
  evaluate(evalText?:boolean): any {
    let result:any = undefined;

    if (this.left) {
      try {
        const op = getOperator(this.value.text!);
        const bop:undefined|BinaryOperator = op!.binaryOp;

        // right must also exist, because we're complete
        const lValue = this.left.evaluate(op!.evalLeft);
        const rValue = this.right!.evaluate(op!.evalRight || this.right!.reRootContext());

        if (!bop) {
          throw new ContextError('Unrecognize binary operator', this.value);
        }
        result = bop(lValue, rValue, this.left?.span, this.right?.span);
        if (result === undefined || Number.isNaN(result)) {
          throw new ContextError('Operation ' + op?.raw + ' resulted in ' + result + ' : ' + lValue + op?.raw + rValue, this.value);
        }
      }
      catch (ex) {
        throw wrapContextError(ex, 'evaluate:binary', this.span);
      }
    }
    else if (this.right) {
      try {
        const op = getOperator(this.value.text!);
        const uop:undefined|UnaryOperator = op!.unaryOp;
        const rValue = this.right.evaluate(op!.evalRight);
        if (!uop) {
          throw new ContextError('Unrecognize unary operator', this.value);
        }
        result = uop(rValue, this.right?.span);
        if (result === undefined || Number.isNaN(result)) {
          throw new ContextError('Operation ' + op?.raw + ' resulted in ' + result + ' : ' + op?.raw + rValue, this.value);
        }
      }
      catch (ex) {
        throw wrapContextError(ex, 'evaluate:unary', this.span);
      }
    }
    else if (this.bracket === '\"' || this.bracket === '\'') {
      // Reliably plain text
      result = resolveEntities(this.value.text);
    }
    else {
      result = resolveEntities(this.value.text!);  // unless overridden below
      let trimmed = simpleTrim(result);

      const maybe = result && trimmed[trimmed.length - 1] == '?';
      if (maybe) {
        trimmed = trimmed.substring(0, trimmed.length - 1);
        evalText = true;
      }

      // Could be plain text (or a number) or a name in context
      if (evalText === true) {
        const context = getBuilderContext();
        if (trimmed in context) {
          result = context[trimmed];
          result = resolveEntities(result);
        }
        else if (maybe) {
          return '';  // Special case
        }
        else if (isIntegerRegex(trimmed)) {
          result = parseInt(trimmed);
        }
        else if (this.bracket == '{') {
          throw new ContextError('Name lookup failed', this.span);
        }
      }
    }
    return result;
  }
}

/**
 * Does this string look like an integer?
 * @param str any text
 * @returns true if, once trimmed, it's a well-formed integer
 */
function isIntegerRegex(str:string):boolean {
  return /^\s*-?\d+\s*$/.test(str);
}

/**
 * Of all the operators, find the one with the highest precedence.
 * @param tokens A list of tokens, which are a mix of operators and values
 * @returns The index of the first operator with the highest precedence,
 * or -1 if no remaining operators
 */
function findHighestPrecedence(tokens:FormulaToken[]): number {
  let precedence = -1;
  let first = -1;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type & TokenType.anyOperatorOrBracket) {
      const op = getOperator(tok.text ?? '');
      if (op) {
        if ((op.precedence || 0) > precedence) {
          precedence = op.precedence!;
          first = i;
        }
      }
    }
  }
  return first;
}

/**
 * Create a merged token, which spans the range between (inclusive) two existing tokens.
 * @param first The first token in the span
 * @param last The last token in the span
 * @param node The node this token spans, if one. If omitted, the type is assumed to be text
 * @returns A new token
 */
function makeSpanToken(first:FormulaToken, last:FormulaToken, node?:FormulaNode) {
  const start = Math.min(first.offset!, last.offset!);
  const end = Math.max(first.offset! + first.length!, last.offset! + last.length!);
  const tok:FormulaToken = {
    type: node ? TokenType.node : TokenType.word,
    node: node,    
    source: first.source,
    text: unescapeOperators(first.source.substring(start, end)),
    offset: start,
    length: end - start,
  };
  return tok;
}

/**
 * An edge case, to create a blank token between existing tokens.
 * @param before The token prior to the empty token
 * @returns An empty token, correctly positioned.
 */
function makeEmptyToken(before:FormulaToken) {
  const tok:FormulaToken = {
    type: TokenType.spaces,
    source: before.source,
    text: '',
    offset: before.offset! + before.length!,
    length: 0,
  };
  return tok;
}

/**
 * 2nd pass of formula parser.
 * Uses operator precedence. 
 * Finds the left-most of the highest-precedence operators.
 * Builds a node that binds that operator to its operand(s).
 * Replace that subset with the node, and repeat
 * @param tokens A sequence of tokens
 * @param bracket An encapsulating bracket, if any
 * @returns A single node
 * @throws an error if the formula is malformed: mismatched brackets or incomplete operators
 */
export function treeifyFormula(tokens:FormulaToken[], bracket?:FormulaToken):FormulaNode
{
  if (tokens.length == 0 && !bracket) {
    throw new CodeError('Cannot treeify without content');
  }

  const fullSpanTok = tokens.length > 0
    ? makeSpanToken(tokens[0], tokens[tokens.length - 1])
    : makeEmptyToken(bracket!);

  if (bracket && isStringBracket(bracket.text!)) {
    return new FormulaNode(fullSpanTok);
  }

  while (tokens.length > 0) {
    const opIndex = findHighestPrecedence(tokens);
    if (opIndex < 0) {
      // If well formed, there should only be a single non-space token left
      let node:FormulaNode|undefined = undefined;
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type != TokenType.spaces) {
          if (node) {
            // This is a 2nd token
            // REVIEW: Alternatively invent a concatenation node
            throw new ContextError('Consecutive tokens with no operator', tok);
          }
          if (tok.type == TokenType.node) {
            node = tok.node!;
          }
          else {
            node = new FormulaNode(tok);
            if (bracket) {
              node.bracket = bracket.text!;
            }
          }
        }
      }
      if (!node) {
        const tok = makeSpanToken(tokens[0], tokens[tokens.length - 1]);
        throw new ContextError('No value tokens in span', tok);
      }
      return node;
    }

    const opTok = tokens[opIndex];
    const ch = opTok.text!
    const op = getOperator(ch);
    
    if (isUnaryOperator(op)) {
      let r = opIndex + 1;
      while (r < tokens.length && tokens[r].type == TokenType.spaces) { 
        r++; 
      }
      if (r >= tokens.length) {
        throw new ContextError('Unary operator without following operand', opTok);
      }
      const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
      const right = treeifyFormula(rightSplit);
      const node = new FormulaNode(opTok, right);
      const tok = makeSpanToken(opTok, rightSplit[rightSplit.length - 1], node);
      node.span = tok;
      tokens[opIndex] = tok;
    }

    else if (isBinaryOperator(op)) {
      let r = opIndex + 1;
      while (r < tokens.length && tokens[r].type == TokenType.spaces) { 
        r++; 
      }
      if (r >= tokens.length) {
        throw new ContextError('Binary operator without right operand', opTok);
      }
      const rightSplit = tokens.splice(opIndex + 1, r - opIndex);
      const right = treeifyFormula(rightSplit);

      let l = opIndex - 1;
      while (l >= 0 && tokens[l].type == TokenType.spaces) { 
        l--; 
      }
      if (l < 0) {
        throw new ContextError('Binary operator without left operand', opTok);
      }
      const leftSplit = tokens.splice(l, opIndex - l);
      const left = treeifyFormula(leftSplit);

      const node = new FormulaNode(opTok, right, left);
      const tok = makeSpanToken(leftSplit[0], rightSplit[rightSplit.length - 1], node);
      node.span = tok;
      tokens[l] = tok;
    }

    else if (isBracketOperator(op)) {
      const close = findCloseBracket(tokens, opIndex);
      const closeTok = tokens.splice(close, 1)[0];
      const nested = tokens.splice(opIndex + 1, close - opIndex - 1);
      const node = treeifyFormula(nested, opTok);
      node.bracket = op!.raw;
      const tok = makeSpanToken(opTok, closeTok, node);
      node.span = tok;
      tokens[opIndex] = tok;
    }
    else {
      throw new ContextError('Unknown operator ' + ch, opTok);
    }
  }

  if (fullSpanTok.length == 0) {
    throw new ContextError('Empty brackets yield no value', bracket);
  }
  throw new ContextError('Treeify reduced to an empty span', fullSpanTok);
}

/**
 * Evaluate a formula
 * @param str A single formula. The bracketing {} are assumed.
 * @returns A single object, list, or string
 */
export function evaluateFormula(str:string|null):any {
  if (str === null) {
    return '';
  }
  try {
    const tokens = tokenizeFormula(str);
    const node = treeifyFormula(tokens);
    return node.evaluate(true);  
  }
  catch (ex) {
    throw wrapContextError(ex, 'evaluateFormula');
  }
}

/**
 * Evaluate a single attribute of an HTML element
 * @param elmt The HTML element
 * @param attr The name of the attribute
 * @param implicitFormula Whether the contents of the attribute require {} to indicate a formula
 * @param required Whether the attribute is required, in which case it will throw if not present. 
 * Otherwise it would return undefined
 * @param onerr What to return in the special case of an exception. If omitted, exceptions throw.
 * @returns Any data type
 */
export function evaluateAttribute(elmt:Element, attr:string, implicitFormula:boolean, required?:boolean, onerr?:any):any {
  const val = elmt.getAttributeNS('', attr);
  if (!val) {
    if (required === false) {  // true by default
      return val == '' ? '' : undefined;  // empty string is interestingly different from missing
    }
    throw new ContextError('Missing required attribute: ' + attr, elementSourceOffset(elmt));
  }
  try {
    if (implicitFormula) {
      return evaluateFormula(val);
    }
    return complexAttribute(val);
  }
  catch (ex) {
    if (onerr !== undefined) {
      return onerr;
    }
    throw wrapContextError(ex, undefined, elementSourceOffset(elmt, attr));
  }

}

/* Context formula syntax has several components that need to play nicely with each other.
   Brackets:
     {} to start lookups
     [] to start secondary, nested lookups
     () to do operator precedence, within formulas
   Fields:
     a-z0-9_   normal javascript field name rules
     .         separator
     ?         indicates optional (sub-)fields
   Generated field suffixes:
     #  index in a loop
     !  value of a key
     $  ???
   Operators:
     +-*\%/   numeric operators
     &@       string operators
     .?:      object and context operators

 */


const bracketPairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  // '<': '>',  // should never be used for comparison operators in this context
  '"': '"',
  "'": "'",
}

/**
 * Most brackets can stack inside each other, but once we have quotes, we're done
 * @param stack a stack of pending close brackets, i.e. what we're inside of
 * @returns true if the innermost bracket is " or '
 */
function isInQuotes(stack:string[]) {
  return stack.length > 0 
    && (stack[stack.length - 1] == '"' || stack[stack.length - 1] == '\'');
}

/**
 * Is this character normally a bracket, and therefore in need of escaping?
 * @param ch 
 * @returns 
 */
function isBracketChar(ch:string):boolean {
  return ch in bracketPairs
    || ch == ')' || ch == ']' || ch == '}';
}

/**
 * Convert any type to a number, or throw in broken cases.
 * @param a Any data, but hopefully an int or float
 * @param tok The source offset, if caller knows it
 * @returns The float equivalent
 */
export function makeFloat(a:any, tok?:SourceOffsetable):number {
  const f = parseFloat(a);
  if (Number.isNaN(f)) {
    throw new ContextError('Not a number: ' + JSON.stringify(a), tok);
  }
  return f;
}

/**
 * Convert any type to an integer, or throw in broken cases.
 * @param a Any data, but hopefully an int
 * @param tok The source offset, if caller knows it
 * @returns The int equivalent
 */
export function makeInt(a:any, tok?:SourceOffsetable):number {
  if (typeof(a) == 'number') {
    if (Math.trunc(a) == a) {
      return a;
    }
  }
  else if (isIntegerRegex('' + a)) {
    return parseInt(a);
  }
  throw new ContextError('Not an integer: ' + a, tok);
}

/**
 * Convert any type to string, or throw in broken cases.
 * @param a Any data, but hopefully string-friendly
 * @param tok The source offset, if caller knows it
 * @returns The string equivalent
 */
export function makeString(a:any, tok?:SourceOffsetable):string {
  if (a === undefined || a === null || typeof(a) == 'object') {
    throw new ContextError('Bad cast to string: ' + JSON.stringify(a), tok);
  }
  return String(a);
}

type UnaryOperator = (a:any,aa?:SourceOffsetable) => any;
type BinaryOperator = (a:any,b:any,aa?:SourceOffsetable,bb?:SourceOffsetable) => any;

type OperatorInfo = {
  raw: string;
  precedence?: number;  // higher numbers should evaluate before lower
  unaryChar?: string;  // if a unaryOp, replace text for a unique operator
  binaryChar?: string;  // if a binaryOp, replace text for a unique operator
  closeChar?: string;  // only for brackets
  unaryOp?: UnaryOperator;  // only supports prefixed unary operators: -4, but not 4!
  binaryOp?: BinaryOperator;
  evalLeft?: boolean;
  evalRight?: boolean;
}

const minus:OperatorInfo = { raw:'-', unaryChar:'⁻', binaryChar:'−'};  // ambiguously unary or binary
const concat:OperatorInfo = { raw:'~', precedence:1, binaryOp:(a,b,aa,bb) => {return makeString(a,aa) + makeString(b,bb)}, evalLeft:true, evalRight:true};
const entity:OperatorInfo = { raw:'@', precedence:2, unaryOp:(a,aa) => {return entitize(a, aa)}, evalRight:false};
const plus:OperatorInfo = { raw:'+', precedence:3, binaryOp:(a,b,aa,bb) => {return makeFloat(a,aa) + makeFloat(b,bb)}, evalLeft:true, evalRight:true};
const subtract:OperatorInfo = { raw:'−', precedence:3, binaryOp:(a,b,aa,bb) => {return makeFloat(a,aa) - makeFloat(b,bb)}, evalLeft:true, evalRight:true};
const times:OperatorInfo = { raw:'*', precedence:4, binaryOp:(a,b,aa,bb) => {return makeFloat(a,aa) * makeFloat(b,bb)}, evalLeft:true, evalRight:true};
const divide:OperatorInfo = { raw:'/', precedence:4, binaryOp:(a,b,aa,bb) => {return makeFloat(a,aa) / makeFloat(b,bb)}, evalLeft:true, evalRight:true};
const intDivide:OperatorInfo = { raw:'\\', precedence:4, binaryOp:(a,b,aa,bb) => {const f=makeFloat(a,aa) / makeFloat(b,bb); return f >= 0 ? Math.floor(f) : Math.ceil(f)}, evalLeft:true, evalRight:true};  // integer divide without Math.trunc
const modulo:OperatorInfo = { raw:'%', precedence:4, binaryOp:(a,b,aa,bb) => {return makeFloat(a,aa) % makeFloat(b,bb)}, evalLeft:true, evalRight:true};
const negative:OperatorInfo = { raw:'⁻', precedence:5, unaryOp:(a,aa) => {return -makeFloat(a,aa)}, evalRight:true};
const childObj:OperatorInfo = { raw:'.', precedence:6, binaryOp:(a,b,aa,bb) => {return getKeyedChild(a, b, bb, false)}, evalLeft:true, evalRight:false};
const rootObj:OperatorInfo = { raw:':', precedence:7, unaryOp:(a,aa) => {return getKeyedChild(null,a,aa)}, evalRight:false};
const roundBrackets:OperatorInfo = { raw:'(', precedence:8, closeChar:')'};
const squareBrackets:OperatorInfo = { raw:'[', precedence:8, closeChar:']'};
const curlyBrackets:OperatorInfo = { raw:'{', precedence:8, closeChar:'}'};
const closeRoundBrackets:OperatorInfo = { raw:')', precedence:0};
const closeSquareBrackets:OperatorInfo = { raw:']', precedence:0};
const closeCurlyBrackets:OperatorInfo = { raw:'}', precedence:0};
const singleQuotes:OperatorInfo = { raw:'\'', precedence:10, closeChar:'\''};
const doubleQuotes:OperatorInfo = { raw:'"', precedence:10, closeChar:'"'};

const allOperators:OperatorInfo[] = [
  minus, concat, plus, subtract, entity, 
  times, divide, intDivide, modulo, negative,
  childObj, rootObj,
  roundBrackets, squareBrackets, curlyBrackets,
  closeRoundBrackets, closeSquareBrackets, closeCurlyBrackets,
  singleQuotes, doubleQuotes
];

// Convert the list to a dictionary, keyed on the raw string
// (accumulate each item in the list into a field in acc, which starts out as {})
const operatorLookup = allOperators.reduce((acc, obj) => { acc[obj.raw] = obj; return acc; }, {});

function isOperator(ch:string) {
  return ch in isOperator;
}

function getOperator(ch:string|OperatorInfo|null):OperatorInfo|null {
  if (ch === null) {
    return null;
  }
  if (typeof ch === 'string') {
    if (ch in operatorLookup) {
      return operatorLookup[ch];
    }
    return null;
  }
  return ch as OperatorInfo;
}

function isUnaryOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null
    && (op.unaryChar !== undefined || op.unaryOp !== undefined);
}

function isBinaryOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null
    && (op.binaryChar !== undefined || op.binaryOp !== undefined);
}

function isBracketOperator(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null && op.closeChar !== undefined;
}

function isCloseBracket(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op == closeRoundBrackets || op == closeSquareBrackets || op == closeCurlyBrackets;
}

function isStringBracket(ch:string|OperatorInfo|null) {
  const op = getOperator(ch);
  return op !== null && (op.raw == '"' || op.raw == '\'');
}

/**
 * A few common named entities
 */
const namedEntities = {
  'quot': '"',
  'apos': '\'',
  'lt': '<',
  'gt': '>',
  'lb': '{',  // not the real name. It should be &lbrace;
  'rb': '}',  // not the real name. It should be &rbrace;
  'lbrace': '{',
  'rbrace': '}',
  'amp': '&',
  'tilde': '~',
  'at': '@',
  'nbsp': '\xa0',
}

/**
 * Convert an entity term into simple text.
 * Note that the entity prefix is # rather than &, because & injects an actual entity, which becomes text before we see it.
 * Supports decimal @34; and hex @x22; and a few named like @quot;
 * @param str the contents of the entity, after the @, up to the first semicolon
 * @returns a single character, if known, else throws an exception
 */
function entitize(str:any, tok?:SourceOffsetable):string {
  if (typeof(str) == 'number') {
    return String.fromCharCode(str);
  }
  str = makeString(str, tok);
  if (str) {
    str = simpleTrim(str);
    if (str.indexOf(';') == str.length - 1) { str = str.substring(0, str.length - 1); } // trim optional trailing semicolon
    if (str[0] == 'x' || str[0] == '#' || (str[0] >= '0' && str[0] <= '9')) {
      if (str[0] == '#') { str = str.substring(1); }  // # isn't required, but allow it like HTML NCRs
      let code = 0;
      if (str[0] == 'x') {
        str = str.substring(1);
        code = parseInt(str, 16);
        // REVIEW: will fromCharCode work for codes > 0x10000?
      }
      else {
        code = parseInt(str, 10);
      }
      return String.fromCharCode(code);
    }
    if (str in namedEntities) {
      return namedEntities[str];
    }
  }
  if (tok) {
    throw new ContextError('Not a recognized entity: ' + str, tok);
  }
  return '';
}

/**
 * Find any entities in a text string, and convert to 
 * Escape characters elsewhere are left.
 * @param raw A string which may contain `
 * @returns The unescapes, user-friendly string
 */
function resolveEntities(raw:any):any {
  if (typeof(raw) != 'string') {
    return raw;
  }
  let str = '';
  let start = 0;
  while (start <= raw.length) {
    const at = raw.indexOf('@', start);
    if (at < 0) {
      str += raw.substring(start);
      break;
    }
    str += raw.substring(start, at);

    const semi = raw.indexOf(';', at + 1);
    if (semi < 0) {
      // Not a valid entity. Treat as plain text.
      str += raw.substring(at);
      break;
    }

    const ent = entitize(raw.substring(at + 1, semi + 1));
    if (ent == '') {
      // Ignore any malformed entities
      str += '@';
      start = at + 1;
    }
    else {
      str += ent;
      start = semi + 1;
    }
  }
  return str;
}

/**
 * Each token in a text string is either plain text or a formula that should be processed.
 */
type TextToken = SourceOffset & {
  text: string;
  formula: boolean;
}

/**
 * Find the next instance of a character, making sure the character isn't escaped.
 * In our custom library, the escape character is a prefixed `
 * The only thing that can be escaped is brackets () [] {} "" '', and the ` itself.
 * Anywhere else, ` is simply that character.
 * @param raw The raw HTML content
 * @param find The character the search for
 * @param start The first position in the raw HTML
 * @returns the index of the character, if found, or else -1 if not found
 */
function findNonEscaped(raw:string, find:string, start:number) {
  while (start < raw.length) {
    let curly = raw.indexOf(find, start);
    if (curly > 0) {
      let esc = 0;
      while (curly - esc > 0 && raw[curly - esc - 1] == '`') {
        esc++;
      }
      if ((esc % 2) == 1) {
        // An odd number of back-slashes means the curly itself is escaped.
        // An even number means the back-slash is itself escaped, but not the curly
        start = curly + 1;
        continue;
      }
    }
    return curly;
  }
  return -1;
}

/**
 * Remove any escape characters preceding curly braces.
 * Since those braces have other meanings when not escaped, 
 * then their sheer presence means they were escaped.
 * @param raw A string which may contain `{ or even ```{
 * @returns A somg;e
 */
function unescapeBraces(raw:string):string {
  let str = '';
  let start = 0;
  while (start <= raw.length) {
    let i = raw.indexOf('`', start);
    if (i < 0) {
      str += raw.substring(start);
      break;
    }
    str += raw.substring(start, i);
    const ch = i + 1 < raw.length ? raw[i + 1] : '';
    if (ch == '`' || ch == '{' || ch == '}') {
      // drop the ` escape, and keep the next char
      str += ch;
      start = i + 2;
    }
    else {
      str += '`';  // not a real escape
      start = i + 1;
    }
  }
  return str;
}

/**
 * Remove any escape characters before operators.
 * Escape characters elsewhere are left.
 * @param raw A string which may contain `
 * @returns The unescapes, user-friendly string
 */
function unescapeOperators(raw:string):string {
  let str = '';
  let start = 0;
  while (start <= raw.length) {
    let i = raw.indexOf('`', start);
    if (i < 0) {
      str += raw.substring(start);
      break;
    }
    str += raw.substring(start, i);
    const ch = i + 1 < raw.length ? raw[i + 1] : '';
    const op = getOperator(ch);
    if (op !== null || ch == '`') {
      str += ch;  // The character after the escape
    }
    else {
      str += '`' + ch  // Not a real escape
    }
    start = i + 2;
  }
  return str;
}

/**
 * Parse text that occurs inside a built control element into tokens.
 * @param raw the raw document text
 * @param implicitFormula if true, the full text can be a formula without being inside {}.
 * (Only exported for unit tests)
 */
export function tokenizeText(raw:string, implicitFormula?:boolean):TextToken[] {
  implicitFormula = implicitFormula || false;
  const list:TextToken[] = [];

  let start = 0;
  while (start < raw.length) {
    let curly = findNonEscaped(raw, '{', start);

    let errorClose = findNonEscaped(raw, '}', start);
    if (errorClose >= start && (curly < 0 || errorClose < curly)) {
      const src:SourceOffset = {source:raw, offset:errorClose, length:1};
      throw new ContextError('Close-curly brace without an open brace.', src);
    }

    if (curly < 0) {
      break;
    }

    if (curly > start) {
      // Plain text prior to a formula
      const ttoken:TextToken = {
        text: unescapeBraces(raw.substring(start, curly)),
        formula: false,
        source: raw,
        offset: start,
        length: curly - start,
      };
      list.push(ttoken);  
    }

    let count = 1;
    let inner = curly + 1;
    while (count > 0) {
      let lb = findNonEscaped(raw, '{', inner);
      let rb = findNonEscaped(raw, '}', inner);
      if (rb < 0) {
        const src:SourceOffset = {source:raw, offset:curly, length:1};
        throw new ContextError('Unclosed curly braces.', src);
      }
      if (lb >= 0 && lb < rb) {
        count++;
        inner = lb + 1;
      }
      else {
        count--;
        inner = rb + 1;
      }
    }
    // The contents of the formula (without the {} braces)
    const ftoken:TextToken = {
      text: unescapeOperators(raw.substring(curly + 1, inner - 1)),
      formula: true,
      source: raw,
      offset: curly + 1,
      length: inner - 1 - curly - 1,
  };
    list.push(ftoken);
    start = inner;
  }
  if (start < raw.length) {
    // Any remaining plain text
    const isFormula = implicitFormula && start == 0;
    const ttoken:TextToken = {
      text: isFormula ? unescapeOperators(raw) : unescapeBraces(raw.substring(start)),
      formula: isFormula,
      source: raw,
      offset: start,
      length: raw.length - start,
  };
    list.push(ttoken);  
  }
  return list;
}

/**
 * Test a key in the current context
 * @param key A key, initially from {curly} notation
 * @returns true if key is a valid path within the context
 */
export function keyExistsInContext(key:string) {
  try {
    const a = evaluateFormula(key);
    // null, undefined, or '' count as not existing
    return a !== null && a !== undefined && a !== '';
    // Note: empty {} and [] do count as existing.
  }
  catch {
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
 * @returns Resolved text
 */
export function textFromContext(key:string|null):string {
  const obj = evaluateFormula(key);
  return makeString(obj);
}


/**
 * Get a keyed child of a parent, where the key is either a dictionary key 
 * or a list index or a string offset.
 * @param parent The parent object: a list, object, or string, which could in turn be the name of a list or object.
 * If null, the parent becomes the root boiler context.
 * @param key The identifier of the child: a dictionary key, a list index, or a string offset.
 * @param kTok The source offset of the token, if caller knows it.
 * @param maybe If true, and key does not work, return ''. If false/omitted, throw on bad keys.
 * @returns A child object, or a substring
 */
function getKeyedChild(parent:any, key:any, kTok?:SourceOffsetable, maybe?:boolean):any {
  if (parent === null) {
    parent = theBoilerContext();
  }

  let index:number|undefined = undefined;
  if (typeof(key) == 'number') {
    index = key;
  }
  else if (isIntegerRegex('' + key)) {
    index = parseInt('' + key);
  }

  if (typeof(parent) == 'string') {
    // If the parent is a string, the only key we support is a character index
    if (index !== undefined) {
      if (index < 0 || index >= (parent as string).length) {
        if (maybe) {
          return '';
        }
        throw new ContextError('Index out of range: ' + index + ' in ' + parent, kTok);
      }
      return (parent as string)[index];
    }
    throw new ContextError('Named fields are only available on objects: ' + key + ' in ' + JSON.stringify(parent), kTok);
  }

  if (index !== undefined && Array.isArray(parent)) {
    // Indexing into a list. Objects with keys that looks like numbers is handled below.
    if (index < 0 || index >= parent.length) {
      if (maybe) {
        return '';
      }
      throw new ContextError('Index out of range: ' + index + ' in ' + parent, kTok);
    }
    return parent[index];
  }

  // Named members of objects
  const trimmed = simpleTrim(key);
  if (!(trimmed in parent)) {
    if (maybe) {
      return '';
    }
    throw new ContextError('Key not found in context: ' + trimmed, kTok);
  }
  return parent[trimmed];
}


/*-----------------------------------------------------------
 * _builderFor.ts
 *-----------------------------------------------------------*/


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
export function startForLoop(src:HTMLElement):Node[] {
  const dest:Node[] = [];

  let iter:string|null = null;
  let list:any[] = [];
  let vals:any[] = [];  // not always used

  // <for each="variable_name" in="list">
  iter = getIterationVariable(src,'each');
  if (iter) {
    list = parseForEach(src);
  }
  else {
    iter = getIterationVariable(src,'char');
    if (iter) {
      list = parseForText(src, '');
    }
    else {
      iter = getIterationVariable(src,'word');
      if (iter) {
        list = parseForText(src, ' ');
      }
      else {
        iter = getIterationVariable(src,'key');
        if (iter) {
          list = parseForKey(src);
          vals = list[1];
          list = list[0];
        }
        else {
          // range and int are synonyms
          iter = getIterationVariable(src,'range') || getIterationVariable(src,'int');
          if (iter) {
            list = parseForRange(src);
          }
          else {
            throw new ContextError('Unrecognized <for> tag type', elementSourceOffset(src));
          }
        }
      }
    }
  }

  if (!list) {
    throw new ContextError('Unable to determine loop', elementSourceOffset(src));
  }

  dest.push(consoleComment('Iterating ' + iter + ' over ' + list.length + ' items...'));

  const inner_context = pushBuilderContext();
  const iter_index = iter + '#';
  for (let i = 0; i < list.length; i++) {
    dest.push(consoleComment(iter + ' #' + i + ' == ' + JSON.stringify(list[i])));
    inner_context[iter_index] = i;
    inner_context[iter] = list[i];
    if (vals.length > 0) {
      inner_context[iter + '!'] = vals[i];
    }
    pushRange(dest, expandContents(src));
  }
  popBuilderContext();
  
  return dest;
}

/**
 * Read an attribute of the <for> tag, looking for the iteration variable name.
 * @param src The <for> element
 * @param attr The attribute name
 * @returns A string, if found, or null if that attribute was not used.
 * @throws an error if the name is malformed - something other than a single word
 */
function getIterationVariable(src:Element, attr:string): string|null {
  const iter = src.getAttributeNS('', attr);
  if (!iter) {
    return null;
  }
  // Iteration variables need to be a single word. No punctuation.
  if (/^[a-zA-Z]+$/.test(iter)) {
    return iter;
  }
  throw new ContextError('For loop iteration variable must be a single word: ' + iter, elementSourceOffset(src, attr));
}

/**
 * Syntax: <for each="var" in="list">
 * @param src 
 * @param context 
 * @returns a list of elements
 */
function parseForEach(src:HTMLElement):any[] {
  const obj = evaluateAttribute(src, 'in', true);
  if (Array.isArray(obj)) {
    return obj as any[];
  }
  throw new ContextError("For each's in attribute must indicate a list", elementSourceOffseter(src, 'in'));
}

function parseForText(src:HTMLElement, delim:string):string[] {
  const tok = elementSourceOffset(src, 'in');
  const obj = evaluateAttribute(src, 'in', true);
  const str = makeString(obj, tok);
  if (delim == '') {  // When splitting every character, we still want to keep graphemes together
    return splitEmoji(str);
  }
  return str.split(delim);
}

/**
 * Splitting a text string by character is complicated when emoji are involved.
 * There are multiple ways glyphs can be combined or extended.
 * @param str A plain text string
 * @returns An array of strings that represent individual visible glyphs.
 */
function splitEmoji(str:string):string[] {
  const glyphs:string[] = [];
  let joining = 0;
  let prev = 0;
  let code = 0;
  for (let ch of str) {
    // Track the current and previous characters
    prev = code;
    code = ch.length == 1 ? ch.charCodeAt(0)
      : ch.length == 2 ? (0x10000 + (((ch.charCodeAt(0) & 0x3ff) << 10)  | (ch.charCodeAt(1) & 0x3ff)))
      : -1;  // error

    if (code < 0) {
      // Expecting loop to always feed 1 UCS-4 character at a time
      throw new ContextError('Unexpected unicode combination: ' + ch + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
    }
    else if (code >= 0xd800 && code <= 0xdf00) {
      // Half of surrogate pair
      throw new ContextError('Unexpected half of unicode surrogate: ' + code.toString(16) + ' at byte ' + (glyphs.join('').length) + ' in ' + str);
    }
    else if (code >= 0x1f3fb && code <= 0x1f3ff) {
      joining += 1;  // Fitzpatrick skin-tone modifier
    }
    else if (code >= 0xfe00 && code <= 0xfe0f) {
      joining += 1;  // Variation selectors
    }
    else if (code == 0x200d) {
      joining += 2;  // this character plus next
    }
    else if (code >= 0x1f1e6 && code <= 0x1f1ff) {
      // Regional indicator symbols
      if (prev >= 0x1f1e6 && prev <= 0x1f1ff && glyphs[glyphs.length - 1].length == 2) {
        // Always come in pairs, so only join if the previous code was also one
        // and that hasn't already built a pair. Note, a pair of these is length==4
        joining += 1;
      }
    }
    else if (code >= 0xe0001 && code <= 0xe007f) {
      // Tags block
      if (prev != 0xe007f) {  // Don't concat past a cancel tag
        joining += 1;
      }
    }

    if (joining > 0) {
      joining--;
      if (glyphs.length == 0) {
        throw new ContextError('Unexpected unicode join character ' + code.toString(16) + ' at byte 0 of ' + str);
      }
      const cur = glyphs.pop();
      ch = cur + ch;
    }

    glyphs.push(ch);
  }
  if (joining > 0) {
    throw new Error('The final emoji sequence expected ' + joining + ' additional characters')
  }  
  return glyphs;
}

function parseForRange(src:HTMLElement):any {
  const from = evaluateAttribute(src, 'from', true, false);
  const until = evaluateAttribute(src, 'until', true, false);
  const last = evaluateAttribute(src, 'to', true, false);
  const length = evaluateAttribute(src, 'len', true, false);
  const step = evaluateAttribute(src, 'step', true, false);

  const start = from ? makeInt(from, elementSourceOffseter(src, 'from')) : 0;
  let end = until ? makeInt(until, elementSourceOffseter(src, 'until'))
    : last ? (makeInt(last, elementSourceOffseter(src, 'last')) + 1)
    : length ? (makeString(length, elementSourceOffseter(src, 'len'))).length
    : start;
  const inc = step ? parseInt(cloneText(step)) : 1;
  if (inc == 0) {
    throw new ContextError("Invalid loop step. Must be non-zero.", elementSourceOffseter(src, 'step'));
  }
  if (!until && inc < 0) {
    end -= 2;  // from 5 to 1 step -1 means i >= 0
  }

  const list:number[] = [];
  for (let i = start; inc > 0 ? (i < end) : (i > end); i += inc) {
    list.push(i);
  }
  return list;
}

function parseForKey(src:HTMLElement):any {
  const obj = evaluateAttribute(src, 'in', true);
  try {
    const keys = Object.keys(obj);
    const vals = keys.map(k => obj[k]);
    return [keys, vals];  
  }
  catch (ex) {
    throw new ContextError('Not an object with keys: ' + obj, elementSourceOffset(src, 'in'), ex);
  }
}



/*-----------------------------------------------------------
 * _builderIf.ts
 *-----------------------------------------------------------*/


export type ifResult = {
  passed:boolean;
  index:number;
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
 * @param src the <if>, <elseif>, or <else> element
 * @param result in/out parameter that determines whether any sibling in a sequence of if/else-if/else tags has passed yet
 * @returns a list of nodes, which will replace this <if> element
 */
export function startIfBlock(src:HTMLElement, result:ifResult):Node[] {
  try {
    
    if (isTag(src, 'if')) {
      result.index = 1;
      // Each <if> tag resets the group's passed state
      result.passed = false;
    }
    else {
      if (result.index < 1) {
        throw new ContextError(src.tagName + ' without preceding <if>', elementSourceOffset(src));
      }
      if (isTag(src, 'else')) {
        result.index = -result.index;
      }
      else {
        result.index++;
      }
      if (result.passed) {
        // A prior sibling already passed, so all subsequent elseif and else blocks should abort.
        return [];
      }
    }

    let exists = evaluateAttribute(src, 'exists', false, false, false);
    let notex = evaluateAttribute(src, 'notex', false, false, true);
    let not = evaluateAttribute(src, 'not', true, false);
    let test = evaluateAttribute(src, 'test', true, false);

    if (isTag(src, 'else')) {
      result.passed = true;
    }
    else if (exists !== undefined || notex !== undefined) {
      if (exists === false || notex === true) {
        // Special case: calling one of these threw an exception, which is still informative
        result.passed = notex ? true : exists;
      }
      else {
        // Does this attribute exist at all?
        result.passed = (exists != null && keyExistsInContext(exists)) || (notex != null && !keyExistsInContext(notex));
      }
    }
    else if (not !== undefined) {
      result.passed = (not === 'false') || (not === '') || (not === null);
    }
    else if (test !== undefined) {
      const testTok = elementSourceOffseter(src, 'test');

      let value:string|null;
      if ((value = evaluateAttribute(src, 'eq', false, false)) !== undefined) {
        result.passed = test === value;  // REVIEW: no casting of either
      }
      else if ((value = evaluateAttribute(src, 'ne', false, false)) !== undefined) {  // not-equals
        result.passed = test !== value;  // REVIEW: no casting of either
      }
      else if (value = evaluateAttribute(src, 'lt', false, false)) {  // less-than
        result.passed = makeFloat(test, testTok) < makeFloat(value, elementSourceOffseter(src, 'lt'));
      }
      else if (value = evaluateAttribute(src, 'le', false, false)) {  // less-than or equals
        result.passed = makeFloat(test, testTok) <= makeFloat(value, elementSourceOffseter(src, 'le'));
      }
      else if (value = evaluateAttribute(src, 'gt', false, false)) {  // greater-than
        result.passed = makeFloat(test, testTok) > makeFloat(value, elementSourceOffseter(src, 'gt'));
      }
      else if (value = evaluateAttribute(src, 'ge', false, false)) {  // greater-than or equals
        result.passed = makeFloat(test, testTok) >= makeFloat(value, elementSourceOffseter(src, 'ge'));
      }
      else if (value = evaluateAttribute(src, 'in', false, false)) {  // string contains
        if (Array.isArray(value)) {
          result.passed = value.indexOf(test) >= 0;
        }
        else if (typeof(value) === 'string') {
          result.passed = value.indexOf(test) >= 0;
        }
        else if (typeof(value) === 'object') {
          result.passed = test in value;
        }
        else {
          throw new ContextError(typeof(value) + " value does not support 'in' queries", elementSourceOffset(src, 'in'));
        }
      }
      else if (value = evaluateAttribute(src, 'ni', false, false)) {  // string doesn't contain
        if (Array.isArray(value)) {
          result.passed = value.indexOf(test) < 0;
        }
        else if (typeof(value) === 'string') {
          result.passed = value.indexOf(test) < 0;
        }
        else if (typeof(value) === 'object') {
          result.passed = !(test in value);
        }
        else {
          throw new ContextError(typeof(value) + " value does not support 'not-in' queries", elementSourceOffset(src, 'in'));
        }
      }
      else if (value = evaluateAttribute(src, 'regex', false, false)) {  // regular expression
        const re = new RegExp(value);
        result.passed = re.test(test);
      }
      else {  // simple boolean
        result.passed = test === 'true';
      }
    }
    else {
      throw new ContextError('<' + src.localName + '> elements must have an evaluating attribute: test, not, exists, or notex');
    }
  }
  catch (ex) {
    const ctxerr = wrapContextError(ex, 'startIfBlock', elementSourceOffset(src));
    if (shouldThrow(ctxerr, src)) { throw ctxerr; }
  }

  if (result.passed) {
    return expandContents(src);
  }
  
  return [];
}



/*-----------------------------------------------------------
 * _builderInput.ts
 *-----------------------------------------------------------*/


export const inputAreaTagNames = [
  'letter', 'letters', 'literal', 'number', 'numbers', 'pattern', 'word', 'extract'
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
export function startInputArea(src:HTMLElement):Node[] {
  const span = document.createElement('span');

  // Copy most attributes. 
  // Special-cased ones are harmless - no meaning in generic spans
  cloneAttributes(src, span);


  let cloneContents = false;
  let literal:string|null = null;
  const extract = src.hasAttributeNS('', 'extract') ? cloneText(src.getAttributeNS('', 'extract')) : null;
  
  let styles = getLetterStyles(src, 'underline', 'none', 'box');

  // Convert special attributes to data-* attributes for later text setup
  let attr:string|null;
  if (isTag(src, 'letter')) {  // 1 input cell for (usually) one character
    toggleClass(span, 'letter-cell', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'letters')) {  // 1 input cell for a few characters
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'multiple-letter', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'literal')) {  // 1 input cell for (usually) one character
    toggleClass(span, 'letter-cell', true);
    literal = ' ';
    cloneContents = true;  // literal value
  }
  else if (isTag(src, 'number')) {  // 1 input cell for one numeric character
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'numeric', true);
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'numbers')) {  // 1 input cell for multiple numeric digits
    toggleClass(span, 'letter-cell', true);
    toggleClass(span, 'multiple-letter', true);
    toggleClass(span, 'numeric', true);
    // To support longer (or negative) numbers, set class = 'multiple-letter'
    literal = src.getAttributeNS('', 'literal');  // converts letter to letter-literal
  }
  else if (isTag(src, 'word')) {  // 1 input cell for one or more words
    toggleClass(span, 'word-cell', true);
    if (attr = src.getAttributeNS('', 'extract')) {
      // attr should be 1 or more numbers (separated by spaces), detailing which letters to extract
      span.setAttributeNS('', 'data-extract-index', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'extracted-id')) {
      span.setAttributeNS('', 'data-extracted-id', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'literal')) {
      toggleClass(span, 'literal', true);
      span.innerText = cloneText(attr);
    }
  }
  else if (isTag(src, 'extract')) {
    // Backdoor way to inject literals into extraction.
    // They can have rules too.
    // Don't specify a *-cell, since we don't actually need an <input>
    span.style.display = 'none';
    toggleClass(span, 'extract-literal', true);
    if (attr = src.getAttributeNS('', 'word')) {
      toggleClass(span, 'word-input', true);
      span.setAttributeNS('', 'value', attr);
    }
    else if (attr = src.getAttributeNS('', 'letter') || src.getAttributeNS('', 'letters')) {  // can be multiple letters
      toggleClass(span, 'extract-input', true);
      span.setAttributeNS('', 'value', attr);
    }
    // Other styles, especially data-*, have already copied across
  }
  else if (isTag(src, 'pattern')) {  // multiple input cells for (usually) one character each
    toggleClass(span, 'letter-cell-block', true);
    if (attr = src.getAttributeNS('', 'pattern')) {
      toggleClass(span, 'create-from-pattern', true);
      span.setAttributeNS('', 'data-letter-pattern', cloneText(attr));
    }
    else if (attr = src.getAttributeNS('', 'extract-numbers')) {
        span.setAttributeNS('', 'data-number-pattern', cloneText(attr));
    }
    else if (attr = src.getAttributeNS('', 'extract-pattern')) {
      span.setAttributeNS('', 'data-letter-pattern', cloneText(attr));
      span.setAttributeNS('', 'data-indexed-by-letter', '');
    }
    if (attr = src.getAttributeNS('', 'extract')) {
      span.setAttributeNS('', 'data-extract-indeces', cloneText(attr));
    }
    if (attr = src.getAttributeNS('', 'numbers')) {
      span.setAttributeNS('', 'data-number-assignments', cloneText(attr));
    }
  }
  else {
    return [src];  // Unknown tag. NYI?
  }

  let block = src.getAttributeNS('', 'block');  // Used in grids
  if (block) {
    toggleClass(span, 'block', true);
    literal = literal || block;
  }

  if (literal == '¤') {  // Special case (and back-compat)
    toggleClass(span, 'block', true);
    literal = ' ';
  }
  
  if (literal) {
    if (!cloneContents) {
      span.innerText = cloneText(literal);  
    }
    toggleClass(span, 'literal', true);
    applyAllClasses(span, styles.literal);
  }      
  else if (!isTag(src, 'pattern')) {
    if (!isTag(src, 'word')) {
      applyAllClasses(span, styles.letter);
    }
    if (extract != null) {
      toggleClass(span, 'extract', true);
      if (parseInt(extract) > 0) {
        toggleClass(span, 'numbered', true);
        toggleClass(span, 'extract-numbered', true);
        span.setAttributeNS('', 'data-number', extract);
        
        const under = document.createElement('span');
        toggleClass(under, 'under-number');
        under.innerText = extract;
        span.appendChild(under);
      }
      applyAllClasses(span, styles.extract);
    }
  }

  if (cloneContents) {
    appendRange(span, expandContents(src));
  }
  else if (src.childNodes.length > 0) {
    throw new ContextError('Input tags like <' + src.localName + '/> should be empty elements', nodeSourceOffset(src.childNodes[0]));
  }

  return [span];
}


/*-----------------------------------------------------------
 * _builderUse.ts
 *-----------------------------------------------------------*/


type TemplateArg = {
  attr: string,
  raw: string,
  text: string,
  any: any,
}

/**
 * Replace a <use> tag with the contents of a <template>.
 * Along the way, push any attributes of the <use> tag onto the context.
 * Also push the context paths (as strings) as separate attributes.
 * Afterwards, pop them all back off.
 * Optionally, a <use> tag without a template="" attribute is a way to modify the context for the use's children.
 * @param node a <use> tag, whose attributes are cloned as arguments
 * @param tempId The ID of a template to invoke. If not set, the ID should be in node.template
 * @returns An array of nodes to insert into the document in place of the <use> tag
 */
export function useTemplate(node:HTMLElement, tempId?:string|null):Node[] {
  let dest:Node[] = [];

  if (!tempId) {
    tempId = node.getAttribute('template');
    if (!tempId) {
      throw new ContextError('<use> tag must specify a template attribute');
    }
    tempId = cloneText(tempId);
  }
  let template:HTMLTemplateElement|null = null;
  try {
    template = getTemplate(tempId);
    if (!template.content) {
      throw new ContextError('Invalid template (no content): ' + tempId);
    }
  }
  catch (ex) {
    const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node, 'template'));
    if (shouldThrow(ctxerr, node)) { throw ctxerr; }
    template = null;
  }
  
  if (template) {
    // We need to build the values to push onto the context, without changing the current context.
    // Do all the evaluations first, and cache them.
    const passed_args:TemplateArg[] = [];
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i].name;
      const val = node.attributes[i].value;
      const attri = attr.toLowerCase();
      try {
        if (attri != 'template' && attri != 'class') {
          const arg:TemplateArg = {
            attr: attr,
            raw: val,  // Store the context path, so it can also be referenced
            text: cloneText(val),
            any: complexAttribute(val),
          }
          passed_args.push(arg);
        }
      }
      catch (ex) {
        const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node, attr));
        if (shouldThrow(ctxerr, node, template)) { throw ctxerr; }
      }
    }

    try {
      // Push a new context for inside the <use>.
      // Each passed arg generates 3 usable context entries:
      //  arg = 'text'          the attribute, evaluated as text
      //  arg! = *any*          the attribute, evaluated as any
      //  arg$ = unevaluated    the raw contents of the argument attribute, unevaluated.
      const inner_context = pushBuilderContext();
      for (let i = 0; i < passed_args.length; i++) {
        const arg = passed_args[i];
        inner_context[arg.attr] = arg.text;
        inner_context[arg.attr + '!'] = arg.any;
        inner_context[arg.attr + '$'] = arg.raw;
      }

      if (!tempId) {
        tempId = node.getAttribute('template');
      }
      if (tempId) {
        const template = getTemplate(tempId);
        if (!template) {
          throw new ContextError('Template not found: ' + tempId, elementSourceOffset(node, 'template'));
        }
        if (!template.content) {
          throw new ContextError('Invalid template (no content): ' + tempId, elementSourceOffset(node, 'template'));
        }
        // The template doesn't have any child nodes. Its content must first be cloned.
        const clone = template.content.cloneNode(true) as HTMLElement;
        dest = expandContents(clone);
      }
      else {
        dest = expandContents(node);
      }
    }
    catch (ex) {
      const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node));
      if (shouldThrow(ctxerr, node, template)) { throw ctxerr; }
    }
    popBuilderContext();
  }

  return dest;
}

/**
 * Replace the current contents of a parent element with 
 * the contents of a template.
 * @param parent Parent element
 * @param tempId ID of a <template> element
 */
function refillFromTemplate(parent:Element, tempId:string) {
  if (!tempId) {
    throw new ContextError('Template ID not specified');
  }
  const template = getTemplate(tempId);
  if (!template) {
    throw new ContextError('Template not found: ' + tempId);
  }
  if (!template.content) {
    throw new ContextError('Invalid template (no content): ' + tempId);
  }

  const clone = template.content.cloneNode(true);
  while (parent.childNodes.length > 0) {
    parent.removeChild(parent.childNodes[0]);
  }
  parent.appendChild(clone);
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
export function getTemplate(tempId:string) :HTMLTemplateElement {
  if (tempId) {
    let elmt = document.getElementById(tempId);
    if (elmt) {
      return elmt as HTMLTemplateElement;
    }
    const template = builtInTemplate(tempId);
    if (template) {
      return template;
    }
  }
  throw new ContextError('Template not found: ' + tempId);
}

const builtInTemplates = {
  paintByNumbers: paintByNumbersTemplate,
  paintByColorNumbers: paintByColorNumbersTemplate,
  classStampPalette: classStampPaletteTemplate,
  classStampNoTools: classStampNoToolsTemplate,
}

/**
 * Match a template name to a built-in template object
 * @param tempId The ID
 * @returns A template element (not part of the document), or undefined if unrecognized.
 */
export function builtInTemplate(tempId:string) :HTMLTemplateElement|undefined {
  if (tempId in builtInTemplates) {
    return builtInTemplates[tempId]();
  }
};

/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByNumbersTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'paintByNumbers';
  temp.innerHTML = 
  `<table_ class="paint-by-numbers stampable-container stamp-drag bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
    <thead_>
      <tr_ class="pbn-col-headers">
        <th_ class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br>(aka paint-by-numbers).<br>
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br>
              <img src="../Images/Intro/pbn.png">
            </a>
          </span>
        </th_>
        <for each="col" in="colGroups">
          <td_ id="colHeader-{col#}" class="pbn-col-header">
            <for each="group" in="col"><span class="pbn-col-group" onclick="togglePbnClue(this)">{.group}</span></for>
          </td_>
        </for>
        <th_ class="pbn-row-footer pbn-corner">&nbsp;</th_>
      </tr_>
    </thead_>
    <for each="row" in="rowGroups">
      <tr_ class="pbn-row">
        <td_ id="rowHeader-{row#}" class="pbn-row-header">
          &hairsp; <for each="group" in="row"><span class="pbn-row-group" onclick="togglePbnClue(this)">{.group}</span> </for>&hairsp;
        </td_>
        <for each="col" in="colGroups">
          <td_ id="{row#}_{col#}" class="pbn-cell stampable">&times;</td_>
        </for>
        <td_ class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></td_>
      </tr_>
    </for>
    <tfoot_>
      <tr_ class="pbn-col-footer">
        <th_ class="pbn-corner">&nbsp;</th_>
        <for each="col" in="colGroups">
          <td_ class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></td_>
        </for>
        <th_ class="pbn-corner-validation">
          ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ
          <br>←&nbsp;validation</th_>
      </tr_>
    </tfoot_>
  </table_>`;
  return temp;
}

/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByColorNumbersTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'paintByNumbers';
  temp.innerHTML = 
  `<table_ class="paint-by-numbers stampable-container stamp-drag pbn-two-color {styles?}" data-col-context="{cols$}" data-row-context="{rows$}" data-stamp-list="{stamplist$}">
    <thead_>
      <tr_ class="pbn-col-headers">
        <th_ class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br>(aka paint-by-numbers).<br>
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br>
              <img src="https://help.puzzyl.net/pbn.png">
            </a>
          </span>
        </th_>
        <for each="col" in="colGroups">
          <td_ id="colHeader-{col#}" class="pbn-col-header">
            <for each="colorGroup" in="col"><for key="color" in="colorGroup"><for each="group" in="color!"><span class="pbn-col-group pbn-color-{color}" onclick="togglePbnClue(this)">{.group}</span></for></for></for>
          </td_>
        </for>
        <if test="validate?" ne="false">
          <th_ class="pbn-row-footer pbn-corner">&nbsp;</th_>
        </if>
      </tr_>
    </thead_>
      <for each="row" in="rowGroups">
        <tr_ class="pbn-row">
          <td_ id="rowHeader-{row#}" class="pbn-row-header">
            &hairsp; 
            <for each="colorGroup" in="row"><for key="color" in="colorGroup">
              <for each="group" in="color!"><span class="pbn-row-group pbn-color-{color}" onclick="togglePbnClue(this)">{.group}</span> </for>
            &hairsp;</for></for>
          </td_>
          <for each="col" in="colGroups">
          <td_ id="{row#}_{col#}" class="pbn-cell stampable">{blank?}</td_>
        </for>
        <if test="validate?" ne="false">
          <td_ class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></td_>
        </if>
      </tr_>
    </for>
    <if test="validate?" ne="false">
      <tfoot_>
        <tr_ class="pbn-col-footer">
          <th_ class="pbn-corner">&nbsp;</th_>
          <for each="col" in="colGroups">
            <td_ class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></td_>
          </for>
          <th_ class="pbn-corner-validation">
            ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ
            <br>←&nbsp;validation</th_>
        </tr_>
      </tfoot_>
    </if>
  </table_>`;
  return temp;
}

/**
 * Create a standard paint-by-numbers template element.
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
function classStampPaletteTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'classStampPalette';
  temp.innerHTML = 
  `<div id="stampPalette" data-tool-count="3" data-tool-erase="{erase}">
    <for each="tool" in="tools">
      <div id={tool.id} class="stampTool {size?}" data-stamp-id="{tool.id}" data-style="{tool.id}" data-click-modifier="{tool.modifier?}" title="{tool.modifier?} + draw" data-next-stamp-id="{tool.next}">
        <div class="roundTool {tool.id}-button">
          <span id="{tool.id}-icon" class="stampIcon"><img src_="{tool.img}"></span>
          <span id="{tool.id}-label" class="stampLabel">{tool.label?}</span>
          <span id="{tool.id}-mod" class="stampMod">{tool.modifier?}+click</span>
        </div>
      </div>
    </for>
  </div>`;
  return temp;
}

function classStampNoToolsTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'classStampPalette';
  temp.innerHTML = 
  `<div id="stampPalette" class="hidden" data-tool-erase="{erase}">
    <for each="tool" in="tools">
      <div class="stampTool" data-stamp-id="{tool.id}" data-next-stamp-id="{tool.next}">
      </div>
    </for>
  </div>`;
  return temp;
}

function stampPaletteTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'StampTools.css');

  const temp = document.createElement('template');
  temp.innerHTML = 
  `<table_ class="paint-by-numbers bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
  </table_>`;
  return temp;
}

var pbnStampTools = [
  {id:'stampPaint', modifier:'ctrl', label:'Paint', img:'../Images/Stamps/brushH.png', next:'stampBlank'},
  {id:'stampBlank', modifier:'shift', label:'Blank', img:'../Images/Stamps/blankH.png', next:'stampErase'},
  {id:'stampErase', modifier:'alt', label:'Erase', img:'../Images/Stamps/eraserH.png', next:'stampPaint'},
];


/*-----------------------------------------------------------
 * _scratch.ts
 *-----------------------------------------------------------*/


let scratchPad:HTMLDivElement;
let currentScratchInput:HTMLTextAreaElement|undefined = undefined;

/**
 * Setup a scratch pad that is the same size as the page.
 */
export function setupScratch() {
    const page = (document.getElementById('page')
        || document.getElementsByClassName('printedPage')[0])  as HTMLElement;
    if (!page) {
        return;
    }

    scratchPad = document.createElement('div');
    scratchPad.id = 'scratch-pad';

    scratchPad.addEventListener('click', function (e) { scratchClick(e); } );
    page.addEventListener('click', function (e) { scratchPageClick(e); } );

    page.appendChild(scratchPad);

    if (getSafariDetails()) {
        linkCss(getSafariDetails()?.cssRoot + 'ScratchPad.css');
    }
}

/**
 * Click on the scratch pad (which is normally in the background).
 * If ctrl+click, start a new note.
 * Otherwise, flatten the current note.
 * @param evt 
 * @returns 
 */
function scratchClick(evt:MouseEvent) {
    if (currentScratchInput && currentScratchInput !== evt.target) {
        scratchFlatten();
    }

    if (evt.target && hasClass(evt.target as Node, 'scratch-div')) {
        scratchRehydrate(evt.target as HTMLDivElement);
        return;
    }
   
    if (!evt.ctrlKey) {
        // One way to leave scratch mode is to click away
        return;
    }

    const spRect = scratchPad.getBoundingClientRect();

    currentScratchInput = document.createElement('textarea');

    // Position the new textarea where its first character would be at the click point
    currentScratchInput.style.left = (evt.clientX - spRect.left - 5) + 'px';  
    currentScratchInput.style.top = (evt.clientY - spRect.top - 10) + 'px';  
    currentScratchInput.style.width = (spRect.right - evt.clientX) + 'px';  // TODO: utilize right edge of scratch
    disableSpellcheck(currentScratchInput);
    currentScratchInput.title = 'Escape to exit note mode';

    currentScratchInput.onkeyup = function(e) { scratchTyped(e); }

    toggleClass(scratchPad, 'topmost', true);
    scratchPad.appendChild(currentScratchInput);
    currentScratchInput.focus();
}

/**
 * Callback when the top-level page is clicked.
 * If it's a ctrl+click, try to create a scratch note at that point.
 * @param evt The mouse event
 */
function scratchPageClick(evt:MouseEvent) {
    if (evt.ctrlKey) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i] as HTMLElement;
            if (hasClass(target as Node, 'scratch-div')) {
                scratchRehydrate(target as HTMLDivElement);
                return;
            }
            if (target.id == 'scratch-pad') {
                scratchClick(evt);
                return;
            }
            if (isTag(target, 'input') || isTag(target, 'textarea')) {
                return;  // Don't steal clicks from inputs
            }
            if (target.id != 'page' && target.onclick) {
                return;  // Don't steal clicks from anything else with a click handler
            }
        }

    }
}

/**
 * Disable all squigglies from the note surface. They are distracting.
 * @param elmt A newly created TextArea
 */
function disableSpellcheck(elmt:Element) {
    elmt.setAttribute('spellCheck', 'false');
    elmt.setAttribute('autoComplete', 'false');
    elmt.setAttribute('autoCorrect', 'false');
    elmt.setAttribute('autoCapitalize', 'false');
}

/**
 * Callback when the user types in the active textarea.
 * Ensures that the textarea stays correctly sized.
 * Exits scratch mode on Escape.
 * @param evt The keyboard event
 */
function scratchTyped(evt:KeyboardEvent) {
    if (!evt.target) {
        return;  // WTF?
    }
    if (evt.code == 'Escape') {
        scratchFlatten();
        return;
    }

    scratchResize(evt.target as HTMLTextAreaElement);
}

/**
 * Ensure that the active textarea is big enough for all its rows of text
 * @param ta The active textarea
 */
function scratchResize(ta: HTMLTextAreaElement) {
    const lines = 1 + (ta.value || '').split('\n').length;
    ta.setAttributeNS('', 'rows', lines.toString());
}

/**
 * Convert the active textarea to a flattened div
 * The textarea will be removed, and the new div added to the scratchPad.
 */
function scratchFlatten() {
    if (!currentScratchInput) {
        return;
    }
    toggleClass(scratchPad, 'topmost', false);

    const text = currentScratchInput!.value.trimEnd();
    if (text) {
        const rect = currentScratchInput!.getBoundingClientRect();
        scratchCreate(parseInt(currentScratchInput!.style.left), 
            parseInt(currentScratchInput!.style.top),
            parseInt(currentScratchInput!.style.width), 
            rect.height,
            text
        );
    }
    currentScratchInput!.parentNode!.removeChild(currentScratchInput!);
    currentScratchInput = undefined;

    saveScratches(scratchPad);
}

/**
 * Convert the <div> HTML contents to text appropriate for a textarea or storage
 * @param div A flattened scratch note
 * @returns A string of lines of notes with \n line breaks
 */
export function textFromScratchDiv(div:HTMLDivElement):string {
    let text = '';
    for (let i = 0; i < div.childNodes.length; i++) {
        const child = div.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            text += (child as Text).textContent;
        }
        else if (child.nodeType == Node.ELEMENT_NODE && isTag(child as Element, 'br')) {
            text += '\n';
        }
        else {
            console.log('Unexpected contents of a scratch-div: ' + child);
        }
    }
    return text;
}

/**
 * Convert a flattened div back to a textarea in the same location
 * @param div A flattened div, which will be removed, and replaced
 */
function scratchRehydrate(div:HTMLDivElement) {
    if (!hasClass(div, 'scratch-div')) {
        return;
    }

    const ta = document.createElement('textarea');
    ta.value = textFromScratchDiv(div);

    const rcSP = scratchPad.getBoundingClientRect();
    const rcD = div.getBoundingClientRect();

    ta.style.left = div.style.left;  
    ta.style.top = div.style.top;  
    ta.style.width = (rcSP.right - rcD.left) + 'px';
    disableSpellcheck(ta);
    ta.title = 'Escape to exit note mode';

    scratchResize(ta);
    ta.onkeyup = function(e) { scratchTyped(e); }

    toggleClass(scratchPad, 'topmost', true);

    div.parentNode!.append(ta);
    div.parentNode!.removeChild(div);
    currentScratchInput = ta;
    ta.focus();
}

/**
 * Wipe away all scratches
 */
export function scratchClear() {
    if (currentScratchInput) {
        currentScratchInput.parentNode!.removeChild(currentScratchInput);
        currentScratchInput = undefined;
    }
    const divs = scratchPad.getElementsByClassName('scratch-div');
    for (let i = divs.length - 1; i >= 0; i--) {
        scratchPad.removeChild(divs[i]);
    }
}

/**
 * Create a scratch div
 * @param x The client-x of the div
 * @param y The client-y of the div
 * @param width The (max) width of the div
 * @param height The (max) height of the div
 * @param text The text contents, as they would come from a textarea, with \n
 */
export function scratchCreate(x:number, y:number, width:number, height:number, text:string) {
    if (text) {
        const div = document.createElement('div');
        toggleClass(div, 'scratch-div', true);

        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
                div.appendChild(document.createElement('br'));
            }
            div.appendChild(document.createTextNode(lines[i]));
        }

        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.style.maxWidth = width + 'px';
        div.style.maxHeight = height + 'px';

        scratchPad.append(div);
    }
}

/*-----------------------------------------------------------
 * _validatePBN.ts
 *-----------------------------------------------------------*/


/**
 * Validate the paint-by-numbers grid that contains this cell
 * @param target The cell that was just modified
 */
function validatePBN(target:HTMLElement) {
  const table = findParentOfClass(target, 'paint-by-numbers');
  if (!table) {
    return;
  }
  const stampList = getOptionalStyle(table, 'data-stamp-list');
  if (stampList) {
    validateColorPBN(target, table as HTMLElement, stampList);
    return;
  }

  let pos = target.id.split('_');
  const row = parseInt(pos[0]);
  const col = parseInt(pos[1]);
  const rSum = document.getElementById('rowSummary-' + row);
  const cSum = document.getElementById('colSummary-' + col);

  if (!rSum && !cSum) {
    return;  // this PBN does not have a UI for validation
  }

  // Scan all cells in this PBN table, looking for those in the current row & column
  // Track the painted ones as a list of row/column indices
  const cells = table.getElementsByClassName('stampable');
  const rowOn:number[] = [];
  const colOn:number[] = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (hasClass(cell, 'stampPaint')) {
      pos = cell.id.split('_');
      const r = parseInt(pos[0]);
      const c = parseInt(pos[1]);
      if (r == row) {
        rowOn.push(c);
      }
      if (c == col) {
        colOn.push(r);
      }
    }
  }

  const rows = contextDataFromRef(table, 'data-row-context');
  if (rSum && rows) {
    // Convert a list of column indices to group notation
    const groups = summarizePBN(rowOn);
    rSum.innerHTML = '';
    for (const g of groups) {
      if (g > 0) {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-row-group', true);
        span.innerText = g.toString();
        rSum.appendChild(span);
      }
    }
    const header = rows[row];
    const comp = compareGroupsPBN(header, groups);
    toggleClass(rSum, 'done', comp == 0);
    toggleClass(rSum, 'exceeded', comp > 0);
    const rHead = document.getElementById('rowHeader-' + row);
    toggleClass(rHead, 'done', comp == 0);
  }

  const cols = contextDataFromRef(table, 'data-col-context');
  if (cSum) {
    const groups = summarizePBN(colOn);
    cSum.innerHTML = '';
    for (const g of groups) {
      if (g > 0) {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-col-group', true);
        span.innerText = g.toString();
        cSum.appendChild(span);
      }
    }
    const header = cols[col];
    const comp = compareGroupsPBN(header, groups);
    toggleClass(cSum, 'done', comp == 0);
    toggleClass(cSum, 'exceeded', comp > 0);
    const cHead = document.getElementById('colHeader-' + col);
    toggleClass(cHead, 'done', comp == 0);
  }

}

/**
 * Is a given cell tagged with a (non-blank) stamp id?
 * @param cell 
 * @param stampTools 
 * @returns the stamp data, or undefined if none found
 */
function dataFromTool(cell:HTMLElement, stampTools: StampToolDetails[]): string|undefined {
  for (let i = 0; i < stampTools.length; i++) {
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
function contextDataFromRef(elmt:Element, attr:string):any {
  const path = getOptionalStyle(elmt, attr);
  if (path) {
    return evaluateFormula(path);
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
  let prev = NaN;
  let consec = 0;
  const summary:number[] = [];
  list.push(NaN);
  for (const next of list) {
    if (next == prev + 1) {
      consec++;
    }
    else {
      if (consec > 0) {
        summary.push(consec);
        const gap = next - prev - 1;
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
function compareGroupsPBN(expect:number[], have:number[]) {
  let exact = true;
  let e = 0;
  let gap = 0;
  let prevH = 0;
  let curE = expect.length > 0 ? expect[0] : 0;
  for (const h of have) {
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
        return 1;  // too big
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
function togglePbnClue(group:HTMLSpanElement) {
  toggleClass(group, 'pbn-check');
}

type indexTag = {
  index: number,
  tag: string
}

const nonIndexTag:indexTag = {index:NaN, tag: ''};

type linearTag = {
  len: number,
  tag: string
}

const nonLinearTag:linearTag = {len: 0, tag: ''};
const outerGapTag:linearTag = {len: 1, tag: ''};

/**
* Validate the paint-by-numbers grid that contains this cell
* @param target The cell that was just modified
* @param table The containing table
* @param stampList
*/
function validateColorPBN(target:HTMLElement, table:HTMLElement, stampList:string) {
  const stampTools = valueFromGlobalContext(stampList) as StampToolDetails[];

  let pos = target.id.split('_');
  const row = parseInt(pos[0]);
  const col = parseInt(pos[1]);
  const rSum = document.getElementById('rowSummary-' + row);
  const cSum = document.getElementById('colSummary-' + col);

  if (!rSum && !cSum) {
    return;  // this PBN does not have a UI for validation
  }

  // Scan all cells in this PBN table, looking for those in the current row & column
  // Track the painted ones as a list of row/column indices
  const cells = table.getElementsByClassName('stampable');
  const rowOn:indexTag[] = [];
  const colOn:indexTag[] = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const data = dataFromTool(cell as HTMLElement, stampTools);
    if (data) {
      pos = cell.id.split('_');
      const r = parseInt(pos[0]);
      const c = parseInt(pos[1]);
      if (r == row) {
        const it:indexTag = {index:c, tag:data};
        rowOn.push(it);
      }
      if (c == col) {
        const it:indexTag = {index:r, tag:data};
        colOn.push(it);
      }
    }
  }

  const rows = contextDataFromRef(table, 'data-row-context');
  if (rSum && rows) {
    // Convert a list of column indices to group notation
    const groups = summarizeTaggedPBN(rowOn);
    rSum.innerHTML = '';
    for (const g of groups) {
      if (g.tag != '') {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-row-group', true);
        toggleClass(span, 'pbn-color-' + g.tag, true);
        span.innerText = g.len.toString();
        rSum.appendChild(span);
      }
    }
    const header = invertColorTags(rows[row]);
    const comp = compareTaggedGroupsPBN(header, groups);
    toggleClass(rSum, 'done', comp == 0);
    toggleClass(rSum, 'exceeded', comp > 0);
    const rHead = document.getElementById('rowHeader-' + row);
    toggleClass(rHead, 'done', comp == 0);
  }

  const cols = contextDataFromRef(table, 'data-col-context');
  if (cSum) {
    const groups = summarizeTaggedPBN(colOn);
    cSum.innerHTML = '';
    for (const g of groups) {
      if (g.tag != '') {
        const span = document.createElement('span');
        toggleClass(span, 'pbn-col-group', true);
        toggleClass(span, 'pbn-color-' + g.tag, true);
        span.innerText = g.len.toString();
        cSum.appendChild(span);
      }
    }
    const header = invertColorTags(cols[col]);
    const comp = compareTaggedGroupsPBN(header, groups);
    toggleClass(cSum, 'done', comp == 0);
    toggleClass(cSum, 'exceeded', comp > 0);
    const cHead = document.getElementById('colHeader-' + col);
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
function invertColorTags(header:object[]): linearTag[] {
  const linear:linearTag[] = [];
  for (let i = 0; i < header.length; i++) {
    const tagged = header[i];  // {tag:[1,2]}
    const tag = Object.keys(tagged)[0];
    const groups = tagged[tag] as number[];
    for (let g = 0; g < groups.length; g++) {
      const lt:linearTag = {len:groups[g], tag:tag};
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
function summarizeTaggedPBN(list:indexTag[]): linearTag[] {
  let prev = nonIndexTag;
  let consec = 0;
  const summary:linearTag[] = [];
  list.push(nonIndexTag);
  for (const next of list) {
    if (next.tag == prev.tag && next.index == prev.index + 1) {
      consec++;
    }
    else {
      if (consec > 0) {
        const line:linearTag = {len: consec, tag:prev.tag}
        summary.push(line);
        const gap:linearTag = {len: next.index - prev.index - 1, tag:''};
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
function compareTaggedGroupsPBN(expect:linearTag[], have:linearTag[]) {
  let exact = true;
  let e = 0;
  let gap = outerGapTag;
  let prevH = nonLinearTag;
  let curE = expect.length == 0 ? nonLinearTag : expect[0];
  for (const h of have) {
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
      return 1;  // We're past the end, while still having cells that don't fit
    }
    if (h.len == curE.len) {
      e++;
      prevH = nonLinearTag;
    } else {
      exact = false;
      prevH = h;
    }
    curE = expect[e];
  }
  // return 0 for exact match
  // return -1 for incomplete match - groups thus far do not exceed expected
  return (exact && e == expect.length) ? 0 : -1;
}

/*-----------------------------------------------------------
 * _testUtils.ts
 *-----------------------------------------------------------*/


type Rect2D = {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

function equalRect2D(a:Rect2D, b:Rect2D) {
    return a.left == b.left
        && a.right == b.right
        && a.top == b.top
        && a.bottom == b.bottom;
}

/**
 * Simplify a DOMRect to 4 edge position values, each rounded to the nearest 0.1 
 * @param r a DOMRect
 * @returns An equivalent Rect2D
 */
function createRect2D(r:DOMRect):Rect2D {
    const rect:Rect2D = {
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        top: Math.round(r.top * 10) / 10,
        bottom: Math.round(r.bottom * 10) / 10,
    };
    return rect;
}

/**
 * Create a size-0 rect at the top-left corner of another rect 
 * @param r a Rect2D
 * @returns An new Rect2D
 */
function pointAtCorner(r?:Rect2D):Rect2D {
    const x = r?.left ?? 0;
    const y = r?.right ?? 0;
    const rect:Rect2D = {
        left: x,
        right: x,
        top: y,
        bottom: y,
    };
    return rect;
}

/**
 * A summary of a single DOM node's position and contents
 */
export type LayoutSummary = {
    index: number;
    id?: string;
    nodeType: number;
    bounds?: Rect2D;
    descendents: number;
    text?: string;
    tagName?: string;
    children?: LayoutSummary[];
};

/**
 * Build a tree of LayoutSummary nodes
 * @param root The root for this (sub-)tree
 * @param index The index of the root within its parent
 * @returns A LayoutSummary tree, which may be merged into a parent tree
 */
function summarizeLayout(root:Node, index?:number):LayoutSummary {
    if (index === undefined) {
        index = 0;
    }
    const summary:LayoutSummary = {
        index: index,
        nodeType: root.nodeType,
        descendents: root.childNodes.length
    };
    if (root.nodeType == Node.ELEMENT_NODE) {
        const elmt = root as HTMLElement;
        const rect = elmt.getBoundingClientRect();
        summary.bounds = createRect2D(rect);
        if (elmt.id) {
            summary.id = elmt.id;
        }
        // summary.text = elmt.innerText;
        const children = [] as LayoutSummary[];
        for (let i = 0; i < root.childNodes.length;i++) {
            const child = root.childNodes[i] as HTMLElement;
            const cl = summarizeLayout(child, i);
            children.push(cl);
            summary.descendents += cl.descendents;
        }
        summary.children = children;
    }
    else if (root.nodeType != Node.COMMENT_NODE && root.textContent) {
        summary.text = root.textContent;

        var range = document.createRange();
        range.selectNode(root);
        const rect = range.getBoundingClientRect();
        range.detach(); // frees up memory in older browsers
        summary.bounds = createRect2D(rect);
    }

    return summary;
}

function pageLayoutRootNode(): Node {
    const pageBody = document.getElementById('pageBody');
    if (pageBody) {
        return pageBody;
    }
    const bodies = document.getElementsByTagName('body');
    if (bodies && bodies.length > 0) {
        return bodies[0];
    }
    return document.getRootNode();

}

/**
 * Summarize the full layout of a typical puzzle page.
 * If a pageBody elememt exists, use that as the root.
 * Otherwise, use the <body> tag, or as a last resort, the DOM root node.
 * @returns A tree of LayoutSummary nodes
 */
export function summarizePageLayout():LayoutSummary {
    const pageRoot = pageLayoutRootNode();
    return summarizeLayout(pageRoot);
}

/**
 * Bit flags for how two layout summaries might differ
 */
enum LayoutDiffType {
    None = 0,
    Add = 1,
    Remove = 2,
    Change = 3,
    AddChild = 4,
    RemoveChild = 8,
    ChangeText = 16,
    ChangeRect = 32,
};

/**
 * A single different point within a larger document comparison 
 */
type LayoutDiff = {
    diffType: LayoutDiffType;
    before?: LayoutSummary;
    after?: LayoutSummary;
};

/**
 * Are these two elements sufficiently similar so as to be comparable?
 * Same node type and element tag name. If they have IDs, they must match too.
 * @param a A layout.
 * @param b Another layout.
 * @returns true if these two objects should be compared at greater depth
 */
function canCompareLayouts(a:LayoutSummary, b:LayoutSummary): boolean {
    return a.nodeType == b.nodeType
        && a.tagName == b.tagName
        && a.id == b.id;
}

/**
 * Find the next element in the list which could plausibly be compared with a given element.
 * @param s The element seeking a partner to compare
 * @param list A list of potential partner elements
 * @param first The first index in the list to consider
 * @returns -1 if none found, else the index (>= first) of the match.
 */
function findComparableLayout(s: LayoutSummary, list: LayoutSummary[], first: number): number {
    for (; first < list.length; first++) {
        if (canCompareLayouts(s, list[first])) {
            return first;
        }
    }
    return -1;
}

/**
 * Build a list of diffs for a before- and after- layout tree
 * @param bef The before layout
 * @param aft The after layout
 * @returns A flat list of difference nodes, including differences among child nodes.
 */
export function diffSummarys(bef:LayoutSummary, aft:LayoutSummary):LayoutDiff[] {
    const diffs = [] as LayoutDiff[];
    let ldt:LayoutDiffType = LayoutDiffType.None;
    if (bef.text != aft.text) {
        ldt |= LayoutDiffType.ChangeText;
    }
    if (bef.bounds || aft.bounds) {
        if (!bef.bounds || !aft.bounds || !equalRect2D(bef.bounds, aft.bounds)) {
            ldt |= LayoutDiffType.ChangeRect;
        }
    }
    if (bef.children && aft.children) {
        let b = 0;
        let a = 0;
        while (b < bef.children.length || a < aft.children.length) {
            const bb = a >= aft.children.length ? bef.children.length : 
                findComparableLayout(aft.children[a], bef.children, b);
            if (bb < 0) {
                ldt |= LayoutDiffType.AddChild;
                const added:LayoutDiff = {
                    diffType: LayoutDiffType.Add,
                    after: aft.children[a]
                };
                diffs.push(added);
                a++;
            }
            else {
                for (; b < bb; b++) {
                    ldt |= LayoutDiffType.RemoveChild;
                    const removed:LayoutDiff = {
                        diffType: LayoutDiffType.Remove,
                        before: bef.children[b]
                    };
                    diffs.push(removed);    
                }

                if (a < aft.children.length) {
                    const ds = diffSummarys(bef.children[b], aft.children[a]);
                    for (let i = 0; i < ds.length; i++) {
                        diffs.push(ds[i]);
                    }
                    b++;
                    a++;
                }
            }
        }
    }
    else if (bef.children) {
        ldt |= LayoutDiffType.RemoveChild;
    }
    else if (aft.children) {
        ldt |= LayoutDiffType.AddChild;
        // for (let i = 0; i < aft.children.length; i++) {

        // }
    }

    if (ldt != LayoutDiffType.None) {
        const change:LayoutDiff = {
            diffType: ldt,
            before: bef,
            after: aft
        };
        diffs.push(change);  // TODO: insert at 0
    }

    return diffs;
}

export function renderDiffs(diffs:LayoutDiff[]) {
    let diffRoot = document.getElementById('render-diffs');
    if (!diffRoot) {
        diffRoot = document.createElement('div');
        diffRoot.id = 'render-diffs';
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(diffRoot);
    }

    // toggleClass(diffRoot, 'diff-div', true);
    for (let i = 0; i < diffs.length; i++) {
        const diff = diffs[i];
        renderDiff(diffRoot, diff);
    }
}

function renderDiff(diffRoot:HTMLElement, diff:LayoutDiff) {
    if (!diff?.after?.bounds && !diff?.before?.bounds) {
        return;  // Nowhere to show
    }

    const div = document.createElement('div');
    toggleClass(div, 'diff-div', true);
    toggleClass(div, 'diff-add', (diff.diffType & LayoutDiffType.Add) != 0);
    toggleClass(div, 'diff-rem', (diff.diffType & LayoutDiffType.Remove) != 0);
    toggleClass(div, 'diff-text', (diff.diffType & LayoutDiffType.ChangeText) != 0);
    toggleClass(div, 'diff-rect', (diff.diffType & LayoutDiffType.ChangeRect) != 0);

    const before = diff.before?.bounds ?? pointAtCorner(diff.after?.bounds);
    const after = diff.after?.bounds ?? pointAtCorner(diff.before?.bounds);

    div.style.left = after.left + 'px';
    div.style.top = after.top + 'px';
    div.style.width = (after.right - after.left) + 'px';
    div.style.height = (after.bottom - after.top) + 'px';


    if (before.left != after.left) {
        div.appendChild(createDiffDeltaRect(before.left - after.left, 'left'));
    }
    if (before.top != after.top) {
        div.appendChild(createDiffDeltaRect(before.top - after.top, 'top'));
    }
    if (before.right != after.right) {
        div.appendChild(createDiffDeltaRect(before.right - after.right, 'right'));
    }
    if (before.bottom != after.bottom) {
        div.appendChild(createDiffDeltaRect(before.bottom - after.bottom, 'bottom'));
    }

    diffRoot.appendChild(div);
}

function createDiffDeltaRect(size:number, edge:string):HTMLDivElement {
    const d = document.createElement('div');
    toggleClass(d, 'diff-shrink', size<0);
    toggleClass(d, 'diff-grow', size>0);
    if (edge == 'left') {
        d.style.left = ((size < 0) ? size : 0) + 'px';
        d.style.width = Math.abs(size) + 'px';
        d.style.top = '0px';
        d.style.height = '100%';
    }
    else if (edge == 'top') {
        d.style.top = ((size < 0) ? size : 0) + 'px';
        d.style.height = Math.abs(size) + 'px';
        d.style.left = '0px';
        d.style.width = '100%';
    }
    else if (edge == 'right') {
        d.style.right = ((size > 0) ? size : 0) + 'px';
        d.style.width = Math.abs(size) + 'px';
        d.style.top = '0px';
        d.style.height = '100%';
    }
    else if (edge == 'bottom') {
        d.style.bottom = ((size > 0) ? size : 0) + 'px';
        d.style.height = Math.abs(size) + 'px';
        d.style.left = '0px';
        d.style.width = '100%';
    }
    return d;
}