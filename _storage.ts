import { forceReload, getSafariDetails, isIFrame, isRestart, theBoiler } from "./_boilerplate";
import { hasClass, toggleClass, getOptionalStyle, findFirstChildOfClass } from "./_classUtil";
import { afterInputUpdate, updateWordExtraction } from "./_textInput";
import { quickMove, quickFreeMove, Position, positionFromStyle } from "./_dragDrop";
import { doStamp, getStampParent } from "./_stampTools";
import { createFromVertexList } from "./_straightEdge";
import { GuessLog, decodeAndValidate } from "./_confirmation";

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
    edges: string[];    // strings
    guesses: GuessLog[];
    time: Date|null;
}

var localCache:LocalCacheStruct = { letters: {}, words: {}, notes: {}, checks: {}, containers: {}, positions: {}, stamps: {}, highlights: {}, edges: [], guesses: [], time: null };

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

/**
 * Update the local cache with the full set of guesses for this puzzle
 * @param guesses An array of guesses, in time order
 */
export function saveGuessHistory(guesses: GuessLog[]) {
    localCache.guesses = guesses;
    saveCache();
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
    reloading = false;

    const fn = theBoiler().onRestore;
    if (fn) {
        fn();
    }
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
    let elements = document.getElementsByClassName('cross-off');
    for (var i = 0; i < elements.length; i++) {
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

/**
 * Recreate any saved guesses and their responses
 * @param guesses A list of guess structures
 */
function restoreGuesses(guesses:GuessLog[]) {
    if (!guesses) {
        guesses = [];
    }
    for (var i = 0; i < guesses.length; i++) {
        const src = guesses[i];
        // Rebuild the GuessLog, to convert the string back to a DateTime
        const gl:GuessLog = { field:src.field, guess:src.guess, time:new Date(String(src.time)) };
        decodeAndValidate(gl);
        // Decoding will rebuild the localCache
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